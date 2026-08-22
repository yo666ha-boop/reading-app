from safe_interquartile_range_variant_engine import can_generate, generate

def parent(**overrides):
    row={"id":"P-IQR-001","question":"データ 2、4、5、7、9、10、12、15 の四分位範囲を求めなさい。","answer":"6.5","figure_refs":[],"choices":None}
    row.update(overrides); return row

def main():
    ok,reason=can_generate(parent()); assert ok and reason=="eight_integer_iqr_exact"
    ok,_=can_generate(parent(choices=[])); assert ok
    rows,evidence,_=generate(parent(),3); assert len(rows)==len(evidence)==3
    assert len({tuple(r["numeric_signature"]) for r in rows})==3
    assert all("PASS" in e["independent_check"] for e in evidence)
    bad=[
      parent(answer="6"),
      parent(figure_refs=["fig.svg"]),
      parent(choices=["6","6.5"]),
      parent(question="データ 2、4、5、7、9、10、12 の四分位範囲を求めなさい。",answer="5"),
      parent(question="データ 2、4、5、7、9、10、12、15 の中央値と四分位範囲を求めなさい。",answer="6.5"),
      parent(question="箱ひげ図を見て四分位範囲を求めなさい。",answer="6.5"),
    ]
    for row in bad:
      ok,_=can_generate(row); assert not ok
      r,e,_=generate(row,1); assert r==[] and e==[]
    print("PASS_SAFE_INTERQUARTILE_RANGE_VARIANT_ENGINE")

if __name__=="__main__": main()
