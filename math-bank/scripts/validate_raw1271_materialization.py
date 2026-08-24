from __future__ import annotations

import argparse
import hashlib
import json
from collections import Counter
from pathlib import Path
from typing import Any

EXPECTED = {"Winpass": 717, "実力錬成": 237, "Standard": 317}
EXPECTED_TOTAL = sum(EXPECTED.values())
EXPECTED_FIGURE_REFS = 41

REQUIRED = (
    "raw_id", "source", "source_document", "source_document_sha256",
    "grade", "major", "subslot", "score_evidence", "question",
    "answer", "question_offsets", "answer_offsets", "figure_refs",
    "record_fingerprint",
)


def canonical(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def fingerprint_payload(record: dict) -> dict:
    payload = {
        "raw_id": record.get("raw_id"),
        "source": record.get("source"),
        "source_document": record.get("source_document"),
        "source_document_sha256": record.get("source_document_sha256"),
        "grade": record.get("grade"),
        "major": record.get("major"),
        "subslot": record.get("subslot"),
        "score_evidence": record.get("score_evidence"),
        "question": record.get("question"),
        "answer": record.get("answer"),
        "question_offsets": record.get("question_offsets"),
        "answer_offsets": record.get("answer_offsets"),
        "figure_refs": record.get("figure_refs"),
    }
    graphical_answer_asset = record.get("graphical_answer_asset")
    if graphical_answer_asset not in (None, "", [], {}):
        payload["graphical_answer_asset"] = graphical_answer_asset
    return payload


def recompute_fingerprint(record: dict) -> str:
    return hashlib.sha256(canonical(fingerprint_payload(record)).encode("utf-8")).hexdigest()


def meaningful_text(value: Any) -> bool:
    if isinstance(value, str):
        return bool(value.strip())
    if isinstance(value, list):
        return any(meaningful_text(x) for x in value)
    if isinstance(value, dict):
        return any(meaningful_text(v) for v in value.values())
    return False


def valid_offsets(value: Any) -> bool:
    if not isinstance(value, list) or not value:
        return False
    for item in value:
        if not isinstance(item, dict):
            return False
        if not item.get("path"):
            return False
        if not isinstance(item.get("paragraph_index"), int):
            return False
    return True


def valid_score_evidence(value: Any) -> bool:
    if isinstance(value, str):
        return bool(value.strip())
    if not isinstance(value, dict):
        return False
    return bool(value.get("text") or value.get("rule") or value.get("source_path"))


def validate_record(record: dict, line_no: int) -> list[str]:
    errors: list[str] = []
    for key in REQUIRED:
        if key not in record:
            errors.append(f"line {line_no}: missing {key}")
    source = record.get("source")
    if source not in EXPECTED:
        errors.append(f"line {line_no}: invalid source {source!r}")
    sha = record.get("source_document_sha256")
    if not isinstance(sha, str) or len(sha) != 64:
        errors.append(f"line {line_no}: invalid source_document_sha256")
    if not meaningful_text(record.get("question")):
        errors.append(f"line {line_no}: empty question")
    answer = record.get("answer")
    graphical_answer = record.get("graphical_answer_asset")
    if not meaningful_text(answer) and not meaningful_text(graphical_answer):
        errors.append(f"line {line_no}: answer has neither exact text nor graphical asset")
    if not valid_offsets(record.get("question_offsets")):
        errors.append(f"line {line_no}: question_offsets lack ordered OOXML provenance")
    if not valid_offsets(record.get("answer_offsets")) and not meaningful_text(graphical_answer):
        errors.append(f"line {line_no}: answer_offsets lack ordered OOXML provenance")
    if not valid_score_evidence(record.get("score_evidence")):
        errors.append(f"line {line_no}: score_evidence missing source evidence")
    refs = record.get("figure_refs")
    if not isinstance(refs, list):
        errors.append(f"line {line_no}: figure_refs must be a list")
    else:
        for i, ref in enumerate(refs):
            if not isinstance(ref, dict):
                errors.append(f"line {line_no}: figure_refs[{i}] must be an object")
                continue
            if not ref.get("relationship_id") and not ref.get("target") and not ref.get("asset_sha256"):
                errors.append(f"line {line_no}: figure_refs[{i}] has no relationship/target/asset identity")
            if ref.get("missing") is True:
                errors.append(f"line {line_no}: figure_refs[{i}] marked missing")
    expected_fp = recompute_fingerprint(record)
    if record.get("record_fingerprint") != expected_fp:
        errors.append(f"line {line_no}: record_fingerprint mismatch")
    return errors


def load_jsonl(path: Path) -> list[dict]:
    records = []
    for line_no, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        value = json.loads(line)
        if not isinstance(value, dict):
            raise ValueError(f"line {line_no}: record must be object")
        records.append(value)
    return records


def build_report(records: list[dict], *, require_expected_figure_refs: bool = True) -> dict:
    errors: list[str] = []
    ids = [r.get("raw_id") for r in records]
    fps = [r.get("record_fingerprint") for r in records]
    counts = Counter(r.get("source") for r in records)
    for i, record in enumerate(records, 1):
        errors.extend(validate_record(record, i))
    if len(records) != EXPECTED_TOTAL:
        errors.append(f"record count {len(records)} != {EXPECTED_TOTAL}")
    for source, expected in EXPECTED.items():
        if counts.get(source, 0) != expected:
            errors.append(f"{source} count {counts.get(source, 0)} != {expected}")
    if len(set(ids)) != len(ids):
        errors.append("raw_id values are not unique")
    if len(set(fps)) != len(fps):
        errors.append("record_fingerprint values are not unique")
    figure_refs = sum(len(r.get("figure_refs", [])) for r in records if isinstance(r.get("figure_refs"), list))
    missing_figure_refs = sum(
        1 for r in records for ref in (r.get("figure_refs") or [])
        if isinstance(ref, dict) and ref.get("missing") is True
    )
    if require_expected_figure_refs and figure_refs != EXPECTED_FIGURE_REFS:
        errors.append(f"figure refs {figure_refs} != historical/live revalidation target {EXPECTED_FIGURE_REFS}")
    if missing_figure_refs:
        errors.append(f"missing figure refs {missing_figure_refs} != 0")
    questions_ok = sum(meaningful_text(r.get("question")) and valid_offsets(r.get("question_offsets")) for r in records)
    answers_ok = sum(
        (meaningful_text(r.get("answer")) and valid_offsets(r.get("answer_offsets")))
        or meaningful_text(r.get("graphical_answer_asset"))
        for r in records
    )
    return {
        "workflow": "Raw1271 materialization Q/A/figure provenance gate",
        "record_count": len(records),
        "counts": dict(sorted(counts.items(), key=lambda x: str(x[0]))),
        "unique_raw_ids": len(set(ids)),
        "unique_record_fingerprints": len(set(fps)),
        "questions_with_exact_provenance": questions_ok,
        "answers_with_exact_provenance_or_graphical_asset": answers_ok,
        "figure_refs": figure_refs,
        "missing_figure_refs": missing_figure_refs,
        "errors": errors,
        "pass": not errors,
        "policy": "A slot passes only with exact Q/A content plus ordered OOXML offsets (or a graphical answer asset), source score evidence, figure relationship/asset identity, and a recomputed content-bound fingerprint. Graphical answer asset identity is included in the fingerprint when present. Non-empty placeholder text is insufficient.",
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("records", type=Path)
    ap.add_argument("--report", type=Path)
    ap.add_argument("--allow-figure-count-drift", action="store_true")
    args = ap.parse_args()
    records = load_jsonl(args.records)
    report = build_report(records, require_expected_figure_refs=not args.allow_figure_count_drift)
    text = json.dumps(report, ensure_ascii=False, indent=2) + "\n"
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(text, encoding="utf-8")
    print(text, end="")
    return 0 if report["pass"] else 9


if __name__ == "__main__":
    raise SystemExit(main())
