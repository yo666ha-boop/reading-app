from __future__ import annotations
from safe_linear_equation_parentheses_variant_engine import can_generate, generate

def parent(**overrides):
    row={"id":"LIN-EQ-PAREN-1","question":"方程式3(x+2)=15を解きなさい。","answer":"x=3","figure_refs":[],"choices":None}
    row.update(overrides); return row

def main():
    for choices in (None,[]):
        p=parent(choices=choices); ok,reason=can_generate(p); assert ok and reason=="linear_equation_parentheses_exact"
        rows,evidence,reason=generate(p,3); assert len(rows)==len(evidence)==3 and len({tuple(r["numeric_signature"]) for r in rows})==3
        assert all(ev["method"]=="linear_equation_parentheses_exact_division_and_recomposition" and ev["independent_check"].endswith("PASS") for ev in evidence)
    frac=parent(question="方程式2(x+1)=5を解きなさい。",answer="x=3/2"); assert can_generate(frac)[0]
    for bad in (parent(answer="x=4"),parent(figure_refs=["f.svg"]),parent(choices=["3","4"]),parent(question="方程式0(x+2)=0を解きなさい。",answer="x=3"),parent(question="y=3(x+2)で、y=15のときxを求めなさい。",answer="x=3"),parent(question="3(x+2)=15, x+1=4を解きなさい。",answer="x=3")):
        assert not can_generate(bad)[0]; assert generate(bad,1)[0]==[]
    print("PASS_SAFE_LINEAR_EQUATION_PARENTHESES_VARIANT_ENGINE")
if __name__=="__main__": main()
