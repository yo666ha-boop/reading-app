from __future__ import annotations

import json
import re
import sys
from collections import Counter
from pathlib import Path, PurePosixPath
from urllib.parse import unquote, urlsplit

REQUIRED = {
    "id", "grade", "unit", "title", "skill", "question_format", "difficulty", "source",
    "question", "choices", "answer", "explanation", "figure_refs", "variant_group", "audit"
}
VALID_GRADES = {1, 2, 3}
VALID_DIFFICULTY = {"basic", "standard", "advanced", "unknown"}
VALID_BOOKS = {"Winpass", "実力錬成", "Standard", "generated"}
EXPECTED_FINAL_RECORDS = 1231
EXPECTED_ORIGINAL_RECORDS = 1124
EXPECTED_GENERATED_VARIANTS = 107
EXPECTED_BY_SOURCE_ORIGINAL = {"Winpass": 570, "実力錬成": 237, "Standard": 317}
EXTERNAL_FIGURE_SCHEMES = {"http", "https", "data", "blob"}
ALLOWED_LOCAL_FIGURE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".avif"}
IMAGE_MARKER_RE = re.compile(r"\[\[IMAGE:([^\]\r\n]+)\]\]")


def fail(msg: str) -> None:
    raise ValueError(msg)


def text(value: object) -> str:
    return value.strip() if isinstance(value, str) else ""


def safe_figure_ref(ref: str) -> bool:
    try:
        raw_ref = ref.strip()
        if raw_ref.startswith("//"):
            return True
        parts = urlsplit(raw_ref)
        scheme = parts.scheme.lower()
        if scheme in EXTERNAL_FIGURE_SCHEMES:
            return True
        if scheme:
            return False
        if parts.netloc:
            return True
        raw = unquote(parts.path)
        if not raw or raw.startswith("/") or "\\" in raw:
            return False
        rel = PurePosixPath(raw)
        if any(part in {"", ".", ".."} for part in rel.parts):
            return False
        return rel.suffix.lower() in ALLOWED_LOCAL_FIGURE_EXTENSIONS
    except Exception:
        return False


def marker_refs(r: dict) -> list[str]:
    out: list[str] = []
    for field in ("question", "answer", "explanation"):
        value = r.get(field)
        if not isinstance(value, str):
            continue
        for match in IMAGE_MARKER_RE.finditer(value):
            ref = match.group(1).strip()
            if ref and ref not in out:
                out.append(ref)
    return out


def validate_record(r: dict, seen_ids: set[str]) -> None:
    if not isinstance(r, dict):
        fail("record must be object")
    missing = REQUIRED - set(r)
    if missing:
        fail(f"{r.get('id', '<no-id>')}: missing {sorted(missing)}")
    rid = r["id"]
    if not text(rid):
        fail("blank id")
    if rid in seen_ids:
        fail(f"duplicate id: {rid}")
    seen_ids.add(rid)

    grade = r["grade"]
    if isinstance(grade, bool) or not isinstance(grade, int) or grade not in VALID_GRADES:
        fail(f"{rid}: invalid grade")
    if not isinstance(r["title"], str):
        fail(f"{rid}: title must be string")
    if r["difficulty"] not in VALID_DIFFICULTY:
        fail(f"{rid}: invalid difficulty")
    if not text(r["skill"]):
        fail(f"{rid}: blank skill")
    if not text(r["question_format"]):
        fail(f"{rid}: blank question_format")
    if not text(r["question"]):
        fail(f"{rid}: blank question")

    choices = r["choices"]
    if choices is not None:
        if not isinstance(choices, list) or any(not isinstance(x, str) or not x.strip() for x in choices):
            fail(f"{rid}: choices must be null or a list of nonblank strings")

    if not text(r["answer"]):
        fail(f"{rid}: blank answer")
    if not isinstance(r["explanation"], str):
        fail(f"{rid}: explanation must be string")
    if not (r["variant_group"] is None or isinstance(r["variant_group"], str)):
        fail(f"{rid}: variant_group must be string or null")

    prerequisites = r.get("prerequisites")
    if prerequisites is not None:
        if (
            not isinstance(prerequisites, list)
            or any(not isinstance(x, str) for x in prerequisites)
            or len(prerequisites) != len(set(prerequisites))
        ):
            fail(f"{rid}: invalid/duplicate prerequisites")

    unit = r["unit"]
    if not isinstance(unit, dict) or not text(unit.get("major")) or not text(unit.get("minor")):
        fail(f"{rid}: invalid unit")
    tags = unit.get("tags", [])
    if not isinstance(tags, list) or any(not isinstance(x, str) for x in tags) or len(tags) != len(set(tags)):
        fail(f"{rid}: invalid/duplicate unit tags")

    source = r["source"]
    if not isinstance(source, dict) or source.get("book") not in VALID_BOOKS:
        fail(f"{rid}: invalid source")
    if not isinstance(source.get("is_generated_variant"), bool):
        fail(f"{rid}: source.is_generated_variant must be bool")
    if not isinstance(source.get("document"), str):
        fail(f"{rid}: source.document must be string")
    if not (source.get("original_no") is None or isinstance(source.get("original_no"), str)):
        fail(f"{rid}: source.original_no must be string or null")

    generated = source["is_generated_variant"]
    if generated:
        if source.get("book") != "generated":
            fail(f"{rid}: generated variant must use source.book=generated")
        if not text(source.get("parent_id")):
            fail(f"{rid}: generated variant without parent_id")
    elif source.get("book") == "generated":
        fail(f"{rid}: source.book=generated but is_generated_variant=false")

    figs = r["figure_refs"]
    if (
        not isinstance(figs, list)
        or any(not isinstance(x, str) or not x.strip() for x in figs)
        or len(figs) != len(set(figs))
    ):
        fail(f"{rid}: invalid/duplicate figure_refs")
    unsafe_refs = [ref for ref in figs if not safe_figure_ref(ref)]
    if unsafe_refs:
        fail(f"{rid}: unsafe/unsupported figure_refs: {unsafe_refs}")
    markers = marker_refs(r)
    missing_markers = [ref for ref in markers if ref not in figs]
    unsafe_markers = [ref for ref in markers if not safe_figure_ref(ref)]
    if missing_markers:
        fail(f"{rid}: inline image marker is not registered in figure_refs: {missing_markers}")
    if unsafe_markers:
        fail(f"{rid}: unsafe inline image marker: {unsafe_markers}")

    audit = r["audit"]
    if not isinstance(audit, dict):
        fail(f"{rid}: invalid audit")
    for key in ("problem_answer_verified", "structure_verified", "figure_refs_verified"):
        if not isinstance(audit.get(key), bool):
            fail(f"{rid}: audit.{key} must be bool")
    if not all(audit[k] for k in ("problem_answer_verified", "structure_verified", "figure_refs_verified")):
        fail(f"{rid}: unverified audit gate")


def load_records(p: Path) -> list[dict]:
    if p.suffix == ".jsonl":
        records = []
        for i, line in enumerate(p.read_text(encoding="utf-8").splitlines(), 1):
            if line.strip():
                try:
                    records.append(json.loads(line))
                except Exception as e:
                    fail(f"line {i}: invalid JSON: {e}")
        return records
    obj = json.loads(p.read_text(encoding="utf-8"))
    if isinstance(obj, list):
        return obj
    if isinstance(obj, dict):
        records = obj.get("records", [])
        if isinstance(records, list):
            return records
    fail("top-level JSON must be an array or object with records array")


def main(path: str, strict: bool = True) -> int:
    p = Path(path)
    seen: set[str] = set()
    records = load_records(p)
    if not records:
        fail("no records")
    for r in records:
        validate_record(r, seen)

    generated = [r for r in records if r["source"]["is_generated_variant"]]
    originals = [r for r in records if not r["source"]["is_generated_variant"]]
    original_counts = Counter(r["source"]["book"] for r in originals)
    grades = Counter(r["grade"] for r in records)
    choice_records = sum(1 for r in records if isinstance(r["choices"], list) and len(r["choices"]) > 0)
    marker_records = sum(1 for r in records if marker_refs(r))
    marker_occurrences = sum(
        len(IMAGE_MARKER_RE.findall(str(r.get(field, ""))))
        for r in records
        for field in ("question", "answer", "explanation")
    )

    by_id = {r["id"]: r for r in records}
    for r in generated:
        parent_id = r["source"].get("parent_id")
        if parent_id not in by_id:
            fail(f"{r['id']}: parent_id not found: {parent_id}")
        if by_id[parent_id]["source"]["is_generated_variant"]:
            fail(f"{r['id']}: parent_id points to generated variant")

    if strict:
        if len(records) != EXPECTED_FINAL_RECORDS:
            fail(f"final record count {len(records)} != {EXPECTED_FINAL_RECORDS}")
        if len(originals) != EXPECTED_ORIGINAL_RECORDS:
            fail(f"original record count {len(originals)} != {EXPECTED_ORIGINAL_RECORDS}")
        if len(generated) != EXPECTED_GENERATED_VARIANTS:
            fail(f"generated variant count {len(generated)} != {EXPECTED_GENERATED_VARIANTS}")
        for book, expected in EXPECTED_BY_SOURCE_ORIGINAL.items():
            actual = original_counts.get(book, 0)
            if actual != expected:
                fail(f"original source count {book}={actual} != {expected}")

    result = {
        "status": "PASS",
        "strict_canonical_gate": strict,
        "records": len(records),
        "original_records": len(originals),
        "generated_variants": len(generated),
        "original_by_source": dict(original_counts),
        "by_grade": dict(grades),
        "unique_ids": len(seen),
        "blank_questions": 0,
        "blank_answers": 0,
        "choice_records": choice_records,
        "title_and_choices_preserved": len(records),
        "verified_audit_gates": len(records),
        "figure_ref_path_safety": "PASS",
        "inline_figure_marker_registration": "PASS",
        "inline_marker_records": marker_records,
        "inline_marker_occurrences": marker_occurrences,
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    args = sys.argv[1:]
    if not args or len(args) > 2 or (len(args) == 2 and args[1] != "--non-strict"):
        print("usage: validate_app_records.py <records.json|records.jsonl> [--non-strict]", file=sys.stderr)
        raise SystemExit(2)
    try:
        raise SystemExit(main(args[0], strict=(len(args) == 1)))
    except Exception as e:
        print(f"FAIL: {e}", file=sys.stderr)
        raise SystemExit(1)
