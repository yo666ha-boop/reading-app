from __future__ import annotations

import copy

from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256

NOW = "2026-08-23T12:00:00Z"


def main() -> None:
    parent = copy.deepcopy(make_base()[0])
    parent["id"] = "U-CIRCLE-RADIUS-AREA"
    parent["question"] = "円周率を3.14とします。面積が78.5cm²の円の半径を求めなさい。"
    parent["answer"] = "5cm"
    parent["choices"] = None
    parent["figure_refs"] = []
    parent["source"]["is_generated_variant"] = False
    parent["source"]["parent_id"] = None
    parent["variant_group"] = None

    rows, prov, reason = generate_parent(parent, 3, NOW)
    assert reason.startswith("specialized:circle_area_pi_3_14:circle_area_to_integer_radius_pi_3_14_exact")
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
        audit = row.get("audit") or {}
        assert audit.get("problem_answer_verified") is True
        assert audit.get("structure_verified") is True
        assert audit.get("figure_refs_verified") is True
        assert evidence["parent_record_sha256"] == expected_sha
        assert evidence["independent_recalculation"] is True
        assert "engine=circle_area_pi_3_14" in evidence["verification_evidence"]
        assert "PASS" in evidence["verification_evidence"]

    print("PASS_CIRCLE_RADIUS_FROM_AREA_UNIFIED_PARENT_SHA_METADATA_AUDIT_AND_RECALC")


if __name__ == "__main__":
    main()
