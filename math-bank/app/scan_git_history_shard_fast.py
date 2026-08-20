from __future__ import annotations

import hashlib
import json
import os
from datetime import datetime, timezone
from pathlib import Path

import scan_git_history_candidates as core


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def main() -> int:
    shard_count = int(os.environ.get("MATH_GIT_SHARD_COUNT", "16"))
    shard_index = int(os.environ.get("MATH_GIT_SHARD_INDEX", "0"))
    oid_list_path = Path(os.environ["MATH_GIT_READABLE_OID_LIST"])
    report_path = Path(os.environ["MATH_GIT_SHARD_REPORT"])
    recovered_dir = Path(os.environ["MATH_GIT_SHARD_RECOVERED"])
    core.OUT_DIR = recovered_dir

    if not (0 <= shard_index < shard_count):
        raise SystemExit(f"invalid shard {shard_index}/{shard_count}")
    if not oid_list_path.is_file():
        raise SystemExit(f"missing readable oid list: {oid_list_path}")

    rows: list[tuple[str, int]] = []
    for line in oid_list_path.read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        oid, size_s = line.split("\t", 1)
        rows.append((oid, int(size_s)))
    shard_rows = [row for pos, row in enumerate(rows) if pos % shard_count == shard_index]

    paths_by_oid = core.parse_rev_list_objects()
    report = {
        "scan": "git_history_prefetched_readable_oid_sha256_shard",
        "expected_filename": core.EXPECTED_FILENAME,
        "expected_sha256": core.EXPECTED_SHA256,
        "required_paired_audit": core.AUDIT_FILENAME,
        "shard_count": shard_count,
        "shard_index": shard_index,
        "readable_blob_oids_total": len(rows),
        "assigned_blob_oids": len(shard_rows),
        "all_blobs_sha256_checked": 0,
        "all_blob_bytes_hashed": 0,
        "canonical_blob_hits": [],
        "lfs_pointer_hits": [],
        "global_audit_blob_candidates": [],
        "recovery_hint_paths": [],
        "retaining_commits_checked": 0,
        "paired_recovery_hits": [],
        "completed_at_utc": None,
        "policy": "Immutable prepare-stage bundle SHA/full-fsck/all-ref inventory are trusted; this shard only imports that proven bundle and hashes its exact precomputed readable OID partition once.",
    }

    exact_hits: list[tuple[str, bytes, list[str]]] = []
    with core.BlobBatchReader() as reader:
        for oid, expected_size in shard_rows:
            paths = sorted(paths_by_oid.get(oid, set()))
            data = reader.read(oid)
            if len(data) != expected_size:
                raise SystemExit(f"blob size mismatch {oid}: {len(data)} != {expected_size}")
            report["all_blobs_sha256_checked"] += 1
            report["all_blob_bytes_hashed"] += len(data)
            digest = sha256_bytes(data)
            if digest == core.EXPECTED_SHA256:
                report["canonical_blob_hits"].append({
                    "oid": oid, "sha256": digest, "bytes": len(data), "paths": paths
                })
                exact_hits.append((oid, data, paths))
            pointer = core.parse_lfs_pointer(data)
            if pointer and pointer[0] == core.EXPECTED_SHA256:
                report["lfs_pointer_hits"].append({
                    "pointer_blob_oid": oid,
                    "lfs_oid_sha256": pointer[0],
                    "lfs_size": pointer[1],
                    "paths": paths,
                })
            if any(Path(p).name == core.AUDIT_FILENAME for p in paths) and core.valid_json_object(data):
                report["global_audit_blob_candidates"].append({
                    "oid": oid, "sha256": digest, "bytes": len(data), "paths": paths
                })
            for p in paths:
                if any(h.lower() in p.lower() for h in core.RECOVERY_HINTS):
                    report["recovery_hint_paths"].append({"oid": oid, "path": p, "size": len(data)})

    recovered_dir.mkdir(parents=True, exist_ok=True)
    for stale in (recovered_dir / core.EXPECTED_FILENAME, recovered_dir / core.AUDIT_FILENAME):
        stale.unlink(missing_ok=True)
    for oid, data, paths in exact_hits:
        if core.pair_with_audit_from_tree(oid, data, paths, report):
            break

    report["completed_at_utc"] = datetime.now(timezone.utc).isoformat()
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
