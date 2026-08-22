from __future__ import annotations

"""Unified fail-closed driver for all proven safe math variant engines.

This driver only operates on actual BASE records loaded from disk. It never
constructs a parent record and never promotes a candidate unless the repository
strict expanded-layer validator accepts the resulting full layer.
"""

import argparse
import json
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path

from generate_safe_verified_variants import (
    generate_parent as generate_legacy_exact,
    make_variant_base,
    variant_id,
)
from safe_affine_variant_engine import generate as generate_affine
from safe_average_variant_engine import generate as generate_average
from safe_circle_area_variant_engine import generate as generate_circle_area
from safe_circle_circumference_variant_engine import generate as generate_circle_circumference
from safe_cone_volume_variant_engine import generate as generate_cone_volume
from safe_cube_volume_variant_engine import generate as generate_cube_volume
from safe_cylinder_volume_variant_engine import generate as generate_cylinder_volume
from safe_inverse_proportion_variant_engine import generate as generate_inverse_proportion
from safe_parallelogram_area_variant_engine import generate as generate_parallelogram_area
from safe_percentage_variant_engine import generate as generate_percentage
from safe_proportion_variant_engine import generate as generate_proportion
from safe_rectangle_area_variant_engine import generate as generate_rectangle_area
from safe_rectangle_perimeter_variant_engine import generate as generate_rectangle_perimeter
from safe_rectangular_prism_volume_variant_engine import generate as generate_rectangular_prism_volume
from safe_single_draw_probability_variant_engine import generate as generate_probability
from safe_speed_distance_variant_engine import generate as generate_speed_distance
from safe_sphere_variant_engine import generate as generate_sphere
from safe_square_area_variant_engine import generate as generate_square_area
from safe_trapezoid_area_variant_engine import generate as generate_trapezoid_area
from safe_triangle_area_variant_engine import generate as generate_triangle_area
from validate_app_records import load_records
from validate_expanded_variant_layer import (
    BASE_CANONICAL_SHA256,
    base_gate,
    load_layer,
    numeric_tokens,
    parent_record_sha256,
    validate_layer,
)


SPECIALIZED_ENGINES = (
    ("affine", generate_affine),
    ("inverse_proportion", generate_inverse_proportion),
    ("single_draw_probability", generate_probability),
    ("proportion", generate_proportion),
    ("percentage", generate_percentage),
    ("simple_average", generate_average),
    ("rectangle_area", generate_rectangle_area),
    ("rectangle_perimeter", generate_rectangle_perimeter),
    ("circle_area_pi_3_14", generate_circle_area),
    ("circle_circumference_pi_3_14", generate_circle_circumference),
    ("square_area", generate_square_area),
    ("triangle_area", generate_triangle_area),
    ("parallelogram_area", generate_parallelogram_area),
    ("trapezoid_area", generate_trapezoid_area),
    ("rectangular_prism_volume", generate_rectangular_prism_volume),
    ("cube_volume", generate_cube_volume),
    ("cylinder_volume_pi_3_14", generate_cylinder_volume),
    ("cone_volume_pi_3_14", generate_cone_volume),
    ("sphere_pi_3_14", generate_sphere),
    ("speed_distance", generate_speed_distance),
)

PARENT_CONTRACT_FIELDS = (
    "grade",
    "unit",
    "skill",
    "difficulty",
    "format",
    "question_format",
    "taxonomy",
)
AUDIT_TRUE_FIELDS = (
    "problem_answer_verified",
    "structure_verified",
    "figure_refs_verified",
)


def _verification_evidence(engine_name: str, evidence: dict) -> str:
    return f"engine={engine_name}; " + json.dumps(evidence, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def _assert_variant_parent_contract(parent: dict, variant: dict, provenance: dict, engine_name: str) -> None:
    """Fail immediately if an adapter drifts from its exact parent contract."""
    for field in PARENT_CONTRACT_FIELDS:
        if variant.get(field) != parent.get(field):
            raise AssertionError(f"{engine_name} parent contract mismatch: {field}")
    if variant.get("choices") != parent.get("choices"):
        raise AssertionError(f"{engine_name} parent contract mismatch: choices")
    if list(variant.get("figure_refs") or []) != list(parent.get("figure_refs") or []):
        raise AssertionError(f"{engine_name} parent contract mismatch: figure_refs")
    source = variant.get("source") if isinstance(variant.get("source"), dict) else {}
    if source.get("parent_id") != parent.get("id"):
        raise AssertionError(f"{engine_name} parent contract mismatch: parent_id")
    audit = variant.get("audit") if isinstance(variant.get("audit"), dict) else {}
    for field in AUDIT_TRUE_FIELDS:
        if audit.get(field) is not True:
            raise AssertionError(f"{engine_name} parent contract mismatch: audit.{field}")
    expected_sha = parent_record_sha256(parent)
    if provenance.get("parent_id") != parent.get("id"):
        raise AssertionError(f"{engine_name} provenance parent_id mismatch")
    if provenance.get("parent_record_sha256") != expected_sha:
        raise AssertionError(f"{engine_name} provenance parent fingerprint mismatch")
    if provenance.get("independent_recalculation") is not True:
        raise AssertionError(f"{engine_name} independent recalculation evidence missing")
    if not provenance.get("verification_evidence"):
        raise AssertionError(f"{engine_name} verification evidence missing")


def _adapt_specialized(parent: dict, count: int, now: str) -> tuple[list[dict], list[dict], str]:
    reasons: list[str] = []
    for engine_name, engine in SPECIALIZED_ENGINES:
        rows, evidence_rows, reason = engine(parent, count)
        if not rows:
            reasons.append(f"{engine_name}:{reason}")
            continue
        if len(rows) != count or len(evidence_rows) != count:
            raise AssertionError(f"{engine_name} returned incomplete sibling set")

        parent_sig = tuple(numeric_tokens(str(parent.get("question") or "")))
        sibling_sigs: set[tuple[str, ...]] = set()
        variants: list[dict] = []
        provenance: list[dict] = []
        for index, (row, evidence) in enumerate(zip(rows, evidence_rows), start=1):
            question = str(row.get("question") or "")
            answer = row.get("answer")
            if not question or answer in (None, ""):
                raise AssertionError(f"{engine_name} returned blank question/answer")
            sig = tuple(numeric_tokens(question))
            if sig == parent_sig or sig in sibling_sigs:
                raise AssertionError(f"{engine_name} numeric surface collision")
            sibling_sigs.add(sig)

            method = f"specialized-{engine_name}-{reason}"
            vid = variant_id(parent, method, index)
            full = make_variant_base(parent, vid)
            full["question"] = question
            full["answer"] = answer
            full["explanation"] = str(row.get("explanation") or "")
            prov = {
                "variant_id": vid,
                "parent_id": parent["id"],
                "parent_record_sha256": parent_record_sha256(parent),
                "generator": "generate_all_safe_verified_variants.py",
                "generation_method": method,
                "verification_method": "specialized fail-closed exact parent recalculation plus independent engine identity check",
                "verified_at": now,
                "independent_recalculation": True,
                "verification_evidence": _verification_evidence(engine_name, evidence),
            }
            _assert_variant_parent_contract(parent, full, prov, engine_name)
            variants.append(full)
            provenance.append(prov)
        return variants, provenance, f"specialized:{engine_name}:{reason}"

    legacy_variants, legacy_prov, legacy_reason = generate_legacy_exact(parent, count, now)
    if legacy_variants:
        if len(legacy_variants) != len(legacy_prov):
            raise AssertionError("legacy exact adapter returned incomplete provenance set")
        for row, p in zip(legacy_variants, legacy_prov):
            p["generator"] = "generate_all_safe_verified_variants.py"
            p["generation_method"] = "legacy_exact_adapter:" + str(p.get("generation_method") or legacy_reason)
            _assert_variant_parent_contract(parent, row, p, "legacy_exact")
        return legacy_variants, legacy_prov, f"legacy:{legacy_reason}"

    reasons.append(f"legacy:{legacy_reason}")
    return [], [], "unsupported_all_safe_engines:" + "|".join(reasons)


def generate_parent(parent: dict, count: int, now: str) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    return _adapt_specialized(parent, count, now)


def generation_request(existing_count: int, *, minimum_per_parent: int, safe_target_per_parent: int) -> tuple[int, int]:
    if existing_count < 0:
        raise ValueError("existing_count must be non-negative")
    if minimum_per_parent not in (1, 2, 3):
        raise ValueError("minimum_per_parent must be 1, 2, or 3")
    if safe_target_per_parent not in (1, 2, 3):
        raise ValueError("safe_target_per_parent must be 1, 2, or 3")
    if safe_target_per_parent < minimum_per_parent:
        raise ValueError("safe_target_per_parent must be >= minimum_per_parent")
    attempt_count = max(0, safe_target_per_parent - existing_count)
    manual_missing_if_unsupported = max(0, minimum_per_parent - existing_count)
    return attempt_count, manual_missing_if_unsupported


def manual_queue_entry(parent: dict, *, missing_count: int, reason: str) -> dict:
    source = parent.get("source") if isinstance(parent.get("source"), dict) else {}
    taxonomy = parent.get("taxonomy") if isinstance(parent.get("taxonomy"), dict) else {}
    return {
        "parent_id": parent["id"],
        "parent_record_sha256": parent_record_sha256(parent),
        "missing_verified_variants": missing_count,
        "reason": reason,
        "grade": parent.get("grade"),
        "genre": parent.get("genre"),
        "unit": parent.get("unit"),
        "skill": parent.get("skill"),
        "difficulty": parent.get("difficulty"),
        "format": parent.get("format"),
        "taxonomy": taxonomy,
        "source_name": source.get("name") or source.get("material") or source.get("book"),
        "has_choices": bool(parent.get("choices")),
        "choice_count": len(parent.get("choices") or []),
        "figure_refs": list(parent.get("figure_refs") or []),
        "manual_policy": "Read this exact fingerprint-bound parent and all referenced figures/choices; do not reconstruct unseen content. Promotion still requires the normal strict expanded validator.",
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("base")
    ap.add_argument("expanded")
    ap.add_argument("output")
    ap.add_argument("--target-per-parent", type=int, default=1, choices=(1, 2, 3))
    ap.add_argument("--safe-target-per-parent", type=int, default=3, choices=(1, 2, 3))
    ap.add_argument("--report")
    ap.add_argument("--manual-queue")
    ns = ap.parse_args()
    if ns.safe_target_per_parent < ns.target_per_parent:
        ap.error("--safe-target-per-parent must be >= --target-per-parent")

    base = load_records(Path(ns.base))
    _, originals, _ = base_gate(base)
    variants, provenance_rows, _ = load_layer(Path(ns.expanded))
    validate_layer(base, variants, provenance_rows, require_full_parent_coverage=False)
    counts = defaultdict(int)
    for row in variants:
        counts[row["source"]["parent_id"]] += 1

    now = datetime.now(timezone.utc).isoformat()
    generated: list[dict] = []
    generated_provenance: list[dict] = []
    manual_queue: list[dict] = []
    reasons = Counter()
    safe_target_parents = 0
    for parent in originals:
        attempt_need, manual_need = generation_request(counts[parent["id"]], minimum_per_parent=ns.target_per_parent, safe_target_per_parent=ns.safe_target_per_parent)
        if attempt_need == 0:
            reasons["already_at_safe_target"] += 1
            continue
        new_rows, new_prov, reason = generate_parent(parent, attempt_need, now)
        reasons[reason] += 1
        if not new_rows:
            if manual_need:
                manual_queue.append(manual_queue_entry(parent, missing_count=manual_need, reason=reason))
            else:
                reasons["unsupported_but_minimum_already_satisfied"] += 1
            continue
        safe_target_parents += 1
        generated.extend(new_rows)
        generated_provenance.extend(new_prov)

    out_layer = {"schema_version": "1.0", "base_canonical_sha256": BASE_CANONICAL_SHA256, "variants": variants + generated, "provenance": provenance_rows + generated_provenance}
    final_report = validate_layer(base, out_layer["variants"], out_layer["provenance"], require_full_parent_coverage=False)
    Path(ns.output).write_text(json.dumps(out_layer, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    if ns.manual_queue:
        queue_payload = {"schema_version": "1.0", "base_canonical_sha256": BASE_CANONICAL_SHA256, "recorded_at_utc": now, "policy": "Actual BASE parents only; every task is fingerprint-bound and contains no generated question. Manual output must pass the same strict validator before counting as coverage.", "minimum_per_parent": ns.target_per_parent, "safe_target_per_parent": ns.safe_target_per_parent, "manual_parent_count": len(manual_queue), "tasks": manual_queue}
        Path(ns.manual_queue).write_text(json.dumps(queue_payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    report = {"status": "PASS", "recorded_at_utc": now, "base_originals": len(originals), "existing_expanded_variants": len(variants), "newly_generated_verified_variants": len(generated), "expanded_total": len(out_layer["variants"]), "expanded_parent_coverage": final_report["expanded_parent_coverage"], "minimum_per_parent": ns.target_per_parent, "safe_target_per_parent": ns.safe_target_per_parent, "safe_target_parents_generated_this_run": safe_target_parents, "manual_parent_count": len(manual_queue), "manual_missing_variant_count": sum(row["missing_verified_variants"] for row in manual_queue), "generation_reason_counts": dict(sorted(reasons.items()))}
    if ns.report:
        Path(ns.report).write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"FAIL: {exc}")
        raise SystemExit(1)
