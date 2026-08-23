from __future__ import annotations

import copy
from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256

NOW="2026-08-24T03:00:00+09:00"


def main():
    parent=copy.deepcopy(make_base()[0])
    parent["id"]="U-RPSA"
    parent["question"]="たて4cm、よこ3cm、高さ2cmの直方体の表面積を求めなさい。"
    parent["answer"]="52cm²"
    parent["choices"]=None
    parent["figure_refs"]=[]
    parent["source"]["is_generated_variant"]=False
    parent["source"]["parent_id"]=None
    parent["variant_group"]=None
    rows, prov, reason=generate_parent(parent,3,NOW)
    assert reason.startswith("specialized:rectangular_prism_volume:rectangular_prism_integer_cm_surface_area_exact")
    assert len(rows)==len(prov)==3
    expected=parent_record_sha256(parent)
    assert len({row["question"] for row in rows})==3
    for row,p in zip(rows,prov):
        assert row["source"]["parent_id"]==parent["id"]
        assert row.get("taxonomy")==parent.get("taxonomy")
        assert row.get("difficulty")==parent.get("difficulty")
        assert row.get("choices")==parent.get("choices")
        assert row.get("figure_refs")==parent.get("figure_refs")
        assert all(row["audit"].get(k) is True for k in ("problem_answer_verified","structure_verified","figure_refs_verified"))
        assert p["parent_record_sha256"]==expected
        assert p["independent_recalculation"] is True
        assert "rectangular_prism_surface_area_exact_three_face_pairs" in p["verification_evidence"]
    print("PASS_RECTANGULAR_PRISM_SURFACE_AREA_UNIFIED_ADAPTER")


if __name__=="__main__":
    main()
