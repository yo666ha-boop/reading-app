from __future__ import annotations

import hashlib
import json
import os
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
OUT_REPORT = Path("math-bank/state/git-history-scan-latest.json")
OUT_DIR = Path("math-bank/recovered-git-history")


def run(*args: str, text: bool = True, check: bool = True) -> subprocess.CompletedProcess:
    return subprocess.run(
        args,
        text=text,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=check,
    )


def git_bytes(*args: str) -> bytes:
    proc = run("git", *args, text=False)
    return proc.stdout


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
        path = parts[1] if len(parts) == 2 else ""
        if path:
            paths_by_oid[oid].add(path)
    return paths_by_oid


def object_type_size(oid: str) -> tuple[str, int] | None:
    proc = run("git", "cat-file", "--batch-check=%(objecttype) %(objectsize)", check=False)
    # This helper is intentionally unused in the hot path; see batch_metadata.
    return None


def batch_metadata(oids: list[str]) -> dict[str, tuple[str, int]]:
    if not oids:
        return {}
    proc = subprocess.Popen(
        ["git", "cat-file", "--batch-check=%(objectname) %(objecttype) %(objectsize)"],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )
    assert proc.stdin is not None and proc.stdout is not None
    proc.stdin.write("\n".join(oids) + "\n")
    proc.stdin.close()
    meta: dict[str, tuple[str, int]] = {}
    for line in proc.stdout:
        parts = line.strip().split()
        if len(parts) == 3:
            oid, typ, size = parts
            try:
                meta[oid] = (typ, int(size))
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


def commits_containing_change_of_object(oid: str) -> list[str]:
    proc = run("git", "log", "--all", f"--find-object={oid}", "--format=%H", check=False)
    if proc.returncode:
        return []
    return list(dict.fromkeys(x.strip() for x in proc.stdout.splitlines() if x.strip()))


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
        if typ != b"blob":
            continue
        out.append((oid_b.decode("ascii"), path_b.decode("utf-8", "replace")))
    return out


def main() -> int:
    if not Path(".git").exists():
        print("BLOCKED: run inside a full Git checkout", file=sys.stderr)
        return 2

    # Make deleted files reachable from remote branches/tags when the runner has permission.
    run("git", "fetch", "--all", "--tags", "--force", check=False)

    paths_by_oid = parse_rev_list_objects()
    candidate_oids = sorted(
        oid for oid, paths in paths_by_oid.items()
        if any(likely_candidate_path(p) for p in paths)
    )
    meta = batch_metadata(candidate_oids)

    report = {
        "scan": "git_history_deleted_blob_scan_for_exact_math_canonical",
        "expected_filename": EXPECTED_FILENAME,
        "expected_sha256": EXPECTED_SHA256,
        "required_paired_audit": AUDIT_FILENAME,
        "reachable_objects_with_paths": len(paths_by_oid),
        "candidate_oids": len(candidate_oids),
        "candidate_blobs_checked": 0,
        "oversize_blobs_skipped": 0,
        "canonical_blob_hits": [],
        "global_audit_blob_candidates": [],
        "recovery_hint_paths": [],
        "paired_recovery_hits": [],
        "completed_at_utc": datetime.now(timezone.utc).isoformat(),
        "policy": "History recovery only. Exact ZIP requires immutable SHA-256. Automatic pairing requires a valid MATHBANK_FINAL_AUDIT_V2.json in the same historical commit. No source reconstruction.",
    }

    exact_hits: list[tuple[str, bytes, list[str]]] = []
    audit_blobs: dict[str, tuple[bytes, set[str]]] = {}

    for oid in candidate_oids:
        typ_size = meta.get(oid)
        if not typ_size or typ_size[0] != "blob":
            continue
        size = typ_size[1]
        paths = sorted(paths_by_oid.get(oid, set()))
        for p in paths:
            if any(h.lower() in p.lower() for h in RECOVERY_HINTS):
                report["recovery_hint_paths"].append({"oid": oid, "path": p, "size": size})
        if size > MAX_BLOB_BYTES:
            report["oversize_blobs_skipped"] += 1
            continue
        data = git_bytes("cat-file", "blob", oid)
        report["candidate_blobs_checked"] += 1
        digest = sha256_bytes(data)
        if digest == EXPECTED_SHA256:
            hit = {"oid": oid, "sha256": digest, "bytes": len(data), "paths": paths}
            report["canonical_blob_hits"].append(hit)
            exact_hits.append((oid, data, paths))
        if any(Path(p).name == AUDIT_FILENAME for p in paths) and valid_json_object(data):
            audit_blobs[oid] = (data, set(paths))
            report["global_audit_blob_candidates"].append({
                "oid": oid,
                "sha256": digest,
                "bytes": len(data),
                "paths": paths,
            })

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for stale in (OUT_DIR / EXPECTED_FILENAME, OUT_DIR / AUDIT_FILENAME):
        stale.unlink(missing_ok=True)

    for zip_oid, zip_data, zip_paths in exact_hits:
        commits = commits_containing_change_of_object(zip_oid)
        for commit in commits:
            entries = tree_entries(commit)
            audits: dict[str, tuple[str, bytes]] = {}
            zip_present = False
            for oid, path in entries:
                if oid == zip_oid:
                    zip_present = True
                if Path(path).name != AUDIT_FILENAME:
                    continue
                try:
                    data = git_bytes("cat-file", "blob", oid)
                except Exception:
                    continue
                if valid_json_object(data):
                    audits[sha256_bytes(data)] = (path, data)
            if not zip_present or len(audits) != 1:
                continue
            audit_sha, (audit_path, audit_data) = next(iter(audits.items()))
            zip_out = OUT_DIR / EXPECTED_FILENAME
            audit_out = OUT_DIR / AUDIT_FILENAME
            zip_out.write_bytes(zip_data)
            audit_out.write_bytes(audit_data)
            pair = {
                "commit": commit,
                "canonical_blob_oid": zip_oid,
                "canonical_paths": zip_paths,
                "canonical_sha256": EXPECTED_SHA256,
                "canonical_bytes": len(zip_data),
                "audit_path": audit_path,
                "audit_sha256": audit_sha,
                "audit_bytes": len(audit_data),
                "canonical_output": str(zip_out),
                "audit_output": str(audit_out),
            }
            report["paired_recovery_hits"].append(pair)
            break
        if report["paired_recovery_hits"]:
            break

    OUT_REPORT.parent.mkdir(parents=True, exist_ok=True)
    OUT_REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
