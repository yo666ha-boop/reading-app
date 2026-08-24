from __future__ import annotations
from safe_quadratic_integer_roots_variant_engine import can_generate, generate

def parent(**overrides):
    row={"id":"QUAD-ROOTS-1","question":"二次方程式 x²-5x+6=0 を解きなさい。","answer":"x=2, x=3","figure_refs":[],"choices":None}
    row.update(overrides); return row

def main():
    for choices in (None,[]):
        p=parent(choices=choices); ok,reason=can_generate(p); assert ok and reason=="quadratic_monic_two_integer_roots_exact"
        rows,evidence,reason=generate(p,3); assert len(rows)==len(evidence)==3
        assert len({tuple(r["numeric_signature"]) for r in rows})==3
        for row,ev in zip(rows,evidence):
            assert row["answer"].count("x=")==2
            assert ev["method"]=="quadratic_monic_integer_roots_discriminant_vieta_and_substitution"
            assert ev["independent_check"].endswith("PASS")
    reversed_answer=parent(answer="x=3, x=2"); assert can_generate(reversed_answer)[0]
    for bad in (parent(answer="x=1, x=6"),parent(figure_refs=["f.svg"]),parent(choices=["2,3","1,6"]),parent(question="二次方程式 x²-4x+4=0 を解きなさい。",answer="x=2, x=2"),parent(question="二次方程式 x²+x+1=0 を解きなさい。",answer="x=0, x=-1"),parent(question="x²-5x+6=0 を因数分解しなさい。",answer="x=2, x=3")):
        assert not can_generate(bad)[0]
        assert generate(bad,1)[0]==[]
    print("PASS_SAFE_QUADRATIC_INTEGER_ROOTS_VARIANT_ENGINE")

if __name__=="__main__": main()
