from __future__ import annotations

import copy

from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256

NOW="2026-08-24T00:00:00Z"


def main():
    parent=copy.deepcopy(make_base()[0])
    parent["id"]="U-RF-TOTAL"
    parent["question"]="度数は10人、相対度数は0.25です。全体の度数を求めなさい。"
    parent["answer"]="40人"
    parent["choices"]=None
    parent["figure_refs"]=[]
    parent["source"]["is_generated_variant"]=False
    parent["source"]["parent_id"]=None
    parent["variant_group"]=None
    rows,prov,reason=generate_parent(parent,3,NOW)
    assert reason.startswith("specialized:relative_frequency:total_from_relative_frequency_exact")
    assert len(rows)==len(prov)==3
    expected=parent_record_sha256(parent)
    for row,evidence in zip(rows,prov):
        assert row["source"]["parent_id"]==parent["id"]
        assert row.get("taxonomy")==parent.get("taxonomy")
        assert row.get("difficulty")==parent.get("difficulty")
        assert row.get("format")==parent.get("format")
        assert row.get("choices")==parent.get("choices")
        assert row.get("figure_refs")==parent.get("figure_refs")
        audit=row.get("audit") or {}
        assert audit.get("problem_answer_verified") is True
        assert audit.get("structure_verified") is True
        assert audit.get("figure_refs_verified") is True
        assert evidence["parent_record_sha256"]==expected
        assert evidence["independent_recalculation"] is True
        assert "total_from_relative_frequency_exact_division_and_fraction_identity" in evidence["verification_evidence"]
    print("PASS_TOTAL_FROM_RELATIVE_FREQUENCY_UNIFIED_ADAPTER")

if __name__=="__main__": main()
