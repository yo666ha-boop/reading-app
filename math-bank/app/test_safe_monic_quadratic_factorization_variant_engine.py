from safe_monic_quadratic_factorization_variant_engine import can_generate, generate


def parent(**overrides):
    row = {
        "id": "P-FACTOR-001",
        "question": "x²+5x+6を因数分解しなさい。",
        "answer": "(x+2)(x+3)",
        "figure_refs": [],
        "choices": None,
    }
    row.update(overrides)
    return row


def main() -> None:
    ok, reason = can_generate(parent())
    assert ok and reason == "monic_quadratic_integer_factorization_exact"
    ok, _ = can_generate(parent(choices=[]))
    assert ok

    neg = parent(question="x²-5x+6を因数分解しなさい。", answer="(x-2)(x-3)")
    ok, _ = can_generate(neg)
    assert ok

    rows, evidence, reason = generate(parent(), 3)
    assert reason == "monic_quadratic_integer_factorization_exact"
    assert len(rows) == len(evidence) == 3
    assert len({tuple(r["numeric_signature"]) for r in rows}) == 3
    assert all("因数分解" in r["question"] for r in rows)
    assert all("PASS" in ev["independent_check"] for ev in evidence)

    bad = [
        parent(answer="(x+1)(x+6)"),
        parent(figure_refs=["fig.svg"]),
        parent(choices=["(x+2)(x+3)", "(x+1)(x+6)"]),
        parent(question="x²+5x+6=0を解きなさい。", answer="x=-2,-3"),
        parent(question="x²+5x+6を展開しなさい。"),
        parent(question="2x²+5x+2を因数分解しなさい。", answer="(2x+1)(x+2)"),
    ]
    for row in bad:
        ok, _ = can_generate(row)
        assert not ok
        generated, ev, _ = generate(row, 1)
        assert generated == [] and ev == []

    print("PASS_SAFE_MONIC_QUADRATIC_FACTORIZATION_VARIANT_ENGINE")


if __name__ == "__main__":
    main()
