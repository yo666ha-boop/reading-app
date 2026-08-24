from __future__ import annotations
from safe_general_linear_system_variant_engine import can_generate, generate

def parent(**overrides):
    row={"id":"SYS-GEN-1","question":"連立方程式 2x+3y=12, x-y=1 を解きなさい。","answer":"x=3, y=2","figure_refs":[],"choices":None}
    row.update(overrides); return row

def main():
    for choices in (None,[]):
        p=parent(choices=choices); ok,reason=can_generate(p); assert ok and reason=="general_linear_system_exact"
        rows,evidence,reason=generate(p,3); assert len(rows)==len(evidence)==3
        assert len({tuple(r["numeric_signature"]) for r in rows})==3
        for row,ev in zip(rows,evidence):
            assert row["answer"].startswith("x=") and ", y=" in row["answer"]
            assert ev["method"]=="general_linear_system_cramer_and_double_substitution"
            assert ev["independent_check"].endswith("PASS")
    frac=parent(question="連立方程式 2x+y=4, x-y=1 を解きなさい。",answer="x=5/3, y=2/3"); assert can_generate(frac)[0]
    for bad in (parent(answer="x=2, y=2"),parent(figure_refs=["f.svg"]),parent(choices=["(3,2)","(2,3)"]),parent(question="連立方程式 x+y=2, 2x+2y=4 を解きなさい。",answer="x=1, y=1"),parent(question="グラフから 2x+3y=12, x-y=1 の交点を求めなさい。",answer="x=3, y=2"),parent(question="2x+3y=12, x-y=1, x+y=5を解きなさい。",answer="x=3, y=2")):
        assert not can_generate(bad)[0]
        assert generate(bad,1)[0]==[]
    print("PASS_SAFE_GENERAL_LINEAR_SYSTEM_VARIANT_ENGINE")

if __name__=="__main__": main()
