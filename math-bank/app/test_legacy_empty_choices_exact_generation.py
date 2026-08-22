from __future__ import annotations

import copy

from generate_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256

NOW = "2026-08-22T00:00:00Z"


def base_parent(pid: str, question: str, answer: str, choices):
    p = copy.deepcopy(make_base()[0])
    p["id"] = pid
    p["question"] = question
    p["answer"] = answer
    p["choices"] = choices
    p["figure_refs"] = []
    p["source"]["is_generated_variant"] = False
    p["source"]["parent_id"] = None
    p["variant_group"] = None
    return p


def assert_exact(parent: dict, expected_reason: str) -> None:
    rows, prov, reason = generate_parent(parent, 2, NOW)
    assert reason == expected_reason, reason
    assert len(rows) == len(prov) == 2
    expected_sha = parent_record_sha256(parent)
    for row, evidence in zip(rows, prov):
        assert row["choices"] == []
        assert row["source"]["parent_id"] == parent["id"]
        assert evidence["parent_record_sha256"] == expected_sha
        assert evidence["independent_recalculation"] is True


def main() -> None:
    arithmetic = base_parent("LEGACY-EMPTY-A", "(-3)+8 を計算しなさい。", "5", [])
    assert_exact(arithmetic, "binary_arithmetic_exact")

    equation = base_parent("LEGACY-EMPTY-E", "方程式 2x+3=11 を解きなさい。", "x=4", [])
    assert_exact(equation, "linear_equation_exact")

    selected = base_parent("LEGACY-CHOICE", "(-3)+8 を計算しなさい。", "5", ["4", "5", "6"])
    rows, prov, reason = generate_parent(selected, 1, NOW)
    assert rows == [] and prov == [] and "choice_parent" in reason

    print("PASS_LEGACY_EXACT_EMPTY_LIST_NON_CHOICE_AND_REAL_CHOICE_FAIL_CLOSED")


if __name__ == "__main__":
    main()
