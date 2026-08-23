from safe_two_coin_heads_probability_variant_engine import can_generate, generate


def parent(**kw):
    row={"id":"P-COIN2-001","question":"公平な硬貨を2枚同時に投げるとき、表が1枚出る確率を求めなさい。","answer":"1/2","figure_refs":[],"choices":None}
    row.update(kw); return row


def main():
    ok,reason=can_generate(parent()); assert ok and reason=="two_fair_coins_exactly_k_heads_exact"
    ok,_=can_generate(parent(choices=[])); assert ok
    rows,ev,_=generate(parent(),2); assert len(rows)==len(ev)==2
    assert len({r["question"] for r in rows})==2
    assert all("PASS" in e["independent_check"] for e in ev)
    bad=[
        parent(answer="1/4"),
        parent(question="公平な硬貨を3枚投げるとき、表が1枚出る確率を求めなさい。",answer="3/8"),
        parent(question="公平な硬貨を2枚投げるとき、少なくとも表が1枚出る確率を求めなさい。",answer="3/4"),
        parent(figure_refs=["coin.svg"]),
        parent(choices=["1/4","1/2"]),
    ]
    for b in bad:
        ok,_=can_generate(b); assert not ok
        r,e,_=generate(b,1); assert r==[] and e==[]
    print("PASS_SAFE_TWO_COIN_HEADS_PROBABILITY_VARIANT_ENGINE")

if __name__=="__main__": main()
