from safe_quadratic_square_equation_variant_engine import can_generate, generate


def parent(**overrides):
    row = {
        "id": "P-QUAD-SQ-001",
        "question": "方程式 x²=49 を解きなさい。",
        "answer": "x=±7",
        "figure_refs": [],
        "choices": None,
    }
    row.update(overrides)
    return row


def main() -> None:
    ok, reason = can_generate(parent())
    assert ok and reason == "quadratic_x_squared_equals_perfect_square_exact"
    empty = parent(choices=[])
    ok, _ = can_generate(empty)
    assert ok

    rows, evidence, reason = generate(parent(), 3)
    assert reason == "quadratic_x_squared_equals_perfect_square_exact"
    assert len(rows) == len(evidence) == 3
    assert len({row["question"] for row in rows}) == 3
    assert all(row["answer"].startswith("x=±") for row in rows)
    assert all("both_roots_square_to_" in ev["independent_check"] for ev in evidence)

    alt = parent(answer="7,-7")
    ok, _ = can_generate(alt)
    assert ok

    bad = [
        parent(answer="x=7"),
        parent(question="方程式 x²=50 を解きなさい。", answer="x=±7"),
        parent(question="方程式 x²=0 を解きなさい。", answer="x=0"),
        parent(question="方程式 x²-49=0 を解きなさい。", answer="x=±7"),
        parent(question="x²=49 のグラフをかきなさい。", answer="x=±7"),
        parent(figure_refs=["fig.svg"]),
        parent(choices=["±7", "7"]),
    ]
    for row in bad:
        ok, _ = can_generate(row)
        assert not ok
        generated, ev, _ = generate(row, 1)
        assert generated == [] and ev == []

    print("PASS_SAFE_QUADRATIC_SQUARE_EQUATION_VARIANT_ENGINE")


if __name__ == "__main__":
    main()
