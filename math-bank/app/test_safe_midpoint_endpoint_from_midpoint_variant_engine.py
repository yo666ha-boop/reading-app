from __future__ import annotations
import copy
from safe_midpoint_endpoint_from_midpoint_variant_engine import generate
from test_expanded_variant_layer import make_base

def base():
    p=copy.deepcopy(make_base()[0]);p["id"]="MID-END";p["question"]="点A(2,3)と中点M(5,7)がある。点Bの座標を求めなさい。";p["answer"]="(8,11)";p["choices"]=None;p["figure_refs"]=[]
    return p

def main():
    p=base();rows,ev,reason=generate(p,3);assert reason=="endpoint_from_integer_midpoint_exact" and len(rows)==len(ev)==3
    sigs={r["numeric_signature"] for r in rows};assert len(sigs)==3
    for r,e in zip(rows,ev):
        assert "PASS" in e["independent_check"] and "2M" in r["explanation"]
    bad=base();bad["answer"]="(8,10)";assert generate(bad,1)[0]==[]
    fig=base();fig["figure_refs"]=["x.png"];assert generate(fig,1)[0]==[]
    ch=base();ch["choices"]=["(8,11)","(7,11)"];assert generate(ch,1)[0]==[]
    amb=base();amb["question"]="点A(2,3)と中点M(5,7)がある。点Cの座標を求めなさい。";assert generate(amb,1)[0]==[]
    print("PASS_SAFE_MIDPOINT_ENDPOINT_FROM_MIDPOINT_VARIANT_ENGINE")
if __name__=="__main__":main()
