from safe_integer_power_variant_engine import can_generate, generate


def parent(**overrides):
    row = {
        "id": "P-POWER-001",
        "question": "(-3)^4を計算しなさい。",
        "answer": "81",
        "figure_refs": [],
        "choices": None,
    }
    row.update(overrides)
    return row


def main() -> None:
    ok, reason = can_generate(parent())
    assert ok and reason == "single_integer_power_evaluation_exact"
    ok, _ = can_generate(parent(question="5³の値を求めなさい。", answer="125", choices=[]))
    assert ok
    rows, evidence, _ = generate(parent(), 3)
    assert len(rows) == len(evidence) == 3
    sigs = {tuple(row["numeric_signature"]) for row in rows}
    assert len(sigs) == 3
    assert ("-3", "4") not in sigs
    for row, ev in zip(rows, evidence):
        assert row["answer"].lstrip("-").isdigit()
        assert "repeated_product" in ev["independent_check"]
        assert "PASS" in ev["independent_check"]

    bad = [
        parent(answer="-81"),
        parent(question="-3^4を計算しなさい。", answer="-81"),
        parent(question="(-3)^4+2を計算しなさい。", answer="83"),
        parent(question="x^4を計算しなさい。", answer="x^4"),
        parent(question="2^0を計算しなさい。", answer="1"),
        parent(question="√81の値を求めなさい。", answer="9"),
        parent(figure_refs=["fig-1.svg"]),
        parent(choices=["81", "-81"]),
    ]
    for row in bad:
        ok, _ = can_generate(row)
        assert not ok
        generated, ev, _ = generate(row, 1)
        assert generated == [] and ev == []

    print("PASS_SAFE_INTEGER_POWER_VARIANT_ENGINE")


if __name__ == "__main__":
    main()
