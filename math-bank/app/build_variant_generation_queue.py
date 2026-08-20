from __future__ import annotations

import argparse
import json
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

from validate_app_records import load_records
from validate_expanded_variant_layer import (
    base_gate,
    load_layer,
    parent_record_sha256,
    validate_layer,
)


def classify_parent(parent: dict) -> tuple[str, str]:
    """Conservative planning only. This never generates or verifies a variant."""
    if parent.get("figure_refs"):
        return "manual_generation_queue", "figure_parent_requires_individual_figure_and_solution_review"
    if isinstance(parent.get("choices"), list):
        return "manual_generation_queue", "choice_parent_requires_choice_and_distractor_recalculation"
    fmt = str(parent.get("question_format") or "")
    skill = str(parent.get("skill") or "")
    q = str(parent.get("question") or "")
    deterministic_terms = ("計算", "方程式", "関数", "確率")
    if any(term in (fmt + skill + q) for term in deterministic_terms):
        return "deterministic_candidate_review", "numeric_or_symbolic_parent_candidate_requires_parser_and_independent_recalculation"
    return "manual_generation_queue", "structure_not_proven_safe_for_automatic_generation"


def validated_covered_parent_ids(
    base: list[dict], variants: list[dict], provenance: list[dict]
) -> tuple[set[str], dict]:
    """Only a layer that passes the strict expanded validator may suppress a parent from the queue."""
    report = validate_layer(base, variants, provenance, require_full_parent_coverage=False)
    covered = {
        r["source"]["parent_id"]
        for r in variants
        if isinstance(r, dict)
        and isinstance(r.get("source"), dict)
        and r["source"].get("parent_id")
    }
    if len(covered) != report["expanded_parent_coverage"]:
        raise ValueError(
            "validated expanded coverage mismatch: "
            f"derived={len(covered)} report={report['expanded_parent_coverage']}"
        )
    return covered, report


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("base")
    ap.add_argument("expanded")
    ap.add_argument("output")
    ns = ap.parse_args()

    base = load_records(Path(ns.base))
    by_id, originals, _ = base_gate(base)
    variants, provenance, _ = load_layer(Path(ns.expanded))
    covered, expanded_validation = validated_covered_parent_ids(base, variants, provenance)

    queue = []
    bucket_counts: Counter[str] = Counter()
    reason_counts: Counter[str] = Counter()
    for parent in originals:
        pid = parent["id"]
        if pid in covered:
            continue
        bucket, reason = classify_parent(parent)
        bucket_counts[bucket] += 1
        reason_counts[reason] += 1
        queue.append({
            "parent_id": pid,
            "parent_record_sha256": parent_record_sha256(parent),
            "grade": parent["grade"],
            "book": parent["source"]["book"],
            "document": parent["source"]["document"],
            "original_no": parent["source"].get("original_no"),
            "unit": parent["unit"],
            "skill": parent["skill"],
            "question_format": parent["question_format"],
            "difficulty": parent["difficulty"],
            "figure_refs": parent.get("figure_refs") or [],
            "bucket": bucket,
            "reason": reason,
            "generation_status": "NOT_GENERATED",
            "verification_status": "NOT_VERIFIED",
        })

    report = {
        "status": "PASS",
        "policy": "Parent-first conservative planning only; only variants that pass the strict expanded validator may count as covered, each queue row is SHA-256-bound to the exact verified parent record read using the same implementation enforced by the publication validator, and this file does not generate or promote variants.",
        "recorded_at_utc": datetime.now(timezone.utc).isoformat(),
        "base_originals": len(originals),
        "validated_existing_expanded_variants": expanded_validation["expanded_verified_variants"],
        "validated_existing_parent_coverage": expanded_validation["expanded_parent_coverage"],
        "already_covered_parents": len(set(by_id).intersection(covered)),
        "uncovered_parent_queue_count": len(queue),
        "parent_fingerprint_algorithm": "sha256(canonical-json-sort-keys)",
        "bucket_counts": dict(sorted(bucket_counts.items())),
        "reason_counts": dict(sorted(reason_counts.items())),
        "queue": queue,
    }
    out = Path(ns.output)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({k: v for k, v in report.items() if k != "queue"}, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as e:
        print(f"FAIL: {e}")
        raise SystemExit(1)
