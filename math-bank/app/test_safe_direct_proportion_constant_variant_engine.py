from safe_direct_proportion_constant_variant_engine import can_generate, generate


def parent(**overrides):
    row={"id":"P-DP-CONST-001","question":"yはxに比例し、x=3のときy=12です。比例定数aを求めなさい。","answer":"a=4","figure_refs":[],"choices":None}
    row.update(overrides); return row


def main():
    ok,reason=can_generate(parent()); assert ok and reason=="direct_proportion_constant_exact"
    ok,_=can_generate(parent(choices=[])); assert ok
    rows,evidence,_=generate(parent(),3)
    assert len(rows)==len(evidence)==3
    assert len({tuple(r["numeric_signature"]) for r in rows})==3
    for r,e in zip(rows,evidence):
        assert r["answer"].startswith("a=")
        assert "PASS" in e["independent_check"]
    bad=[
        parent(answer="a=5"),
        parent(question="yはxに反比例し、x=3のときy=12です。比例定数aを求めなさい。",answer="a=36"),
        parent(question="yはxに比例し、x=0のときy=0です。比例定数aを求めなさい。",answer="a=0"),
        parent(figure_refs=["fig.svg"]),
        parent(choices=["3","4"]),
    ]
    for p in bad:
        ok,_=can_generate(p); assert not ok
        rows,ev,_=generate(p,1); assert rows==[] and ev==[]
    print("PASS_SAFE_DIRECT_PROPORTION_CONSTANT_VARIANT_ENGINE")

if __name__=="__main__": main()
