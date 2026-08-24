from __future__ import annotations

import argparse
import hashlib
import json
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

TARGETS = {"Winpass": 570, "実力錬成": 237, "Standard": 317}
TOTAL = 1124


def norm(value: object) -> str:
    return str(value or "").strip()


def load_array(path: Path) -> list[dict]:
    obj = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(obj, list) or not all(isinstance(x, dict) for x in obj):
        raise SystemExit(f"{path}: expected JSON array of objects")
    return obj


def fingerprint(record: dict) -> str:
    payload = {
        k: record.get(k)
        for k in ("id", "source", "document_id", "record_index", "question", "answer", "explanation", "figure_refs")
    }
    return hashlib.sha256(
        json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    ).hexdigest()


def source_name(record: dict) -> str:
    value = record.get("source")
    if isinstance(value, str):
        return value.strip()
    if isinstance(value, dict):
        for key in ("dataset", "source", "name", "book"):
            if norm(value.get(key)):
                return norm(value.get(key))
    return ""


def is_generated(record: dict) -> bool:
    src = record.get("source")
    if isinstance(src, dict) and src.get("is_generated_variant") is True:
        return True
    if record.get("is_generated_variant") is True:
        return True
    if norm(record.get("parent_id")):
        return True
    if norm(record.get("variant_group")):
        return True
    return False


def validate(by_source: dict[str, list[dict]], asset_manifest: set[str] | None = None) -> dict:
    issues: list[dict] = []
    ids: list[str] = []
    fps: list[str] = []
    qa: list[tuple[str, str]] = []
    counts: dict[str, int] = {}
    figure_refs = 0
    missing_figure_refs: list[dict] = []

    for source, expected in TARGETS.items():
        records = by_source.get(source, [])
        counts[source] = len(records)
        if len(records) != expected:
            issues.append({"source": source, "issue": "source_count_mismatch", "expected": expected, "actual": len(records)})
        for index, record in enumerate(records):
            rid = norm(record.get("id"))
            question = norm(record.get("question"))
            answer = norm(record.get("answer"))
            actual_source = source_name(record)
            if not rid:
                issues.append({"source": source, "index": index, "issue": "blank_id"})
            if not question:
                issues.append({"source": source, "index": index, "id": rid, "issue": "blank_question"})
            if not answer:
                issues.append({"source": source, "index": index, "id": rid, "issue": "blank_answer"})
            if actual_source and actual_source != source:
                issues.append({"source": source, "index": index, "id": rid, "issue": "source_mismatch", "actual": actual_source})
            if is_generated(record):
                issues.append({"source": source, "index": index, "id": rid, "issue": "generated_variant_contaminated_originals"})
            refs = record.get("figure_refs", [])
            if refs is None:
                refs = []
            if not isinstance(refs, list):
                issues.append({"source": source, "index": index, "id": rid, "issue": "figure_refs_not_list"})
                refs = []
            for ref in refs:
                ref_text = norm(ref)
                figure_refs += 1
                if not ref_text:
                    issues.append({"source": source, "index": index, "id": rid, "issue": "blank_figure_ref"})
                elif asset_manifest is not None and ref_text not in asset_manifest:
                    missing_figure_refs.append({"source": source, "index": index, "id": rid, "ref": ref_text})
            ids.append(rid)
            fps.append(fingerprint(record))
            qa.append((question, answer))

    duplicate_ids = sorted(k for k, n in Counter(ids).items() if k and n > 1)
    duplicate_fingerprints = sorted(k for k, n in Counter(fps).items() if n > 1)
    duplicate_qa_groups = [
        {"question": key[0], "answer": key[1], "count": n}
        for key, n in Counter(qa).items()
        if key[0] and key[1] and n > 1
    ]
    total = sum(counts.values())
    passed = (
        total == TOTAL
        and all(counts.get(source) == expected for source, expected in TARGETS.items())
        and not issues
        and not duplicate_ids
        and not duplicate_fingerprints
        and not missing_figure_refs
    )
    return {
        "expected_counts": TARGETS,
        "actual_counts": counts,
        "expected_total": TOTAL,
        "actual_total": total,
        "records_with_question": sum(bool(norm(r.get("question"))) for rows in by_source.values() for r in rows),
        "records_with_answer": sum(bool(norm(r.get("answer"))) for rows in by_source.values() for r in rows),
        "figure_refs": figure_refs,
        "missing_figure_refs": missing_figure_refs,
        "issues": issues,
        "duplicate_ids": duplicate_ids,
        "duplicate_fingerprints": duplicate_fingerprints,
        "duplicate_question_answer_groups_for_review": duplicate_qa_groups,
        "pass": passed,
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--winpass", type=Path, required=True)
    ap.add_argument("--jitsuren", type=Path, required=True)
    ap.add_argument("--standard", type=Path, required=True)
    ap.add_argument("--asset-manifest", type=Path)
    ap.add_argument("--report", type=Path, required=True)
    args = ap.parse_args()
    assets = None
    if args.asset_manifest:
        obj = json.loads(args.asset_manifest.read_text(encoding="utf-8"))
        if not isinstance(obj, list):
            raise SystemExit("asset manifest must be a JSON array")
        assets = {norm(x) for x in obj if norm(x)}
    result = validate({
        "Winpass": load_array(args.winpass),
        "実力錬成": load_array(args.jitsuren),
        "Standard": load_array(args.standard),
    }, assets)
    report = {
        "workflow": "Math Rebuilt 1124 Originals Validation",
        "recorded_at_utc": datetime.now(timezone.utc).isoformat(),
        "policy": {
            "source_counts_are_verification_not_selection_rules": True,
            "all_1124_questions_and_answers_required": True,
            "global_id_uniqueness_required": True,
            "global_record_fingerprint_uniqueness_required": True,
            "generated_variant_contamination_forbidden": True,
            "figure_ref_resolution_required_when_asset_manifest_provided": True,
            "duplicate_question_answer_groups_are_reported_for_review_not_auto_deleted": True,
            "only_pass_may_feed_variant_generation_and_app_records": True,
        },
        "result": result,
        "next": "Only PASS may become immutable rebuilt originals and feed fingerprint-bound variant generation. Duplicate Q&A text is review evidence only and must never be auto-deleted to force counts.",
    }
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0 if result["pass"] else 9


if __name__ == "__main__":
    raise SystemExit(main())
