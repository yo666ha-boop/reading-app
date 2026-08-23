from safe_ratio_simplification_variant_engine import can_generate, generate


def parent(**overrides):
    row={
        "id":"P-RATIO-SIMPLIFY-001",
        "question":"18:24を最も簡単な整数の比にしなさい。",
        "answer":"3:4",
        "figure_refs":[],
        "choices":None,
    }
    row.update(overrides)
    return row


def main():
    ok,reason=can_generate(parent())
    assert ok and reason=="two_integer_ratio_simplification_exact"
    empty=parent(choices=[])
    ok,reason=can_generate(empty)
    assert ok and reason=="two_integer_ratio_simplification_exact"
    rows,evidence,_=generate(parent(),3)
    assert len(rows)==len(evidence)==3
    assert len({row["question"] for row in rows})==3
    assert len({tuple(row["numeric_signature"]) for row in rows})==3
    for row,ev in zip(rows,evidence):
        assert ":" in row["answer"]
        assert ev["method"]=="ratio_simplification_gcd_coprime_and_cross_product"
        assert "PASS" in ev["independent_check"]

    bad=[
        parent(answer="6:8"),
        parent(question="3:4を最も簡単な整数の比にしなさい。",answer="3:4"),
        parent(figure_refs=["fig.svg"]),
        parent(choices=["3:4","6:8"]),
        parent(question="18:24の割合を求めなさい。",answer="3:4"),
        parent(question="18:24=3:x の比例式を解きなさい。",answer="4"),
        parent(question="18:24:30を簡単な整数の比にしなさい。",answer="3:4:5"),
    ]
    for row in bad:
        ok,_=can_generate(row)
        assert not ok
        generated,ev,_=generate(row,1)
        assert generated==[] and ev==[]
    print("PASS_SAFE_RATIO_SIMPLIFICATION_VARIANT_ENGINE")

if __name__=="__main__": main()
