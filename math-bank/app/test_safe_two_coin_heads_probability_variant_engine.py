from safe_two_coin_heads_probability_variant_engine import can_generate, generate


def parent(**kw):
    row={"id":"P-COIN2-001","question":"公平な硬貨を2枚同時に投げるとき、表が1枚出る確率を求めなさい。","answer":"1/2","figure_refs":[],"choices":None}
    row.update(kw); return row


def main():
    ok,reason=can_generate(parent()); assert ok and reason=="fair_coins_2_to_4_exactly_k_heads_exact"
    ok,_=can_generate(parent(choices=[])); assert ok
    three=parent(question="公平な硬貨を3枚同時に投げるとき、表が1枚出る確率を求めなさい。",answer="3/8")
    ok,_=can_generate(three); assert ok
    rows,ev,_=generate(parent(),3); assert len(rows)==len(ev)==3
    assert len({r["question"] for r in rows})==3
    assert len({tuple(r["numeric_signature"]) for r in rows})==3
    assert all("PASS" in e["independent_check"] for e in ev)
    bad=[
        parent(answer="1/4"),
        parent(question="公平な硬貨を5枚投げるとき、表が1枚出る確率を求めなさい。",answer="5/32"),
        parent(question="公平な硬貨を2枚投げるとき、少なくとも表が1枚出る確率を求めなさい。",answer="3/4"),
        parent(figure_refs=["coin.svg"]),
        parent(choices=["1/4","1/2"]),
    ]
    for b in bad:
        ok,_=can_generate(b); assert not ok
        r,e,_=generate(b,1); assert r==[] and e==[]
    print("PASS_SAFE_COIN_HEADS_PROBABILITY_VARIANT_ENGINE_SAFE_TARGET_THREE")

if __name__=="__main__": main()
