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


def iter_jsonl(path: Path):
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except Exception:
        return
    for line_no, line in enumerate(lines, 1):
        if not line.strip():
            continue
        try:
            obj = json.loads(line)
        except Exception:
            continue
        if isinstance(obj, dict):
            yield line_no, obj


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--state-root", type=Path, default=Path("math-bank/state"))
    ap.add_argument("--evidence", type=Path, required=True)
    ap.add_argument("--report", type=Path)
    args = ap.parse_args()

    ev = json.loads(args.evidence.read_text(encoding="utf-8"))
    target = {x["raw_id"]: x for x in ev["evidence"]}
    candidates = defaultdict(list)
    for path in sorted(args.state_root.rglob("*.jsonl")):
        if path.name == ev.get("output_jsonl"):
            continue
        for line_no, obj in iter_jsonl(path):
            rid = obj.get("raw_id")
            if rid in target:
                candidates[rid].append((path.as_posix(), line_no, obj))

    result = []
    summary = Counter()
    for rid, evidence in target.items():
        rows = candidates.get(rid, [])
        exact = []
        recomputed = []
        structurally_recoverable = []
        for path, line_no, obj in rows:
            current = copy.deepcopy(obj)
            current["record_fingerprint"] = gate.recompute_fingerprint(current)
            rec = {
                "file": path,
                "line": line_no,
                "stored_fp": obj.get("record_fingerprint"),
                "recomputed_fp": current["record_fingerprint"],
                "expected_fp": evidence["fp"],
                "structural_errors_after_fp_refresh": gate.validate_record(current, line_no),
                "question_offsets": obj.get("question_offsets"),
                "answer_offsets": obj.get("answer_offsets"),
                "figure_relationship_ids": [r.get("relationship_id") for r in (obj.get("figure_refs") or []) if isinstance(r, dict)],
            }
            recomputed.append(rec)
            if rec["recomputed_fp"] == evidence["fp"]:
                exact.append(rec)
            if not rec["structural_errors_after_fp_refresh"]:
                structurally_recoverable.append(rec)
        if len(exact) == 1 and not exact[0]["structural_errors_after_fp_refresh"]:
            status = "EXACT_RECOVERABLE"
        elif len(exact) > 1 and all(not x["structural_errors_after_fp_refresh"] for x in exact):
            # identical raw body may be duplicated across durable artifacts; fp identity makes this safe to dedupe later.
            status = "EXACT_RECOVERABLE_DUPLICATED"
        elif rows:
            status = "CANDIDATE_FOUND_BUT_NOT_EXPECTED_FP"
        else:
            status = "NO_CANDIDATE"
        summary[status] += 1
        result.append({"raw_id": rid, "status": status, "candidate_count": len(rows), "exact_expected_fp_count": len(exact), "structurally_recoverable_count": len(structurally_recoverable), "expected_q": evidence.get("q"), "expected_a": evidence.get("a"), "expected_rels": evidence.get("rels"), "exact_matches": exact, "candidate_diagnostics": recomputed[:10]})

    report = {
        "workflow": "Recover corrupted Winpass69 current-schema artifact from prior durable strict bodies without content guessing",
        "target_records": len(target),
        "summary": dict(summary),
        "fully_exact_recoverable": summary["EXACT_RECOVERABLE"] + summary["EXACT_RECOVERABLE_DUPLICATED"],
        "records": result,
        "policy": "A record is recoverable only if an existing durable strict body, with only record_fingerprint refreshed under the current contract, recomputes to the exact fingerprint already frozen in the 69-record evidence artifact and passes the current per-record structural validator. No text similarity and no field synthesis are used.",
    }
    text = json.dumps(report, ensure_ascii=False, indent=2) + "\n"
    print(json.dumps({k: report[k] for k in ("workflow","target_records","summary","fully_exact_recoverable")}, ensure_ascii=False, indent=2))
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(text, encoding="utf-8")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
