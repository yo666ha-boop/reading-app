from __future__ import annotations
import copy
from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256
NOW="2026-08-23T02:20:00Z"
def parent():
    p=copy.deepcopy(make_base()[0]); p["id"]="U-POLY-SUM"; p["question"]="8角形の内角の和を求めなさい。"; p["answer"]="1080°"; p["choices"]=[]; p["figure_refs"]=[]; p["source"]["is_generated_variant"]=False; p["source"]["parent_id"]=None; p["variant_group"]=None; return p
def main():
    p=parent(); rows,prov,reason=generate_parent(p,3,NOW); assert reason.startswith("specialized:polygon_interior_sum:"); assert len(rows)==len(prov)==3
    expected=parent_record_sha256(p)
    for r,e in zip(rows,prov):
        assert r["source"]["parent_id"]==p["id"] and r["choices"]==[] and r["figure_refs"]==[]
        assert all(r["audit"][k] is True for k in ("problem_answer_verified","structure_verified","figure_refs_verified"))
        assert e["parent_record_sha256"]==expected and e["independent_recalculation"] is True and "polygon_interior_sum_formula_and_triangle_decomposition_identity" in e["verification_evidence"]
    bad=parent(); bad["answer"]="1070°"; rows,prov,reason=generate_parent(bad,1,NOW); assert rows==[] and prov==[] and "polygon_interior_sum_parent_not_exactly_parsed_and_verified" in reason
    print("PASS_POLYGON_INTERIOR_SUM_UNIFIED_PARENT_SHA_EMPTY_CHOICES_AUDIT3_AND_IDENTITY")
if __name__=="__main__": main()
