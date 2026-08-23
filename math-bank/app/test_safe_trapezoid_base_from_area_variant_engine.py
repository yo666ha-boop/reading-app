from safe_trapezoid_base_from_area_variant_engine import can_generate, generate


def p(**kw):
    row={"id":"P-TRAP-B","question":"上底6cm、高さ8cm、面積64cm²の台形の下底を求めなさい。","answer":"10cm","choices":None,"figure_refs":[]}
    row.update(kw); return row


def main():
    ok,reason=can_generate(p()); assert ok and reason=="trapezoid_base_from_area_exact"
    rows,ev,_=generate(p(),3); assert len(rows)==len(ev)==3
    assert len({tuple(r["numeric_signature"]) for r in rows})==3
    for r,e in zip(rows,ev):
        assert r["answer"].endswith("cm") and "下底" in r["question"]
        assert "PASS" in e["independent_check"]
    upper=p(question="下底10cm、高さ8cm、面積64cm²の台形の上底を求めなさい。",answer="6cm")
    assert can_generate(upper)[0]
    bad=[p(answer="9cm"),p(choices=[]),p(figure_refs=["x.svg"]),p(question="上底6cm、高さ7cm、面積50cm²の台形の下底を求めなさい。",answer="8cm")]
    for x in bad:
        assert not can_generate(x)[0]
        assert generate(x,1)[0]==[]
    print("PASS_SAFE_TRAPEZOID_BASE_FROM_AREA_VARIANT_ENGINE")

if __name__=="__main__": main()
