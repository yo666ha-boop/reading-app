from __future__ import annotations

import argparse
import hashlib
import importlib.util
import json
from pathlib import Path

FREEZE_PATH = Path(__file__).with_name("freeze_rebuilt_originals.py")
spec = importlib.util.spec_from_file_location("freeze_rebuilt_originals", FREEZE_PATH)
assert spec and spec.loader
_f = importlib.util.module_from_spec(spec)
spec.loader.exec_module(_f)


def load_obj(path: Path) -> object:
    return json.loads(path.read_text(encoding="utf-8"))


def validate(records: list[dict], manifest: dict) -> dict:
    issues: list[dict] = []
    if len(records) != 1124:
        issues.append({"issue":"record_count_mismatch","expected":1124,"actual":len(records)})
    if manifest.get("records") != len(records):
        issues.append({"issue":"manifest_record_count_mismatch","manifest":manifest.get("records"),"actual":len(records)})
    expected_payload_sha = _f.payload_sha256(records)
    if manifest.get("combined_payload_sha256") != expected_payload_sha:
        issues.append({"issue":"combined_payload_sha256_mismatch","expected":expected_payload_sha,"actual":manifest.get("combined_payload_sha256")})

    provenance = manifest.get("provenance")
    if not isinstance(provenance, list):
        provenance = []
        issues.append({"issue":"provenance_not_list"})
    if len(provenance) != len(records):
        issues.append({"issue":"provenance_count_mismatch","expected":len(records),"actual":len(provenance)})

    fingerprints: list[str] = []
    source_counts = {"Winpass":0,"実力錬成":0,"Standard":0}
    expected_source_order = ["Winpass"] * 570 + ["実力錬成"] * 237 + ["Standard"] * 317
    for index, record in enumerate(records):
        fp = _f._v.fingerprint(record)
        fingerprints.append(fp)
        if index >= len(provenance):
            continue
        p = provenance[index]
        if not isinstance(p, dict):
            issues.append({"index":index,"issue":"provenance_not_object"})
            continue
        expected_source = expected_source_order[index] if index < len(expected_source_order) else None
        source = str(p.get("source", "")).strip()
        if p.get("combined_index") != index:
            issues.append({"index":index,"issue":"combined_index_mismatch","actual":p.get("combined_index")})
        if source != expected_source:
            issues.append({"index":index,"issue":"source_order_mismatch","expected":expected_source,"actual":source})
        if source in source_counts:
            source_counts[source] += 1
        expected_local = index if source == "Winpass" else index - 570 if source == "実力錬成" else index - 807 if source == "Standard" else None
        if p.get("source_index") != expected_local:
            issues.append({"index":index,"issue":"source_index_mismatch","expected":expected_local,"actual":p.get("source_index")})
        rid = str(record.get("id", "")).strip()
        if str(p.get("record_id", "")).strip() != rid:
            issues.append({"index":index,"issue":"record_id_mismatch","expected":rid,"actual":p.get("record_id")})
        if str(p.get("record_fingerprint_sha256", "")).strip().lower() != fp:
            issues.append({"index":index,"issue":"record_fingerprint_mismatch","expected":fp,"actual":p.get("record_fingerprint_sha256")})

    expected_seq_sha = _f.payload_sha256(fingerprints)
    if manifest.get("record_fingerprint_sequence_sha256") != expected_seq_sha:
        issues.append({"issue":"record_fingerprint_sequence_sha256_mismatch","expected":expected_seq_sha,"actual":manifest.get("record_fingerprint_sequence_sha256")})
    if manifest.get("source_counts") != {"Winpass":570,"実力錬成":237,"Standard":317}:
        issues.append({"issue":"manifest_source_counts_mismatch","actual":manifest.get("source_counts")})
    if source_counts != {"Winpass":570,"実力錬成":237,"Standard":317}:
        issues.append({"issue":"provenance_source_counts_mismatch","actual":source_counts})

    return {
        "records": len(records),
        "combined_payload_sha256": expected_payload_sha,
        "record_fingerprint_sequence_sha256": expected_seq_sha,
        "source_counts": source_counts,
        "issues": issues,
        "pass": not issues,
        "policy": {
            "manifest_and_records_must_match_exactly": True,
            "fixed_source_order_required": True,
            "per_record_provenance_binding_required": True,
            "combined_payload_sha_required": True,
            "fingerprint_sequence_sha_required": True,
            "only_pass_may_feed_variant_parent_binding": True,
        },
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--records", type=Path, required=True)
    ap.add_argument("--manifest", type=Path, required=True)
    ap.add_argument("--report", type=Path, required=True)
    args = ap.parse_args()
    records = load_obj(args.records)
    manifest = load_obj(args.manifest)
    if not isinstance(records, list) or not all(isinstance(x, dict) for x in records):
        raise SystemExit("records must be array of objects")
    if not isinstance(manifest, dict):
        raise SystemExit("manifest must be object")
    result = validate(records, manifest)
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result["pass"] else 11


if __name__ == "__main__":
    raise SystemExit(main())
