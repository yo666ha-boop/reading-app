from __future__ import annotations

import copy
from safe_quadratic_nonmonic_integer_roots_variant_engine import _sha, generate
from test_expanded_variant_layer import make_base


def parent():
    p=copy.deepcopy(make_base()[0]); p["id"]="Q-NONMONIC"; p["question"]="二次方程式 2x²-10x+12=0 を解きなさい。"; p["answer"]="x=2, x=3"; p["choices"]=[]; p["figure_refs"]=[]; p["source"]["is_generated_variant"]=False; p["source"]["parent_id"]=None; p["variant_group"]=None
    return p


def initial_r1_for_first_sibling(p: dict) -> int:
    seed=int(_sha(p)[:12],16)
    r1=-5+((seed >> 9) % 11)
    r2=-5+((seed >> 13) % 11)
    if r1==r2:
        r2+=2
    if r1>r2:
        r1,r2=r2,r1
    return r1


def main():
    p=parent(); rows,evidence,reason=generate(p,3)
    assert reason=="quadratic_nonmonic_two_integer_roots_exact"
    assert len(rows)==len(evidence)==3
    sigs={tuple(r["numeric_signature"]) for r in rows}; assert len(sigs)==3
    for row,ev in zip(rows,evidence):
        assert row["question"]!=p["question"] and row["answer"]!=p["answer"]
        assert "x=0" not in row["answer"]
        assert ev["parent_sha256"] and "both_substitute_to_0 PASS" in ev["independent_check"]

    # Regression for the former non-terminating seed: when the deterministic
    # first root is zero, changing only r2 can never make c=a*r1*r2 nonzero.
    zero_seed_parent=None
    for i in range(256):
        candidate=parent(); candidate["id"]=f"Q-NONMONIC-ZERO-{i}"
        if initial_r1_for_first_sibling(candidate)==0:
            zero_seed_parent=candidate
            break
    assert zero_seed_parent is not None
    zero_rows,zero_evidence,zero_reason=generate(zero_seed_parent,3)
    assert zero_reason=="quadratic_nonmonic_two_integer_roots_exact"
    assert len(zero_rows)==len(zero_evidence)==3
    assert all("x=0" not in row["answer"] for row in zero_rows)
    assert len({tuple(row["numeric_signature"]) for row in zero_rows})==3

    bad=parent(); bad["answer"]="x=1, x=6"; assert generate(bad,1)[0]==[]
    figure=parent(); figure["figure_refs"]=["fig1"]; assert generate(figure,1)[0]==[]
    choice=parent(); choice["choices"]=["1","2"]; assert generate(choice,1)[0]==[]
    repeated=parent(); repeated["question"]="二次方程式 2x²-8x+8=0 を解きなさい。"; repeated["answer"]="x=2, x=2"; assert generate(repeated,1)[0]==[]
    print("PASS_SAFE_QUADRATIC_NONMONIC_INTEGER_ROOTS_VARIANT_ENGINE")

if __name__=="__main__": main()
