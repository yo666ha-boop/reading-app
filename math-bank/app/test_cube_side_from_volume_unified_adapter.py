from __future__ import annotations

import copy
from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256

NOW = "2026-08-24T04:55:00+09:00"


def main() -> None:
    parent = copy.deepcopy(make_base()[0])
    parent["id"] = "U-CUBE-SIDE-FROM-VOLUME"
    parent["question"] = "体積が125cm³の立方体があります。この立方体の1辺を求めなさい。"
    parent["answer"] = "5cm"
    parent["choices"] = None
    parent["figure_refs"] = []
    parent["source"]["is_generated_variant"] = False
    parent["source"]["parent_id"] = None
    parent["variant_group"] = None

    rows, prov, reason = generate_parent(parent, 3, NOW)
    assert reason.startswith("specialized:cube_volume:cube_volume_to_integer_side_exact")
    assert len(rows) == len(prov) == 3
    assert len({row["question"] for row in rows}) == 3
    expected_sha = parent_record_sha256(parent)
    for row, evidence in zip(rows, prov):
        assert row["source"]["parent_id"] == parent["id"]
        assert row.get("taxonomy") == parent.get("taxonomy")
        assert row.get("difficulty") == parent.get("difficulty")
        assert row.get("choices") == parent.get("choices")
        assert row.get("figure_refs") == parent.get("figure_refs")
        assert all(row["audit"].get(k) is True for k in ("problem_answer_verified", "structure_verified", "figure_refs_verified"))
        assert evidence["parent_record_sha256"] == expected_sha
        assert evidence["independent_recalculation"] is True
        assert "cube_side_from_volume_exact_cube_root_and_recomposition" in evidence["verification_evidence"]
    print("PASS_CUBE_SIDE_FROM_VOLUME_UNIFIED_PARENT_CONTRACT")


if __name__ == "__main__":
    main()
