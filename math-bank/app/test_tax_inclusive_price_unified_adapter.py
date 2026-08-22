from __future__ import annotations
import copy
from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256
NOW="2026-08-22T09:10:00Z"

def main():
    parent=copy.deepcopy(make_base()[0])
    parent["id"]="U-TAX"
    parent["question"]="1200円の商品に消費税10%を加えた税込みの代金を求めなさい。"
    parent["answer"]="1320円"; parent["choices"]=None; parent["figure_refs"]=[]
    parent["source"]["is_generated_variant"]=False; parent["source"]["parent_id"]=None; parent["variant_group"]=None
    rows,prov,reason=generate_parent(parent,3,NOW)
    assert reason.startswith("specialized:tax_inclusive_price:")
    assert len(rows)==len(prov)==3
    expected_sha=parent_record_sha256(parent)
    for row,p in zip(rows,prov):
        assert row["source"]["parent_id"]==parent["id"]
        assert row.get("taxonomy")==parent.get("taxonomy")
        assert row.get("difficulty")==parent.get("difficulty")
        assert row.get("format")==parent.get("format")
        assert row.get("choices")==parent.get("choices")
        assert row.get("figure_refs")==parent.get("figure_refs")
        assert row["audit"]["problem_answer_verified"] is True
        assert row["audit"]["structure_verified"] is True
        assert row["audit"]["figure_refs_verified"] is True
        assert p["parent_record_sha256"]==expected_sha
        assert p["independent_recalculation"] is True
        assert "engine=tax_inclusive_price" in p["verification_evidence"]
    print("PASS_TAX_INCLUSIVE_PRICE_UNIFIED_ADAPTER")

if __name__=="__main__": main()
