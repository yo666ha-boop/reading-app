from __future__ import annotations

import argparse
import json
from pathlib import Path

import compose_strict_qa_candidates as composer
import locate_recovered_qa_ooxml as locator
import promote_recovered_qa_drafts as promotion
import reconcile_strict_qa_progress as reconciler


def write_json(path: Path, value: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def run_batch(
    *,
    source: str,
    draft_path: Path,
    expected_sha256: str,
    expected_count: int,
    structure_path: Path,
    asset_manifest_path: Path | None,
    slot_evidence_path: Path | None,
    graphical_evidence_path: Path | None,
    existing_path: Path | None,
    work_dir: Path,
) -> dict:
    if source not in promotion.SOURCE_ORDER:
        raise ValueError(f"unsupported source {source!r}")
    if slot_evidence_path is None:
        raise ValueError("source-bound slot evidence is required for strict candidate composition")

    # Verify recovered bytes before using any draft content.
    drafts = promotion.verify_draft(draft_path, expected_sha256, expected_count)
    draft_index = promotion.index_unique(drafts, source_hint=source, label=f"draft {source}")

    structures = locator.load_structure(structure_path)
    assets = locator.load_asset_manifest(asset_manifest_path)
    locator_report = locator.build_report(drafts, structures, assets)
    if locator_report.get("duplicate_raw_ids"):
        raise ValueError(f"locator duplicate raw_ids: {locator_report['duplicate_raw_ids'][:3]}")

    slot_evidence = composer.load_jsonl(slot_evidence_path)
    graphical_evidence = composer.load_jsonl(graphical_evidence_path) if graphical_evidence_path else []
    candidates, compose_report = composer.compose(
        drafts,
        locator_report,
        slot_evidence,
        graphical_evidence,
        assets,
    )

    work_dir.mkdir(parents=True, exist_ok=True)
    locator_report_path = work_dir / f"{source}-exact-locator-report.json"
    candidate_path = work_dir / f"{source}-strict-candidates.jsonl"
    compose_report_path = work_dir / f"{source}-strict-compose-report.json"
    strict_output_path = work_dir / f"{source}-strict-promoted.jsonl"
    promotion_report_path = work_dir / f"{source}-strict-promotion-report.json"
    reconcile_report_path = work_dir / f"{source}-strict-reconcile-report.json"

    write_json(locator_report_path, locator_report)
    composer.write_jsonl(candidate_path, candidates)
    write_json(compose_report_path, compose_report)

    existing_records = promotion.load_jsonl(existing_path) if existing_path else []
    promoted_records, promotion_report = promotion.promote(
        {source: (draft_path, expected_sha256, expected_count)},
        candidates,
        existing_records,
    )
    promotion.atomic_write_jsonl(strict_output_path, promoted_records)
    write_json(promotion_report_path, promotion_report)

    _, reconcile_report = reconciler.reconcile([strict_output_path])
    write_json(reconcile_report_path, reconcile_report)

    candidate_ids = {record["raw_id"] for record in candidates}
    existing_ids = {record["raw_id"] for record in existing_records}
    draft_ids = set(draft_index)
    summary = {
        "workflow": "Recovered Q/A strict batch runner",
        "source": source,
        "draft_sha256_verified": expected_sha256,
        "draft_records_verified": len(drafts),
        "slot_evidence_records": len(slot_evidence),
        "asset_manifest_loaded": asset_manifest_path is not None,
        "exact_locator_ready": locator_report.get("exact_qa_offsets_located", 0),
        "locator_unresolved": locator_report.get("unresolved", 0),
        "strict_candidates": len(candidates),
        "existing_strict_records_input": len(existing_records),
        "strict_output_records": len(promoted_records),
        "new_candidate_ids_not_already_strict": len(candidate_ids - existing_ids),
        "drafts_without_strict_candidate": len(draft_ids - candidate_ids),
        "promotion_pass": promotion_report.get("pass"),
        "reconcile_partial_progress_pass": reconcile_report.get("partial_progress_pass"),
        "reconcile_complete_1271": reconcile_report.get("complete_1271"),
        "outputs": {
            "locator_report": str(locator_report_path),
            "strict_candidates": str(candidate_path),
            "compose_report": str(compose_report_path),
            "strict_promoted": str(strict_output_path),
            "promotion_report": str(promotion_report_path),
            "reconcile_report": str(reconcile_report_path),
        },
        "completion_policy": (
            "These outputs are local batch products only. No record counts as complete until the strict output is "
            "persisted to GitHub or another durable project store, read back after persistence, and reconciled there. "
            "Slot/score evidence must be bound to the same source-document SHA; figure and graphical assets must be "
            "verified against the OOXML asset manifest before a strict candidate can be emitted."
        ),
    }
    summary["pass"] = bool(
        summary["promotion_pass"]
        and summary["reconcile_partial_progress_pass"]
        and not locator_report.get("duplicate_raw_ids")
    )
    return summary


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--source", required=True, choices=promotion.SOURCE_ORDER)
    ap.add_argument("--draft", type=Path, required=True)
    ap.add_argument("--expected-sha256", required=True)
    ap.add_argument("--expected-count", type=int, required=True)
    ap.add_argument("--structure", type=Path, required=True)
    ap.add_argument("--asset-manifest", type=Path)
    ap.add_argument("--slot-evidence", type=Path, required=True)
    ap.add_argument("--graphical-evidence", type=Path)
    ap.add_argument("--existing", type=Path)
    ap.add_argument("--work-dir", type=Path, required=True)
    ap.add_argument("--summary", type=Path)
    ap.add_argument("--require-all-drafts-resolved", action="store_true")
    args = ap.parse_args()

    summary = run_batch(
        source=args.source,
        draft_path=args.draft,
        expected_sha256=args.expected_sha256,
        expected_count=args.expected_count,
        structure_path=args.structure,
        asset_manifest_path=args.asset_manifest,
        slot_evidence_path=args.slot_evidence,
        graphical_evidence_path=args.graphical_evidence,
        existing_path=args.existing,
        work_dir=args.work_dir,
    )
    if args.summary:
        write_json(args.summary, summary)
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    if not summary["pass"]:
        return 9
    if args.require_all_drafts_resolved and summary["drafts_without_strict_candidate"]:
        return 10
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
