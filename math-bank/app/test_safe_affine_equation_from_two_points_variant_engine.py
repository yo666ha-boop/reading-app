from safe_affine_equation_from_two_points_variant_engine import generate


def parent(question, answer, choices=None, figure_refs=None):
    return {
        "id": "P-AFF-2PT",
        "question": question,
        "answer": answer,
        "choices": choices,
        "figure_refs": [] if figure_refs is None else figure_refs,
    }


def main():
    p = parent("2点(1,3)、(3,7)を通る一次関数の式を求めなさい。", "y=2x+1")
    rows, evidence, reason = generate(p, 3)
    assert reason == "affine_equation_from_two_integer_points_exact"
    assert len(rows) == len(evidence) == 3
    assert len({tuple(r["numeric_signature"]) for r in rows}) == 3
    for row, ev in zip(rows, evidence):
        assert row["question"] != p["question"]
        assert row["answer"].startswith("y=")
        assert ev["parent_sha256"]
        assert ev["method"] == "affine_two_integer_points_exact_slope_intercept_and_forward_substitution"
        assert ev["independent_check"].endswith("PASS")

    bad_answer = parent("2点(1,3)、(3,7)を通る一次関数の式を求めなさい。", "y=2x+2")
    assert generate(bad_answer, 1)[0] == []
    vertical = parent("2点(1,3)、(1,7)を通る一次関数の式を求めなさい。", "y=2x+1")
    assert generate(vertical, 1)[0] == []
    fraction_slope = parent("2点(0,0)、(2,1)を通る一次関数の式を求めなさい。", "y=1/2x")
    assert generate(fraction_slope, 1)[0] == []
    figure = parent("2点(1,3)、(3,7)を通る一次関数の式を求めなさい。", "y=2x+1", figure_refs=["f1"])
    assert generate(figure, 1)[0] == []
    choices = parent("2点(1,3)、(3,7)を通る一次関数の式を求めなさい。", "y=2x+1", choices=["y=2x+1", "y=x+2"])
    assert generate(choices, 1)[0] == []
    graph = parent("グラフ上の2点(1,3)、(3,7)を通る一次関数の式を求めなさい。", "y=2x+1")
    assert generate(graph, 1)[0] == []
    print("PASS_SAFE_AFFINE_EQUATION_FROM_TWO_POINTS_VARIANT_ENGINE")


if __name__ == "__main__":
    main()
