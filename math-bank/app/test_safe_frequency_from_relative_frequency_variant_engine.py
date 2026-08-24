from safe_frequency_from_relative_frequency_variant_engine import can_generate, generate


def parent(**overrides):
    row={"id":"P-RF-FREQ-001","question":"全体の度数は40人、相対度数は0.25です。この階級の度数を求めなさい。","answer":"10人","figure_refs":[],"choices":None}
    row.update(overrides); return row


def main():
    ok,reason=can_generate(parent()); assert ok and reason=="frequency_from_relative_frequency_exact"
    ok,_=can_generate(parent(choices=[])); assert ok
    rows,evidence,_=generate(parent(),3)
    assert len(rows)==len(evidence)==3
    assert len({tuple(r["numeric_signature"]) for r in rows})==3
    for r,e in zip(rows,evidence): assert "PASS" in e["independent_check"]
    bad=[
        parent(answer="9人"),
        parent(question="全体の度数は30人、相対度数は0.25です。この階級の度数を求めなさい。",answer="7人"),
        parent(figure_refs=["fig.svg"]),
        parent(choices=["9人","10人"]),
        parent(question="表を見て、全体の度数は40人、相対度数は0.25です。この階級の度数を求めなさい。"),
    ]
    for p in bad:
        ok,_=can_generate(p); assert not ok
        rows,ev,_=generate(p,1); assert rows==[] and ev==[]
    print("PASS_SAFE_FREQUENCY_FROM_RELATIVE_FREQUENCY_VARIANT_ENGINE")

if __name__=="__main__": main()
