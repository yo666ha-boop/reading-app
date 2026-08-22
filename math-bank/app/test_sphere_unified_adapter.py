from __future__ import annotations

import copy

from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256

NOW = "2026-08-22T00:00:00Z"


def make_parent(question: str, answer: str):
    parent = copy.deepcopy(make_base()[0])
    parent["id"] = "U-SPHERE"
    parent["question"] = question
    parent["answer"] = answer
    parent["choices"] = None
    parent["figure_refs"] = []
    parent["source"]["is_generated_variant"] = False
    parent["source"]["parent_id"] = None
    parent["variant_group"] = None
    return parent


def check(parent, mode: str):
    rows, prov, reason = generate_parent(parent, 3, NOW)
    assert reason.startswith("specialized:sphere_pi_3_14:")
    assert len(rows) == len(prov) == 3
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
        assert "engine=sphere_pi_3_14" in evidence["verification_evidence"]
        assert mode in evidence["verification_evidence"]


def main() -> None:
    check(make_parent("半径3cmの球の体積を求めなさい。円周率は3.14とする。", "113.04cm³"), "sphere_volume")
    check(make_parent("半径5cmの球の表面積を求めなさい。円周率は3.14とする。", "314cm²"), "sphere_surface_area")
    print("PASS_SPHERE_UNIFIED_PARENT_SHA_METADATA_AUDIT_AND_INDEPENDENT_RECALCULATION")


if __name__ == "__main__":
    main()
