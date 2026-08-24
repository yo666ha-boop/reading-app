from __future__ import annotations

import argparse
import importlib.util
import json
from datetime import datetime, timezone
from pathlib import Path

MODULE_PATH = Path(__file__).with_name("audit_winpass_normalization.py")
spec = importlib.util.spec_from_file_location("audit_winpass_normalization", MODULE_PATH)
assert spec and spec.loader
_audit_mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(_audit_mod)


def load_array(path: Path) -> list[dict]:
    obj = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(obj, list) or not all(isinstance(x, dict) for x in obj):
        raise SystemExit(f"{path}: expected JSON array of objects")
    return obj


def apply(records: list[dict], decisions: list[dict], *, expected_raw: int = 717, expected_included: int = 570) -> tuple[list[dict], dict]:
    report = _audit_mod.audit(records, decisions, expected_raw=expected_raw, expected_included=expected_included)
    if not report.get("pass"):
        raise ValueError("Winpass normalization audit did not PASS; refusing to materialize originals")

    decision_map = {str(d["record_id"]).strip(): d for d in decisions}
    included: list[dict] = []
    provenance: list[dict] = []
    for raw_index, record in enumerate(records):
        rid = str(record.get("id", "")).strip()
        decision = decision_map[rid]
        if str(decision.get("action", "")).strip().lower() != "include":
            continue
        fp = _audit_mod.record_fingerprint(record)
        if str(decision.get("record_fingerprint_sha256", "")).strip().lower() != fp:
            raise AssertionError("post-audit record fingerprint drift detected")
        included.append(record)
        provenance.append({
            "output_index": len(included) - 1,
            "raw_index": raw_index,
            "record_id": rid,
            "record_fingerprint_sha256": fp,
            "decision_reason": str(decision.get("reason", "")).strip(),
            "decision_evidence": [str(x).strip() for x in decision.get("evidence", []) if str(x).strip()],
        })

    if len(included) != expected_included:
        raise AssertionError(f"post-audit included count drift: {len(included)} != {expected_included}")
    if [p["record_id"] for p in provenance] != [str(r.get("id", "")).strip() for r in included]:
        raise AssertionError("provenance/output order mismatch")

    manifest = {
        "workflow": "Winpass Evidence-Bound Normalization Materialization",
        "recorded_at_utc": datetime.now(timezone.utc).isoformat(),
        "raw_records": len(records),
        "materialized_originals": len(included),
        "audit_pass": True,
        "policy": {
            "audit_pass_required_before_materialization": True,
            "exact_record_fingerprint_binding_rechecked": True,
            "raw_input_order_preserved": True,
            "count_is_verification_not_selection_rule": True,
            "excluded_records_never_materialized": True,
        },
        "provenance": provenance,
    }
    return included, manifest


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--records", type=Path, required=True)
    ap.add_argument("--decisions", type=Path, required=True)
    ap.add_argument("--out-records", type=Path, required=True)
    ap.add_argument("--out-provenance", type=Path, required=True)
    ap.add_argument("--expected-raw", type=int, default=717)
    ap.add_argument("--expected-included", type=int, default=570)
    args = ap.parse_args()
    try:
        included, manifest = apply(load_array(args.records), load_array(args.decisions), expected_raw=args.expected_raw, expected_included=args.expected_included)
    except (ValueError, AssertionError) as exc:
        print(f"FAIL_CLOSED: {exc}")
        return 8
    args.out_records.parent.mkdir(parents=True, exist_ok=True)
    args.out_provenance.parent.mkdir(parents=True, exist_ok=True)
    args.out_records.write_text(json.dumps(included, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    args.out_provenance.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({k: v for k, v in manifest.items() if k != "provenance"}, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
