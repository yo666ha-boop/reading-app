from safe_lcm_variant_engine import can_generate, generate


def parent(**overrides):
    row = {"id":"P-LCM-001","question":"12と18の最小公倍数を求めなさい。","answer":"36","figure_refs":[],"choices":None}
    row.update(overrides)
    return row


def main() -> None:
    ok, reason = can_generate(parent())
    assert ok and reason == "two_positive_integer_lcm_exact"
    ok, _ = can_generate(parent(choices=[]))
    assert ok
    rows, evidence, _ = generate(parent(), 3)
    assert len(rows) == len(evidence) == 3
    assert len({tuple(r["numeric_signature"]) for r in rows}) == 3
    assert ("12","18") not in {tuple(r["numeric_signature"]) for r in rows}
    for row, ev in zip(rows, evidence):
        assert "最小公倍数" in row["question"]
        assert int(row["answer"]) > 0
        assert ev["method"] == "two_integer_lcm_product_over_gcd_and_enumerated_common_multiples"
        assert "PASS" in ev["independent_check"]
    bad = [
        parent(answer="72"),
        parent(question="12と18の最大公約数を求めなさい。",answer="6"),
        parent(question="12と18の最大公約数と最小公倍数を求めなさい。",answer="36"),
        parent(question="12と18と24の最小公倍数を求めなさい。",answer="72"),
        parent(question="12と18を素因数分解して最小公倍数を求めなさい。",answer="36"),
        parent(figure_refs=["fig.svg"]),
        parent(choices=["18","36","72"]),
    ]
    for row in bad:
        ok, _ = can_generate(row)
        assert not ok
        generated, ev, _ = generate(row, 1)
        assert generated == [] and ev == []
    print("PASS_SAFE_LCM_VARIANT_ENGINE")


if __name__ == "__main__":
    main()
