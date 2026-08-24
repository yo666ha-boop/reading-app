from safe_square_root_like_terms_variant_engine import generate

def p(q,a,choices=None,fig=None): return {"id":"P-ROOT-LIKE","question":q,"answer":a,"choices":choices,"figure_refs":[] if fig is None else fig}

def main():
    rows,evidence,reason=generate(p("2√3+5√3を計算しなさい。","7√3"),3)
    assert reason=="square_root_like_terms_exact" and len(rows)==len(evidence)==3
    assert len({tuple(r["numeric_signature"]) for r in rows})==3
    for ev in evidence: assert ev["independent_check"].endswith("PASS")
    rows2,_,reason2=generate(p("7√5-2√5を計算しなさい。","5√5"),2)
    assert reason2=="square_root_like_terms_exact" and len(rows2)==2
    assert generate(p("2√3+5√2を計算しなさい。","2√3+5√2"),1)[0]==[]
    assert generate(p("2√12+5√12を計算しなさい。","7√12"),1)[0]==[]
    assert generate(p("2√3+5√3を計算しなさい。","8√3"),1)[0]==[]
    assert generate(p("2√3+5√3を計算しなさい。","7√3",choices=["7√3","3√3"]),1)[0]==[]
    print("PASS_SAFE_SQUARE_ROOT_LIKE_TERMS_VARIANT_ENGINE")
if __name__=="__main__": main()
