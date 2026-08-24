from __future__ import annotations

import argparse
import hashlib
import json
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

FORBIDDEN_REASONS = {"count_adjustment", "count-forcing", "make_570", "target_count"}


def load_array(path: Path) -> list[dict]:
    obj = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(obj, list) or not all(isinstance(x, dict) for x in obj):
        raise SystemExit(f"{path}: expected JSON array of objects")
    return obj


def record_fingerprint(record: dict) -> str:
    payload = {k: record.get(k) for k in ("id", "source", "document_id", "record_index", "question", "answer", "explanation", "figure_refs")}
    raw = json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def audit(records: list[dict], decisions: list[dict], *, expected_raw: int = 717, expected_included: int = 570) -> dict:
    record_ids = [str(r.get("id", "")).strip() for r in records]
    blank_record_ids = [i for i, rid in enumerate(record_ids) if not rid]
    duplicate_record_ids = sorted(rid for rid, n in Counter(record_ids).items() if rid and n > 1)
    record_set = {rid for rid in record_ids if rid}
    record_map = {str(r.get("id", "")).strip(): r for r in records if str(r.get("id", "")).strip()}

    decision_ids = [str(d.get("record_id", "")).strip() for d in decisions]
    duplicate_decision_ids = sorted(rid for rid, n in Counter(decision_ids).items() if rid and n > 1)
    decision_map = {str(d.get("record_id", "")).strip(): d for d in decisions if str(d.get("record_id", "")).strip()}
    missing_decisions = sorted(record_set - set(decision_map))
    orphan_decisions = sorted(set(decision_map) - record_set)

    invalid_decisions = []
    included = []
    excluded = []
    reason_counts: Counter[str] = Counter()
    fingerprint_mismatches = []
    for rid in sorted(record_set & set(decision_map)):
        d = decision_map[rid]
        action = str(d.get("action", "")).strip().lower()
        reason = str(d.get("reason", "")).strip()
        evidence = d.get("evidence")
        if not isinstance(evidence, list):
            evidence = []
        evidence = [str(x).strip() for x in evidence if str(x).strip()]
        supplied_fp = str(d.get("record_fingerprint_sha256", "")).strip().lower()
        expected_fp = record_fingerprint(record_map[rid])
        issues = []
        if not supplied_fp:
            issues.append("record_fingerprint_sha256 required")
        elif supplied_fp != expected_fp:
            issues.append("record fingerprint mismatch")
            fingerprint_mismatches.append({"record_id": rid, "expected": expected_fp, "actual": supplied_fp})
        if action not in {"include", "exclude"}:
            issues.append("action must be include/exclude")
        if not reason:
            issues.append("reason required")
        if reason.casefold() in FORBIDDEN_REASONS:
            issues.append("count-forcing reason forbidden")
        if action == "exclude" and not evidence:
            issues.append("exclude requires source evidence")
        if issues:
            invalid_decisions.append({"record_id": rid, "issues": issues, "decision": d})
            continue
        reason_counts[f"{action}:{reason}"] += 1
        if action == "include":
            included.append(rid)
        else:
            excluded.append(rid)

    structural_ok = (
        len(records) == expected_raw
        and not blank_record_ids
        and not duplicate_record_ids
        and not duplicate_decision_ids
        and not missing_decisions
        and not orphan_decisions
        and not invalid_decisions
        and not fingerprint_mismatches
    )
    count_match = len(included) == expected_included and len(excluded) == expected_raw - expected_included
    pass_gate = structural_ok and count_match
    return {
        "workflow": "Winpass Evidence-Bound Normalization Audit",
        "recorded_at_utc": datetime.now(timezone.utc).isoformat(),
        "policy": {
            "expected_570_is_verification_only_not_selection_rule": True,
            "every_raw_record_requires_explicit_decision": True,
            "exclude_requires_evidence": True,
            "count_forcing_reason_forbidden": True,
            "no_auto_delete_to_target_count": True,
            "decision_must_match_exact_raw_record_fingerprint": True,
        },
        "expected_raw": expected_raw,
        "actual_raw": len(records),
        "expected_included": expected_included,
        "included": len(included),
        "excluded": len(excluded),
        "blank_record_id_indexes": blank_record_ids,
        "duplicate_record_ids": duplicate_record_ids,
        "duplicate_decision_ids": duplicate_decision_ids,
        "missing_decisions": missing_decisions,
        "orphan_decisions": orphan_decisions,
        "fingerprint_mismatches": fingerprint_mismatches,
        "invalid_decisions": invalid_decisions,
        "reason_counts": dict(sorted(reason_counts.items())),
        "included_ids": included,
        "excluded_ids": excluded,
        "structural_decision_coverage_pass": structural_ok,
        "historical_570_count_match_after_evidence_decisions": count_match,
        "pass": pass_gate,
        "next": "Only PASS may feed the 570 Winpass originals into full problem/answer/figure/duplicate/structure validation. If count differs, inspect evidence; never edit decisions merely to force 570.",
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--records", type=Path, required=True)
    ap.add_argument("--decisions", type=Path, required=True)
    ap.add_argument("--report", type=Path, default=Path("math-bank/state/winpass-normalization-audit-latest.json"))
    ap.add_argument("--expected-raw", type=int, default=717)
    ap.add_argument("--expected-included", type=int, default=570)
    args = ap.parse_args()
    report = audit(load_array(args.records), load_array(args.decisions), expected_raw=args.expected_raw, expected_included=args.expected_included)
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0 if report["pass"] else 4


if __name__ == "__main__":
    raise SystemExit(main())
