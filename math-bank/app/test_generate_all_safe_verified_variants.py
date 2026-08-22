from __future__ import annotations

import copy

from generate_all_safe_verified_variants import generation_request, generate_parent, manual_queue_entry
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


def _assert_manual_task(parent: dict, reason: str, missing: int) -> None:
    task = manual_queue_entry(parent, missing_count=missing, reason=reason)
    assert task["parent_id"] == parent["id"]
    assert task["parent_record_sha256"] == parent_record_sha256(parent)
    assert task["missing_verified_variants"] == missing
    assert task["reason"] == reason
    assert "question" not in task and "answer" not in task
    assert "generated" not in task


def main() -> None:
    assert generation_request(0, minimum_per_parent=1, safe_target_per_parent=3) == (3, 1)
    assert generation_request(1, minimum_per_parent=1, safe_target_per_parent=3) == (2, 0)
    assert generation_request(2, minimum_per_parent=1, safe_target_per_parent=3) == (1, 0)
    assert generation_request(3, minimum_per_parent=1, safe_target_per_parent=3) == (0, 0)
    try:
        generation_request(0, minimum_per_parent=2, safe_target_per_parent=1)
        raise AssertionError("safe target below minimum must fail")
    except ValueError:
        pass

    base = make_base()
    template = base[0]

    affine = _parent(template, pid="U-AFF", question="一次関数 y=2x+3 で x=4 のときの y を求めなさい。", answer="y=11")
    _assert_generated(affine, "affine")

    square_root = _parent(template, pid="U-SQRT", question="√72を簡単にしなさい。", answer="6√2")
    _assert_generated(square_root, "square_root_simplification")
    square_root_empty_choices = copy.deepcopy(square_root)
    square_root_empty_choices["choices"] = []
    _assert_generated(square_root_empty_choices, "square_root_simplification")

    probability = _parent(template, pid="U-PROB", question="赤玉が3個、白玉が2個入っている袋から、玉を1個取り出すとき、赤玉が出る確率を求めなさい。", answer="3/5")
    _assert_generated(probability, "single_draw_probability")

    proportion = _parent(template, pid="U-RATIO", question="比例式 4:3=8:x の x を求めなさい。", answer="x=6")
    _assert_generated(proportion, "proportion")

    percentage = _parent(template, pid="U-PCT", question="1200円の25%は何円ですか。", answer="300円")
    _assert_generated(percentage, "percentage")

    average = _parent(template, pid="U-AVG", question="12、15、18の平均を求めなさい。", answer="15")
    _assert_generated(average, "simple_average")

    rectangle = _parent(template, pid="U-RECT", question="たて4cm、横6cmの長方形の面積を求めなさい。", answer="24cm²")
    _assert_generated(rectangle, "rectangle_area")

    triangle = _parent(template, pid="U-TRI", question="底辺8cm、高さ6cmの三角形の面積を求めなさい。", answer="24cm²")
    _assert_generated(triangle, "triangle_area")

    parallelogram = _parent(template, pid="U-PARA", question="底辺8cm、高さ5cmの平行四辺形の面積を求めなさい。", answer="40cm²")
    _assert_generated(parallelogram, "parallelogram_area")

    arithmetic = _parent(template, pid="U-ARITH", question="(-3)+8 を計算しなさい。", answer="5")
    rows, prov, reason = generate_parent(arithmetic, 2, NOW)
    assert len(rows) == len(prov) == 2 and reason == "legacy:binary_arithmetic_exact"

    equation = _parent(template, pid="U-EQ", question="方程式 2x+3=11 を解きなさい。", answer="x=4")
    rows, prov, reason = generate_parent(equation, 2, NOW)
    assert len(rows) == len(prov) == 2 and reason == "legacy:linear_equation_exact"

    wrong = copy.deepcopy(percentage)
    wrong["answer"] = "301円"
    rows, prov, reason = generate_parent(wrong, 1, NOW)
    assert rows == [] and prov == [] and reason.startswith("unsupported_all_safe_engines:")
    _assert_manual_task(wrong, reason, 1)

    bad_sqrt = copy.deepcopy(square_root)
    bad_sqrt["answer"] = "3√8"
    rows, prov, reason = generate_parent(bad_sqrt, 1, NOW)
    assert rows == [] and prov == [] and "square_root_parent_not_exactly_parsed_and_verified" in reason

    rectangle_wrong = copy.deepcopy(rectangle)
    rectangle_wrong["answer"] = "25cm²"
    rows, prov, reason = generate_parent(rectangle_wrong, 1, NOW)
    assert rows == [] and prov == [] and "rectangle_area_parent_not_exactly_parsed_and_verified" in reason

    rectangle_perimeter = copy.deepcopy(rectangle)
    rectangle_perimeter["question"] = "たて4cm、横6cmの長方形の周の長さを求めなさい。"
    rectangle_perimeter["answer"] = "20cm"
    rows, prov, reason = generate_parent(rectangle_perimeter, 1, NOW)
    assert len(rows) == len(prov) == 1
    assert reason.startswith("specialized:rectangle_perimeter:")
    assert rows[0]["source"]["parent_id"] == rectangle_perimeter["id"]
    assert prov[0]["parent_record_sha256"] == parent_record_sha256(rectangle_perimeter)
    assert prov[0]["independent_recalculation"] is True
    assert "engine=rectangle_perimeter" in prov[0]["verification_evidence"]

    rectangle_mixed = copy.deepcopy(rectangle)
    rectangle_mixed["question"] = "たて4cm、横6mの長方形の面積を求めなさい。"
    rectangle_mixed["answer"] = "2400cm²"
    rows, prov, reason = generate_parent(rectangle_mixed, 1, NOW)
    assert rows == [] and prov == [] and "rectangle_area_parent_not_exactly_parsed_and_verified" in reason

    triangle_wrong = copy.deepcopy(triangle)
    triangle_wrong["answer"] = "25cm²"
    rows, prov, reason = generate_parent(triangle_wrong, 1, NOW)
    assert rows == [] and prov == [] and "triangle_area_parent_not_exactly_parsed_and_verified" in reason

    triangle_odd = copy.deepcopy(triangle)
    triangle_odd["question"] = "底辺5cm、高さ3cmの三角形の面積を求めなさい。"
    triangle_odd["answer"] = "7.5cm²"
    rows, prov, reason = generate_parent(triangle_odd, 1, NOW)
    assert rows == [] and prov == [] and "triangle_area_parent_not_exactly_parsed_and_verified" in reason

    triangle_mixed = copy.deepcopy(triangle)
    triangle_mixed["question"] = "底辺8cm、高さ6mの三角形の面積を求めなさい。"
    triangle_mixed["answer"] = "2400cm²"
    rows, prov, reason = generate_parent(triangle_mixed, 1, NOW)
    assert rows == [] and prov == [] and "triangle_area_parent_not_exactly_parsed_and_verified" in reason

    parallelogram_wrong = copy.deepcopy(parallelogram)
    parallelogram_wrong["answer"] = "41cm²"
    rows, prov, reason = generate_parent(parallelogram_wrong, 1, NOW)
    assert rows == [] and prov == [] and "parallelogram_area_parent_not_exactly_parsed_and_verified" in reason

    parallelogram_perimeter = copy.deepcopy(parallelogram)
    parallelogram_perimeter["question"] = "底辺8cm、高さ5cmの平行四辺形の周の長さを求めなさい。"
    parallelogram_perimeter["answer"] = "26cm"
    rows, prov, reason = generate_parent(parallelogram_perimeter, 1, NOW)
    assert rows == [] and prov == [] and "parallelogram_area_parent_not_exactly_parsed_and_verified" in reason

    parallelogram_mixed = copy.deepcopy(parallelogram)
    parallelogram_mixed["question"] = "底辺8cm、高さ5mの平行四辺形の面積を求めなさい。"
    parallelogram_mixed["answer"] = "4000cm²"
    rows, prov, reason = generate_parent(parallelogram_mixed, 1, NOW)
    assert rows == [] and prov == [] and "parallelogram_area_parent_not_exactly_parsed_and_verified" in reason

    figure = copy.deepcopy(average)
    figure["figure_refs"] = ["figures/unknown.png"]
    rows, prov, reason = generate_parent(figure, 1, NOW)
    assert rows == [] and prov == [] and "figure_parent" in reason
    _assert_manual_task(figure, reason, 1)
    task = manual_queue_entry(figure, missing_count=1, reason=reason)
    assert task["figure_refs"] == ["figures/unknown.png"]

    choice = copy.deepcopy(proportion)
    choice["choices"] = ["5", "6", "7", "8"]
    rows, prov, reason = generate_parent(choice, 2, NOW)
    assert rows == [] and prov == [] and "choice_parent" in reason
    _assert_manual_task(choice, reason, 2)
    task = manual_queue_entry(choice, missing_count=2, reason=reason)
    assert task["has_choices"] is True and task["choice_count"] == 4

    original_task = manual_queue_entry(figure, missing_count=1, reason="manual")
    changed = copy.deepcopy(figure)
    changed["answer"] = "16"
    changed_task = manual_queue_entry(changed, missing_count=1, reason="manual")
    assert original_task["parent_record_sha256"] != changed_task["parent_record_sha256"]

    print("PASS_UNIFIED_SAFE_VARIANT_ADAPTIVE_1_MINIMUM_3_SAFE_TARGET")
    print("PASS_UNIFIED_SAFE_VARIANT_SPECIALIZED_ENGINES_INCLUDING_SQUARE_ROOT")
    print("PASS_UNIFIED_SAFE_VARIANT_LEGACY_EXACT_FALLBACK")
    print("PASS_UNIFIED_SAFE_VARIANT_WRONG_ANSWER_GEOMETRY_MIXED_UNIT_FIGURE_CHOICE_FAIL_CLOSED")
    print("PASS_UNIFIED_SAFE_VARIANT_FINGERPRINT_BOUND_MANUAL_QUEUE")


if __name__ == "__main__":
    main()
