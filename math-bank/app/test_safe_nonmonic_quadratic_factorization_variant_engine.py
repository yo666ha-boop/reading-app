from __future__ import annotations
import copy
from safe_nonmonic_quadratic_factorization_variant_engine import generate
from test_expanded_variant_layer import make_base

def parent():
    p=copy.deepcopy(make_base()[0]); p["id"]="F-NONMONIC"; p["question"]="6x²+11x+3を因数分解しなさい。"; p["answer"]="(3x+1)(2x+3)"; p["choices"]=[]; p["figure_refs"]=[]; p["source"]["is_generated_variant"]=False; p["source"]["parent_id"]=None; p["variant_group"]=None; return p

def main():
    p=parent(); rows,ev,reason=generate(p,3); assert reason=="nonmonic_quadratic_integer_factorization_exact"; assert len(rows)==len(ev)==3; assert len({tuple(r["numeric_signature"]) for r in rows})==3
    for r,e in zip(rows,ev): assert r["question"]!=p["question"] and e["parent_sha256"] and "PASS" in e["independent_check"]
    bad=parent(); bad["answer"]="(6x+1)(x+3)"; assert generate(bad,1)[0]==[]
    fig=parent(); fig["figure_refs"]=["f"]; assert generate(fig,1)[0]==[]
    choice=parent(); choice["choices"]=["a"]; assert generate(choice,1)[0]==[]
    print("PASS_SAFE_NONMONIC_QUADRATIC_FACTORIZATION_VARIANT_ENGINE")
if __name__=="__main__": main()
