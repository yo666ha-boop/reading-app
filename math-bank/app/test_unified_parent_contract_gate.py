from __future__ import annotations

import copy

import generate_all_safe_verified_variants as unified
from test_expanded_variant_layer import make_base

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

    expect_contract_failure("difficulty", lambda row: row.__setitem__("difficulty", "corrupted"))
    expect_contract_failure("choices", lambda row: row.__setitem__("choices", ["300円"]))
    expect_contract_failure("figure_refs", lambda row: row.__setitem__("figure_refs", ["missing.svg"]))
    expect_contract_failure("parent_id", lambda row: row["source"].__setitem__("parent_id", "WRONG"))
    expect_contract_failure("audit.problem_answer_verified", lambda row: row["audit"].__setitem__("problem_answer_verified", False))
    expect_contract_failure("audit.structure_verified", lambda row: row["audit"].__setitem__("structure_verified", False))
    expect_contract_failure("audit.figure_refs_verified", lambda row: row["audit"].__setitem__("figure_refs_verified", False))

    print("PASS_UNIFIED_PARENT_CONTRACT_RUNTIME_FAIL_CLOSED_GATE")


if __name__ == "__main__":
    main()
