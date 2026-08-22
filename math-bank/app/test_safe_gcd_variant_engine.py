from safe_gcd_variant_engine import can_generate, generate


def parent(**overrides):
    row = {
        "id": "P-GCD-001",
        "question": "18と24の最大公約数を求めなさい。",
        "answer": "6",
        "figure_refs": [],
        "choices": None,
    }
    row.update(overrides)
    return row


def main() -> None:
    ok, reason = can_generate(parent())
    assert ok and reason == "two_positive_integer_gcd_exact"
    empty_choices = parent(choices=[])
    ok, _ = can_generate(empty_choices)
    assert ok

    rows, evidence, _ = generate(parent(), 3)
    assert len(rows) == len(evidence) == 3
    assert len({tuple(r["numeric_signature"]) for r in rows}) == 3
    assert ("18", "24") not in {tuple(r["numeric_signature"]) for r in rows}
    for row, ev in zip(rows, evidence):
        assert "最大公約数" in row["question"]
        assert int(row["answer"]) > 1
        assert ev["method"] == "two_integer_gcd_euclid_and_exhaustive_common_divisors"
        assert "PASS" in ev["independent_check"]

    bad = [
        parent(answer="12"),
        parent(question="18と25の最大公約数を求めなさい。", answer="1"),
        parent(question="18と24の最小公倍数を求めなさい。", answer="72"),
        parent(question="18と24の最大公約数と最小公倍数を求めなさい。", answer="6"),
        parent(question="18と24と30の最大公約数を求めなさい。", answer="6"),
        parent(question="18と24を素因数分解して最大公約数を求めなさい。", answer="6"),
        parent(figure_refs=["fig.svg"]),
        parent(choices=["3", "6", "12"]),
    ]
    for row in bad:
        ok, _ = can_generate(row)
        assert not ok
        generated, ev, _ = generate(row, 1)
        assert generated == [] and ev == []

    print("PASS_SAFE_GCD_VARIANT_ENGINE")


if __name__ == "__main__":
    main()
