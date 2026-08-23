from __future__ import annotations

import copy

import generate_all_safe_verified_variants as unified
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256

NOW = "2026-08-22T00:00:00Z"


def parent() -> dict:
    p = copy.deepcopy(make_base()[0])
    p["id"] = "U-PARENT-CONTRACT"
    p["question"] = "1200円の25%は何円ですか。"
    p["answer"] = "300円"
    p["choices"] = None
    p["figure_refs"] = []
    p["source"]["is_generated_variant"] = False
    p["source"]["parent_id"] = None
    p["variant_group"] = None
    return p


def triangle_angle_parent() -> dict:
    p = copy.deepcopy(make_base()[0])
    p["id"] = "U-TRIANGLE-THIRD-ANGLE"
    p["question"] = "三角形の2つの角が50°と60°です。残りの1つの角を求めなさい。"
    p["answer"] = "70°"
    p["choices"] = []
    p["figure_refs"] = []
    p["source"]["is_generated_variant"] = False
    p["source"]["parent_id"] = None
    p["variant_group"] = None
    return p


def expect_contract_failure(field: str, mutate) -> None:
    original = unified.make_variant_base

    def corrupt(base_parent: dict, vid: str) -> dict:
        row = original(base_parent, vid)
        mutate(row)
        return row

    unified.make_variant_base = corrupt
    try:
        try:
            unified.generate_parent(parent(), 1, NOW)
        except AssertionError as exc:
            assert field in str(exc), (field, exc)
        else:
            raise AssertionError(f"corrupted {field} must fail closed")
    finally:
        unified.make_variant_base = original


def main() -> None:
    rows, prov, reason = unified.generate_parent(parent(), 1, NOW)
    assert len(rows) == len(prov) == 1
    assert reason.startswith("specialized:percentage:")

    tri = triangle_angle_parent()
    rows, prov, reason = unified.generate_parent(tri, 3, NOW)
    assert len(rows) == len(prov) == 3
    assert reason.startswith("specialized:triangle_area:triangle_two_integer_angles_third_exact")
    assert len({row["question"] for row in rows}) == 3
    assert all(row["answer"].endswith("°") for row in rows)
    assert all(row["choices"] == [] for row in rows)
    expected_sha = parent_record_sha256(tri)
    for row, evidence in zip(rows, prov):
        assert row["source"]["parent_id"] == tri["id"]
        assert row["audit"]["problem_answer_verified"] is True
        assert row["audit"]["structure_verified"] is True
        assert row["audit"]["figure_refs_verified"] is True
        assert evidence["parent_record_sha256"] == expected_sha
        assert evidence["independent_recalculation"] is True
        assert "triangle_third_angle_exact_subtraction_and_sum_identity" in evidence["verification_evidence"]
        assert "180 PASS" in evidence["verification_evidence"]

    wrong = triangle_angle_parent()
    wrong["answer"] = "71°"
    rows, prov, reason = unified.generate_parent(wrong, 1, NOW)
    assert rows == [] and prov == []
    assert "triangle_third_angle_parent_not_exactly_parsed_and_verified" in reason

    with_choice = triangle_angle_parent()
    with_choice["choices"] = ["60°", "70°", "80°"]
    rows, prov, reason = unified.generate_parent(with_choice, 1, NOW)
    assert rows == [] and prov == [] and "choice_parent" in reason

    expect_contract_failure("difficulty", lambda row: row.__setitem__("difficulty", "corrupted"))
    expect_contract_failure("choices", lambda row: row.__setitem__("choices", ["300円"]))
    expect_contract_failure("figure_refs", lambda row: row.__setitem__("figure_refs", ["missing.svg"]))
    expect_contract_failure("parent_id", lambda row: row["source"].__setitem__("parent_id", "WRONG"))
    expect_contract_failure("audit.problem_answer_verified", lambda row: row["audit"].__setitem__("problem_answer_verified", False))
    expect_contract_failure("audit.structure_verified", lambda row: row["audit"].__setitem__("structure_verified", False))
    expect_contract_failure("audit.figure_refs_verified", lambda row: row["audit"].__setitem__("figure_refs_verified", False))

    print("PASS_UNIFIED_PARENT_CONTRACT_RUNTIME_FAIL_CLOSED_GATE")
    print("PASS_TRIANGLE_THIRD_ANGLE_PARENT_SHA_EMPTY_CHOICES_AUDIT3_AND_SUM_IDENTITY")


if __name__ == "__main__":
    main()
