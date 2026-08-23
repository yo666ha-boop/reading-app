from __future__ import annotations

import copy
from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256

NOW="2026-08-23T12:10:00Z"


def main():
    parent=copy.deepcopy(make_base()[0])
    parent["id"]="U-RPH"
    parent["question"]="たて4cm、よこ5cm、体積が120cm³の直方体があります。この直方体の高さを求めなさい。"
    parent["answer"]="6cm"
    parent["choices"]=None
    parent["figure_refs"]=[]
    parent["source"]["is_generated_variant"]=False
    parent["source"]["parent_id"]=None
    parent["variant_group"]=None
    rows, prov, reason=generate_parent(parent,3,NOW)
    assert reason.startswith("specialized:rectangular_prism_volume:rectangular_prism_integer_height_from_volume_exact")
    assert len(rows)==len(prov)==3
    expected=parent_record_sha256(parent)
    for row,p in zip(rows,prov):
        assert row["source"]["parent_id"]==parent["id"]
        assert row.get("taxonomy")==parent.get("taxonomy")
        assert row.get("difficulty")==parent.get("difficulty")
        assert row.get("choices")==parent.get("choices")
        assert row.get("figure_refs")==parent.get("figure_refs")
        assert all(row["audit"].get(k) is True for k in ("problem_answer_verified","structure_verified","figure_refs_verified"))
        assert p["parent_record_sha256"]==expected
        assert p["independent_recalculation"] is True
        assert "rectangular_prism_height_from_volume" in p["verification_evidence"]
    print("PASS_RECTANGULAR_PRISM_HEIGHT_FROM_VOLUME_UNIFIED_ADAPTER")


if __name__=="__main__":
    main()
