from __future__ import annotations
from safe_linear_equation_both_sides_variant_engine import can_generate, generate

def parent(**overrides):
    row={"id":"LIN-EQ-BOTH-1","question":"方程式3x+2=x+10を解きなさい。","answer":"x=4","figure_refs":[],"choices":None}
    row.update(overrides); return row

def main():
    for choices in (None,[]):
        p=parent(choices=choices); ok,reason=can_generate(p); assert ok and reason=="linear_equation_both_sides_exact"
        rows,evidence,reason=generate(p,3); assert len(rows)==len(evidence)==3
        assert len({tuple(r["numeric_signature"]) for r in rows})==3
        for row,ev in zip(rows,evidence):
            assert row["answer"].startswith("x=")
            assert ev["method"]=="linear_equation_both_sides_exact_rearrangement_and_recomposition"
            assert ev["independent_check"].endswith("PASS")
    fraction=parent(question="方程式3x+1=x+4を解きなさい。",answer="x=3/2"); assert can_generate(fraction)[0]
    for bad in (parent(answer="x=5"),parent(figure_refs=["f.svg"]),parent(choices=["3","4"]),parent(question="方程式3x+2=3x+2を解きなさい。",answer="x=1"),parent(question="y=3x+2で、y=x+10のときのxを求めなさい。",answer="x=4"),parent(question="3x+2=x+10, x+1=5を解きなさい。",answer="x=4")):
        assert not can_generate(bad)[0]
        assert generate(bad,1)[0]==[]
    print("PASS_SAFE_LINEAR_EQUATION_BOTH_SIDES_VARIANT_ENGINE")

if __name__=="__main__": main()
