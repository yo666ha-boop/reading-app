from __future__ import annotations

import argparse
import json
import re
from collections import Counter
from pathlib import Path
from typing import Any

WS_RE = re.compile(r"\s+")


def normalize_text(value: Any) -> str:
    if not isinstance(value, str):
        return ""
    return WS_RE.sub(" ", value).strip()


def load_jsonl(path: Path) -> list[dict]:
    records: list[dict] = []
    for line_no, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        value = json.loads(line)
        if not isinstance(value, dict):
            raise ValueError(f"{path}: line {line_no}: object required")
        records.append(value)
    return records


def load_structure(path: Path) -> dict[tuple[str, str], dict]:
    obj = json.loads(path.read_text(encoding="utf-8"))
    documents = obj.get("documents")
    if not isinstance(documents, list):
        raise ValueError("structure report has no documents list")
    out: dict[tuple[str, str], dict] = {}
    for doc in documents:
        if not isinstance(doc, dict):
            continue
        source = doc.get("source")
        name = doc.get("document")
        if not isinstance(source, str) or not isinstance(name, str):
            continue
        key = (source, Path(name).name)
        if key in out:
            raise ValueError(f"duplicate structure document {key}")
        out[key] = doc
    return out


def load_asset_manifest(path: Path | None) -> dict[tuple[str, str, str], dict]:
    if path is None:
        return {}
    obj = json.loads(path.read_text(encoding="utf-8"))
    out: dict[tuple[str, str, str], dict] = {}
    for doc in obj.get("documents", []):
        if not isinstance(doc, dict):
            continue
        source = doc.get("source")
        name = doc.get("document")
        for asset in doc.get("assets", []):
            target = asset.get("target") if isinstance(asset, dict) else None
            if isinstance(source, str) and isinstance(name, str) and isinstance(target, str):
                out[(source, Path(name).name, target)] = asset
    return out


def paragraph_offset(p: dict) -> dict:
    return {
        "path": p.get("path"),
        "paragraph_index": p.get("paragraph_index"),
    }


def nonblank_paragraphs(document: dict) -> list[dict]:
    return [
        p for p in document.get("paragraphs", [])
        if isinstance(p, dict) and normalize_text(p.get("text_stripped") or p.get("text"))
    ]


def exact_question_spans(document: dict, question: str) -> list[list[dict]]:
    target = normalize_text(question)
    if not target:
        return []
    paragraphs = nonblank_paragraphs(document)
    found: list[list[dict]] = []
    # Draft questions were composed from ordered OOXML text. Only whitespace collapse is
    # permitted here. No punctuation, Unicode, numeric, or fuzzy normalization is used.
    for start in range(len(paragraphs)):
        parts: list[str] = []
        span: list[dict] = []
        for end in range(start, len(paragraphs)):
            text = normalize_text(paragraphs[end].get("text_stripped") or paragraphs[end].get("text"))
            parts.append(text)
            span.append(paragraphs[end])
            joined = " ".join(parts)
            if joined == target:
                found.append(list(span))
                break
            if len(joined) >= len(target):
                break
    return found


def exact_answer_paragraphs(document: dict, answer: str) -> list[dict]:
    target = normalize_text(answer)
    if not target:
        return []
    found: list[dict] = []
    for p in nonblank_paragraphs(document):
        text = normalize_text(p.get("text_stripped") or p.get("text"))
        if target in text:
            found.append(p)
    return found


def bind_image_refs(source: str, document: str, paragraphs: list[dict], assets: dict) -> tuple[list[dict], list[str]]:
    refs: list[dict] = []
    errors: list[str] = []
    seen: set[tuple[str | None, str | None]] = set()
    for p in paragraphs:
        for image in p.get("images", []) if isinstance(p.get("images"), list) else []:
            if not isinstance(image, dict):
                continue
            rid = image.get("relationship_id")
            target = image.get("target")
            key = (rid, target)
            if key in seen:
                continue
            seen.add(key)
            ref = {"relationship_id": rid, "target": target}
            asset = assets.get((source, Path(document).name, target)) if isinstance(target, str) else None
            if asset:
                ref["asset_sha256"] = asset.get("asset_sha256")
                ref["bytes"] = asset.get("bytes")
                ref["missing"] = False
            else:
                ref["missing"] = True
                errors.append(f"image asset identity unavailable for {rid}/{target}")
            refs.append(ref)
    return refs, errors


def raw_identity(record: dict) -> str | None:
    raw_id = record.get("raw_id")
    if isinstance(raw_id, str) and raw_id.strip():
        return raw_id
    source = record.get("source")
    doc = record.get("source_document") or record.get("document")
    major = record.get("major")
    subslot = record.get("subslot")
    if isinstance(source, str) and isinstance(doc, str) and major is not None and subslot is not None:
        return f"{source}:{Path(doc).stem}:M{int(major):02}:S{int(subslot):02}"
    return None


def locate_record(record: dict, structures: dict, assets: dict) -> dict:
    source = record.get("source")
    document = record.get("source_document") or record.get("document")
    result: dict[str, Any] = {
        "raw_id": raw_identity(record),
        "source": source,
        "source_document": Path(document).name if isinstance(document, str) else document,
        "question_match_count": 0,
        "answer_match_count": 0,
        "status": "UNRESOLVED",
        "reasons": [],
    }
    if not isinstance(source, str) or not isinstance(document, str):
        result["reasons"].append("draft lacks source/source_document identity")
        return result
    doc = structures.get((source, Path(document).name))
    if doc is None:
        result["reasons"].append("source document absent from OOXML structure report")
        return result
    document_sha256 = doc.get("document_sha256")
    if isinstance(document_sha256, str) and len(document_sha256) == 64:
        result["source_document_sha256"] = document_sha256
    else:
        result["reasons"].append("source document SHA256 absent or invalid in OOXML structure report")

    qmatches = exact_question_spans(doc, record.get("question", ""))
    result["question_match_count"] = len(qmatches)
    if len(qmatches) == 1:
        result["question_offsets"] = [paragraph_offset(p) for p in qmatches[0]]
        qrefs, qref_errors = bind_image_refs(source, document, qmatches[0], assets)
        result["question_figure_refs"] = qrefs
        if qref_errors:
            result["reasons"].extend(qref_errors)
    elif not qmatches:
        result["reasons"].append("question has no exact ordered paragraph-span match")
    else:
        result["reasons"].append("question exact paragraph-span match is ambiguous")

    answer = normalize_text(record.get("answer"))
    graphical_marker = record.get("graphical_answer") or record.get("graphical_answer_asset")
    if answer:
        amatches = exact_answer_paragraphs(doc, answer)
        result["answer_match_count"] = len(amatches)
        if len(amatches) == 1:
            result["answer_offsets"] = [paragraph_offset(amatches[0])]
        elif not amatches:
            result["reasons"].append("answer has no exact paragraph containment match")
        else:
            result["reasons"].append("answer exact paragraph containment match is ambiguous")
    elif graphical_marker:
        result["reasons"].append("graphical answer requires explicit answer relationship/asset evidence")
    else:
        result["reasons"].append("draft has neither answer text nor graphical-answer marker")

    score_evidence = record.get("score_evidence")
    if score_evidence not in (None, "", [], {}):
        result["score_evidence"] = score_evidence
    else:
        result["reasons"].append("score evidence is not present in recovered draft; bind from raw-slot evidence before strict promotion")

    required_locator_ready = (
        len(qmatches) == 1
        and bool(answer)
        and result["answer_match_count"] == 1
        and isinstance(result.get("source_document_sha256"), str)
        and not any("image asset identity unavailable" in reason for reason in result["reasons"])
    )
    result["locator_ready"] = required_locator_ready
    if required_locator_ready:
        result["status"] = "EXACT_QA_OFFSETS_LOCATED"
    return result


def build_report(drafts: list[dict], structures: dict, assets: dict) -> dict:
    results = [locate_record(record, structures, assets) for record in drafts]
    statuses = Counter(row["status"] for row in results)
    reasons = Counter(reason for row in results for reason in row.get("reasons", []))
    duplicate_ids = [
        raw_id for raw_id, count in Counter(row.get("raw_id") for row in results if row.get("raw_id")).items()
        if count > 1
    ]
    return {
        "workflow": "Recovered Q/A exact OOXML locator",
        "draft_records": len(drafts),
        "exact_qa_offsets_located": statuses.get("EXACT_QA_OFFSETS_LOCATED", 0),
        "unresolved": statuses.get("UNRESOLVED", 0),
        "duplicate_raw_ids": duplicate_ids,
        "reason_counts": dict(reasons.most_common()),
        "results": results,
        "policy": (
            "Only whitespace is normalized. Question offsets require exactly one ordered paragraph-span equality; "
            "text answer offsets require exactly one paragraph containing the exact answer text. Ambiguous or missing "
            "matches remain unresolved. Source document SHA must come from the OOXML report. Graphical answers require "
            "explicit relationship/asset evidence. This locator does not itself declare strict completion or infer score evidence."
        ),
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--draft", type=Path, required=True)
    ap.add_argument("--structure", type=Path, required=True)
    ap.add_argument("--asset-manifest", type=Path)
    ap.add_argument("--report", type=Path, required=True)
    args = ap.parse_args()
    drafts = load_jsonl(args.draft)
    structures = load_structure(args.structure)
    assets = load_asset_manifest(args.asset_manifest)
    report = build_report(drafts, structures, assets)
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "draft_records": report["draft_records"],
        "exact_qa_offsets_located": report["exact_qa_offsets_located"],
        "unresolved": report["unresolved"],
        "duplicate_raw_ids": report["duplicate_raw_ids"],
        "reason_counts": report["reason_counts"],
    }, ensure_ascii=False, indent=2))
    return 0 if not report["duplicate_raw_ids"] else 9


if __name__ == "__main__":
    raise SystemExit(main())
