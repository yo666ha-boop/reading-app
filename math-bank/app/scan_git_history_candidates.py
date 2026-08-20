from __future__ import annotations

import hashlib
import json
import re
import subprocess
import sys
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

EXPECTED_SHA256 = "eb93279a52dd49191612a52ac0df2df2fdd865c8975d815547daa126b4398175"
EXPECTED_FILENAME = "みかみ塾数学問題バンク_最終完成版_20260820.zip"
AUDIT_FILENAME = "MATHBANK_FINAL_AUDIT_V2.json"
RECOVERY_HINTS = (
    "winpass_verified_union570_authoritative_norm_20260820",
    "jitsuren_verified_union225_complete27_20260820",
)
MAX_BLOB_BYTES = 500 * 1024 * 1024
LFS_PREFIX = b"version https://git-lfs.github.com/spec/v1\n"
OUT_REPORT = Path("math-bank/state/git-history-scan-latest.json")
OUT_DIR = Path("math-bank/recovered-git-history")


def run(*args: str, text: bool = True, check: bool = True) -> subprocess.CompletedProcess:
    return subprocess.run(args, text=text, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=check)


def git_bytes(*args: str) -> bytes:
    return run("git", *args, text=False).stdout


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def valid_json_object(data: bytes) -> bool:
    try:
        obj = json.loads(data.decode("utf-8"))
    except Exception:
        return False
    return isinstance(obj, dict)


def fetch_all_remote_history() -> dict:
    result = {
        "heads_fetch_rc": None,
        "tags_fetch_rc": None,
        "pull_heads_fetch_rc": None,
        "pull_merges_fetch_rc": None,
    }
    heads = run(
        "git", "fetch", "origin", "+refs/heads/*:refs/remotes/origin/*", "--force", "--prune",
        check=False,
    )
    result["heads_fetch_rc"] = heads.returncode
    tags = run("git", "fetch", "origin", "+refs/tags/*:refs/tags/*", "--force", check=False)
    result["tags_fetch_rc"] = tags.returncode
    pull_heads = run(
        "git", "fetch", "origin", "+refs/pull/*/head:refs/remotes/origin/pull/*/head", "--force",
        check=False,
    )
    result["pull_heads_fetch_rc"] = pull_heads.returncode
    pull_merges = run(
        "git", "fetch", "origin", "+refs/pull/*/merge:refs/remotes/origin/pull/*/merge", "--force",
        check=False,
    )
    result["pull_merges_fetch_rc"] = pull_merges.returncode
    return result


def parse_rev_list_objects() -> dict[str, set[str]]:
    proc = run("git", "rev-list", "--objects", "--all")
    paths_by_oid: dict[str, set[str]] = defaultdict(set)
    for line in proc.stdout.splitlines():
        if not line.strip():
            continue
        parts = line.split(" ", 1)
        oid = parts[0]
        if len(parts) == 2 and parts[1]:
            paths_by_oid[oid].add(parts[1])
        else:
            paths_by_oid.setdefault(oid, set())
    return paths_by_oid


def batch_metadata(oids: list[str]) -> dict[str, tuple[str, int]]:
    if not oids:
        return {}
    proc = subprocess.Popen(
        ["git", "cat-file", "--batch-check=%(objectname) %(objecttype) %(objectsize)"],
        stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True,
    )
    assert proc.stdin is not None and proc.stdout is not None
    proc.stdin.write("\n".join(oids) + "\n")
    proc.stdin.close()
    meta: dict[str, tuple[str, int]] = {}
    for line in proc.stdout:
        parts = line.strip().split()
        if len(parts) == 3:
            try:
                meta[parts[0]] = (parts[1], int(parts[2]))
            except ValueError:
                pass
    stderr = proc.stderr.read() if proc.stderr is not None else ""
    rc = proc.wait()
    if rc:
        raise RuntimeError(f"git cat-file batch-check failed rc={rc}: {stderr[:1000]}")
    return meta


class BlobBatchReader:
    """Keep one git cat-file process alive so exhaustive SHA scans do not spawn a process per blob."""

    def __init__(self) -> None:
        self.proc = subprocess.Popen(
            ["git", "cat-file", "--batch"],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )
        if self.proc.stdin is None or self.proc.stdout is None:
            raise RuntimeError("failed to open git cat-file --batch pipes")

    def read(self, oid: str) -> bytes:
        assert self.proc.stdin is not None and self.proc.stdout is not None
        self.proc.stdin.write(oid.encode("ascii") + b"\n")
        self.proc.stdin.flush()
        header = self.proc.stdout.readline()
        if not header:
            raise RuntimeError(f"cat-file batch ended before {oid}")
        parts = header.rstrip(b"\n").split()
        if len(parts) != 3 or parts[1] != b"blob":
            raise RuntimeError(f"unexpected cat-file batch header for {oid}: {header[:200]!r}")
        size = int(parts[2])
        data = self.proc.stdout.read(size)
        sep = self.proc.stdout.read(1)
        if len(data) != size or sep != b"\n":
            raise RuntimeError(f"short/malformed cat-file batch payload for {oid}")
        return data

    def close(self) -> None:
        if self.proc.stdin is not None and not self.proc.stdin.closed:
            self.proc.stdin.close()
        stderr = self.proc.stderr.read() if self.proc.stderr is not None else b""
        rc = self.proc.wait()
        if rc:
            raise RuntimeError(f"git cat-file --batch failed rc={rc}: {stderr.decode('utf-8','replace')[:1000]}")

    def __enter__(self) -> "BlobBatchReader":
        return self

    def __exit__(self, exc_type, exc, tb) -> None:
        try:
            self.close()
        except Exception:
            if exc is None:
                raise


def likely_candidate_path(path: str) -> bool:
    low = path.lower()
    name = Path(path).name
    return (
        low.endswith(".zip")
        or name == AUDIT_FILENAME
        or name == EXPECTED_FILENAME
        or any(h.lower() in low for h in RECOVERY_HINTS)
        or ("math" in low and low.endswith((".json", ".jsonl")))
        or ("数学" in path and low.endswith((".json", ".jsonl")))
    )


def parse_lfs_pointer(data: bytes) -> tuple[str, int | None] | None:
    if not data.startswith(LFS_PREFIX) or len(data) > 4096:
        return None
    text = data.decode("utf-8", "replace")
    m = re.search(r"^oid sha256:([0-9a-f]{64})$", text, flags=re.M)
    if not m:
        return None
    s = re.search(r"^size (\d+)$", text, flags=re.M)
    return m.group(1), int(s.group(1)) if s else None


def tree_entries(commit: str) -> list[tuple[str, str]]:
    raw = git_bytes("ls-tree", "-r", "-z", commit)
    out: list[tuple[str, str]] = []
    for item in raw.split(b"\0"):
        if not item:
            continue
        try:
            head, path_b = item.split(b"\t", 1)
            _, typ, oid_b = head.split(b" ", 2)
        except ValueError:
            continue
        if typ == b"blob":
            out.append((oid_b.decode("ascii"), path_b.decode("utf-8", "replace")))
    return out


def commits_retaining_blob(zip_oid: str, known_paths: list[str]) -> list[str]:
    commits = [x.strip() for x in run("git", "rev-list", "--all").stdout.splitlines() if x.strip()]
    retaining: list[str] = []
    if known_paths:
        for commit in commits:
            for p in known_paths:
                proc = run("git", "ls-tree", commit, "--", p, check=False)
                if proc.returncode == 0 and zip_oid in proc.stdout:
                    retaining.append(commit)
                    break
        return retaining
    for commit in commits:
        if any(oid == zip_oid for oid, _ in tree_entries(commit)):
            retaining.append(commit)
    return retaining


def recover_lfs_object_if_available() -> Path | None:
    if run("git", "lfs", "version", check=False).returncode != 0:
        return None
    run("git", "lfs", "fetch", "--all", check=False)
    root = Path(".git/lfs/objects")
    if not root.is_dir():
        return None
    expected_path = root / EXPECTED_SHA256[:2] / EXPECTED_SHA256[2:4] / EXPECTED_SHA256
    if expected_path.is_file() and sha256_bytes(expected_path.read_bytes()) == EXPECTED_SHA256:
        return expected_path
    for p in root.rglob(EXPECTED_SHA256):
        if p.is_file() and sha256_bytes(p.read_bytes()) == EXPECTED_SHA256:
            return p
    return None


def pair_with_audit_from_tree(zip_identity: str, zip_data: bytes, zip_paths: list[str], report: dict) -> bool:
    for commit in commits_retaining_blob(zip_identity, zip_paths):
        report["retaining_commits_checked"] += 1
        entries = tree_entries(commit)
        if not any(oid == zip_identity for oid, _ in entries):
            continue
        audits: dict[str, tuple[str, bytes]] = {}
        for oid, path in entries:
            if Path(path).name != AUDIT_FILENAME:
                continue
            try:
                data = git_bytes("cat-file", "blob", oid)
            except Exception:
                continue
            if valid_json_object(data):
                audits[sha256_bytes(data)] = (path, data)
        if len(audits) != 1:
            continue
        audit_sha, (audit_path, audit_data) = next(iter(audits.items()))
        zip_out = OUT_DIR / EXPECTED_FILENAME
        audit_out = OUT_DIR / AUDIT_FILENAME
        zip_out.write_bytes(zip_data)
        audit_out.write_bytes(audit_data)
        report["paired_recovery_hits"].append({
            "commit": commit,
            "canonical_blob_oid": zip_identity,
            "canonical_paths": zip_paths,
            "canonical_sha256": EXPECTED_SHA256,
            "canonical_bytes": len(zip_data),
            "audit_path": audit_path,
            "audit_sha256": audit_sha,
            "audit_bytes": len(audit_data),
            "canonical_output": str(zip_out),
            "audit_output": str(audit_out),
        })
        return True
    return False


def ref_count(prefix: str) -> int:
    return len([x for x in run("git", "for-each-ref", "--format=%(refname)", prefix).stdout.splitlines() if x.strip()])


def main() -> int:
    if not Path(".git").exists():
        print("BLOCKED: run inside a full Git checkout", file=sys.stderr)
        return 2

    fetch_result = fetch_all_remote_history()
    paths_by_oid = parse_rev_list_objects()
    all_oids = sorted(paths_by_oid)
    meta = batch_metadata(all_oids)
    blob_oids = [oid for oid in all_oids if meta.get(oid, (None, 0))[0] == "blob"]
    named_candidate_oids = {oid for oid in blob_oids if any(likely_candidate_path(p) for p in paths_by_oid.get(oid, set()))}

    pull_ref_names = [
        x for x in run("git", "for-each-ref", "--format=%(refname)", "refs/remotes/origin/pull/").stdout.splitlines()
        if x.strip()
    ]
    report = {
        "scan": "git_history_all_remote_branches_tags_and_pull_refs_all_reachable_blob_scan_for_exact_math_canonical",
        "expected_filename": EXPECTED_FILENAME,
        "expected_sha256": EXPECTED_SHA256,
        "required_paired_audit": AUDIT_FILENAME,
        "remote_fetch": fetch_result,
        "remote_branches_seen": len([
            x for x in run("git", "for-each-ref", "--format=%(refname)", "refs/remotes/origin/").stdout.splitlines()
            if x.strip() and "/pull/" not in x
        ]),
        "tags_seen": ref_count("refs/tags/"),
        "pull_head_refs_seen": len([x for x in pull_ref_names if x.endswith("/head")]),
        "pull_merge_refs_seen": len([x for x in pull_ref_names if x.endswith("/merge")]),
        "reachable_objects_total": len(all_oids),
        "reachable_blob_oids": len(blob_oids),
        "named_candidate_oids": len(named_candidate_oids),
        "all_blobs_sha256_checked": 0,
        "all_blob_bytes_hashed": 0,
        "oversize_blobs_skipped": 0,
        "blob_read_mode": "single_persistent_git_cat_file_batch_process",
        "canonical_blob_hits": [],
        "lfs_pointer_hits": [],
        "lfs_exact_object_recovered": False,
        "global_audit_blob_candidates": [],
        "recovery_hint_paths": [],
        "retaining_commits_checked": 0,
        "paired_recovery_hits": [],
        "completed_at_utc": datetime.now(timezone.utc).isoformat(),
        "policy": "Every reachable blob from every fetched remote branch, tag and GitHub PR head/merge ref under the size cap is SHA-256 checked regardless of filename. LFS pointers to the canonical SHA are detected. Pairing requires one valid final audit in the same historical tree. No source reconstruction.",
    }

    exact_hits: list[tuple[str, bytes, list[str]]] = []
    lfs_exact_paths: list[tuple[str, list[str]]] = []
    readable_oids = [oid for oid in blob_oids if meta[oid][1] <= MAX_BLOB_BYTES]
    report["oversize_blobs_skipped"] = len(blob_oids) - len(readable_oids)
    with BlobBatchReader() as reader:
        for oid in readable_oids:
            size = meta[oid][1]
            paths = sorted(paths_by_oid.get(oid, set()))
            for p in paths:
                if any(h.lower() in p.lower() for h in RECOVERY_HINTS):
                    report["recovery_hint_paths"].append({"oid": oid, "path": p, "size": size})
            data = reader.read(oid)
            report["all_blobs_sha256_checked"] += 1
            report["all_blob_bytes_hashed"] += len(data)
            digest = sha256_bytes(data)
            if digest == EXPECTED_SHA256:
                report["canonical_blob_hits"].append({"oid": oid, "sha256": digest, "bytes": len(data), "paths": paths})
                exact_hits.append((oid, data, paths))
            pointer = parse_lfs_pointer(data)
            if pointer and pointer[0] == EXPECTED_SHA256:
                report["lfs_pointer_hits"].append({"pointer_blob_oid": oid, "lfs_oid_sha256": pointer[0], "lfs_size": pointer[1], "paths": paths})
                lfs_exact_paths.append((oid, paths))
            if any(Path(p).name == AUDIT_FILENAME for p in paths) and valid_json_object(data):
                report["global_audit_blob_candidates"].append({"oid": oid, "sha256": digest, "bytes": len(data), "paths": paths})

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for stale in (OUT_DIR / EXPECTED_FILENAME, OUT_DIR / AUDIT_FILENAME):
        stale.unlink(missing_ok=True)

    for oid, data, paths in exact_hits:
        if pair_with_audit_from_tree(oid, data, paths, report):
            break

    if not report["paired_recovery_hits"] and lfs_exact_paths:
        lfs_path = recover_lfs_object_if_available()
        if lfs_path is not None:
            report["lfs_exact_object_recovered"] = True
            lfs_data = lfs_path.read_bytes()
            for pointer_oid, paths in lfs_exact_paths:
                for commit in commits_retaining_blob(pointer_oid, paths):
                    report["retaining_commits_checked"] += 1
                    audits: dict[str, tuple[str, bytes]] = {}
                    for oid, path in tree_entries(commit):
                        if Path(path).name != AUDIT_FILENAME:
                            continue
                        data = git_bytes("cat-file", "blob", oid)
                        if valid_json_object(data):
                            audits[sha256_bytes(data)] = (path, data)
                    if len(audits) != 1:
                        continue
                    audit_sha, (audit_path, audit_data) = next(iter(audits.items()))
                    zip_out = OUT_DIR / EXPECTED_FILENAME
                    audit_out = OUT_DIR / AUDIT_FILENAME
                    zip_out.write_bytes(lfs_data)
                    audit_out.write_bytes(audit_data)
                    report["paired_recovery_hits"].append({
                        "commit": commit,
                        "canonical_blob_oid": "LFS:" + EXPECTED_SHA256,
                        "canonical_paths": paths,
                        "canonical_sha256": EXPECTED_SHA256,
                        "canonical_bytes": len(lfs_data),
                        "audit_path": audit_path,
                        "audit_sha256": audit_sha,
                        "audit_bytes": len(audit_data),
                        "canonical_output": str(zip_out),
                        "audit_output": str(audit_out),
                    })
                    break
                if report["paired_recovery_hits"]:
                    break

    OUT_REPORT.parent.mkdir(parents=True, exist_ok=True)
    report["completed_at_utc"] = datetime.now(timezone.utc).isoformat()
    OUT_REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
