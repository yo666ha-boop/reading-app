from safe_square_side_from_perimeter_variant_engine import can_generate, generate


def parent(**overrides):
    row={"id":"P-SQ-SIDE-P-001","question":"周の長さ32cmの正方形の1辺の長さを求めなさい。","answer":"8cm","figure_refs":[],"choices":None}
    row.update(overrides); return row


def main():
    ok,reason=can_generate(parent()); assert ok and reason=="square_side_from_perimeter_exact_division_by_four"
    ok,_=can_generate(parent(choices=[])); assert ok
    rows,evidence,_=generate(parent(),3)
    assert len(rows)==len(evidence)==3
    assert len({tuple(r["numeric_signature"]) for r in rows})==3
    for r,e in zip(rows,evidence):
        assert r["answer"].endswith("cm")
        assert "PASS" in e["independent_check"]
    bad=[
        parent(answer="7cm"),
        parent(question="周の長さ30cmの正方形の1辺の長さを求めなさい。",answer="7cm"),
        parent(figure_refs=["fig.svg"]),
        parent(choices=["7cm","8cm"]),
        parent(question="面積64cm²の正方形の1辺の長さを求めなさい。",answer="8cm"),
    ]
    for p in bad:
        ok,_=can_generate(p); assert not ok
        rows,ev,_=generate(p,1); assert rows==[] and ev==[]
    print("PASS_SAFE_SQUARE_SIDE_FROM_PERIMETER_VARIANT_ENGINE")

if __name__=="__main__": main()
