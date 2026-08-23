from __future__ import annotations

import copy
from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256

NOW="2026-08-23T07:00:00Z"


def main():
    parent=copy.deepcopy(make_base()[0])
    parent["id"]="U-SLOPE-2P"
    parent["question"]="2点(1,3),(4,9)を通る直線の傾きを求めなさい。"
    parent["answer"]="2"
    parent["choices"]=[]
    parent["figure_refs"]=[]
    parent["source"]["is_generated_variant"]=False
    parent["source"]["parent_id"]=None
    parent["variant_group"]=None
    rows,prov,reason=generate_parent(parent,3,NOW)
    assert reason.startswith("specialized:slope_from_two_points:")
    assert len(rows)==len(prov)==3
    expected=parent_record_sha256(parent)
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
        assert p["parent_record_sha256"]==expected
        assert p["independent_recalculation"] is True
        assert "engine=slope_from_two_points" in p["verification_evidence"]
        assert "delta_y=" in p["verification_evidence"]
    print("PASS_SLOPE_FROM_TWO_POINTS_UNIFIED_PARENT_SHA_METADATA_AUDIT_AND_IDENTITY")

if __name__=="__main__":main()
