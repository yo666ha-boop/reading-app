from __future__ import annotations

import copy
from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256

NOW="2026-08-24T00:15:00Z"


def main():
    parent=copy.deepcopy(make_base()[0])
    parent["id"]="U-TRI-HEIGHT-FROM-AREA"
    parent["question"]="底辺8cm、面積24cm²の三角形の高さを求めなさい。"
    parent["answer"]="6cm"; parent["choices"]=[]; parent["figure_refs"]=[]
    parent["source"]["is_generated_variant"]=False; parent["source"]["parent_id"]=None; parent["variant_group"]=None
    rows,prov,reason=generate_parent(parent,3,NOW)
    assert reason.startswith("specialized:triangle_area:triangle_height_from_area_exact")
    assert len(rows)==len(prov)==3
    expected=parent_record_sha256(parent)
    for row,p in zip(rows,prov):
        assert row["source"]["parent_id"]==parent["id"]
        for field in ("grade","unit","skill","difficulty","format","question_format","taxonomy"):
            assert row.get(field)==parent.get(field)
        assert row.get("choices")==parent.get("choices") and row.get("figure_refs")==parent.get("figure_refs")
        assert all(row["audit"][k] is True for k in ("problem_answer_verified","structure_verified","figure_refs_verified"))
        assert p["parent_record_sha256"]==expected and p["independent_recalculation"] is True
        assert "engine=triangle_area" in p["verification_evidence"] and "base*height == 2*area PASS" in p["verification_evidence"]
    print("PASS_TRIANGLE_HEIGHT_FROM_AREA_UNIFIED_PARENT_SHA_METADATA_AUDIT_AND_IDENTITY")

if __name__=="__main__": main()
