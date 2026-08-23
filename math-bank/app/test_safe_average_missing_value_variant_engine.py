from safe_average_missing_value_variant_engine import can_generate, generate


def parent(**overrides):
    row={"id":"P-AVG-MISS","question":"8、10、12、xの平均が11です。xの値を求めなさい。","answer":"14","figure_refs":[],"choices":None}
    row.update(overrides);return row


def main():
    ok,reason=can_generate(parent());assert ok and reason=="one_missing_value_simple_average_exact"
    empty=parent(choices=[]);ok,_=can_generate(empty);assert ok
    rows,ev,_=generate(parent(),3);assert len(rows)==len(ev)==3
    assert len({r["question"] for r in rows})==3
    assert len({tuple(r["numeric_signature"]) for r in rows})==3
    assert all(e["method"]=="one_missing_average_exact_sum_and_recomputed_mean" for e in ev)
    bad=[
        parent(answer="13"),
        parent(figure_refs=["f.svg"]),
        parent(choices=["12","14"]),
        parent(question="8、10、x、xの平均が11です。xの値を求めなさい。"),
        parent(question="8、10、12、xの中央値が11です。xの値を求めなさい。"),
        parent(question="8、10、12、xの平均が11です。合計を求めなさい。"),
    ]
    for p in bad:
        ok,_=can_generate(p);assert not ok
        r,e,_=generate(p,1);assert r==[] and e==[]
    print("PASS_SAFE_AVERAGE_MISSING_VALUE_VARIANT_ENGINE")

if __name__=="__main__":main()
