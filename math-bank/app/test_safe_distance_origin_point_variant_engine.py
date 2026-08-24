from __future__ import annotations
from safe_distance_origin_point_variant_engine import generate

def parent(q="原点Oと点A(3,4)の距離を求めなさい。",a="5"):
    return {"id":"T-ODIST","question":q,"answer":a,"choices":None,"figure_refs":[]}
def main():
    rows,ev,reason=generate(parent(),3);assert reason=="origin_to_integer_point_distance_exact_square" and len(rows)==len(ev)==3
    assert len({tuple(r["numeric_signature"]) for r in rows})==3
    for r,e in zip(rows,ev):assert r["answer"].isdigit() and "x^2+y^2=d^2 PASS" in e["independent_check"]
    for bad in (parent(a="4"),parent("原点Oと点A(1,1)の距離を求めなさい。","1"),parent("原点Oと点A(3,4)の中点と距離を求めなさい。","5")):
        assert generate(bad,1)[0]==[]
    p=parent();p["figure_refs"]=["f"];assert generate(p,1)[0]==[]
    p=parent();p["choices"]=["4","5"];assert generate(p,1)[0]==[]
    print("PASS_SAFE_DISTANCE_ORIGIN_POINT_VARIANT_ENGINE")
if __name__=="__main__":main()
