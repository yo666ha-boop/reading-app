from __future__ import annotations
import copy
from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256

NOW="2026-08-23T04:10:00Z"

def main():
    parent=copy.deepcopy(make_base()[0])
    parent["id"]="U-REG-EXT"
    parent["question"]="正6角形の1つの外角の大きさを求めなさい。"
    parent["answer"]="60°"
    parent["choices"]=None
    parent["figure_refs"]=[]
    parent["source"]["is_generated_variant"]=False
    parent["source"]["parent_id"]=None
    parent["variant_group"]=None
    rows,prov,reason=generate_parent(parent,3,NOW)
    assert reason.startswith("specialized:regular_polygon_interior_angle:regular_polygon_single_exterior_angle_exact")
    assert len(rows)==len(prov)==3
    expected=parent_record_sha256(parent)
    for row,p in zip(rows,prov):
        assert row["source"]["parent_id"]==parent["id"]
        assert row.get("taxonomy")==parent.get("taxonomy")
        assert row.get("difficulty")==parent.get("difficulty")
        assert row.get("choices")==parent.get("choices")
        assert row.get("figure_refs")==parent.get("figure_refs")
        assert row["audit"]["problem_answer_verified"] is True
        assert row["audit"]["structure_verified"] is True
        assert row["audit"]["figure_refs_verified"] is True
        assert p["parent_record_sha256"]==expected
        assert p["independent_recalculation"] is True
        assert "regular_polygon_exterior_sum_divided_by_n_and_supplement_identity" in p["verification_evidence"]
    print("PASS_REGULAR_POLYGON_EXTERIOR_ANGLE_UNIFIED_PARENT_CONTRACT")

if __name__=="__main__":
    main()
