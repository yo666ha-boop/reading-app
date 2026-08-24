from __future__ import annotations

import argparse
import hashlib
import json
import os
import tempfile
from collections import Counter
from pathlib import Path
from typing import Any

import validate_raw1271_materialization as strict_gate

SOURCE_ORDER = ("Standard", "実力錬成", "Winpass")
EXPECTED = strict_gate.EXPECTED
EXPECTED_TOTAL = strict_gate.EXPECTED_TOTAL
EXPECTED_FIGURE_REFS = strict_gate.EXPECTED_FIGURE_REFS


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


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


def atomic_write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp_name = tempfile.mkstemp(prefix=path.name + ".", suffix=".tmp", dir=path.parent)
    try:
        with os.fdopen(fd, "w", encoding="utf-8", newline="\n") as fh:
            fh.write(text)
        os.replace(tmp_name, path)
    except Exception:
        try:
            os.unlink(tmp_name)
        except FileNotFoundError:
            pass
        raise


def sort_key(record: dict) -> tuple[int, str]:
    source = record.get("source")
    try:
        source_index = SOURCE_ORDER.index(source)
    except ValueError:
        source_index = len(SOURCE_ORDER)
    return source_index, str(record.get("raw_id", ""))


def reconcile(paths: list[Path]) -> tuple[list[dict], dict]:
    errors: list[str] = []
    file_manifest: list[dict[str, Any]] = []
    valid_by_id: dict[str, dict] = {}
    duplicate_identical: list[dict[str, str]] = []
    invalid_records: list[dict[str, Any]] = []

    if not paths:
        errors.append("no strict JSONL inputs provided")

    for path in paths:
        if not path.is_file():
            errors.append(f"missing strict input: {path}")
            continue
        records = load_jsonl(path)
        file_manifest.append({
            "path": str(path),
            "sha256": sha256_file(path),
            "records": len(records),
        })
        for line_no, record in enumerate(records, 1):
            record_errors = strict_gate.validate_record(record, line_no)
            raw_id = record.get("raw_id")
            if record_errors:
                invalid_records.append({
                    "path": str(path),
                    "line": line_no,
                    "raw_id": raw_id,
                    "errors": record_errors,
                })
                continue
            if not isinstance(raw_id, str) or not raw_id.strip():
                invalid_records.append({
                    "path": str(path),
                    "line": line_no,
                    "raw_id": raw_id,
                    "errors": ["validated record has no usable raw_id"],
                })
                continue
            old = valid_by_id.get(raw_id)
            if old is None:
                valid_by_id[raw_id] = record
                continue
            if old.get("record_fingerprint") == record.get("record_fingerprint"):
                duplicate_identical.append({"raw_id": raw_id, "path": str(path)})
                continue
            errors.append(f"conflicting strict fingerprints for {raw_id}")

    if invalid_records:
        errors.append(f"invalid strict records: {len(invalid_records)}")

    combined = sorted(valid_by_id.values(), key=sort_key)
    counts = Counter(record.get("source") for record in combined)
    for source, count in counts.items():
        expected = EXPECTED.get(source)
        if expected is None:
            errors.append(f"unexpected source in valid records: {source!r}")
        elif count > expected:
            errors.append(f"{source} strict count {count} exceeds expected {expected}")

    figure_refs = 0
    missing_figure_refs = 0
    graphical_answers = 0
    for record in combined:
        refs = record.get("figure_refs") or []
        figure_refs += len(refs) if isinstance(refs, list) else 0
        if isinstance(refs, list):
            missing_figure_refs += sum(
                1 for ref in refs if isinstance(ref, dict) and ref.get("missing") is True
            )
        if strict_gate.meaningful_text(record.get("graphical_answer_asset")):
            graphical_answers += 1

    if missing_figure_refs:
        errors.append(f"missing figure refs among strict records: {missing_figure_refs}")

    exact_counts = all(counts.get(source, 0) == expected for source, expected in EXPECTED.items())
    complete_1271 = (
        not errors
        and len(combined) == EXPECTED_TOTAL
        and exact_counts
        and figure_refs == EXPECTED_FIGURE_REFS
        and missing_figure_refs == 0
    )

    remaining = {
        source: max(0, expected - counts.get(source, 0))
        for source, expected in EXPECTED.items()
    }
    report = {
        "workflow": "Persisted strict Q/A progress reconciliation",
        "input_files": file_manifest,
        "input_file_count": len(file_manifest),
        "valid_unique_strict_records": len(combined),
        "strict_counts": {source: counts.get(source, 0) for source in SOURCE_ORDER},
        "remaining_to_1271": remaining,
        "remaining_total": max(0, EXPECTED_TOTAL - len(combined)),
        "duplicate_identical_copies": duplicate_identical,
        "invalid_records": invalid_records,
        "figure_refs_revalidated_in_strict_subset": figure_refs,
        "missing_figure_refs_in_strict_subset": missing_figure_refs,
        "graphical_answers_with_asset_identity": graphical_answers,
        "partial_progress_pass": not errors,
        "complete_1271": complete_1271,
        "errors": errors,
        "policy": (
            "Progress counts only unique raw_id records that independently pass the strict "
            "Q/A/OOXML/score/figure/fingerprint validator. Identical duplicate copies do not "
            "increase progress; conflicting fingerprints or invalid records fail reconciliation."
        ),
    }
    return combined, report


def jsonl_text(records: list[dict]) -> str:
    return "".join(
        json.dumps(record, ensure_ascii=False, sort_keys=True, separators=(",", ":")) + "\n"
        for record in records
    )


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("strict_jsonl", nargs="+", type=Path)
    ap.add_argument("--output-combined", type=Path)
    ap.add_argument("--report", type=Path)
    args = ap.parse_args()

    combined, report = reconcile(args.strict_jsonl)
    if args.output_combined:
        atomic_write_text(args.output_combined, jsonl_text(combined))
    report_text = json.dumps(report, ensure_ascii=False, indent=2) + "\n"
    if args.report:
        atomic_write_text(args.report, report_text)
    print(report_text, end="")
    return 0 if report["partial_progress_pass"] else 9


if __name__ == "__main__":
    raise SystemExit(main())
