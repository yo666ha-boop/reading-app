from __future__ import annotations

import json
import sys
from collections import Counter
from pathlib import Path

REQUIRED = {
    "id", "grade", "unit", "difficulty", "source", "question", "answer",
    "explanation", "figure_refs", "variant_group", "audit"
}
VALID_GRADES = {1, 2, 3}
VALID_DIFFICULTY = {"basic", "standard", "advanced", "unknown"}
VALID_BOOKS = {"Winpass", "実力錬成", "Standard", "generated"}


def fail(msg: str) -> None:
    raise ValueError(msg)


def validate_record(r: dict, seen_ids: set[str]) -> None:
    missing = REQUIRED - set(r)
    if missing:
        fail(f"{r.get('id', '<no-id>')}: missing {sorted(missing)}")
    rid = r["id"]
    if not isinstance(rid, str) or not rid.strip():
        fail("blank id")
    if rid in seen_ids:
        fail(f"duplicate id: {rid}")
    seen_ids.add(rid)
    if r["grade"] not in VALID_GRADES:
        fail(f"{rid}: invalid grade")
    if r["difficulty"] not in VALID_DIFFICULTY:
        fail(f"{rid}: invalid difficulty")
    if not isinstance(r["question"], str) or not r["question"].strip():
        fail(f"{rid}: blank question")
    if not isinstance(r["answer"], str) or not r["answer"].strip():
        fail(f"{rid}: blank answer")
    unit = r["unit"]
    if not isinstance(unit, dict) or not str(unit.get("major", "")).strip() or not str(unit.get("minor", "")).strip():
        fail(f"{rid}: invalid unit")
    source = r["source"]
    if not isinstance(source, dict) or source.get("book") not in VALID_BOOKS:
        fail(f"{rid}: invalid source")
    generated = bool(source.get("is_generated_variant"))
    if generated and not source.get("parent_id"):
        fail(f"{rid}: generated variant without parent_id")
    audit = r["audit"]
    for key in ("problem_answer_verified", "structure_verified", "figure_refs_verified"):
        if not isinstance(audit.get(key), bool):
            fail(f"{rid}: audit.{key} must be bool")
    if not all(audit[k] for k in ("problem_answer_verified", "structure_verified", "figure_refs_verified")):
        fail(f"{rid}: unverified audit gate")


def main(path: str) -> int:
    p = Path(path)
    seen: set[str] = set()
    records = []
    if p.suffix == ".jsonl":
        for i, line in enumerate(p.read_text(encoding="utf-8").splitlines(), 1):
            if line.strip():
                try:
                    records.append(json.loads(line))
                except Exception as e:
                    fail(f"line {i}: invalid JSON: {e}")
    else:
        obj = json.loads(p.read_text(encoding="utf-8"))
        records = obj if isinstance(obj, list) else obj.get("records", [])
    if not records:
        fail("no records")
    for r in records:
        validate_record(r, seen)
    counts = Counter(r["source"]["book"] for r in records)
    grades = Counter(r["grade"] for r in records)
    generated = sum(1 for r in records if r["source"].get("is_generated_variant"))
    print(json.dumps({
        "status": "PASS",
        "records": len(records),
        "by_source": counts,
        "by_grade": grades,
        "generated_variants": generated,
        "unique_ids": len(seen)
    }, ensure_ascii=False, indent=2, default=dict))
    return 0


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("usage: validate_app_records.py <records.json|records.jsonl>", file=sys.stderr)
        raise SystemExit(2)
    try:
        raise SystemExit(main(sys.argv[1]))
    except Exception as e:
        print(f"FAIL: {e}", file=sys.stderr)
        raise SystemExit(1)
