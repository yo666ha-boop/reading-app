from __future__ import annotations
from safe_distance_two_points_variant_engine import generate

def parent(q="2点(1,2)と(4,6)の距離を求めなさい。",a="5"):
    return {"id":"T-DIST","question":q,"answer":a,"choices":None,"figure_refs":[]}

def main():
    rows,ev,reason=generate(parent(),3)
    assert reason=="two_integer_points_distance_exact_square" and len(rows)==len(ev)==3
    sigs={tuple(r["numeric_signature"]) for r in rows};assert len(sigs)==3
    for r,e in zip(rows,ev):
        assert r["answer"].isdigit() and "dx^2+dy^2=d^2 PASS" in e["independent_check"]
    for bad in (parent(a="4"),parent("2点(1,2)と(2,3)の距離を求めなさい。","1"),parent("2点(1,2)と(4,6)の中点と距離を求めなさい。","5")):
        rows,_,_=generate(bad,1);assert rows==[]
    p=parent();p["figure_refs"]=["f1"];assert generate(p,1)[0]==[]
    p=parent();p["choices"]=["4","5"];assert generate(p,1)[0]==[]
    print("PASS_SAFE_DISTANCE_TWO_POINTS_VARIANT_ENGINE")
if __name__=="__main__":main()
