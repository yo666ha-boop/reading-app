from __future__ import annotations
import copy
from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import numeric_tokens,parent_record_sha256
NOW="2026-08-24T03:00:00Z"

def main():
    parent=copy.deepcopy(make_base()[0]);parent["id"]="U-RP-SA-SIDE"
    parent["question"]="直方体で、よこ4cm、高さ5cm、表面積148cm²です。たてを求めなさい。";parent["answer"]="6cm"
    parent["choices"]=None;parent["figure_refs"]=[];parent["source"]["is_generated_variant"]=False;parent["source"]["parent_id"]=None;parent["variant_group"]=None
    rows,prov,reason=generate_parent(parent,3,NOW);assert reason.startswith("specialized:rectangular_prism_volume:rectangular_prism_side_from_surface_area_exact")
    assert len(rows)==len(prov)==3
    ps=tuple(numeric_tokens(parent["question"]));ss={tuple(numeric_tokens(r["question"])) for r in rows};assert ps not in ss and len(ss)==3
    expected=parent_record_sha256(parent)
    for row,p in zip(rows,prov):
        assert row["source"]["parent_id"]==parent["id"]
        for field in ("grade","unit","skill","difficulty","format","question_format","taxonomy"):assert row.get(field)==parent.get(field)
        assert row.get("choices")==parent.get("choices") and row.get("figure_refs")==parent.get("figure_refs")
        assert p["parent_record_sha256"]==expected and p["independent_recalculation"] is True
        assert "rectangular_prism_side_from_surface_area_exact_linear_inverse_and_recomposition" in p["verification_evidence"]
        assert all((row.get("audit") or {}).get(k) is True for k in ("problem_answer_verified","structure_verified","figure_refs_verified"))
    print("PASS_RECTANGULAR_PRISM_SIDE_FROM_SURFACE_AREA_UNIFIED_CONTRACT")
if __name__=="__main__":main()
