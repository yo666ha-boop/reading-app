from safe_slope_from_two_points_variant_engine import can_generate, generate


def parent(**kw):
    row={"id":"P-SLOPE2-001","question":"2点(1,3),(4,9)を通る直線の傾きを求めなさい。","answer":"2","figure_refs":[],"choices":None}
    row.update(kw);return row


def main():
    ok,reason=can_generate(parent());assert ok and reason=="two_integer_points_slope_exact"
    ok,_=can_generate(parent(choices=[]));assert ok
    rows,ev,_=generate(parent(),3);assert len(rows)==len(ev)==3
    assert len({r["question"] for r in rows})==3
    assert len({tuple(r["numeric_signature"]) for r in rows})==3
    assert all("PASS" in e["independent_check"] for e in ev)
    bad=[parent(answer="3"),parent(question="2点(1,3),(1,9)を通る直線の傾きを求めなさい。",answer="0"),parent(question="グラフ上の2点(1,3),(4,9)から傾きを求めなさい。"),parent(figure_refs=["g.svg"]),parent(choices=["1","2"])]
    for b in bad:
        ok,_=can_generate(b);assert not ok
        r,e,_=generate(b,1);assert r==[] and e==[]
    print("PASS_SAFE_SLOPE_FROM_TWO_POINTS_VARIANT_ENGINE")

if __name__=="__main__":main()
