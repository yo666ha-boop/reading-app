from safe_fraction_arithmetic_variant_engine import can_generate, generate


def parent(**overrides):
    row = {
        "id": "P-FRAC-001",
        "question": "1/2+1/3を計算しなさい。",
        "answer": "5/6",
        "figure_refs": [],
        "choices": None,
    }
    row.update(overrides)
    return row


def main() -> None:
    ok, reason = can_generate(parent())
    assert ok and reason == "binary_fraction_arithmetic_exact"
    ok, _ = can_generate(parent(choices=[]))
    assert ok
    for q, a in (
        ("3/4-1/6を計算しなさい。", "7/12"),
        ("2/3×3/5を計算しなさい。", "2/5"),
        ("2/3÷4/5を計算しなさい。", "5/6"),
    ):
        ok, _ = can_generate(parent(question=q, answer=a))
        assert ok

    rows, evidence, _ = generate(parent(), 3)
    assert len(rows) == len(evidence) == 3
    assert len({row["question"] for row in rows}) == 3
    assert len({tuple(row["numeric_signature"]) for row in rows}) == 3
    for row, ev in zip(rows, evidence):
        assert row["answer"]
        assert "/" in row["question"]
        assert "PASS" in ev["independent_check"]

    bad = [
        parent(answer="4/6"),
        parent(figure_refs=["fig.svg"]),
        parent(choices=["1/2", "5/6"]),
        parent(question="1/2+1/3+1/4を計算しなさい。", answer="13/12"),
        parent(question="0.5+1/3を計算しなさい。", answer="5/6"),
        parent(question="1/2+x=1を解きなさい。", answer="x=1/2"),
        parent(question="2/1+1/3を計算しなさい。", answer="7/3"),
    ]
    for row in bad:
        ok, _ = can_generate(row)
        assert not ok
        generated, ev, _ = generate(row, 1)
        assert generated == [] and ev == []

    print("PASS_SAFE_FRACTION_ARITHMETIC_VARIANT_ENGINE")


if __name__ == "__main__":
    main()
