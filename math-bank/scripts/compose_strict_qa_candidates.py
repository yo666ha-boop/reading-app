from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any

import validate_raw1271_materialization as strict_gate

RAW_ID_RE = re.compile(r"^(?P<source>[^:]+):(?P<stem>[^:]+):M(?P<major>\d+):S(?P<subslot>\d+)$")


def canonical(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def load_jsonl(path: Path) -> list[dict]:
    out: list[dict] = []
    for line_no, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        value = json.loads(line)
        if not isinstance(value, dict):
            raise ValueError(f"{path}: line {line_no}: object required")
        out.append(value)
    return out


def unique_by_raw_id(records: list[dict], label: str) -> dict[str, dict]:
    out: dict[str, dict] = {}
    for record in records:
        raw_id = record.get("raw_id")
        if not isinstance(raw_id, str) or not raw_id.strip():
            raise ValueError(f"{label}: raw_id required")
        if raw_id in out:
            raise ValueError(f"{label}: duplicate raw_id {raw_id}")
        out[raw_id] = record
    return out


def locator_index(report: dict) -> dict[str, dict]:
    results = report.get("results")
    if not isinstance(results, list):
        raise ValueError("locator report has no results list")
    return unique_by_raw_id([x for x in results if isinstance(x, dict)], "locator")


def parse_raw_id(raw_id: str) -> dict | None:
    match = RAW_ID_RE.fullmatch(raw_id)
    if not match:
        return None
    return {
        "source": match.group("source"),
        "stem": match.group("stem"),
        "major": int(match.group("major")),
        "subslot": int(match.group("subslot")),
    }


def choose_exact(field: str, values: list[tuple[str, Any]], reasons: list[str]) -> Any:
    present = [(label, value) for label, value in values if value not in (None, "", [], {})]
    if not present:
        reasons.append(f"missing {field}")
        return None
    baseline = canonical(present[0][1])
    for label, value in present[1:]:
        if canonical(value) != baseline:
            reasons.append(f"conflicting {field}: {present[0][0]} vs {label}")
            return None
    return present[0][1]


def valid_graphical_asset(value: Any, expected_doc_sha: str) -> bool:
    if not isinstance(value, dict):
        return False
    asset_sha = value.get("asset_sha256")
    doc_sha = value.get("source_document_sha256")
    identity = value.get("target") or value.get("relationship_id")
    return (
        isinstance(asset_sha, str)
        and len(asset_sha) == 64
        and isinstance(doc_sha, str)
        and doc_sha == expected_doc_sha
        and bool(identity)
    )


def valid_figure_refs(refs: Any) -> bool:
    if not isinstance(refs, list):
        return False
    for ref in refs:
        if not isinstance(ref, dict) or ref.get("missing") is True:
            return False
        sha = ref.get("asset_sha256")
        if not isinstance(sha, str) or len(sha) != 64:
            return False
        if not ref.get("relationship_id") and not ref.get("target"):
            return False
    return True


def compose_one(
    draft: dict,
    locator: dict | None,
    slot: dict | None,
    graphical: dict | None,
) -> tuple[dict | None, dict]:
    raw_id = draft.get("raw_id")
    reasons: list[str] = []
    detail: dict[str, Any] = {"raw_id": raw_id, "reasons": reasons, "status": "UNRESOLVED"}
    if not isinstance(raw_id, str):
        reasons.append("draft raw_id missing")
        return None, detail
    identity = parse_raw_id(raw_id)
    if identity is None:
        reasons.append("raw_id does not match source:stem:Mnn:Snn scheme")
        return None, detail
    if locator is None:
        reasons.append("missing locator result")
        return None, detail

    source = choose_exact("source", [
        ("raw_id", identity["source"]),
        ("draft", draft.get("source")),
        ("locator", locator.get("source")),
        ("slot", slot.get("source") if slot else None),
    ], reasons)
    source_document = choose_exact("source_document", [
        ("draft", Path(str(draft.get("source_document"))).name if draft.get("source_document") else None),
        ("locator", Path(str(locator.get("source_document"))).name if locator.get("source_document") else None),
        ("slot", Path(str(slot.get("source_document"))).name if slot and slot.get("source_document") else None),
    ], reasons)
    if isinstance(source_document, str) and Path(source_document).stem != identity["stem"]:
        reasons.append("source_document stem disagrees with raw_id")

    document_sha = locator.get("source_document_sha256")
    if not isinstance(document_sha, str) or len(document_sha) != 64:
        reasons.append("locator lacks exact source_document_sha256")

    grade = choose_exact("grade", [
        ("draft", draft.get("grade")),
        ("slot", slot.get("grade") if slot else None),
    ], reasons)
    major = choose_exact("major", [
        ("raw_id", identity["major"]),
        ("draft", draft.get("major")),
        ("slot", slot.get("major") if slot else None),
    ], reasons)
    subslot = choose_exact("subslot", [
        ("raw_id", identity["subslot"]),
        ("draft", draft.get("subslot")),
        ("slot", slot.get("subslot") if slot else None),
    ], reasons)
    score_evidence = choose_exact("score_evidence", [
        ("draft", draft.get("score_evidence")),
        ("slot", slot.get("score_evidence") if slot else None),
    ], reasons)
    if score_evidence is not None and not strict_gate.valid_score_evidence(score_evidence):
        reasons.append("score_evidence fails strict source-evidence shape")

    question = draft.get("question")
    if not strict_gate.meaningful_text(question):
        reasons.append("question missing")
    question_offsets = locator.get("question_offsets")
    if locator.get("question_match_count") != 1 or not strict_gate.valid_offsets(question_offsets):
        reasons.append("question exact OOXML match is not uniquely proven")

    figure_refs = locator.get("question_figure_refs", [])
    if figure_refs and not valid_figure_refs(figure_refs):
        reasons.append("question figure refs lack exact asset identity")

    answer = draft.get("answer") if isinstance(draft.get("answer"), str) else ""
    graphical_marker = bool(draft.get("graphical_answer") or draft.get("graphical_answer_asset"))
    answer_offsets: list[dict] = []
    graphical_asset = None
    if answer.strip():
        answer_offsets = locator.get("answer_offsets") or []
        if locator.get("answer_match_count") != 1 or not strict_gate.valid_offsets(answer_offsets):
            reasons.append("text answer exact OOXML match is not uniquely proven")
    elif graphical_marker:
        if graphical is None:
            reasons.append("graphical answer evidence missing")
        else:
            graphical_asset = graphical.get("graphical_answer_asset")
            if not isinstance(document_sha, str) or not valid_graphical_asset(graphical_asset, document_sha):
                reasons.append("graphical answer asset lacks exact SHA/document identity")
            supplied_offsets = graphical.get("answer_offsets")
            if supplied_offsets not in (None, [], {}) and not strict_gate.valid_offsets(supplied_offsets):
                reasons.append("graphical answer_offsets invalid")
            answer_offsets = supplied_offsets if isinstance(supplied_offsets, list) else []
    else:
        reasons.append("draft has neither text answer nor graphical marker")

    if reasons:
        return None, detail

    record = {
        "raw_id": raw_id,
        "source": source,
        "source_document": source_document,
        "source_document_sha256": document_sha,
        "grade": grade,
        "major": major,
        "subslot": subslot,
        "score_evidence": score_evidence,
        "question": question,
        "answer": answer,
        "question_offsets": question_offsets,
        "answer_offsets": answer_offsets,
        "figure_refs": figure_refs,
    }
    if graphical_asset is not None:
        record["graphical_answer_asset"] = graphical_asset
    record["record_fingerprint"] = strict_gate.recompute_fingerprint(record)
    validation_errors = strict_gate.validate_record(record, 1)
    if validation_errors:
        reasons.extend(validation_errors)
        return None, detail
    detail["status"] = "STRICT_CANDIDATE_VALID"
    detail["record_fingerprint"] = record["record_fingerprint"]
    return record, detail


def compose(
    drafts: list[dict],
    locator_report: dict,
    slots: list[dict] | None = None,
    graphical_evidence: list[dict] | None = None,
) -> tuple[list[dict], dict]:
    draft_index = unique_by_raw_id(drafts, "draft")
    locators = locator_index(locator_report)
    slot_index = unique_by_raw_id(slots or [], "slot evidence")
    graphical_index = unique_by_raw_id(graphical_evidence or [], "graphical evidence")
    candidates: list[dict] = []
    details: list[dict] = []
    for raw_id, draft in draft_index.items():
        record, detail = compose_one(
            draft,
            locators.get(raw_id),
            slot_index.get(raw_id),
            graphical_index.get(raw_id),
        )
        details.append(detail)
        if record is not None:
            candidates.append(record)
    candidates.sort(key=lambda r: r["raw_id"])
    unresolved = [d for d in details if d["status"] != "STRICT_CANDIDATE_VALID"]
    return candidates, {
        "workflow": "Strict Q/A candidate composer",
        "draft_records": len(drafts),
        "strict_candidates": len(candidates),
        "unresolved": len(unresolved),
        "details": details,
        "policy": (
            "A candidate is emitted only after exact raw identity agreement, source document SHA from OOXML, "
            "grade/major/subslot agreement, explicit score evidence, unique exact Q/A offsets or source-bound "
            "graphical asset evidence, exact figure asset identity, content-bound fingerprint recomputation, and "
            "per-record strict validator PASS. This file creates candidates only; durable save/readback/reconciliation "
            "is still required before completion is counted."
        ),
    }


def write_jsonl(path: Path, records: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        "".join(json.dumps(r, ensure_ascii=False, sort_keys=True, separators=(",", ":")) + "\n" for r in records),
        encoding="utf-8",
    )


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--draft", type=Path, required=True)
    ap.add_argument("--locator-report", type=Path, required=True)
    ap.add_argument("--slot-evidence", type=Path)
    ap.add_argument("--graphical-evidence", type=Path)
    ap.add_argument("--output", type=Path, required=True)
    ap.add_argument("--report", type=Path, required=True)
    args = ap.parse_args()
    drafts = load_jsonl(args.draft)
    locator_report = json.loads(args.locator_report.read_text(encoding="utf-8"))
    slots = load_jsonl(args.slot_evidence) if args.slot_evidence else []
    graphical = load_jsonl(args.graphical_evidence) if args.graphical_evidence else []
    candidates, report = compose(drafts, locator_report, slots, graphical)
    write_jsonl(args.output, candidates)
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "draft_records": report["draft_records"],
        "strict_candidates": report["strict_candidates"],
        "unresolved": report["unresolved"],
    }, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
