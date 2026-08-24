from __future__ import annotations
import copy
from safe_nonmonic_binomial_expansion_variant_engine import generate
from test_expanded_variant_layer import make_base

def parent():
    p=copy.deepcopy(make_base()[0]); p["id"]="EXP-NONMONIC"; p["question"]="(2x+3)(3x-4)を展開しなさい。"; p["answer"]="6x²+x-12"; p["choices"]=[]; p["figure_refs"]=[]; p["source"]["is_generated_variant"]=False; p["source"]["parent_id"]=None; p["variant_group"]=None; return p

def main():
    p=parent(); rows,ev,reason=generate(p,3); assert reason=="nonmonic_binomial_integer_expansion_exact"; assert len(rows)==len(ev)==3; assert len({tuple(r["numeric_signature"]) for r in rows})==3
    for r,e in zip(rows,ev): assert r["question"]!=p["question"] and e["parent_sha256"] and "PASS" in e["independent_check"]
    minus=parent(); minus["question"]="(2x-3)(3x+4)を展開しなさい。"; minus["answer"]="6x²-x-12"; mrows,_,mreason=generate(minus,1); assert mreason=="nonmonic_binomial_integer_expansion_exact" and len(mrows)==1
    bad=parent(); bad["answer"]="6x²-x-12"; assert generate(bad,1)[0]==[]
    fig=parent(); fig["figure_refs"]=["f"]; assert generate(fig,1)[0]==[]
    choice=parent(); choice["choices"]=["a"]; assert generate(choice,1)[0]==[]
    print("PASS_SAFE_NONMONIC_BINOMIAL_EXPANSION_VARIANT_ENGINE")
if __name__=="__main__": main()
