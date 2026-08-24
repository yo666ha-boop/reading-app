from safe_square_root_quotient_variant_engine import generate

def p(q,a,choices=None,fig=None): return {"id":"P-ROOT-QUOT","question":q,"answer":a,"choices":choices,"figure_refs":[] if fig is None else fig}

def main():
    rows,evidence,reason=generate(p("√18÷√2を計算しなさい。","3"),3)
    assert reason=="square_root_quotient_integer_exact" and len(rows)==len(evidence)==3
    assert len({tuple(r["numeric_signature"]) for r in rows})==3
    for ev in evidence: assert ev["independent_check"].endswith("PASS")
    assert generate(p("√12÷√2を計算しなさい。","√6"),1)[0]==[]
    assert generate(p("√18÷√2を計算しなさい。","4"),1)[0]==[]
    assert generate(p("√18×√2を計算しなさい。","6"),1)[0]==[]
    assert generate(p("√18÷√2を計算しなさい。","3",choices=["3","4"]),1)[0]==[]
    print("PASS_SAFE_SQUARE_ROOT_QUOTIENT_VARIANT_ENGINE")
if __name__=="__main__": main()
