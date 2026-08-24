from __future__ import annotations
import copy
from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import numeric_tokens, parent_record_sha256
NOW="2026-08-24T08:25:00Z"


def make_parent(mode="forward"):
    parent=copy.deepcopy(make_base()[0]); parent["id"]="U-TAX-"+mode.upper()
    if mode=="reverse":
        parent["question"]="税込み1320円、消費税10%の商品です。税抜き価格を求めなさい。"; parent["answer"]="1200円"
    elif mode=="amount":
        parent["question"]="1200円の商品に消費税10%がかかります。消費税額を求めなさい。"; parent["answer"]="120円"
    else:
        parent["question"]="1200円の商品に消費税10%を加えた税込みの代金を求めなさい。"; parent["answer"]="1320円"
    parent["choices"]=None; parent["figure_refs"]=[]; parent["source"]["is_generated_variant"]=False; parent["source"]["parent_id"]=None; parent["variant_group"]=None
    return parent


def assert_unified(parent,expected_reason):
    rows,prov,reason=generate_parent(parent,3,NOW); assert reason.startswith("specialized:tax_inclusive_price:"+expected_reason)
    assert len(rows)==len(prov)==3
    expected_sha=parent_record_sha256(parent); parent_sig=tuple(numeric_tokens(parent["question"])); sibling_sigs=set()
    for row,p in zip(rows,prov):
        sig=tuple(numeric_tokens(row["question"])); assert sig!=parent_sig and sig not in sibling_sigs; sibling_sigs.add(sig)
        assert row["source"]["parent_id"]==parent["id"] and row.get("taxonomy")==parent.get("taxonomy") and row.get("difficulty")==parent.get("difficulty")
        assert row.get("format")==parent.get("format") and row.get("choices")==parent.get("choices") and row.get("figure_refs")==parent.get("figure_refs")
        assert row["audit"]["problem_answer_verified"] is True and row["audit"]["structure_verified"] is True and row["audit"]["figure_refs_verified"] is True
        assert p["parent_record_sha256"]==expected_sha and p["independent_recalculation"] is True and "engine=tax_inclusive_price" in p["verification_evidence"]
    return rows


def main():
    forward=assert_unified(make_parent("forward"),"tax_inclusive_yen_exact")
    reverse=assert_unified(make_parent("reverse"),"tax_exclusive_from_inclusive_yen_exact")
    amount=assert_unified(make_parent("amount"),"tax_amount_yen_exact")
    assert all("税抜き価格" in row["question"] for row in reverse)
    assert all("消費税額" in row["question"] for row in amount)
    assert all(row["answer"].endswith("円") for row in forward+reverse+amount)
    print("PASS_TAX_INCLUSIVE_PRICE_UNIFIED_ADAPTER_FORWARD_REVERSE_AMOUNT")

if __name__=="__main__": main()
