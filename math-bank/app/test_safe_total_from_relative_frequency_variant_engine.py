from safe_total_from_relative_frequency_variant_engine import can_generate, generate


def parent(**overrides):
    row={"id":"P-RF-TOTAL-001","question":"度数は10人、相対度数は0.25です。全体の度数を求めなさい。","answer":"40人","figure_refs":[],"choices":None}
    row.update(overrides); return row


def main():
    ok,reason=can_generate(parent()); assert ok and reason=="total_from_relative_frequency_exact"
    ok,_=can_generate(parent(choices=[])); assert ok
    rows,evidence,_=generate(parent(),3)
    assert len(rows)==len(evidence)==3
    assert len({tuple(r["numeric_signature"]) for r in rows})==3
    for r,e in zip(rows,evidence): assert "PASS" in e["independent_check"]
    bad=[
        parent(answer="39人"),
        parent(question="度数は7人、相対度数は0.3です。全体の度数を求めなさい。",answer="23人"),
        parent(figure_refs=["fig.svg"]),
        parent(choices=["39人","40人"]),
        parent(question="表を見て、度数は10人、相対度数は0.25です。全体の度数を求めなさい。"),
    ]
    for p in bad:
        ok,_=can_generate(p); assert not ok
        rows,ev,_=generate(p,1); assert rows==[] and ev==[]
    print("PASS_SAFE_TOTAL_FROM_RELATIVE_FREQUENCY_VARIANT_ENGINE")

if __name__=="__main__": main()
