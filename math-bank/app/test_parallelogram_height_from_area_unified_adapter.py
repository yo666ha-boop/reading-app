from __future__ import annotations
import copy
from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256
NOW="2026-08-24T00:30:00Z"
def main():
    parent=copy.deepcopy(make_base()[0]); parent["id"]="U-PARA-H"
    parent["question"]="底辺8cm、面積48cm²の平行四辺形の高さを求めなさい。"; parent["answer"]="6cm"
    parent["choices"]=[]; parent["figure_refs"]=[]; parent["source"]["is_generated_variant"]=False; parent["source"]["parent_id"]=None; parent["variant_group"]=None
    rows,prov,reason=generate_parent(parent,3,NOW); assert reason.startswith("specialized:parallelogram_area:parallelogram_height_from_area_exact")
    expected=parent_record_sha256(parent); assert len(rows)==len(prov)==3
    for row,p in zip(rows,prov):
        for field in ("grade","unit","skill","difficulty","format","question_format","taxonomy"): assert row.get(field)==parent.get(field)
        assert row.get("choices")==parent.get("choices") and row.get("figure_refs")==parent.get("figure_refs")
        assert p["parent_record_sha256"]==expected and p["independent_recalculation"] is True and "base*height == area PASS" in p["verification_evidence"]
        assert all(row["audit"][k] is True for k in ("problem_answer_verified","structure_verified","figure_refs_verified"))
    print("PASS_PARALLELOGRAM_HEIGHT_FROM_AREA_UNIFIED_CONTRACT")
if __name__=="__main__": main()
