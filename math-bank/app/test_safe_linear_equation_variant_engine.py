from __future__ import annotations
from safe_linear_equation_variant_engine import can_generate, generate

def parent(**overrides):
    row={"id":"LIN-EQ-1","question":"方程式3x+2=20を解きなさい。","answer":"x=6","figure_refs":[],"choices":None}
    row.update(overrides); return row

def main():
    for choices in (None,[]):
        p=parent(choices=choices); ok,reason=can_generate(p); assert ok and reason=="linear_equation_ax_plus_b_equals_c_exact"
        rows,evidence,reason=generate(p,3); assert len(rows)==len(evidence)==3
        assert len({tuple(r["numeric_signature"]) for r in rows})==3
        for row,ev in zip(rows,evidence):
            assert row["answer"].startswith("x=")
            assert ev["method"]=="linear_equation_exact_inverse_and_forward_recomposition"
            assert ev["independent_check"].endswith("PASS")
    good_fraction=parent(question="方程式2x+1=4を解きなさい。",answer="x=3/2"); assert can_generate(good_fraction)[0]
    for bad in (parent(answer="x=5"),parent(figure_refs=["f.svg"]),parent(choices=["5","6"]),parent(question="方程式0x+2=2を解きなさい。",answer="x=1"),parent(question="y=3x+2で、y=20のときのxの値を求めなさい。",answer="x=6"),parent(question="3x+2=20, x+1=7を解きなさい。",answer="x=6")):
        assert not can_generate(bad)[0]
        assert generate(bad,1)[0]==[]
    print("PASS_SAFE_LINEAR_EQUATION_VARIANT_ENGINE")

if __name__=="__main__": main()
