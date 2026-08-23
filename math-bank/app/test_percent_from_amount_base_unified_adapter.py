from __future__ import annotations

import copy
from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256

NOW="2026-08-24T00:00:00Z"


def main():
    parent=copy.deepcopy(make_base()[0])
    parent["id"]="U-PERCENT-FROM-AMOUNT"
    parent["question"]="800円のうち200円は何%ですか。"
    parent["answer"]="25%"
    parent["choices"]=[]; parent["figure_refs"]=[]
    parent["source"]["is_generated_variant"]=False; parent["source"]["parent_id"]=None; parent["variant_group"]=None
    rows,prov,reason=generate_parent(parent,3,NOW)
    assert reason.startswith("specialized:percentage:percent_from_amount_base_integer_exact")
    assert len(rows)==len(prov)==3
    expected=parent_record_sha256(parent)
    for row,p in zip(rows,prov):
        assert row["source"]["parent_id"]==parent["id"]
        assert row["taxonomy"]==parent["taxonomy"] and row["difficulty"]==parent["difficulty"]
        assert row["choices"]==parent["choices"] and row["figure_refs"]==parent["figure_refs"]
        assert all(row["audit"][k] is True for k in ("problem_answer_verified","structure_verified","figure_refs_verified"))
        assert p["parent_record_sha256"]==expected and p["independent_recalculation"] is True
        assert "engine=percentage" in p["verification_evidence"]
        assert "percent*base/100 == amount PASS" in p["verification_evidence"]
    print("PASS_PERCENT_FROM_AMOUNT_BASE_UNIFIED_PARENT_SHA_METADATA_AUDIT_AND_IDENTITY")

if __name__=="__main__": main()
