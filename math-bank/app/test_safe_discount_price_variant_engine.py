from safe_discount_price_variant_engine import can_generate, generate


def parent(**overrides):
    row = {
        "id": "P-DISCOUNT-001",
        "question": "定価1200円の商品を25%引きで買います。代金は何円ですか。",
        "answer": "900円",
        "figure_refs": [],
        "choices": None,
    }
    row.update(overrides)
    return row


def main() -> None:
    for choices in (None, []):
        p = parent(choices=choices)
        ok, reason = can_generate(p)
        assert ok and reason == "discount_final_price_integer_yen_exact"
        rows, evidence, _ = generate(p, 3)
        assert len(rows) == len(evidence) == 3
        sigs = {tuple(row["numeric_signature"]) for row in rows}
        assert len(sigs) == 3
        assert ("1200", "25") not in sigs
        for row, ev in zip(rows, evidence):
            assert row["answer"].endswith("円")
            assert "%引き" in row["question"]
            assert ev["method"] == "discount_final_price_exact_fraction_and_cross_multiply"
            assert "PASS" in ev["independent_check"]

    bad = [
        parent(answer="901円"),
        parent(figure_refs=["fig-1.svg"]),
        parent(choices=["800円", "900円"]),
        parent(question="定価1200円の商品を25%引きで買い、さらに10%引きにします。代金は何円ですか。", answer="810円"),
        parent(question="定価1200円の商品を25%引きで買います。税込の代金は何円ですか。", answer="900円"),
        parent(question="定価1200円の商品を何%引きにすると900円ですか。", answer="25円"),
        parent(question="定価1234円の商品を25%引きで買います。代金は何円ですか。", answer="925円"),
    ]
    for row in bad:
        ok, _ = can_generate(row)
        assert not ok
        rows, evidence, _ = generate(row, 1)
        assert rows == [] and evidence == []

    print("PASS_SAFE_DISCOUNT_PRICE_VARIANT_ENGINE")


if __name__ == "__main__":
    main()
