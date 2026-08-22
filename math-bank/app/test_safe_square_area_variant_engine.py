from __future__ import annotations

import copy

from safe_square_area_variant_engine import generate
from test_expanded_variant_layer import make_base


def _parent() -> dict:
    p = copy.deepcopy(make_base()[0])
    p["id"] = "SQ-AREA"
    p["question"] = "1辺6cmの正方形の面積を求めなさい。"
    p["answer"] = "36cm²"
    p["choices"] = None
    p["figure_refs"] = []
    p["source"]["is_generated_variant"] = False
    p["source"]["parent_id"] = None
    p["variant_group"] = None
    return p


def main() -> None:
    for choices in (None, []):
        parent = _parent()
        parent["choices"] = choices
        rows, evidence, reason = generate(parent, 3)
        assert reason == "square_integer_cm_area_exact"
        assert len(rows) == len(evidence) == 3
        assert len({row["numeric_signature"] for row in rows}) == 3
        assert all(row["question"] != parent["question"] for row in rows)
        for row, ev in zip(rows, evidence):
            side = int(row["numeric_signature"][0])
            assert row["answer"] == f"{side * side}cm²"
            assert ev["independent_check"].endswith("PASS")

        perimeter = copy.deepcopy(parent)
        perimeter["id"] = "SQ-PERIM"
        perimeter["question"] = "1辺6cmの正方形の周の長さを求めなさい。"
        perimeter["answer"] = "24cm"
        rows, evidence, reason = generate(perimeter, 3)
        assert reason == "square_integer_cm_perimeter_exact"
        assert len(rows) == len(evidence) == 3
        assert len({row["numeric_signature"] for row in rows}) == 3
        assert all(row["question"] != perimeter["question"] for row in rows)
        for row, ev in zip(rows, evidence):
            side = int(row["numeric_signature"][0])
            assert row["answer"] == f"{side * 4}cm"
            assert ev["method"] == "square_perimeter_exact_quadruple_and_inverse_identity"
            assert ev["independent_check"].endswith("PASS")

    parent = _parent()
    wrong = copy.deepcopy(parent)
    wrong["answer"] = "35cm²"
    assert generate(wrong, 1)[0] == []

    wrong_perimeter = copy.deepcopy(parent)
    wrong_perimeter["question"] = "1辺6cmの正方形の周の長さを求めなさい。"
    wrong_perimeter["answer"] = "25cm"
    assert generate(wrong_perimeter, 1)[0] == []

    reverse = copy.deepcopy(parent)
    reverse["question"] = "面積36cm²の正方形の1辺の長さを求めなさい。"
    reverse["answer"] = "6cm"
    assert generate(reverse, 1)[0] == []

    mixed = copy.deepcopy(parent)
    mixed["question"] = "1辺6mの正方形の面積を求めなさい。"
    mixed["answer"] = "36m²"
    assert generate(mixed, 1)[0] == []

    both = copy.deepcopy(parent)
    both["question"] = "1辺6cmの正方形の面積と周の長さを求めなさい。"
    both["answer"] = "36cm²,24cm"
    assert generate(both, 1)[0] == []

    figure = copy.deepcopy(parent)
    figure["figure_refs"] = ["figures/square.png"]
    assert generate(figure, 1)[0] == []

    choice = copy.deepcopy(parent)
    choice["choices"] = ["24cm²", "30cm²", "36cm²", "42cm²"]
    assert generate(choice, 1)[0] == []

    print("PASS_SAFE_SQUARE_AREA_EXACT_PRODUCT_AND_INTEGER_SQRT_IDENTITY")
    print("PASS_SAFE_SQUARE_PERIMETER_EXACT_QUADRUPLE_AND_INVERSE_IDENTITY")
    print("PASS_SAFE_SQUARE_WRONG_REVERSE_MIXED_MULTIASK_FIGURE_REAL_CHOICE_FAIL_CLOSED")


if __name__ == "__main__":
    main()
