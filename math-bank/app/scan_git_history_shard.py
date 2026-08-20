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
    if shard_count < 1 or shard_index < 0 or shard_index >= shard_count:
        raise SystemExit(f"invalid shard {shard_index}/{shard_count}")

    report_path = Path(os.environ.get(
        "MATH_GIT_SHARD_REPORT",
        f"math-bank/state/git-history-shards/shard-{shard_index:02d}.json",
    ))
    recovered_dir = Path(os.environ.get(
        "MATH_GIT_SHARD_RECOVERED",
        f"math-bank/recovered-git-history-shards/shard-{shard_index:02d}",
    ))
    core.OUT_DIR = recovered_dir

    if not Path(".git").exists():
        raise SystemExit("run inside a full Git checkout")

    fetch_result = core.fetch_all_remote_history()
    paths_by_oid = core.parse_rev_list_objects()
    all_oids = sorted(paths_by_oid)
    meta = core.batch_metadata(all_oids)
    blob_oids = [oid for oid in all_oids if meta.get(oid, (None, 0))[0] == "blob"]
    readable = [oid for oid in blob_oids if meta[oid][1] <= core.MAX_BLOB_BYTES]
    shard_oids = [oid for pos, oid in enumerate(readable) if pos % shard_count == shard_index]

    report = {
        "scan": "git_history_exhaustive_sha256_shard",
        "expected_filename": core.EXPECTED_FILENAME,
        "expected_sha256": core.EXPECTED_SHA256,
        "required_paired_audit": core.AUDIT_FILENAME,
        "shard_count": shard_count,
        "shard_index": shard_index,
        "remote_fetch": fetch_result,
        "reachable_objects_total": len(all_oids),
        "reachable_blob_oids": len(blob_oids),
        "readable_blob_oids_total": len(readable),
        "oversize_blobs_skipped_total": len(blob_oids) - len(readable),
        "assigned_blob_oids": len(shard_oids),
        "all_blobs_sha256_checked": 0,
        "all_blob_bytes_hashed": 0,
        "canonical_blob_hits": [],
        "lfs_pointer_hits": [],
        "lfs_exact_object_recovered": False,
        "global_audit_blob_candidates": [],
        "recovery_hint_paths": [],
        "retaining_commits_checked": 0,
        "paired_recovery_hits": [],
        "completed_at_utc": None,
        "policy": "This shard hashes every assigned readable reachable blob. Across all shard indexes 0..N-1 every readable blob is assigned exactly once. Exact SHA plus same-tree final audit only; no reconstruction.",
    }

    exact_hits: list[tuple[str, bytes, list[str]]] = []
    lfs_hits: list[tuple[str, list[str]]] = []
    with core.BlobBatchReader() as reader:
        for oid in shard_oids:
            size = meta[oid][1]
            paths = sorted(paths_by_oid.get(oid, set()))
            for p in paths:
                if any(h.lower() in p.lower() for h in core.RECOVERY_HINTS):
                    report["recovery_hint_paths"].append({"oid": oid, "path": p, "size": size})
            data = reader.read(oid)
            report["all_blobs_sha256_checked"] += 1
            report["all_blob_bytes_hashed"] += len(data)
            digest = sha256_bytes(data)
            if digest == core.EXPECTED_SHA256:
                hit = {"oid": oid, "sha256": digest, "bytes": len(data), "paths": paths}
                report["canonical_blob_hits"].append(hit)
                exact_hits.append((oid, data, paths))
            pointer = core.parse_lfs_pointer(data)
            if pointer and pointer[0] == core.EXPECTED_SHA256:
                report["lfs_pointer_hits"].append({
                    "pointer_blob_oid": oid,
                    "lfs_oid_sha256": pointer[0],
                    "lfs_size": pointer[1],
                    "paths": paths,
                })
                lfs_hits.append((oid, paths))
            if any(Path(p).name == core.AUDIT_FILENAME for p in paths) and core.valid_json_object(data):
                report["global_audit_blob_candidates"].append({
                    "oid": oid, "sha256": digest, "bytes": len(data), "paths": paths
                })

    recovered_dir.mkdir(parents=True, exist_ok=True)
    for stale in (recovered_dir / core.EXPECTED_FILENAME, recovered_dir / core.AUDIT_FILENAME):
        stale.unlink(missing_ok=True)

    for oid, data, paths in exact_hits:
        if core.pair_with_audit_from_tree(oid, data, paths, report):
            break

    if not report["paired_recovery_hits"] and lfs_hits:
        lfs_path = core.recover_lfs_object_if_available()
        if lfs_path is not None:
            report["lfs_exact_object_recovered"] = True
            lfs_data = lfs_path.read_bytes()
            for pointer_oid, paths in lfs_hits:
                for commit in core.commits_retaining_blob(pointer_oid, paths):
                    report["retaining_commits_checked"] += 1
                    audits: dict[str, tuple[str, bytes]] = {}
                    for oid, path in core.tree_entries(commit):
                        if Path(path).name != core.AUDIT_FILENAME:
                            continue
                        data = core.git_bytes("cat-file", "blob", oid)
                        if core.valid_json_object(data):
                            audits[sha256_bytes(data)] = (path, data)
                    if len(audits) != 1:
                        continue
                    audit_sha, (audit_path, audit_data) = next(iter(audits.items()))
                    zip_out = recovered_dir / core.EXPECTED_FILENAME
                    audit_out = recovered_dir / core.AUDIT_FILENAME
                    zip_out.write_bytes(lfs_data)
                    audit_out.write_bytes(audit_data)
                    report["paired_recovery_hits"].append({
                        "commit": commit,
                        "canonical_blob_oid": "LFS:" + core.EXPECTED_SHA256,
                        "canonical_paths": paths,
                        "canonical_sha256": core.EXPECTED_SHA256,
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

    report["completed_at_utc"] = datetime.now(timezone.utc).isoformat()
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
