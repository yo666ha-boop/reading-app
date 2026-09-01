from __future__ import annotations

import argparse
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


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--state-root", type=Path, default=Path("math-bank/state"))
    ap.add_argument("--report", type=Path)
    ap.add_argument("--records-output", type=Path)
    ap.add_argument("--strict-conflicts", action="store_true")
    args = ap.parse_args()

    files = sorted(args.state_root.rglob("*.jsonl"))
    by_source_raw = defaultdict(lambda: defaultdict(list))
    scanned_lines = 0
    json_errors = []
    structural_rejects = Counter()
    contributors = Counter()

    for path in files:
        rel = path.as_posix()
        for line_no, record, parse_error in load_jsonl(path):
            scanned_lines += 1
            if parse_error:
                json_errors.append(f"{rel}:{line_no}: {parse_error}")
                continue
            source = record.get("source")
            if source not in gate.EXPECTED:
                continue
            errors = gate.validate_record(record, line_no)
            if errors:
                structural_rejects[source] += 1
                continue
            raw_id = record.get("raw_id")
            fp = record.get("record_fingerprint")
            by_source_raw[source][raw_id].append({"fingerprint": fp, "file": rel, "line": line_no, "record": record})
            contributors[rel] += 1

    counts = {}
    conflicts = []
    exact_duplicate_raw_ids = []
    unique_records = []
    for source in gate.EXPECTED:
        raw_map = by_source_raw[source]
        counts[source] = len(raw_map)
        for raw_id, occ in sorted(raw_map.items()):
            fps = sorted({x["fingerprint"] for x in occ})
            public_occ = [{k:v for k,v in x.items() if k != "record"} for x in occ]
            if len(fps) > 1:
                conflicts.append({"source": source, "raw_id": raw_id, "fingerprints": fps, "occurrences": public_occ})
            else:
                unique_records.append(occ[-1]["record"])
                if len(occ) > 1:
                    exact_duplicate_raw_ids.append({"source": source, "raw_id": raw_id, "fingerprint": fps[0], "occurrences": public_occ})

    total_unique = sum(counts.values())
    report = {
        "workflow": "Audit current-contract records already durably present in math-bank/state JSONL files",
        "state_root": args.state_root.as_posix(),
        "jsonl_files_scanned": len(files),
        "lines_scanned": scanned_lines,
        "current_contract_unique_raw_ids_by_source": counts,
        "current_contract_unique_raw_ids_total": total_unique,
        "expected_by_source": gate.EXPECTED,
        "expected_total": gate.EXPECTED_TOTAL,
        "structural_reject_lines_by_source": dict(structural_rejects),
        "conflicting_raw_ids": len(conflicts),
        "conflicts": conflicts,
        "exact_duplicate_raw_ids": len(exact_duplicate_raw_ids),
        "top_contributing_files": contributors.most_common(80),
        "json_parse_errors": len(json_errors),
        "json_parse_error_examples": json_errors[:20],
        "records_output_count": len(unique_records) if not conflicts else 0,
        "policy": "Counts include only records that pass the current strict per-record validator including content-bound fingerprint. Multiple occurrences with the same raw_id+fingerprint are counted once. Any same raw_id with multiple current fingerprints is reported as a conflict and never auto-resolved. records-output is emitted only when there are zero current-contract conflicts.",
    }
    text = json.dumps(report, ensure_ascii=False, indent=2) + "\n"
    print(text, end="")
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(text, encoding="utf-8")
    if args.records_output and not conflicts:
        args.records_output.parent.mkdir(parents=True, exist_ok=True)
        unique_records.sort(key=lambda r: (str(r.get("source")), str(r.get("raw_id"))))
        args.records_output.write_text("".join(json.dumps(r, ensure_ascii=False, separators=(",", ":")) + "\n" for r in unique_records), encoding="utf-8")
    return 11 if args.strict_conflicts and conflicts else 0


if __name__ == "__main__":
    raise SystemExit(main())
