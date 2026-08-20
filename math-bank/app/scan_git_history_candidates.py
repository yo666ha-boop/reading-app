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
    for commit in commits:
        for p in known_paths:
            proc = run("git", "ls-tree", commit, "--", p, check=False)
            if proc.returncode == 0 and zip_oid in proc.stdout:
                retaining.append(commit)
                break
    return retaining


def recover_lfs_object_if_available() -> Path | None:
    # GitHub-hosted runners normally include git-lfs. This is discovery-only; failure is fine.
    if run("git", "lfs", "version", check=False).returncode != 0:
        return None
    run("git", "lfs", "fetch", "--all", check=False)
    root = Path(".git/lfs/objects")
    if not root.is_dir():
        return None
    expected_path = root / EXPECTED_SHA256[:2] / EXPECTED_SHA256[2:4] / EXPECTED_SHA256
    if expected_path.is_file() and sha256_bytes(expected_path.read_bytes()) == EXPECTED_SHA256:
        return expected_path
    # Defend against alternate LFS layout/version.
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


def main() -> int:
    if not Path(".git").exists():
        print("BLOCKED: run inside a full Git checkout", file=sys.stderr)
        return 2

    run("git", "fetch", "--all", "--tags", "--force", check=False)
    paths_by_oid = parse_rev_list_objects()
    all_oids = sorted(paths_by_oid)
    meta = batch_metadata(all_oids)
    blob_oids = [oid for oid in all_oids if meta.get(oid, (None, 0))[0] == "blob"]
    named_candidate_oids = {oid for oid in blob_oids if any(likely_candidate_path(p) for p in paths_by_oid.get(oid, set()))}

    report = {
        "scan": "git_history_all_reachable_blob_scan_for_exact_math_canonical",
        "expected_filename": EXPECTED_FILENAME,
        "expected_sha256": EXPECTED_SHA256,
        "required_paired_audit": AUDIT_FILENAME,
        "reachable_objects_total": len(all_oids),
        "reachable_blob_oids": len(blob_oids),
        "named_candidate_oids": len(named_candidate_oids),
        "all_blobs_sha256_checked": 0,
        "all_blob_bytes_hashed": 0,
        "oversize_blobs_skipped": 0,
        "canonical_blob_hits": [],
        "lfs_pointer_hits": [],
        "lfs_exact_object_recovered": False,
        "global_audit_blob_candidates": [],
        "recovery_hint_paths": [],
        "retaining_commits_checked": 0,
        "paired_recovery_hits": [],
        "completed_at_utc": datetime.now(timezone.utc).isoformat(),
        "policy": "History recovery only. Every reachable Git blob under the size cap is SHA-256 checked regardless of filename. Git LFS pointers to the canonical SHA are detected. Pairing requires one valid final audit in the same historical tree. No source reconstruction.",
    }

    exact_hits: list[tuple[str, bytes, list[str]]] = []
    lfs_exact_paths: list[tuple[str, list[str]]] = []
    for oid in blob_oids:
        size = meta[oid][1]
        paths = sorted(paths_by_oid.get(oid, set()))
        for p in paths:
            if any(h.lower() in p.lower() for h in RECOVERY_HINTS):
                report["recovery_hint_paths"].append({"oid": oid, "path": p, "size": size})
        if size > MAX_BLOB_BYTES:
            report["oversize_blobs_skipped"] += 1
            continue
        data = git_bytes("cat-file", "blob", oid)
        report["all_blobs_sha256_checked"] += 1
        report["all_blob_bytes_hashed"] += len(data)
        digest = sha256_bytes(data)
        if digest == EXPECTED_SHA256:
            hit = {"oid": oid, "sha256": digest, "bytes": len(data), "paths": paths}
            report["canonical_blob_hits"].append(hit)
            exact_hits.append((oid, data, paths))
        pointer = parse_lfs_pointer(data)
        if pointer and pointer[0] == EXPECTED_SHA256:
            hit = {"pointer_blob_oid": oid, "lfs_oid_sha256": pointer[0], "lfs_size": pointer[1], "paths": paths}
            report["lfs_pointer_hits"].append(hit)
            lfs_exact_paths.append((oid, paths))
        if any(Path(p).name == AUDIT_FILENAME for p in paths) and valid_json_object(data):
            report["global_audit_blob_candidates"].append({"oid": oid, "sha256": digest, "bytes": len(data), "paths": paths})

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for stale in (OUT_DIR / EXPECTED_FILENAME, OUT_DIR / AUDIT_FILENAME):
        stale.unlink(missing_ok=True)

    for oid, data, paths in exact_hits:
        if pair_with_audit_from_tree(oid, data, paths, report):
            break

    # LFS pointers store the canonical content hash, so if such a pointer exists, try to
    # materialize the exact LFS object. We still do not promote it without a paired audit.
    if not report["paired_recovery_hits"] and lfs_exact_paths:
        lfs_path = recover_lfs_object_if_available()
        if lfs_path is not None:
            report["lfs_exact_object_recovered"] = True
            lfs_data = lfs_path.read_bytes()
            # The historical tree contains the pointer blob, not the binary blob. Pair
            # against commits retaining the pointer and then save the materialized ZIP.
            for pointer_oid, paths in lfs_exact_paths:
                for commit in commits_retaining_blob(pointer_oid, paths):
                    report["retaining_commits_checked"] += 1
                    entries = tree_entries(commit)
                    audits: dict[str, tuple[str, bytes]] = {}
                    for oid, path in entries:
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
    OUT_REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
