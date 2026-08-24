from __future__ import annotations

import copy
from safe_quadratic_nonmonic_integer_roots_variant_engine import generate
from test_expanded_variant_layer import make_base


def parent():
    p=copy.deepcopy(make_base()[0]); p["id"]="Q-NONMONIC"; p["question"]="二次方程式 2x²-10x+12=0 を解きなさい。"; p["answer"]="x=2, x=3"; p["choices"]=[]; p["figure_refs"]=[]; p["source"]["is_generated_variant"]=False; p["source"]["parent_id"]=None; p["variant_group"]=None
    return p


def main():
    p=parent(); rows,evidence,reason=generate(p,3)
    assert reason=="quadratic_nonmonic_two_integer_roots_exact"
    assert len(rows)==len(evidence)==3
    sigs={tuple(r["numeric_signature"]) for r in rows}; assert len(sigs)==3
    for row,ev in zip(rows,evidence):
        assert row["question"]!=p["question"] and row["answer"]!=p["answer"]
        assert ev["parent_sha256"] and "both_substitute_to_0 PASS" in ev["independent_check"]
    bad=parent(); bad["answer"]="x=1, x=6"; assert generate(bad,1)[0]==[]
    figure=parent(); figure["figure_refs"]=["fig1"]; assert generate(figure,1)[0]==[]
    choice=parent(); choice["choices"]=["1","2"]; assert generate(choice,1)[0]==[]
    repeated=parent(); repeated["question"]="二次方程式 2x²-8x+8=0 を解きなさい。"; repeated["answer"]="x=2, x=2"; assert generate(repeated,1)[0]==[]
    print("PASS_SAFE_QUADRATIC_NONMONIC_INTEGER_ROOTS_VARIANT_ENGINE")

if __name__=="__main__": main()
