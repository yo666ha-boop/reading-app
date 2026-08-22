from safe_relative_frequency_variant_engine import can_generate, generate


def parent(**overrides):
    row={
        "id":"P-REL-FREQ-001",
        "question":"ある階級の度数は6人、全体の度数は20人です。この階級の相対度数を求めなさい。",
        "answer":"0.3",
        "figure_refs":[],
        "choices":None,
    }
    row.update(overrides); return row


def main()->None:
    ok,reason=can_generate(parent()); assert ok and reason=="relative_frequency_exact_terminating_decimal"
    ok,reason=can_generate(parent(choices=[])); assert ok
    rows,evidence,_=generate(parent(),3); assert len(rows)==len(evidence)==3
    sigs={tuple(r["numeric_signature"]) for r in rows}; assert len(sigs)==3 and ("6","20") not in sigs
    for row,ev in zip(rows,evidence):
        assert "相対度数" in row["question"]
        value=float(row["answer"]); assert 0 < value < 1
        assert ev["method"]=="relative_frequency_exact_fraction_and_cross_product"
        assert "PASS" in ev["independent_check"]
    bad=[
        parent(answer="0.4"),
        parent(figure_refs=["table.svg"]),
        parent(choices=["0.2","0.3"]),
        parent(question="ある階級の度数は6人、全体の度数は20人です。相対度数を百分率で求めなさい。",answer="30%"),
        parent(question="ある階級の度数は6人、全体の度数は20人です。累積相対度数を求めなさい。"),
        parent(question="ある階級の度数は1人、全体の度数は3人です。この階級の相対度数を求めなさい。",answer="0.333"),
    ]
    for row in bad:
        ok,_=can_generate(row); assert not ok
        generated,ev,_=generate(row,1); assert generated==[] and ev==[]
    print("PASS_SAFE_RELATIVE_FREQUENCY_VARIANT_ENGINE")

if __name__=="__main__": main()
