from safe_percent_change_variant_engine import can_generate, generate


def parent(**overrides):
    row={
        "id":"P-PCT-CHANGE-001",
        "question":"ある人数が80人から100人に増えました。何%増えましたか。",
        "answer":"25%",
        "figure_refs":[],
        "choices":None,
    }
    row.update(overrides)
    return row


def main():
    ok,reason=can_generate(parent())
    assert ok and reason=="simple_integer_percent_change_exact"
    empty=parent(choices=[])
    ok,reason=can_generate(empty)
    assert ok and reason=="simple_integer_percent_change_exact"
    rows,evidence,_=generate(parent(),3)
    assert len(rows)==len(evidence)==3
    assert len({row["question"] for row in rows})==3
    assert len({tuple(row["numeric_signature"]) for row in rows})==3
    for row,ev in zip(rows,evidence):
        assert row["answer"].endswith("%")
        assert ev["method"]=="simple_percent_change_exact_fraction_and_cross_product"
        assert "PASS" in ev["independent_check"]
        assert ev["direction"]=="increase"

    dec=parent(question="ある個数が200個から150個に減りました。何%減りましたか。",answer="25%")
    ok,reason=can_generate(dec)
    assert ok and reason=="simple_integer_percent_change_exact"
    drows,dev,_=generate(dec,3)
    assert len(drows)==len(dev)==3
    assert all(x["direction"]=="decrease" for x in dev)

    bad=[
        parent(answer="20%"),
        parent(figure_refs=["fig.svg"]),
        parent(choices=["20%","25%"]),
        parent(question="80人から100人になりました。割合を求めなさい。",answer="25%"),
        parent(question="1000円を20%割引したとき、何%減りましたか。",answer="20%"),
        parent(question="80人から100人に増えました。20人増加は何パーセントポイントですか。",answer="25%"),
        parent(question="90人から100人に増えました。何%増えましたか。",answer="10%"),
        parent(question="100人から80人に増えました。何%増えましたか。",answer="20%"),
    ]
    for row in bad:
        ok,_=can_generate(row)
        assert not ok
        generated,ev,_=generate(row,1)
        assert generated==[] and ev==[]
    print("PASS_SAFE_PERCENT_CHANGE_VARIANT_ENGINE")

if __name__=="__main__": main()
