from safe_rectangle_side_from_perimeter_variant_engine import can_generate, generate


def parent(**overrides):
    row={"id":"P-RECT-PERIM-SIDE-001","question":"たて8cm、周の長さ26cmの長方形があります。横の長さを求めなさい。","answer":"5cm","figure_refs":[],"choices":None}
    row.update(overrides); return row


def main():
    ok,reason=can_generate(parent()); assert ok and reason=="rectangle_missing_side_from_perimeter_exact"
    ok,_=can_generate(parent(choices=[])); assert ok
    rows,evidence,reason=generate(parent(),3)
    assert reason=="rectangle_missing_side_from_perimeter_exact" and len(rows)==len(evidence)==3
    assert len({tuple(r["numeric_signature"]) for r in rows})==3
    for row,ev in zip(rows,evidence):
        assert row["answer"].endswith("cm") and "横の長さ" in row["question"]
        assert ev["method"]=="rectangle_missing_side_from_perimeter_half_and_recomposition" and "PASS" in ev["independent_check"]
    vertical=parent(question="横6cm、周の長さ26cmの長方形があります。たての長さを求めなさい。",answer="7cm")
    ok,_=can_generate(vertical); assert ok
    bad=[parent(answer="6cm"),parent(figure_refs=["fig.svg"]),parent(choices=["5cm","6cm"]),parent(question="たて8cm、周の長さ25cmの長方形があります。横の長さを求めなさい。"),parent(question="たて8cm、横5cmの長方形の周の長さを求めなさい。",answer="26cm")]
    for row in bad:
        ok,_=can_generate(row); assert not ok
        generated,ev,_=generate(row,1); assert generated==[] and ev==[]
    print("PASS_SAFE_RECTANGLE_SIDE_FROM_PERIMETER_VARIANT_ENGINE")

if __name__=="__main__": main()
