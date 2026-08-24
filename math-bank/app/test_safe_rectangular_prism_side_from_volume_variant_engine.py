from safe_rectangular_prism_side_from_volume_variant_engine import can_generate, generate

def p(**kw):
    row={"id":"P-RP-SIDE","question":"たて4cm、高さ5cm、体積が120cm³の直方体のよこを求めなさい。","answer":"6cm","choices":None,"figure_refs":[]}
    row.update(kw); return row

def main():
    assert can_generate(p())[0]
    rows,ev,_=generate(p(),3); assert len(rows)==len(ev)==3
    assert len({tuple(r["numeric_signature"]) for r in rows})==3
    for r,e in zip(rows,ev): assert r["answer"].endswith("cm") and "PASS" in e["independent_check"]
    rev=p(question="よこ6cm、高さ5cm、体積が120cm³の直方体のたてを求めなさい。",answer="4cm")
    assert can_generate(rev)[0]
    bad=[p(answer="7cm"),p(figure_refs=["x.svg"]),p(choices=["6cm"]),p(question="たて4cm、高さ5cm、体積が122cm³の直方体のよこを求めなさい。",answer="6cm")]
    for x in bad:
        assert not can_generate(x)[0]; assert generate(x,1)[0]==[]
    print("PASS_SAFE_RECTANGULAR_PRISM_SIDE_FROM_VOLUME_VARIANT_ENGINE")
if __name__=="__main__": main()
