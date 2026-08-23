from safe_base_from_amount_percent_variant_engine import can_generate, generate


def parent(**overrides):
    row={"id":"P-PCT-BASE-001","question":"20%にあたる160円があります。もとの金額はいくらですか。","answer":"800円","figure_refs":[],"choices":None}
    row.update(overrides); return row


def main():
    ok,reason=can_generate(parent()); assert ok and reason=="base_from_amount_percent_integer_exact"
    ok,_=can_generate(parent(choices=[])); assert ok
    rows,evidence,_=generate(parent(),3)
    assert len(rows)==len(evidence)==3
    assert len({tuple(r["numeric_signature"]) for r in rows})==3
    for r,e in zip(rows,evidence):
        assert r["answer"].endswith("円")
        assert "PASS" in e["independent_check"]
    bad=[
        parent(answer="700円"),
        parent(figure_refs=["fig.svg"]),
        parent(choices=["800円","900円"]),
        parent(question="20%値引きして160円安くなりました。もとの金額はいくらですか。",answer="800円"),
        parent(question="30%にあたる100円があります。もとの金額はいくらですか。",answer="333円"),
    ]
    for x in bad:
        ok,_=can_generate(x); assert not ok
        rr,ee,_=generate(x,1); assert rr==[] and ee==[]
    print("PASS_SAFE_BASE_FROM_AMOUNT_PERCENT_VARIANT_ENGINE")

if __name__=="__main__": main()
