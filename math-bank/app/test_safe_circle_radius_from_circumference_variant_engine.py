from safe_circle_radius_from_circumference_variant_engine import can_generate, generate


def parent(**overrides):
    row={"id":"P-CIRCLE-R-001","question":"円周率を3.14として、円周の長さが31.4cmの円の半径を求めなさい。","answer":"5cm","figure_refs":[],"choices":None}
    row.update(overrides); return row


def main():
    ok,reason=can_generate(parent()); assert ok and reason=="circle_radius_from_circumference_pi_3_14_exact"
    rows,evidence,_=generate(parent(),3); assert len(rows)==len(evidence)==3
    assert len({r["question"] for r in rows})==3
    for row,ev in zip(rows,evidence):
        assert row["answer"].endswith("cm")
        assert "円周の長さ" in row["question"]
        assert "PASS" in ev["independent_check"]
    empty=parent(choices=[]); assert can_generate(empty)[0]
    bad=[parent(answer="4cm"),parent(figure_refs=["fig.svg"]),parent(choices=["4cm","5cm"]),parent(question="円周率を3.14として、円周の長さが30cmの円の半径を求めなさい。",answer="5cm"),parent(question="円周率を3.14として、円周の長さが31.4cmの円の直径を求めなさい。",answer="10cm")]
    for p in bad:
        assert not can_generate(p)[0]
        rows,ev,_=generate(p,1); assert rows==[] and ev==[]
    print("PASS_SAFE_CIRCLE_RADIUS_FROM_CIRCUMFERENCE_VARIANT_ENGINE")

if __name__=="__main__": main()
