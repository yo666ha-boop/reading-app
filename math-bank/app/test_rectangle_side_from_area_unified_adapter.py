from __future__ import annotations

import copy

from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256

NOW="2026-08-24T00:00:00Z"


def main():
    parent=copy.deepcopy(make_base()[0])
    parent["id"]="U-RECT-SIDE"
    parent["question"]="たて8cm、面積40cm²の長方形があります。横の長さを求めなさい。"
    parent["answer"]="5cm"
    parent["choices"]=None
    parent["figure_refs"]=[]
    parent["source"]["is_generated_variant"]=False
    parent["source"]["parent_id"]=None
    parent["variant_group"]=None
    rows,prov,reason=generate_parent(parent,3,NOW)
    assert reason.startswith("specialized:rectangle_area:rectangle_missing_side_from_area_exact")
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
        assert "rectangle_missing_side_from_area_exact_division_and_product_recomposition" in evidence["verification_evidence"]
    print("PASS_RECTANGLE_SIDE_FROM_AREA_UNIFIED_ADAPTER")

if __name__=="__main__": main()
