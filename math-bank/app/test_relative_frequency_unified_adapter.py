from __future__ import annotations

import copy
from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256

NOW="2026-08-22T09:00:00Z"

def main()->None:
    parent=copy.deepcopy(make_base()[0])
    parent["id"]="U-REL-FREQ"
    parent["question"]="ある階級の度数は6人、全体の度数は20人です。この階級の相対度数を求めなさい。"
    parent["answer"]="0.3"
    parent["choices"]=[]
    parent["figure_refs"]=[]
    parent["source"]["is_generated_variant"]=False
    parent["source"]["parent_id"]=None
    parent["variant_group"]=None
    rows,prov,reason=generate_parent(parent,3,NOW)
    assert reason.startswith("specialized:relative_frequency:")
    assert len(rows)==len(prov)==3
    expected_sha=parent_record_sha256(parent)
    for row,p in zip(rows,prov):
        assert row["source"]["parent_id"]==parent["id"]
        assert row.get("taxonomy")==parent.get("taxonomy")
        assert row.get("difficulty")==parent.get("difficulty")
        assert row.get("format")==parent.get("format")
        assert row.get("choices")==[]
        assert row.get("figure_refs")==[]
        assert row["audit"]["problem_answer_verified"] is True
        assert row["audit"]["structure_verified"] is True
        assert row["audit"]["figure_refs_verified"] is True
        assert p["parent_record_sha256"]==expected_sha
        assert p["independent_recalculation"] is True
        assert "engine=relative_frequency" in p["verification_evidence"]
        assert "PASS" in p["verification_evidence"]
    print("PASS_RELATIVE_FREQUENCY_UNIFIED_PARENT_SHA_METADATA_AUDIT_AND_INDEPENDENT_RECALCULATION")

if __name__=="__main__": main()
