from __future__ import annotations

import argparse
import copy
import json
import sys
from collections import Counter, defaultdict
from pathlib import Path

HERE = Path(__file__).resolve().parent
if str(HERE) not in sys.path:
    sys.path.insert(0, str(HERE))

import validate_raw1271_materialization as gate


def load_jsonl(path: Path):
    for line_no, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        try:
            value = json.loads(line)
        except Exception as exc:
            yield line_no, None, f"json decode: {exc}"
            continue
        if not isinstance(value, dict):
            yield line_no, None, "record is not object"
            continue
        yield line_no, value, None


def independent_pass(record: dict) -> bool:
    value = record.get("independent_check")
    if isinstance(value, str):
        return value.strip().upper().startswith("PASS")
    if isinstance(value, dict):
        status = value.get("status") or value.get("result") or value.get("check")
        return isinstance(status, str) and status.strip().upper().startswith("PASS")
    return False


def normalize_figure_refs(value):
    if not isinstance(value, list):
        return None, ["figure_refs is not list"]
    out = []
    errors = []
    for i, ref in enumerate(value):
        if not isinstance(ref, dict):
            errors.append(f"figure_refs[{i}] not object")
            continue
        item = copy.deepcopy(ref)
        if not item.get("asset_sha256") and item.get("sha256"):
            item["asset_sha256"] = item["sha256"]
        target = item.get("target")
        if isinstance(target, str) and target and not target.startswith("word/"):
            item["target"] = "word/" + target.lstrip("/")
        if not item.get("relationship_id"):
            errors.append(f"figure_refs[{i}] missing relationship_id")
        if not item.get("target"):
            errors.append(f"figure_refs[{i}] missing target")
        asset = item.get("asset_sha256")
        if not isinstance(asset, str) or len(asset) != 64:
            errors.append(f"figure_refs[{i}] missing asset_sha256")
        if item.get("missing") is True:
            errors.append(f"figure_refs[{i}] marked missing")
        out.append(item)
    return out, errors


def safe_migrate(record: dict, line_no: int):
    if record.get("source") not in gate.EXPECTED:
        return None, ["invalid source"]
    required_semantics = (
        "raw_id", "source", "source_document", "source_document_sha256",
        "grade", "major", "subslot", "score_evidence", "question",
        "answer", "question_offsets", "answer_offsets", "figure_refs",
    )
    missing = [key for key in required_semantics if key not in record]
    if missing:
        return None, ["missing semantic fields: " + ",".join(missing)]
    if not independent_pass(record):
        return None, ["independent_check is not explicit PASS"]

    migrated = copy.deepcopy(record)
    refs, ref_errors = normalize_figure_refs(migrated.get("figure_refs"))
    if ref_errors:
        return None, ref_errors
    migrated["figure_refs"] = refs

    # Remove only historical fingerprint aliases. Q/A, provenance, score evidence,
    # figures, source identity, grade/slot identity and independent-check fields stay intact.
    migrated.pop("fingerprint", None)
    migrated.pop("content_bound_fingerprint_sha256", None)
    migrated["record_fingerprint"] = gate.recompute_fingerprint(migrated)
    errors = gate.validate_record(migrated, line_no)
    if errors:
        return None, errors
    return migrated, []


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--state-root", type=Path, default=Path("math-bank/state"))
    ap.add_argument("--output", type=Path, required=True)
    ap.add_argument("--report", type=Path, required=True)
    args = ap.parse_args()

    files = sorted(args.state_root.rglob("*.jsonl"))
    current_by_raw = defaultdict(list)
    migrated_by_raw = defaultdict(list)
    parse_errors = []
    rejection_reasons = Counter()
    candidate_lines = 0
    already_current_lines = 0

    for path in files:
        rel = path.as_posix()
        for line_no, record, parse_error in load_jsonl(path):
            if parse_error:
                parse_errors.append(f"{rel}:{line_no}: {parse_error}")
                continue
            if record.get("source") not in gate.EXPECTED:
                continue
            current_errors = gate.validate_record(record, line_no)
            if not current_errors:
                already_current_lines += 1
                current_by_raw[record["raw_id"]].append({"record": record, "file": rel, "line": line_no})
                continue
            candidate_lines += 1
            migrated, errors = safe_migrate(record, line_no)
            if migrated is None:
                key = " | ".join(sorted(set(errors)))[:400]
                rejection_reasons[key] += 1
                continue
            migrated_by_raw[migrated["raw_id"]].append({"record": migrated, "file": rel, "line": line_no})

    current_fp = {}
    current_conflicts = []
    for raw_id, occ in current_by_raw.items():
        fps = sorted({x["record"]["record_fingerprint"] for x in occ})
        if len(fps) == 1:
            current_fp[raw_id] = fps[0]
        else:
            current_conflicts.append({"raw_id": raw_id, "fingerprints": fps})

    safe_new = []
    exact_existing = 0
    migration_conflicts = []
    exact_legacy_duplicates = 0
    provenance = []
    for raw_id, occ in sorted(migrated_by_raw.items()):
        fps = sorted({x["record"]["record_fingerprint"] for x in occ})
        if len(fps) != 1:
            migration_conflicts.append({"raw_id": raw_id, "fingerprints": fps, "occurrences": [{"file":x["file"],"line":x["line"]} for x in occ]})
            continue
        fp = fps[0]
        if raw_id in current_fp:
            if current_fp[raw_id] == fp:
                exact_existing += 1
            else:
                migration_conflicts.append({"raw_id": raw_id, "current_fingerprint": current_fp[raw_id], "migrated_fingerprint": fp})
            continue
        if len(occ) > 1:
            exact_legacy_duplicates += len(occ) - 1
        chosen = occ[-1]
        safe_new.append(chosen["record"])
        provenance.append({"raw_id":raw_id,"fingerprint":fp,"chosen_file":chosen["file"],"chosen_line":chosen["line"],"occurrences":[{"file":x["file"],"line":x["line"]} for x in occ]})

    safe_new.sort(key=lambda r: r["raw_id"])
    output_text = "".join(json.dumps(r, ensure_ascii=False, separators=(",", ":")) + "\n" for r in safe_new)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(output_text, encoding="utf-8")

    source_counts = Counter(r["source"] for r in safe_new)
    figure_refs = sum(len(r.get("figure_refs", [])) for r in safe_new)
    report = {
        "workflow": "Safe current-contract migration of durable strict JSONL records",
        "state_root": args.state_root.as_posix(),
        "jsonl_files_scanned": len(files),
        "already_current_lines": already_current_lines,
        "legacy_candidate_lines": candidate_lines,
        "safe_new_unique_raw_ids": len(safe_new),
        "safe_new_by_source": dict(source_counts),
        "safe_new_unique_fingerprints": len({r["record_fingerprint"] for r in safe_new}),
        "safe_new_figure_refs_with_bound_identity": figure_refs,
        "exact_existing_after_migration": exact_existing,
        "exact_legacy_duplicate_occurrences": exact_legacy_duplicates,
        "current_conflicts": current_conflicts,
        "migration_conflicts": migration_conflicts,
        "parse_errors": parse_errors,
        "top_rejection_reasons": rejection_reasons.most_common(30),
        "provenance": provenance,
        "policy": "Migration is allowed only when source identity, exact Q/A, ordered offsets, score evidence, explicit independent_check PASS, and every figure relationship+target+asset SHA already exist. Only historical fingerprint aliases/figure sha256 aliases are normalized, then the current content-bound fingerprint is recomputed. Conflicts are never auto-resolved.",
        "pass": not current_conflicts and not migration_conflicts and len({r["raw_id"] for r in safe_new}) == len(safe_new) and len({r["record_fingerprint"] for r in safe_new}) == len(safe_new),
    }
    args.report.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({k:v for k,v in report.items() if k != "provenance"}, ensure_ascii=False, indent=2))
    return 0 if report["pass"] else 13


if __name__ == "__main__":
    raise SystemExit(main())
