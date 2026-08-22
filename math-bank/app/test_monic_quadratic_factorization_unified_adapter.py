from __future__ import annotations

import copy

from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256

NOW = "2026-08-23T00:00:00Z"


def main() -> None:
    parent = copy.deepcopy(make_base()[0])
    parent["id"] = "U-MONIC-FACTOR"
    parent["question"] = "x²+5x+6を因数分解しなさい。"
    parent["answer"] = "(x+2)(x+3)"
    parent["choices"] = None
    parent["figure_refs"] = []
    parent["source"]["is_generated_variant"] = False
    parent["source"]["parent_id"] = None
    parent["variant_group"] = None

    rows, provenance, reason = generate_parent(parent, 3, NOW)
    assert reason.startswith("specialized:monic_quadratic_factorization:")
    assert len(rows) == len(provenance) == 3
    assert len({row["question"] for row in rows}) == 3

    expected_sha = parent_record_sha256(parent)
    for row, evidence in zip(rows, provenance):
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
        assert "engine=monic_quadratic_factorization" in evidence["verification_evidence"]

    empty_choice = copy.deepcopy(parent)
    empty_choice["choices"] = []
    rows2, provenance2, reason2 = generate_parent(empty_choice, 1, NOW)
    assert reason2.startswith("specialized:monic_quadratic_factorization:")
    assert rows2[0]["choices"] == []
    assert provenance2[0]["parent_record_sha256"] == parent_record_sha256(empty_choice)

    print("PASS_MONIC_QUADRATIC_FACTORIZATION_UNIFIED_PARENT_CONTRACT")


if __name__ == "__main__":
    main()
