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


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


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


def exact_key(record: dict, *, require_source: str | None = None) -> str:
    raw_id = record.get("raw_id")
    if isinstance(raw_id, str) and raw_id.strip():
        if require_source and record.get("source") not in (None, "", require_source):
            raise ValueError(f"raw_id {raw_id}: draft source disagrees with {require_source}")
        if require_source and not raw_id.startswith(require_source + ":"):
            raise ValueError(f"raw_id {raw_id}: does not belong to {require_source}")
        return raw_id
    fields = ("source_document", "major", "subslot")
    if require_source and all(record.get(k) not in (None, "") for k in fields):
        stem = Path(str(record["source_document"])).stem
        return f"{require_source}:{stem}:M{int(record['major']):02}:S{int(record['subslot']):02}"
    source = record.get("source")
    if source and all(record.get(k) not in (None, "") for k in fields):
        stem = Path(str(record["source_document"])).stem
        return f"{source}:{stem}:M{int(record['major']):02}:S{int(record['subslot']):02}"
    raise ValueError("record lacks exact raw_id or source_document/major/subslot identity")


def normalize_text(value: Any) -> str:
    return value.strip() if isinstance(value, str) else ""


def draft_matches_strict(draft: dict, strict: dict) -> list[str]:
    errors: list[str] = []
    if normalize_text(draft.get("question")) != normalize_text(strict.get("question")):
        errors.append("question mismatch")
    draft_answer = normalize_text(draft.get("answer"))
    strict_answer = normalize_text(strict.get("answer"))
    strict_graphical = strict.get("graphical_answer_asset")
    draft_graphical = draft.get("graphical_answer_asset") or draft.get("graphical_answer")
    if draft_answer:
        if draft_answer != strict_answer:
            errors.append("answer mismatch")
    elif draft_graphical:
        if not strict_gate.meaningful_text(strict_graphical):
            errors.append("draft graphical answer lacks strict graphical asset identity")
    else:
        errors.append("draft has neither answer text nor graphical-answer marker")
    return errors


def verify_draft(path: Path, expected_sha256: str, expected_count: int) -> list[dict]:
    actual_sha = sha256_file(path)
    if actual_sha != expected_sha256:
        raise ValueError(f"{path}: sha256 {actual_sha} != expected {expected_sha256}")
    records = load_jsonl(path)
    if len(records) != expected_count:
        raise ValueError(f"{path}: record count {len(records)} != expected {expected_count}")
    return records


def index_unique(records: list[dict], *, source_hint: str | None = None, label: str) -> dict[str, dict]:
    out: dict[str, dict] = {}
    for record in records:
        key = exact_key(record, require_source=source_hint)
        if key in out:
            raise ValueError(f"{label}: duplicate exact identity {key}")
        out[key] = record
    return out


def strict_index(records: list[dict], *, label: str) -> dict[str, dict]:
    out: dict[str, dict] = {}
    for line_no, record in enumerate(records, 1):
        errors = strict_gate.validate_record(record, line_no)
        if errors:
            raise ValueError(f"{label}: invalid strict record {record.get('raw_id')}: {'; '.join(errors)}")
        key = exact_key(record)
        if key in out:
            raise ValueError(f"{label}: duplicate strict raw_id {key}")
        out[key] = record
    return out


def atomic_write_jsonl(path: Path, records: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, tmp_name = tempfile.mkstemp(prefix=path.name + ".", suffix=".tmp", dir=path.parent)
    try:
        with os.fdopen(fd, "w", encoding="utf-8", newline="\n") as fh:
            for record in records:
                fh.write(json.dumps(record, ensure_ascii=False, sort_keys=True, separators=(",", ":")) + "\n")
        os.replace(tmp_name, path)
    except Exception:
        try:
            os.unlink(tmp_name)
        except FileNotFoundError:
            pass
        raise


def promote(
    draft_specs: dict[str, tuple[Path, str, int]],
    evidence_records: list[dict],
    existing_records: list[dict] | None = None,
) -> tuple[list[dict], dict]:
    drafts_by_key: dict[str, dict] = {}
    draft_counts: Counter[str] = Counter()
    for source, (path, expected_sha, expected_count) in draft_specs.items():
        records = verify_draft(path, expected_sha, expected_count)
        idx = index_unique(records, source_hint=source, label=f"draft {source}")
        overlap = set(drafts_by_key).intersection(idx)
        if overlap:
            raise ValueError(f"drafts overlap exact identities: {sorted(overlap)[:3]}")
        drafts_by_key.update(idx)
        draft_counts[source] += len(records)

    evidence = strict_index(evidence_records, label="evidence")
    existing = strict_index(existing_records or [], label="existing")

    promoted = dict(existing)
    newly_promoted: list[str] = []
    unmatched_evidence: list[str] = []
    content_mismatches: list[str] = []

    for key, strict_record in evidence.items():
        draft = drafts_by_key.get(key)
        if draft is None:
            unmatched_evidence.append(key)
            continue
        mismatch = draft_matches_strict(draft, strict_record)
        if mismatch:
            content_mismatches.append(f"{key}: {', '.join(mismatch)}")
            continue
        old = promoted.get(key)
        if old is not None:
            if old.get("record_fingerprint") != strict_record.get("record_fingerprint"):
                raise ValueError(f"resume conflict for {key}: existing strict fingerprint differs")
            continue
        promoted[key] = strict_record
        newly_promoted.append(key)

    records_out = sorted(promoted.values(), key=lambda r: (SOURCE_ORDER.index(r.get("source")) if r.get("source") in SOURCE_ORDER else 99, r.get("raw_id", "")))
    promoted_counts = Counter(r.get("source") for r in records_out)
    matched_keys = set(promoted).intersection(drafts_by_key)
    report = {
        "workflow": "Recovered Q/A draft strict promotion",
        "draft_counts_verified": dict(draft_counts),
        "draft_total_verified": sum(draft_counts.values()),
        "strict_evidence_records": len(evidence),
        "existing_strict_records": len(existing),
        "newly_promoted": len(newly_promoted),
        "strict_output_records": len(records_out),
        "strict_output_counts": dict(promoted_counts),
        "drafts_with_strict_match": len(matched_keys),
        "drafts_pending_strict_evidence": len(drafts_by_key) - len(matched_keys),
        "unmatched_strict_evidence": unmatched_evidence,
        "content_mismatches": content_mismatches,
        "pass": not content_mismatches,
        "policy": "A recovered draft is promotable only after exact file SHA/count verification, exact raw identity join, exact Q/A agreement, strict OOXML/figure provenance validation, and content-bound fingerprint validation. Counts are never padded or forced.",
    }
    return records_out, report


def parse_source_map(items: list[str], cast=str) -> dict[str, Any]:
    out: dict[str, Any] = {}
    for item in items:
        if "=" not in item:
            raise ValueError(f"expected SOURCE=VALUE, got {item!r}")
        source, value = item.split("=", 1)
        if source not in SOURCE_ORDER:
            raise ValueError(f"unknown source {source!r}")
        if source in out:
            raise ValueError(f"duplicate source argument {source}")
        out[source] = cast(value)
    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--draft", action="append", default=[], metavar="SOURCE=PATH", required=True)
    ap.add_argument("--expected-sha256", action="append", default=[], metavar="SOURCE=SHA256", required=True)
    ap.add_argument("--expected-count", action="append", default=[], metavar="SOURCE=N", required=True)
    ap.add_argument("--evidence", type=Path, required=True, help="strict candidate/evidence JSONL")
    ap.add_argument("--existing", type=Path, help="already promoted strict JSONL for resume")
    ap.add_argument("--output", type=Path)
    ap.add_argument("--report", type=Path)
    ap.add_argument("--verify-only", action="store_true")
    args = ap.parse_args()

    draft_paths = parse_source_map(args.draft, Path)
    shas = parse_source_map(args.expected_sha256, str)
    counts = parse_source_map(args.expected_count, int)
    if set(draft_paths) != set(shas) or set(draft_paths) != set(counts):
        raise SystemExit("draft, expected-sha256, and expected-count sources must match exactly")
    specs = {s: (draft_paths[s], shas[s], counts[s]) for s in draft_paths}
    evidence_records = load_jsonl(args.evidence)
    existing_records = load_jsonl(args.existing) if args.existing else []
    output_records, report = promote(specs, evidence_records, existing_records)
    report_text = json.dumps(report, ensure_ascii=False, indent=2) + "\n"
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(report_text, encoding="utf-8")
    if not args.verify_only:
        if not args.output:
            raise SystemExit("--output is required unless --verify-only is used")
        atomic_write_jsonl(args.output, output_records)
    print(report_text, end="")
    return 0 if report["pass"] else 9


if __name__ == "__main__":
    raise SystemExit(main())
