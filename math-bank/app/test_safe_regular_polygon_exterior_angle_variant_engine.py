from safe_regular_polygon_exterior_angle_variant_engine import can_generate, generate

def parent(**overrides):
    row={
        "id":"P-REG-EXT-001",
        "question":"正6角形の1つの外角の大きさを求めなさい。",
        "answer":"60°",
        "figure_refs":[],
        "choices":None,
    }
    row.update(overrides)
    return row

def main():
    ok,reason=can_generate(parent())
    assert ok and reason=="regular_polygon_single_exterior_angle_exact"
    ok,reason=can_generate(parent(choices=[]))
    assert ok and reason=="regular_polygon_single_exterior_angle_exact"
    rows,evidence,_=generate(parent(),3)
    assert len(rows)==len(evidence)==3
    assert len({row["question"] for row in rows})==3
    assert all(row["answer"].endswith("°") for row in rows)
    for ev in evidence:
        assert ev["method"]=="regular_polygon_exterior_sum_divided_by_n_and_supplement_identity"
        assert "PASS" in ev["independent_check"]
    bad=[
        parent(answer="59°"),
        parent(figure_refs=["fig.svg"]),
        parent(choices=["45°","60°"]),
        parent(question="正6角形の内角の大きさを求めなさい。",answer="120°"),
        parent(question="正6角形の外角の和を求めなさい。",answer="360°"),
        parent(question="正7角形の1つの外角の大きさを求めなさい。",answer="51°"),
    ]
    for row in bad:
        ok,_=can_generate(row)
        assert not ok
        made,ev,_=generate(row,1)
        assert made==[] and ev==[]
    print("PASS_SAFE_REGULAR_POLYGON_EXTERIOR_ANGLE_VARIANT_ENGINE")

if __name__=="__main__":
    main()
