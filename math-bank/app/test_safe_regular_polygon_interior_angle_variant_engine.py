from safe_regular_polygon_interior_angle_variant_engine import can_generate, generate


def parent(**overrides):
    row={
        "id":"P-REG-POLY-001",
        "question":"正6角形の1つの内角の大きさを求めなさい。",
        "answer":"120°",
        "figure_refs":[],
        "choices":None,
    }
    row.update(overrides); return row


def main():
    ok,reason=can_generate(parent())
    assert ok and reason=="regular_polygon_single_interior_angle_exact"
    empty=parent(choices=[])
    ok,_=can_generate(empty); assert ok
    rows,evidence,_=generate(parent(),3)
    assert len(rows)==len(evidence)==3
    assert len({tuple(r["numeric_signature"]) for r in rows})==3
    for row,ev in zip(rows,evidence):
        assert row["answer"].endswith("°")
        assert "PASS" in ev["independent_check"]
    bad=[
        parent(answer="119°"),
        parent(figure_refs=["fig.svg"]),
        parent(choices=["120°","135°"]),
        parent(question="6角形の内角の和を求めなさい。",answer="720°"),
        parent(question="正6角形の外角を求めなさい。",answer="60°"),
        parent(question="正7角形の1つの内角の大きさを求めなさい。",answer="128°"),
    ]
    for row in bad:
        ok,_=can_generate(row); assert not ok
        generated,ev,_=generate(row,1); assert generated==[] and ev==[]
    print("PASS_SAFE_REGULAR_POLYGON_INTERIOR_ANGLE_VARIANT_ENGINE")

if __name__=="__main__": main()
