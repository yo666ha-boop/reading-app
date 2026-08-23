from safe_percent_from_amount_base_variant_engine import can_generate, generate


def parent(**overrides):
    row={"id":"P-PCT-RATE-001","question":"800円のうち200円は何%ですか。","answer":"25%","figure_refs":[],"choices":None}
    row.update(overrides); return row


def main():
    ok,reason=can_generate(parent()); assert ok and reason=="percent_from_amount_base_integer_exact"
    ok,_=can_generate(parent(choices=[])); assert ok
    rows,evidence,_=generate(parent(),3)
    assert len(rows)==len(evidence)==3
    assert len({tuple(r["numeric_signature"]) for r in rows})==3
    for r,e in zip(rows,evidence):
        assert r["answer"].endswith("%")
        assert "PASS" in e["independent_check"]
    bad=[
        parent(answer="24%"),
        parent(figure_refs=["fig.svg"]),
        parent(choices=["25%","50%"]),
        parent(question="800円から200円に減りました。何%減りましたか。",answer="75%"),
        parent(question="800円の商品を200円値引きしました。何%引きですか。",answer="25%"),
        parent(question="300円のうち100円は何%ですか。",answer="33%"),
    ]
    for x in bad:
        ok,_=can_generate(x); assert not ok
        rr,ee,_=generate(x,1); assert rr==[] and ee==[]
    print("PASS_SAFE_PERCENT_FROM_AMOUNT_BASE_VARIANT_ENGINE")

if __name__=="__main__": main()
