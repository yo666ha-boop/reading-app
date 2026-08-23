from safe_average_total_variant_engine import can_generate, generate


def parent(**overrides):
    row={"id":"P-AVG-TOTAL","question":"5人の平均点が12点です。合計点を求めなさい。","answer":"60","figure_refs":[],"choices":None}
    row.update(overrides); return row


def main():
    ok,reason=can_generate(parent()); assert ok and reason=="average_times_count_total_exact"
    empty=parent(choices=[]); ok,_=can_generate(empty); assert ok
    rows,ev,_=generate(parent(),3); assert len(rows)==len(ev)==3
    assert len({tuple(r["numeric_signature"]) for r in rows})==3
    assert all(e["method"]=="average_times_count_exact_total_and_inverse_identity" for e in ev)
    bad=[
        parent(answer="59"),
        parent(figure_refs=["f.svg"]),
        parent(choices=["50","60"]),
        parent(question="5人の平均点が12点です。平均点を求めなさい。"),
        parent(question="5人の平均点が12点です。中央値と合計点を求めなさい。"),
        parent(question="5人の平均点が12点です。あと1人加わると平均は何点ですか。"),
    ]
    for p in bad:
        ok,_=can_generate(p); assert not ok
        r,e,_=generate(p,1); assert r==[] and e==[]
    print("PASS_SAFE_AVERAGE_TOTAL_VARIANT_ENGINE")

if __name__=="__main__": main()
