from safe_two_dice_sum_probability_variant_engine import can_generate, generate


def parent(**overrides):
    row = {
        "id": "P-TWO-DICE-SUM-001",
        "question": "2個のサイコロを同時に投げるとき、出た目の和が7になる確率を求めなさい。",
        "answer": "1/6",
        "figure_refs": [],
        "choices": None,
    }
    row.update(overrides)
    return row


def main() -> None:
    ok, reason = can_generate(parent())
    assert ok and reason == "two_fair_dice_sum_exact_36_outcomes"
    ok, _ = can_generate(parent(choices=[]))
    assert ok

    rows, evidence, reason = generate(parent(), 3)
    assert reason == "two_fair_dice_sum_exact_36_outcomes"
    assert len(rows) == len(evidence) == 3
    questions = {row["question"] for row in rows}
    assert len(questions) == 3
    assert all("和が7になる" not in q for q in questions)
    assert len({tuple(row["numeric_signature"]) for row in rows}) == 3
    for row, ev in zip(rows, evidence):
        assert "/" in row["answer"] or row["answer"] in ("0", "1")
        assert "PASS" in ev["independent_check"]
        assert ev["method"] == "two_fair_dice_sum_exhaustive_36_and_triangular_identity"

    bad = [
        parent(answer="1/5"),
        parent(question="2個のサイコロを同時に投げるとき、出た目の和が13になる確率を求めなさい。", answer="0"),
        parent(question="2個のサイコロを同時に投げるとき、出た目の積が6になる確率を求めなさい。", answer="1/9"),
        parent(question="3個のサイコロを同時に投げるとき、出た目の和が7になる確率を求めなさい。", answer="1/6"),
        parent(question="2個のサイコロを同時に投げるとき、出た目の和が7以上になる確率を求めなさい。", answer="7/12"),
        parent(figure_refs=["dice.svg"]),
        parent(choices=["1/6", "1/5"]),
    ]
    for row in bad:
        ok, _ = can_generate(row)
        assert not ok
        generated, ev, _ = generate(row, 1)
        assert generated == [] and ev == []

    print("PASS_SAFE_TWO_DICE_SUM_PROBABILITY_VARIANT_ENGINE")


if __name__ == "__main__":
    main()
