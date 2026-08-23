from __future__ import annotations

import copy
from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256

NOW="2026-08-24T00:00:00Z"


def main():
    parent=copy.deepcopy(make_base()[0])
    parent["id"]="U-BASE-FROM-PERCENT"
    parent["question"]="20%にあたる160円があります。もとの金額はいくらですか。"
    parent["answer"]="800円"
    parent["choices"]=[]; parent["figure_refs"]=[]
    parent["source"]["is_generated_variant"]=False; parent["source"]["parent_id"]=None; parent["variant_group"]=None
    rows,prov,reason=generate_parent(parent,3,NOW)
    assert reason.startswith("specialized:percentage:base_from_amount_percent_integer_exact")
    assert len(rows)==len(prov)==3
    expected=parent_record_sha256(parent)
    for row,p in zip(rows,prov):
        assert row["source"]["parent_id"]==parent["id"]
        assert row["taxonomy"]==parent["taxonomy"] and row["difficulty"]==parent["difficulty"]
        assert row["choices"]==parent["choices"] and row["figure_refs"]==parent["figure_refs"]
        assert all(row["audit"][k] is True for k in ("problem_answer_verified","structure_verified","figure_refs_verified"))
        assert p["parent_record_sha256"]==expected and p["independent_recalculation"] is True
        assert "engine=percentage" in p["verification_evidence"]
        assert "base*percent/100 == amount PASS" in p["verification_evidence"]
    print("PASS_BASE_FROM_AMOUNT_PERCENT_UNIFIED_PARENT_SHA_METADATA_AUDIT_AND_IDENTITY")

if __name__=="__main__": main()
