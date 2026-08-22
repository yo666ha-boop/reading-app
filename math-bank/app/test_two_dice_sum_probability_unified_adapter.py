from __future__ import annotations

import copy

from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256

NOW = "2026-08-22T12:10:00Z"


def main() -> None:
    parent = copy.deepcopy(make_base()[0])
    parent["id"] = "U-TWO-DICE-SUM"
    parent["question"] = "2個のサイコロを同時に投げるとき、出た目の和が7になる確率を求めなさい。"
    parent["answer"] = "1/6"
    parent["choices"] = []
    parent["figure_refs"] = []
    parent["source"]["is_generated_variant"] = False
    parent["source"]["parent_id"] = None
    parent["variant_group"] = None

    rows, prov, reason = generate_parent(parent, 3, NOW)
    assert reason.startswith("specialized:two_dice_sum_probability:")
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
        assert "engine=two_dice_sum_probability" in evidence["verification_evidence"]
        assert "favorable_count == 6-abs(7-" in evidence["verification_evidence"]

    print("PASS_TWO_DICE_SUM_PROBABILITY_UNIFIED_ADAPTER_PARENT_SHA_METADATA_AUDIT_AND_INDEPENDENT_RECALCULATION")


if __name__ == "__main__":
    main()
