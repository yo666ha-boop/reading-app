from __future__ import annotations

import copy

from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256

NOW = "2026-08-24T00:00:00Z"


def main() -> None:
    parent = copy.deepcopy(make_base()[0])
    parent["id"] = "U-CONE-SA"
    parent["question"] = "半径3cm、母線5cmの円すいの表面積を、円周率を3.14として求めなさい。"
    parent["answer"] = "75.36cm²"
    parent["choices"] = None
    parent["figure_refs"] = []
    parent["source"]["is_generated_variant"] = False
    parent["source"]["parent_id"] = None
    parent["variant_group"] = None

    rows, prov, reason = generate_parent(parent, 3, NOW)
    assert reason.startswith("specialized:cone_volume_pi_3_14:cone_surface_area_pi_3_14_exact")
    assert len(rows) == len(prov) == 3
    assert len({row["question"] for row in rows}) == 3

    expected_sha = parent_record_sha256(parent)
    for row, evidence in zip(rows, prov):
        assert row["source"]["parent_id"] == parent["id"]
        assert row.get("taxonomy") == parent.get("taxonomy")
        assert row.get("difficulty") == parent.get("difficulty")
        assert row.get("format") == parent.get("format")
        assert row.get("choices") == parent.get("choices")
        assert row.get("figure_refs") == parent.get("figure_refs")
        assert row["audit"]["problem_answer_verified"] is True
        assert row["audit"]["structure_verified"] is True
        assert row["audit"]["figure_refs_verified"] is True
        assert evidence["parent_record_sha256"] == expected_sha
        assert evidence["independent_recalculation"] is True
        assert "engine=cone_volume_pi_3_14" in evidence["verification_evidence"]
        assert "cone_surface_area_exact_pi_r2_plus_pi_r_l_and_factored_identity" in evidence["verification_evidence"]
        assert "PASS" in evidence["verification_evidence"]

    print("PASS_CONE_SURFACE_AREA_UNIFIED_PARENT_SHA_METADATA_AUDIT_AND_RECALCULATION")


if __name__ == "__main__":
    main()
