from __future__ import annotations

import argparse
import json
import re
from collections import Counter, defaultdict
from pathlib import Path

from validate_app_records import load_records, validate_record

BASE_CANONICAL_SHA256 = "eb93279a52dd49191612a52ac0df2df2fdd865c8975d815547daa126b4398175"
EXPECTED_BASE_TOTAL = 1231
EXPECTED_ORIGINALS = 1124
EXPECTED_BASELINE_VARIANTS = 107
EXPECTED_ORIGINAL_BY_SOURCE = {"Winpass": 570, "実力錬成": 237, "Standard": 317}
REQUIRED_PROVENANCE = {
    "variant_id", "parent_id", "generator", "generation_method", "verification_method", "verified_at"
}
NUMBER_RE = re.compile(r"(?<![A-Za-z_])[-+]?\d+(?:\.\d+)?(?:/\d+(?:\.\d+)?)?")


def fail(msg: str) -> None:
    raise ValueError(msg)


def text(v: object) -> str:
    return v.strip() if isinstance(v, str) else ""


def norm_problem(v: object) -> str:
    s = text(v)
    s = re.sub(r"\s+", " ", s)
    return s.casefold()


def numeric_tokens(v: object) -> tuple[str, ...]:
    """Return normalized numeric literals used to reject wording-only pseudo variants."""
    return tuple(NUMBER_RE.findall(text(v).replace("−", "-").replace("＋", "+")))


def load_layer(path: Path) -> tuple[list[dict], list[dict], str]:
    obj = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(obj, dict):
        fail("expanded layer must be a JSON object")
    if obj.get("schema_version") != "1.0":
        fail("expanded layer schema_version must be 1.0")
    base_sha = text(obj.get("base_canonical_sha256"))
    if base_sha != BASE_CANONICAL_SHA256:
        fail("expanded layer is not anchored to the immutable base canonical SHA-256")
    variants = obj.get("variants")
    provenance = obj.get("provenance")
    if not isinstance(variants, list):
        fail("expanded layer variants must be a list")
    if not isinstance(provenance, list):
        fail("expanded layer provenance must be a list")
    return variants, provenance, base_sha


def base_gate(base: list[dict]) -> tuple[dict[str, dict], list[dict], list[dict]]:
    seen: set[str] = set()
    for r in base:
        validate_record(r, seen)
    originals = [r for r in base if not r["source"]["is_generated_variant"]]
    legacy_variants = [r for r in base if r["source"]["is_generated_variant"]]
    if len(base) != EXPECTED_BASE_TOTAL:
        fail(f"base total {len(base)} != {EXPECTED_BASE_TOTAL}")
    if len(originals) != EXPECTED_ORIGINALS:
        fail(f"base originals {len(originals)} != {EXPECTED_ORIGINALS}")
    if len(legacy_variants) != EXPECTED_BASELINE_VARIANTS:
        fail(f"base baseline variants {len(legacy_variants)} != {EXPECTED_BASELINE_VARIANTS}")
    counts = Counter(r["source"]["book"] for r in originals)
    for book, expected in EXPECTED_ORIGINAL_BY_SOURCE.items():
        if counts.get(book, 0) != expected:
            fail(f"base source {book}={counts.get(book, 0)} != {expected}")
    by_id = {r["id"]: r for r in base}
    for r in legacy_variants:
        parent = by_id.get(r["source"].get("parent_id"))
        if not parent or parent["source"]["is_generated_variant"]:
            fail(f"baseline variant {r['id']}: invalid parent")
    return by_id, originals, legacy_variants


def choices_shape(v: object) -> tuple[str, int]:
    if v is None:
        return ("none", 0)
    if isinstance(v, list):
        return ("list", len(v))
    return ("invalid", -1)


def taxonomy_signature(r: dict) -> tuple:
    return (
        r.get("grade"),
        r.get("unit", {}).get("major"),
        r.get("unit", {}).get("minor"),
        r.get("skill"),
        r.get("question_format"),
    )


def validate_layer(
    base: list[dict],
    variants: list[dict],
    provenance: list[dict],
    *,
    require_full_parent_coverage: bool = False,
) -> dict:
    by_id, originals, legacy_variants = base_gate(base)
    original_ids = {r["id"] for r in originals}

    prov_by_variant: dict[str, dict] = {}
    for i, p in enumerate(provenance):
        if not isinstance(p, dict):
            fail(f"provenance[{i}] must be object")
        missing = REQUIRED_PROVENANCE - set(p)
        if missing:
            fail(f"provenance[{i}] missing {sorted(missing)}")
        vid = text(p.get("variant_id"))
        pid = text(p.get("parent_id"))
        if not vid or not pid:
            fail(f"provenance[{i}] blank variant_id/parent_id")
        if vid in prov_by_variant:
            fail(f"duplicate provenance for {vid}")
        for key in ("generator", "generation_method", "verification_method", "verified_at"):
            if not text(p.get(key)):
                fail(f"provenance {vid}: blank {key}")
        prov_by_variant[vid] = p

    seen = set(by_id)
    existing_problem_sigs = {norm_problem(r.get("question")) for r in base}
    generated_problem_sigs: set[str] = set()
    parent_counts: defaultdict[str, int] = defaultdict(int)
    grade_counts: Counter[int] = Counter()
    unit_counts: Counter[str] = Counter()
    wording_only_rejections = 0

    for r in variants:
        validate_record(r, seen)
        rid = r["id"]
        src = r["source"]
        if not src["is_generated_variant"] or src.get("book") != "generated":
            fail(f"{rid}: expanded records must be generated variants")
        pid = text(src.get("parent_id"))
        if pid not in original_ids:
            fail(f"{rid}: parent_id must point to a base original: {pid}")
        parent = by_id[pid]
        if taxonomy_signature(r) != taxonomy_signature(parent):
            fail(f"{rid}: grade/unit/skill/question_format taxonomy differs from parent {pid}")
        if r.get("difficulty") != parent.get("difficulty"):
            fail(f"{rid}: difficulty differs from parent {pid}")
        if choices_shape(r.get("choices")) != choices_shape(parent.get("choices")):
            fail(f"{rid}: choices shape/count differs from parent {pid}")
        if list(r.get("figure_refs") or []) != list(parent.get("figure_refs") or []):
            fail(f"{rid}: expanded variant figure_refs must exactly reuse verified parent figure_refs")
        if text(r.get("variant_group")) != pid:
            fail(f"{rid}: variant_group must equal parent_id for expanded variants")

        sig = norm_problem(r.get("question"))
        if not sig:
            fail(f"{rid}: blank normalized question")
        if sig in existing_problem_sigs:
            fail(f"{rid}: question duplicates base data")
        if sig in generated_problem_sigs:
            fail(f"{rid}: question duplicates another expanded variant")
        generated_problem_sigs.add(sig)

        # If the parent contains numeric literals, a new variant must actually change at
        # least one numeric literal. Rewording the same numbers is not a substantive
        # mathematical variant and is rejected even when the full text differs.
        parent_nums = numeric_tokens(parent.get("question"))
        variant_nums = numeric_tokens(r.get("question"))
        if parent_nums and parent_nums == variant_nums:
            wording_only_rejections += 1
            fail(f"{rid}: wording-only pseudo variant; numeric literals are unchanged from parent {pid}")

        p = prov_by_variant.get(rid)
        if not p:
            fail(f"{rid}: missing provenance")
        if text(p.get("parent_id")) != pid:
            fail(f"{rid}: provenance parent_id mismatch")
        independent = p.get("independent_recalculation")
        if independent is not True:
            fail(f"{rid}: independent_recalculation must be true")
        if not text(p.get("verification_evidence")):
            fail(f"{rid}: verification_evidence is required")

        parent_counts[pid] += 1
        grade_counts[r["grade"]] += 1
        unit_counts[f"{r['grade']}:{r['unit']['major']}:{r['unit']['minor']}"] += 1

    variant_ids = {r["id"] for r in variants}
    extra_prov = sorted(set(prov_by_variant) - variant_ids)
    if extra_prov:
        fail(f"provenance entries without variants: {extra_prov[:10]}")

    covered = set(parent_counts)
    uncovered = sorted(original_ids - covered)
    if require_full_parent_coverage and uncovered:
        fail(f"expanded parent coverage incomplete: {len(covered)}/{EXPECTED_ORIGINALS}; uncovered={len(uncovered)}")

    result = {
        "status": "PASS",
        "base_canonical_sha256": BASE_CANONICAL_SHA256,
        "base_records": len(base),
        "base_originals": len(originals),
        "baseline_verified_variants": len(legacy_variants),
        "expanded_verified_variants": len(variants),
        "composed_total": len(base) + len(variants),
        "expanded_parent_coverage": len(covered),
        "expanded_parent_target": EXPECTED_ORIGINALS,
        "expanded_parent_coverage_percent": round(100 * len(covered) / EXPECTED_ORIGINALS, 3),
        "uncovered_parent_count": len(uncovered),
        "uncovered_parent_ids": uncovered,
        "expanded_by_grade": dict(sorted(grade_counts.items())),
        "expanded_by_unit": dict(sorted(unit_counts.items())),
        "duplicate_questions": 0,
        "wording_only_pseudo_variants": wording_only_rejections,
        "taxonomy_mismatches": 0,
        "parent_failures": 0,
        "unverified_records": 0,
        "provenance_failures": 0,
        "require_full_parent_coverage": require_full_parent_coverage,
    }
    return result


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("base")
    ap.add_argument("expanded")
    ap.add_argument("--require-full-parent-coverage", action="store_true")
    ap.add_argument("--report")
    ns = ap.parse_args()
    base = load_records(Path(ns.base))
    variants, provenance, _ = load_layer(Path(ns.expanded))
    report = validate_layer(base, variants, provenance, require_full_parent_coverage=ns.require_full_parent_coverage)
    text_out = json.dumps(report, ensure_ascii=False, indent=2) + "\n"
    if ns.report:
        p = Path(ns.report); p.parent.mkdir(parents=True, exist_ok=True); p.write_text(text_out, encoding="utf-8")
    print(text_out, end="")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as e:
        print(f"FAIL: {e}")
        raise SystemExit(1)
