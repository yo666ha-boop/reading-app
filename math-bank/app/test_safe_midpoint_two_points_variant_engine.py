from __future__ import annotations
from safe_midpoint_two_points_variant_engine import can_generate,generate

def parent(**overrides):
    row={"id":"MID-1","question":"2点A(2,4), B(6,8)の中点の座標を求めなさい。","answer":"(4,6)","figure_refs":[],"choices":None};row.update(overrides);return row

def main():
    for choices in (None,[]):
        p=parent(choices=choices);ok,reason=can_generate(p);assert ok and reason=="two_integer_points_midpoint_exact"
        rows,ev,_=generate(p,3);assert len(rows)==len(ev)==3 and len({tuple(r["numeric_signature"]) for r in rows})==3
        assert all(e["method"]=="two_point_midpoint_exact_average_and_double_identity" and e["independent_check"].endswith("PASS") for e in ev)
    half=parent(question="2点A(1,2), B(4,7)の中点の座標を求めなさい。",answer="(5/2,9/2)");assert can_generate(half)[0]
    for bad in (parent(answer="(4,5)"),parent(figure_refs=["f.svg"]),parent(choices=["(4,6)","(6,4)"]),parent(question="2点A(2,4), B(6,8)を通る直線の傾きを求めなさい。",answer="1"),parent(question="グラフ上の2点A(2,4), B(6,8)の中点を求めなさい。",answer="(4,6)")):
        assert not can_generate(bad)[0];assert generate(bad,1)[0]==[]
    print("PASS_SAFE_MIDPOINT_TWO_POINTS_VARIANT_ENGINE")
if __name__=="__main__":main()
