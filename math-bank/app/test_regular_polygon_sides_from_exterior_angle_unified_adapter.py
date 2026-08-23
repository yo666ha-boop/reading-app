from __future__ import annotations
import copy

from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256

NOW="2026-08-23T05:00:00Z"

def main():
    parent=copy.deepcopy(make_base()[0])
    parent["id"]="U-RPOLY-EXTERIOR-INVERSE"
    parent["question"]="1つの外角が45°である正多角形は何角形ですか。"
    parent["answer"]="8角形"
    parent["choices"]=None
    parent["figure_refs"]=[]
    parent["source"]["is_generated_variant"]=False
    parent["source"]["parent_id"]=None
    parent["variant_group"]=None

    rows,prov,reason=generate_parent(parent,3,NOW)
    assert "regular_polygon_sides_from_single_exterior_angle_exact" in reason, reason
    assert len(rows)==len(prov)==3
    assert len({row["question"] for row in rows})==3
    expected_sha=parent_record_sha256(parent)
    for row,evidence in zip(rows,prov):
        assert row["source"]["parent_id"]==parent["id"]
        assert row.get("taxonomy")==parent.get("taxonomy")
        assert row.get("difficulty")==parent.get("difficulty")
        assert row.get("choices")==parent.get("choices")
        assert row.get("figure_refs")==parent.get("figure_refs")
        audit=row.get("audit") or {}
        assert audit.get("problem_answer_verified") is True
        assert audit.get("structure_verified") is True
        assert audit.get("figure_refs_verified") is True
        assert evidence["parent_record_sha256"]==expected_sha
        assert evidence["independent_recalculation"] is True
        assert "engine=regular_polygon_exterior_angle" in evidence["verification_evidence"], evidence["verification_evidence"]
        assert row["answer"].endswith("角形")
    print("PASS_REGULAR_POLYGON_SIDES_FROM_EXTERIOR_UNIFIED_PARENT_CONTRACT", reason)

if __name__=="__main__": main()
