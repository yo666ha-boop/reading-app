from safe_prime_factorization_variant_engine import can_generate, generate


def parent(**overrides):
    row = {
        "id": "P-PRIME-FACTOR-001",
        "question": "84を素因数分解しなさい。",
        "answer": "2^2×3×7",
        "figure_refs": [],
        "choices": None,
    }
    row.update(overrides)
    return row


def main() -> None:
    ok, reason = can_generate(parent())
    assert ok and reason == "single_composite_integer_prime_factorization_exact"
    empty = parent(choices=[])
    ok, _ = can_generate(empty)
    assert ok

    rows, evidence, reason = generate(parent(), 3)
    assert reason == "single_composite_integer_prime_factorization_exact"
    assert len(rows) == len(evidence) == 3
    assert len({row["question"] for row in rows}) == 3
    assert all("素因数分解" in row["question"] for row in rows)
    assert all("PASS" in ev["independent_check"] for ev in evidence)
    assert all("prime_factors_all_prime" in ev["method"] for ev in evidence)

    bad = [
        parent(answer="2×3×7"),
        parent(answer="4×3×7"),
        parent(question="83を素因数分解しなさい。", answer="83"),
        parent(question="84と126を素因数分解しなさい。", answer="2^2×3×7"),
        parent(question="84の約数の個数を求めなさい。", answer="12"),
        parent(question="84と126の最大公約数を求めなさい。", answer="42"),
        parent(figure_refs=["fig.svg"]),
        parent(choices=["2^2×3×7", "2×3×14"]),
    ]
    for row in bad:
        ok, _ = can_generate(row)
        assert not ok
        generated, ev, _ = generate(row, 1)
        assert generated == [] and ev == []

    print("PASS_SAFE_PRIME_FACTORIZATION_VARIANT_ENGINE")


if __name__ == "__main__":
    main()
