from safe_speed_from_distance_time_variant_engine import can_generate, generate


def parent(**overrides):
    row={"id":"P-SPEED-INV-001","question":"180kmの道のりを3時間で進みました。このときの速さを求めなさい。","answer":"60km/h","figure_refs":[],"choices":None}
    row.update(overrides); return row


def main():
    ok,reason=can_generate(parent()); assert ok and reason=="speed_from_distance_time_exact"
    ok,_=can_generate(parent(choices=[])); assert ok
    rows,evidence,reason=generate(parent(),3)
    assert reason=="speed_from_distance_time_exact" and len(rows)==len(evidence)==3
    assert len({tuple(r["numeric_signature"]) for r in rows})==3
    for row,ev in zip(rows,evidence):
        assert row["answer"].endswith("km/h") and "速さ" in row["question"]
        assert ev["method"]=="speed_from_distance_time_exact_division_and_product_recomposition" and "PASS" in ev["independent_check"]
    bad=[parent(answer="50km/h"),parent(figure_refs=["fig.svg"]),parent(choices=["50km/h","60km/h"]),parent(question="181kmの道のりを3時間で進みました。このときの速さを求めなさい。"),parent(question="180kmの道のりを3時間で進みました。平均の速さを求めなさい。")]
    for row in bad:
        ok,_=can_generate(row); assert not ok
        generated,ev,_=generate(row,1); assert generated==[] and ev==[]
    print("PASS_SAFE_SPEED_FROM_DISTANCE_TIME_VARIANT_ENGINE")

if __name__=="__main__": main()
