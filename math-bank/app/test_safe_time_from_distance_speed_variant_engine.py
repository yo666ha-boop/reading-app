from safe_time_from_distance_speed_variant_engine import can_generate, generate


def parent(**overrides):
    row={"id":"P-TIME-INV-001","question":"時速60kmで180km進むには何時間かかりますか。","answer":"3時間","figure_refs":[],"choices":None}
    row.update(overrides); return row


def main():
    ok,reason=can_generate(parent()); assert ok and reason=="time_from_distance_speed_exact"
    ok,_=can_generate(parent(choices=[])); assert ok
    rows,evidence,reason=generate(parent(),3)
    assert reason=="time_from_distance_speed_exact" and len(rows)==len(evidence)==3
    assert len({tuple(r["numeric_signature"]) for r in rows})==3
    for row,ev in zip(rows,evidence):
        assert row["answer"].endswith("時間") and "何時間" in row["question"]
        assert ev["method"]=="time_from_distance_speed_exact_division_and_product_recomposition" and "PASS" in ev["independent_check"]
    bad=[parent(answer="4時間"),parent(figure_refs=["fig.svg"]),parent(choices=["2時間","3時間"]),parent(question="時速60kmで181km進むには何時間かかりますか。"),parent(question="時速60kmで180km進む平均の時間を求めなさい。")]
    for row in bad:
        ok,_=can_generate(row); assert not ok
        generated,ev,_=generate(row,1); assert generated==[] and ev==[]
    print("PASS_SAFE_TIME_FROM_DISTANCE_SPEED_VARIANT_ENGINE")

if __name__=="__main__": main()
