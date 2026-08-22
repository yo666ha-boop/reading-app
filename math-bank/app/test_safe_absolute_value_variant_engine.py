from safe_absolute_value_variant_engine import can_generate, generate


def parent(**overrides):
    row = {
        "id": "P-ABS-001",
        "question": "-7の絶対値を求めなさい。",
        "answer": "7",
        "figure_refs": [],
        "choices": None,
    }
    row.update(overrides)
    return row


def main() -> None:
    ok, reason = can_generate(parent())
    assert ok and reason == "single_integer_absolute_value_exact"
    empty_choices = parent(choices=[])
    ok, _ = can_generate(empty_choices)
    assert ok
    rows, evidence, _ = generate(parent(), 3)
    assert len(rows) == len(evidence) == 3
    assert len({row["question"] for row in rows}) == 3
    assert all(int(row["answer"]) >= 0 for row in rows)
    assert all("PASS" in ev["independent_check"] for ev in evidence)

    bad = [
        parent(answer="-7"),
        parent(choices=["7", "-7"]),
        parent(figure_refs=["number-line.svg"]),
        parent(question="-7と3の絶対値を比べなさい。", answer="7"),
        parent(question="数直線で-7の絶対値を求めなさい。", answer="7"),
        parent(question="-7と3の差の絶対値を求めなさい。", answer="10"),
        parent(question="xの絶対値を求めなさい。", answer="7"),
    ]
    for row in bad:
        ok, _ = can_generate(row)
        assert not ok
        generated, ev, _ = generate(row, 1)
        assert generated == [] and ev == []

    print("PASS_SAFE_ABSOLUTE_VALUE_VARIANT_ENGINE")


if __name__ == "__main__":
    main()
