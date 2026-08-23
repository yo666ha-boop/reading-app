from __future__ import annotations
import copy
from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256
NOW="2026-08-23T03:10:00Z"
def parent():
    p=copy.deepcopy(make_base()[0]); p["id"]="U-REG-POLY-ANGLE"; p["question"]="正6角形の1つの内角の大きさを求めなさい。"; p["answer"]="120°"; p["choices"]=[]; p["figure_refs"]=[]; p["source"]["is_generated_variant"]=False; p["source"]["parent_id"]=None; p["variant_group"]=None; return p
def main():
    p=parent(); rows,prov,reason=generate_parent(p,3,NOW); assert reason.startswith("specialized:regular_polygon_interior_angle:"); assert len(rows)==len(prov)==3
    expected=parent_record_sha256(p)
    for r,e in zip(rows,prov):
        assert r["source"]["parent_id"]==p["id"] and r["choices"]==[] and r["figure_refs"]==[]
        assert all(r["audit"][k] is True for k in ("problem_answer_verified","structure_verified","figure_refs_verified"))
        assert e["parent_record_sha256"]==expected and e["independent_recalculation"] is True and "regular_polygon_interior_sum_divided_by_n_and_recomposition_identity" in e["verification_evidence"]
    bad=parent(); bad["answer"]="121°"; rows,prov,reason=generate_parent(bad,1,NOW); assert rows==[] and prov==[] and "regular_polygon_interior_angle_parent_not_exactly_parsed_and_verified" in reason
    print("PASS_REGULAR_POLYGON_INTERIOR_ANGLE_UNIFIED_PARENT_SHA_EMPTY_CHOICES_AUDIT3_AND_IDENTITY")
if __name__=="__main__": main()
