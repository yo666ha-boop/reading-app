from __future__ import annotations

import copy

from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256

NOW="2026-08-24T00:00:00Z"


def main():
    parent=copy.deepcopy(make_base()[0])
    parent["id"]="U-INVERSE-PROP-CONST"
    parent["question"]="yはxに反比例し、x=3のときy=8です。比例定数aを求めなさい。"
    parent["answer"]="a=24"
    parent["choices"]=None
    parent["figure_refs"]=[]
    parent["source"]["is_generated_variant"]=False
    parent["source"]["parent_id"]=None
    parent["variant_group"]=None
    rows,prov,reason=generate_parent(parent,3,NOW)
    assert reason.startswith("specialized:inverse_proportion:inverse_proportion_constant_exact")
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
        assert "inverse_proportion_constant_exact_product_and_division_identity" in evidence["verification_evidence"]
    print("PASS_INVERSE_PROPORTION_CONSTANT_UNIFIED_ADAPTER")

if __name__=="__main__": main()
