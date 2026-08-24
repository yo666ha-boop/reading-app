from safe_tax_inclusive_price_variant_engine import can_generate, generate


def parent(**overrides):
    row={"id":"P-TAX-001","question":"1200円の商品に消費税10%を加えた税込みの代金を求めなさい。","answer":"1320円","figure_refs":[],"choices":None}
    row.update(overrides); return row


def reverse_parent(**overrides):
    row={"id":"P-TAX-REV-001","question":"税込み1320円、消費税10%の商品です。税抜き価格を求めなさい。","answer":"1200円","figure_refs":[],"choices":None}
    row.update(overrides); return row


def main():
    ok,reason=can_generate(parent()); assert ok and reason=="tax_inclusive_yen_exact"
    rows,evidence,_=generate(parent(),3); assert len(rows)==len(evidence)==3
    assert len({tuple(r["numeric_signature"]) for r in rows})==3
    for row,ev in zip(rows,evidence):
        assert row["answer"].endswith("円")
        assert "消費税" in row["question"]
        assert "PASS" in ev["independent_check"]

    ok,reason=can_generate(reverse_parent()); assert ok and reason=="tax_exclusive_from_inclusive_yen_exact"
    rows,evidence,reason=generate(reverse_parent(),3)
    assert reason=="tax_exclusive_from_inclusive_yen_exact"
    assert len(rows)==len(evidence)==3
    assert len({tuple(r["numeric_signature"]) for r in rows})==3
    assert all("税抜き価格" in r["question"] for r in rows)
    assert all(r["answer"].endswith("円") for r in rows)
    assert all("PASS" in ev["independent_check"] for ev in evidence)

    empty=parent(choices=[]); assert can_generate(empty)[0]; assert len(generate(empty,1)[0])==1
    bad=[
        parent(answer="1319円"),
        parent(figure_refs=["f.svg"]),
        parent(choices=["1200円","1320円"]),
        parent(question="1200円の商品を10%引きで買いました。代金を求めなさい。",answer="1080円"),
        parent(question="1234円の商品に消費税10%を加えた税込みの代金を求めなさい。",answer="1357円"),
        parent(question="1200円の商品に消費税10%を加え、1円未満を四捨五入した代金を求めなさい。",answer="1320円"),
        reverse_parent(answer="1199円"),
        reverse_parent(question="税込み1321円、消費税10%の商品です。税抜き価格を求めなさい。",answer="1201円"),
        reverse_parent(question="税込み1320円、消費税10%の商品をさらに10%引きします。税抜き価格を求めなさい。",answer="1200円"),
        reverse_parent(question="税込み1320円、消費税10%の商品です。1円未満を四捨五入して税抜き価格を求めなさい。",answer="1200円"),
        reverse_parent(figure_refs=["f.svg"]),
        reverse_parent(choices=["1100円","1200円"]),
    ]
    for b in bad:
        assert not can_generate(b)[0]
        rows,ev,_=generate(b,1); assert rows==[] and ev==[]
    print("PASS_SAFE_TAX_INCLUSIVE_PRICE_VARIANT_ENGINE")

if __name__=="__main__": main()
