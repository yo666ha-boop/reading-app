from __future__ import annotations

import copy
from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256

NOW = "2026-08-24T04:10:00Z"


def main():
    p = copy.deepcopy(make_base()[0])
    p["id"] = "U-LINEAR-INEQ"
    p["grade"] = 2
    p["unit"] = "一次不等式"
    p["skill"] = "一次不等式を解く"
    p["taxonomy"] = {"domain": "algebra", "topic": "linear_inequality"}
    p["question"] = "不等式 3x+2<20 を解きなさい。"
    p["answer"] = "x<6"
    p["choices"] = None
    p["figure_refs"] = []
    p["source"]["is_generated_variant"] = False
    p["source"]["parent_id"] = None
    p["variant_group"] = None

    rows, prov, reason = generate_parent(p, 3, NOW)
    assert reason.startswith("specialized:affine:linear_inequality_ax_plus_b_rel_c_exact"), reason
    assert len(rows) == len(prov) == 3
    assert len({tuple(r["question"].split()) for r in rows}) == 3
    expected = parent_record_sha256(p)
    for row, ev in zip(rows, prov):
        assert row["source"]["parent_id"] == p["id"]
        assert row.get("taxonomy") == p.get("taxonomy")
        assert row.get("difficulty") == p.get("difficulty")
        assert row.get("choices") == p.get("choices")
        assert row.get("figure_refs") == p.get("figure_refs")
        audit = row.get("audit") or {}
        assert all(audit.get(k) is True for k in ("problem_answer_verified", "structure_verified", "figure_refs_verified"))
        assert ev["parent_record_sha256"] == expected
        assert ev["independent_recalculation"] is True
        assert "linear_inequality_exact_boundary_inverse_and_direction_check" in ev["verification_evidence"]
    print("PASS_LINEAR_INEQUALITY_UNIFIED_PARENT_CONTRACT")


if __name__ == "__main__":
    main()
