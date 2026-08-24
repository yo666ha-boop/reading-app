from __future__ import annotations

from safe_direct_proportion_value_variant_engine import can_generate, generate


def parent(question="yはxに比例し、比例定数は3です。x=4のとき、yの値を求めなさい。", answer="y=12"):
    return {"id":"P-DPV","question":question,"answer":answer,"choices":None,"figure_refs":[]}


def main():
    p=parent(); ok,reason=can_generate(p); assert ok and reason=="direct_proportion_value_exact"
    rows,evidence,reason=generate(p,3); assert reason=="direct_proportion_value_exact"; assert len(rows)==len(evidence)==3
    sigs=set()
    for row,ev in zip(rows,evidence):
        assert row["question"]!=p["question"]
        assert row["numeric_signature"] not in sigs; sigs.add(row["numeric_signature"])
        assert ev["method"]=="direct_proportion_value_exact_product_and_inverse_identity"
        assert "PASS" in ev["independent_check"]
    assert generate(parent(answer="y=13"),1)[0]==[]
    assert generate(parent(question="yはxに比例し、比例定数は3です。x=4のとき、xの値を求めなさい。",answer="4"),1)[0]==[]
    bad=parent(); bad["figure_refs"]=["fig-1"]; assert generate(bad,1)[0]==[]
    bad=parent(); bad["choices"]=["10","12"]; assert generate(bad,1)[0]==[]
    print("PASS_SAFE_DIRECT_PROPORTION_VALUE_VARIANT_ENGINE")

if __name__=="__main__": main()
