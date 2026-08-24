from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any

import validate_raw1271_materialization as strict_gate

RAW_ID_RE = re.compile(r"^(?P<source>[^:]+):(?P<stem>[^:]+):M(?P<major>\d+):S(?P<subslot>\d+)$")
SHA256_RE = re.compile(r"^[0-9a-f]{64}$")


def canonical(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def valid_sha256(value: Any) -> bool:
    return isinstance(value, str) and bool(SHA256_RE.fullmatch(value))


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


def load_asset_manifest(path: Path | None) -> dict[tuple[str, str, str], dict]:
    if path is None:
        return {}
    obj = json.loads(path.read_text(encoding="utf-8"))
    documents = obj.get("documents")
    if not isinstance(documents, list):
        raise ValueError("asset manifest has no documents list")
    out: dict[tuple[str, str, str], dict] = {}
    for doc in documents:
        if not isinstance(doc, dict):
            continue
        source = doc.get("source")
        name = doc.get("document")
        if not isinstance(source, str) or not isinstance(name, str):
            continue
        for asset in doc.get("assets", []):
            if not isinstance(asset, dict):
                continue
            target = asset.get("target")
            if not isinstance(target, str):
                continue
            key = (source, Path(name).name, target)
            if key in out:
                raise ValueError(f"duplicate asset target {key}")
            out[key] = asset
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


def asset_matches_manifest(
    value: Any,
    *,
    source: str,
    source_document: str,
    asset_map: dict[tuple[str, str, str], dict],
) -> bool:
    if not isinstance(value, dict):
        return False
    target = value.get("target")
    asset_sha = value.get("asset_sha256")
    if not isinstance(target, str) or not valid_sha256(asset_sha):
        return False
    manifest_asset = asset_map.get((source, Path(source_document).name, target))
    if not isinstance(manifest_asset, dict):
        return False
    if manifest_asset.get("asset_sha256") != asset_sha:
        return False
    relationship_id = value.get("relationship_id")
    if relationship_id:
        relationship_ids = manifest_asset.get("relationship_ids") or []
        if relationship_id not in relationship_ids:
            return False
    return True


def valid_graphical_asset(
    value: Any,
    *,
    expected_doc_sha: str,
    source: str,
    source_document: str,
    asset_map: dict[tuple[str, str, str], dict],
) -> bool:
    if not isinstance(value, dict):
        return False
    doc_sha = value.get("source_document_sha256")
    return (
        valid_sha256(doc_sha)
        and doc_sha == expected_doc_sha
        and asset_matches_manifest(
            value,
            source=source,
            source_document=source_document,
            asset_map=asset_map,
        )
    )


def valid_figure_refs(
    refs: Any,
    *,
    source: str,
    source_document: str,
    asset_map: dict[tuple[str, str, str], dict],
) -> bool:
    if not isinstance(refs, list):
        return False
    for ref in refs:
        if not isinstance(ref, dict) or ref.get("missing") is True:
            return False
        if not asset_matches_manifest(
            ref,
            source=source,
            source_document=source_document,
            asset_map=asset_map,
        ):
            return False
    return True


def compose_one(
    draft: dict,
    locator: dict | None,
    slot: dict | None,
    graphical: dict | None,
    asset_map: dict[tuple[str, str, str], dict],
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
    if slot is None:
        reasons.append("slot evidence missing; score evidence must be source-bound")
        return None, detail

    source = choose_exact("source", [
        ("raw_id", identity["source"]),
        ("draft", draft.get("source")),
        ("locator", locator.get("source")),
        ("slot", slot.get("source")),
    ], reasons)
    source_document = choose_exact("source_document", [
        ("draft", Path(str(draft.get("source_document"))).name if draft.get("source_document") else None),
        ("locator", Path(str(locator.get("source_document"))).name if locator.get("source_document") else None),
        ("slot", Path(str(slot.get("source_document"))).name if slot.get("source_document") else None),
    ], reasons)
    if isinstance(source_document, str) and Path(source_document).stem != identity["stem"]:
        reasons.append("source_document stem disagrees with raw_id")

    document_sha = locator.get("source_document_sha256")
    if not valid_sha256(document_sha):
        reasons.append("locator lacks exact source_document_sha256")
    slot_document_sha = slot.get("source_document_sha256")
    if not valid_sha256(slot_document_sha):
        reasons.append("slot evidence lacks exact source_document_sha256")
    elif valid_sha256(document_sha) and slot_document_sha != document_sha:
        reasons.append("slot evidence source_document_sha256 disagrees with OOXML locator")

    grade = choose_exact("grade", [
        ("draft", draft.get("grade")),
        ("slot", slot.get("grade")),
    ], reasons)
    major = choose_exact("major", [
        ("raw_id", identity["major"]),
        ("draft", draft.get("major")),
        ("slot", slot.get("major")),
    ], reasons)
    subslot = choose_exact("subslot", [
        ("raw_id", identity["subslot"]),
        ("draft", draft.get("subslot")),
        ("slot", slot.get("subslot")),
    ], reasons)
    score_evidence = slot.get("score_evidence")
    if not strict_gate.valid_score_evidence(score_evidence):
        reasons.append("slot score_evidence fails strict source-evidence shape")

    question = draft.get("question")
    if not strict_gate.meaningful_text(question):
        reasons.append("question missing")
    question_offsets = locator.get("question_offsets")
    if locator.get("question_match_count") != 1 or not strict_gate.valid_offsets(question_offsets):
        reasons.append("question exact OOXML match is not uniquely proven")

    figure_refs = locator.get("question_figure_refs", [])
    if figure_refs:
        if not isinstance(source, str) or not isinstance(source_document, str) or not valid_figure_refs(
            figure_refs,
            source=source,
            source_document=source_document,
            asset_map=asset_map,
        ):
            reasons.append("question figure refs are not verified against OOXML asset manifest")

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
            if (
                not valid_sha256(document_sha)
                or not isinstance(source, str)
                or not isinstance(source_document, str)
                or not valid_graphical_asset(
                    graphical_asset,
                    expected_doc_sha=document_sha,
                    source=source,
                    source_document=source_document,
                    asset_map=asset_map,
                )
            ):
                reasons.append("graphical answer asset is not verified against OOXML asset manifest/document SHA")
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
    asset_map: dict[tuple[str, str, str], dict] | None = None,
) -> tuple[list[dict], dict]:
    draft_index = unique_by_raw_id(drafts, "draft")
    locators = locator_index(locator_report)
    slot_index = unique_by_raw_id(slots or [], "slot evidence")
    graphical_index = unique_by_raw_id(graphical_evidence or [], "graphical evidence")
    assets = asset_map or {}
    candidates: list[dict] = []
    details: list[dict] = []
    for raw_id, draft in draft_index.items():
        record, detail = compose_one(
            draft,
            locators.get(raw_id),
            slot_index.get(raw_id),
            graphical_index.get(raw_id),
            assets,
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
            "A candidate is emitted only after exact raw identity agreement; source document SHA from OOXML; "
            "source-document-bound slot/score evidence; grade/major/subslot agreement; unique exact Q/A offsets or "
            "graphical answer evidence verified against the OOXML asset manifest; every figure ref revalidated against "
            "that same manifest; content-bound fingerprint recomputation; and per-record strict validator PASS. "
            "Candidates still require durable save/readback/reconciliation before completion is counted."
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
    ap.add_argument("--slot-evidence", type=Path, required=True)
    ap.add_argument("--graphical-evidence", type=Path)
    ap.add_argument("--asset-manifest", type=Path)
    ap.add_argument("--output", type=Path, required=True)
    ap.add_argument("--report", type=Path, required=True)
    args = ap.parse_args()
    drafts = load_jsonl(args.draft)
    locator_report = json.loads(args.locator_report.read_text(encoding="utf-8"))
    slots = load_jsonl(args.slot_evidence)
    graphical = load_jsonl(args.graphical_evidence) if args.graphical_evidence else []
    assets = load_asset_manifest(args.asset_manifest)
    candidates, report = compose(drafts, locator_report, slots, graphical, assets)
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
