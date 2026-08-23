from safe_parallelogram_height_from_area_variant_engine import can_generate, generate


def parent(**overrides):
    row={"id":"P-PARA-H-001","question":"底辺8cm、面積48cm²の平行四辺形の高さを求めなさい。","answer":"6cm","figure_refs":[],"choices":None}
    row.update(overrides); return row


def main():
    ok,reason=can_generate(parent()); assert ok and reason=="parallelogram_height_from_area_exact"
    ok,_=can_generate(parent(choices=[])); assert ok
    rows,evidence,_=generate(parent(),3); assert len(rows)==len(evidence)==3
    assert len({tuple(r["numeric_signature"]) for r in rows})==3
    for r,e in zip(rows,evidence): assert "PASS" in e["independent_check"]
    for x in [parent(answer="5cm"),parent(figure_refs=["fig.svg"]),parent(choices=["6cm"]),parent(question="底辺7cm、面積50cm²の平行四辺形の高さを求めなさい。",answer="7cm")]:
        ok,_=can_generate(x); assert not ok
    print("PASS_SAFE_PARALLELOGRAM_HEIGHT_FROM_AREA_VARIANT_ENGINE")
if __name__=="__main__": main()
