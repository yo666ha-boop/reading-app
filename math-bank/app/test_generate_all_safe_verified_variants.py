from __future__ import annotations

import copy

from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256

NOW = "2026-08-21T08:30:00Z"


def _parent(template: dict, *, pid: str, question: str, answer: str) -> dict:
    p = copy.deepcopy(template)
    p["id"] = pid
    p["question"] = question
    p["answer"] = answer
    p["choices"] = None
    p["figure_refs"] = []
    p["source"]["is_generated_variant"] = False
    p["source"]["parent_id"] = None
    p["variant_group"] = None
    return p


def _assert_generated(parent: dict, expected_engine: str) -> None:
    rows, prov, reason = generate_parent(parent, 3, NOW)
    assert len(rows) == len(prov) == 3, (expected_engine, reason)
    assert reason.startswith(f"specialized:{expected_engine}:")
    assert len({r["question"] for r in rows}) == 3
    assert all(r["question"] != parent["question"] for r in rows)
    assert all(r["source"]["parent_id"] == parent["id"] for r in rows)
    assert all(r["audit"]["problem_answer_verified"] is True for r in rows)
    expected_sha = parent_record_sha256(parent)
    for row, evidence in zip(rows, prov):
        assert evidence["variant_id"] == row["id"]
        assert evidence["parent_id"] == parent["id"]
        assert evidence["parent_record_sha256"] == expected_sha
        assert evidence["independent_recalculation"] is True
        assert evidence["verification_evidence"]
        assert evidence["generator"] == "generate_all_safe_verified_variants.py"


def main() -> None:
    base = make_base()
    template = base[0]

    affine = _parent(template, pid="U-AFF", question="一次関数 y=2x+3 で x=4 のときの y を求めなさい。", answer="y=11")
    _assert_generated(affine, "affine")

    probability = _parent(
        template,
        pid="U-PROB",
        question="赤玉が3個、白玉が2個入っている袋から、玉を1個取り出すとき、赤玉が出る確率を求めなさい。",
        answer="3/5",
    )
    _assert_generated(probability, "single_draw_probability")

    proportion = _parent(template, pid="U-RATIO", question="比例式 4:3=8:x の x を求めなさい。", answer="x=6")
    _assert_generated(proportion, "proportion")

    percentage = _parent(template, pid="U-PCT", question="1200円の25%は何円ですか。", answer="300円")
    _assert_generated(percentage, "percentage")

    average = _parent(template, pid="U-AVG", question="12、15、18の平均を求めなさい。", answer="15")
    _assert_generated(average, "simple_average")

    # Existing exact arithmetic / linear-equation generation remains available
    # as the final fallback rather than being displaced by specialized engines.
    arithmetic = _parent(template, pid="U-ARITH", question="(-3)+8 を計算しなさい。", answer="5")
    rows, prov, reason = generate_parent(arithmetic, 2, NOW)
    assert len(rows) == len(prov) == 2 and reason == "legacy:binary_arithmetic_exact"

    equation = _parent(template, pid="U-EQ", question="方程式 2x+3=11 を解きなさい。", answer="x=4")
    rows, prov, reason = generate_parent(equation, 2, NOW)
    assert len(rows) == len(prov) == 2 and reason == "legacy:linear_equation_exact"

    # Parent answer verification remains fail-closed through the unified path.
    wrong = copy.deepcopy(percentage)
    wrong["answer"] = "301円"
    rows, prov, reason = generate_parent(wrong, 1, NOW)
    assert rows == [] and prov == [] and reason.startswith("unsupported_all_safe_engines:")

    # Structural uncertainty remains manual: no figure or choice parent can be
    # auto-promoted merely because its visible text resembles a supported type.
    figure = copy.deepcopy(average)
    figure["figure_refs"] = ["figures/unknown.png"]
    rows, prov, reason = generate_parent(figure, 1, NOW)
    assert rows == [] and prov == [] and "figure_parent" in reason

    choice = copy.deepcopy(proportion)
    choice["choices"] = ["5", "6", "7", "8"]
    rows, prov, reason = generate_parent(choice, 1, NOW)
    assert rows == [] and prov == [] and "choice_parent" in reason

    print("PASS_UNIFIED_SAFE_VARIANT_ALL_SPECIALIZED_ENGINES")
    print("PASS_UNIFIED_SAFE_VARIANT_LEGACY_EXACT_FALLBACK")
    print("PASS_UNIFIED_SAFE_VARIANT_WRONG_ANSWER_FIGURE_CHOICE_FAIL_CLOSED")


if __name__ == "__main__":
    main()
