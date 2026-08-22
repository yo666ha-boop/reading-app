from safe_difference_of_squares_factorization_variant_engine import can_generate, generate


def parent(**overrides):
    row={"id":"P-DIFFSQ-1","question":"x²-49を因数分解しなさい。","answer":"(x-7)(x+7)","figure_refs":[],"choices":None}
    row.update(overrides); return row


def main():
    ok,reason=can_generate(parent()); assert ok and reason=="difference_of_squares_exact"
    ok,_=can_generate(parent(choices=[])); assert ok
    rows,ev,_=generate(parent(),3); assert len(rows)==len(ev)==3
    assert len({r["question"] for r in rows})==3
    for r,e in zip(rows,ev):
        assert "(x-" in r["answer"] and ")(x+" in r["answer"]
        assert "expands to" in e["independent_check"] and "PASS" in e["independent_check"]
    bad=[parent(answer="(x-6)(x+6)"),parent(question="x²-50を因数分解しなさい。",answer=""),parent(question="x²-49=0を解きなさい。"),parent(figure_refs=["f.svg"]),parent(choices=["A","B"])]
    for p in bad:
        assert not can_generate(p)[0]; assert generate(p,1)[0]==[]
    print("PASS_SAFE_DIFFERENCE_OF_SQUARES_FACTORIZATION")

if __name__=="__main__": main()
