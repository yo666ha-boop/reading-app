from safe_polygon_interior_sum_variant_engine import can_generate, generate

def parent(**overrides):
    row={"id":"P-POLY-SUM-001","question":"8角形の内角の和を求めなさい。","answer":"1080°","figure_refs":[],"choices":None}
    row.update(overrides); return row

def main():
    ok,reason=can_generate(parent()); assert ok and reason=="polygon_interior_sum_exact"
    empty=parent(choices=[]); ok,_=can_generate(empty); assert ok
    rows,evidence,_=generate(parent(),3); assert len(rows)==len(evidence)==3
    assert len({r["question"] for r in rows})==3
    assert all("PASS" in e["independent_check"] for e in evidence)
    bad=[parent(answer="1070°"),parent(figure_refs=["fig.svg"]),parent(choices=["900°","1080°"]),parent(question="正8角形の1つの内角を求めなさい。",answer="135°"),parent(question="8角形の外角の和を求めなさい。",answer="360°")]
    for row in bad:
        ok,_=can_generate(row); assert not ok
        gen,ev,_=generate(row,1); assert gen==[] and ev==[]
    print("PASS_SAFE_POLYGON_INTERIOR_SUM_VARIANT_ENGINE")

if __name__=="__main__": main()
