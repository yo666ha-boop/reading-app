from __future__ import annotations

import copy
from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256

NOW="2026-08-23T00:00:00Z"


def main():
    parent=copy.deepcopy(make_base()[0])
    parent["id"]="U-SYS-001"
    parent["question"]="次の連立方程式を解きなさい。 x+y=11, x-y=3"
    parent["answer"]="x=7, y=4"
    parent["choices"]=None
    parent["figure_refs"]=[]
    parent["source"]["is_generated_variant"]=False
    parent["source"]["parent_id"]=None
    parent["variant_group"]=None
    rows,prov,reason=generate_parent(parent,3,NOW)
    assert reason.startswith("specialized:symmetric_linear_system:")
    assert len(rows)==len(prov)==3
    assert len({r["question"] for r in rows})==3
    expected=parent_record_sha256(parent)
    for row,p in zip(rows,prov):
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
        assert p["parent_record_sha256"]==expected
        assert p["independent_recalculation"] is True
        assert "engine=symmetric_linear_system" in p["verification_evidence"]
    print("PASS_SYMMETRIC_LINEAR_SYSTEM_UNIFIED_ADAPTER_PARENT_SHA_METADATA_AUDIT_AND_INDEPENDENT_RECALCULATION")

if __name__=="__main__":
    main()
