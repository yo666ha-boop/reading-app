from safe_discount_price_variant_engine import can_generate, generate


def parent(**overrides):
    row={"id":"P-DISCOUNT-001","question":"定価1200円の商品を25%引きで買います。代金は何円ですか。","answer":"900円","figure_refs":[],"choices":None}
    row.update(overrides); return row


def reverse_parent(**overrides):
    row={"id":"P-DISCOUNT-REV-001","question":"25%引きで900円になりました。定価は何円ですか。","answer":"1200円","figure_refs":[],"choices":None}
    row.update(overrides); return row


def main() -> None:
    for choices in (None, []):
        p=parent(choices=choices); ok,reason=can_generate(p); assert ok and reason=="discount_final_price_integer_yen_exact"
        rows,evidence,_=generate(p,3); assert len(rows)==len(evidence)==3
        sigs={tuple(row["numeric_signature"]) for row in rows}; assert len(sigs)==3 and ("1200","25") not in sigs
        for row,ev in zip(rows,evidence):
            assert row["answer"].endswith("円") and "%引き" in row["question"]
            assert ev["method"]=="discount_final_price_exact_fraction_and_cross_multiply" and "PASS" in ev["independent_check"]

    ok,reason=can_generate(reverse_parent()); assert ok and reason=="discount_original_price_integer_yen_exact"
    rows,evidence,reason=generate(reverse_parent(),3); assert reason=="discount_original_price_integer_yen_exact" and len(rows)==len(evidence)==3
    assert len({tuple(row["numeric_signature"]) for row in rows})==3
    assert all("定価は何円" in row["question"] for row in rows)
    assert all(ev["method"]=="discount_original_price_exact_fraction_and_cross_multiply" and "PASS" in ev["independent_check"] for ev in evidence)

    bad=[
        parent(answer="901円"), parent(figure_refs=["fig-1.svg"]), parent(choices=["800円","900円"]),
        parent(question="定価1200円の商品を25%引きで買い、さらに10%引きにします。代金は何円ですか。",answer="810円"),
        parent(question="定価1200円の商品を25%引きで買います。税込の代金は何円ですか。",answer="900円"),
        parent(question="定価1200円の商品を何%引きにすると900円ですか。",answer="25円"),
        parent(question="定価1234円の商品を25%引きで買います。代金は何円ですか。",answer="925円"),
        reverse_parent(answer="1199円"),
        reverse_parent(question="25%引きで901円になりました。定価は何円ですか。",answer="1201円"),
        reverse_parent(question="25%引きで900円になり、さらに10%引きにします。定価は何円ですか。",answer="1200円"),
        reverse_parent(question="25%引きで900円になりました。税込の定価は何円ですか。",answer="1200円"),
        reverse_parent(figure_refs=["fig.svg"]), reverse_parent(choices=["1200円"]),
    ]
    for row in bad:
        assert not can_generate(row)[0]
        rows,evidence,_=generate(row,1); assert rows==[] and evidence==[]
    print("PASS_SAFE_DISCOUNT_PRICE_VARIANT_ENGINE")

if __name__=="__main__": main()
