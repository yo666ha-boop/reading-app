from safe_triangle_base_from_area_variant_engine import can_generate, generate


def parent(**overrides):
    row={"id":"P-TRI-B-001","question":"高さ6cm、面積24cm²の三角形の底辺を求めなさい。","answer":"8cm","figure_refs":[],"choices":None}
    row.update(overrides); return row


def main():
    ok,reason=can_generate(parent()); assert ok and reason=="triangle_base_from_area_exact"
    ok,_=can_generate(parent(choices=[])); assert ok
    rows,evidence,_=generate(parent(),3); assert len(rows)==len(evidence)==3
    assert len({tuple(r["numeric_signature"]) for r in rows})==3
    for r,e in zip(rows,evidence): assert "PASS" in e["independent_check"]
    bad=[parent(answer="7cm"),parent(figure_refs=["fig.svg"]),parent(choices=["8cm","7cm"]),parent(question="高さ6cm、面積25cm²の三角形の底辺を求めなさい。",answer="8cm")]
    for x in bad:
        ok,_=can_generate(x); assert not ok
        rr,ee,_=generate(x,1); assert rr==[] and ee==[]
    print("PASS_SAFE_TRIANGLE_BASE_FROM_AREA_VARIANT_ENGINE")

if __name__=="__main__": main()
