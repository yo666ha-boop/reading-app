from __future__ import annotations

import copy
from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256

NOW = "2026-08-24T01:30:00Z"


def main():
    p = copy.deepcopy(make_base()[0])
    p["id"] = "U-AFF-2PT"
    p["question"] = "2点(1,3)、(3,7)を通る一次関数の式を求めなさい。"
    p["answer"] = "y=2x+1"
    p["choices"] = None
    p["figure_refs"] = []
    p["source"]["is_generated_variant"] = False
    p["source"]["parent_id"] = None
    p["variant_group"] = None
    rows, prov, reason = generate_parent(p, 3, NOW)
    assert reason.startswith("specialized:affine:affine_equation_from_two_integer_points_exact")
    assert len(rows) == len(prov) == 3
    expected = parent_record_sha256(p)
    numeric_surfaces = set()
    for row, ev in zip(rows, prov):
        assert row["source"]["parent_id"] == p["id"]
        assert row.get("taxonomy") == p.get("taxonomy") and row.get("difficulty") == p.get("difficulty")
        assert row.get("choices") == p.get("choices") and row.get("figure_refs") == p.get("figure_refs")
        audit = row.get("audit") or {}
        assert all(audit.get(k) is True for k in ("problem_answer_verified", "structure_verified", "figure_refs_verified"))
        assert ev["parent_record_sha256"] == expected and ev["independent_recalculation"] is True
        assert "affine_two_integer_points_exact_slope_intercept_and_forward_substitution" in ev["verification_evidence"]
        nums = tuple(__import__("re").findall(r"[+-]?\d+", row["question"]))
        assert nums not in numeric_surfaces
        numeric_surfaces.add(nums)
    print("PASS_AFFINE_EQUATION_FROM_TWO_POINTS_UNIFIED_ADAPTER")


if __name__ == "__main__":
    main()
