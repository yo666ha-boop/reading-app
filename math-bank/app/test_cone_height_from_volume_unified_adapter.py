from __future__ import annotations

import copy

from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256

NOW = "2026-08-23T15:00:00Z"


def main() -> None:
    parent = copy.deepcopy(make_base()[0])
    parent["id"] = "U-CONE-H"
    parent["question"] = "半径3cm、体積94.2cm³の円すいがあります。円周率を3.14として、高さを求めなさい。"
    parent["answer"] = "10cm"
    parent["choices"] = None
    parent["figure_refs"] = []
    parent["source"]["is_generated_variant"] = False
    parent["source"]["parent_id"] = None
    parent["variant_group"] = None

    rows, prov, reason = generate_parent(parent, 3, NOW)
    assert reason.startswith("specialized:cone_volume_pi_3_14:cone_height_from_volume_pi_3_14_exact")
    assert len(rows) == len(prov) == 3
    assert len({row["question"] for row in rows}) == 3

    expected_sha = parent_record_sha256(parent)
    parent_taxonomy = copy.deepcopy(parent.get("taxonomy"))
    parent_difficulty = parent.get("difficulty")
    parent_format = parent.get("format")
    for row, evidence in zip(rows, prov):
        assert row["source"]["parent_id"] == parent["id"]
        assert row.get("taxonomy") == parent_taxonomy
        assert row.get("difficulty") == parent_difficulty
        assert row.get("format") == parent_format
        assert row.get("choices") == parent.get("choices")
        assert row.get("figure_refs") == parent.get("figure_refs")
        audit = row.get("audit") or {}
        assert audit.get("problem_answer_verified") is True
        assert audit.get("structure_verified") is True
        assert audit.get("figure_refs_verified") is True
        assert evidence["parent_record_sha256"] == expected_sha
        assert evidence["independent_recalculation"] is True
        assert "cone_height_exact_triple_volume_division_and_volume_recomposition" in evidence["verification_evidence"]

    empty = copy.deepcopy(parent)
    empty["id"] = "U-CONE-H-EMPTY"
    empty["choices"] = []
    rows2, prov2, reason2 = generate_parent(empty, 1, NOW)
    assert len(rows2) == len(prov2) == 1
    assert reason2.startswith("specialized:cone_volume_pi_3_14:cone_height_from_volume_pi_3_14_exact")

    print("PASS_CONE_HEIGHT_FROM_VOLUME_UNIFIED_PARENT_SHA_METADATA_AUDIT_AND_RECALCULATION")


if __name__ == "__main__":
    main()
