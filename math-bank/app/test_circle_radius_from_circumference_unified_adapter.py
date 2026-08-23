from __future__ import annotations

import copy
from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256

NOW="2026-08-23T10:10:00Z"


def main():
    parent=copy.deepcopy(make_base()[0])
    parent["id"]="U-CIRCLE-RADIUS"
    parent["question"]="円周率を3.14として、円周の長さが31.4cmの円の半径を求めなさい。"
    parent["answer"]="5cm"
    parent["choices"]=None; parent["figure_refs"]=[]
    parent["source"]["is_generated_variant"]=False; parent["source"]["parent_id"]=None; parent["variant_group"]=None
    rows,prov,reason=generate_parent(parent,3,NOW)
    assert reason.startswith("specialized:circle_circumference_pi_3_14:circle_radius_from_circumference_pi_3_14_exact")
    assert len(rows)==len(prov)==3
    expected_sha=parent_record_sha256(parent)
    for row,p in zip(rows,prov):
        assert row["source"]["parent_id"]==parent["id"]
        assert row.get("taxonomy")==parent.get("taxonomy")
        assert row.get("difficulty")==parent.get("difficulty")
        assert row.get("choices")==parent.get("choices")
        assert row.get("figure_refs")==parent.get("figure_refs")
        assert all(row["audit"][k] is True for k in ("problem_answer_verified","structure_verified","figure_refs_verified"))
        assert p["parent_record_sha256"]==expected_sha
        assert p["independent_recalculation"] is True
        assert "circle_radius_from_circumference_exact_division_and_recomposition" in p["verification_evidence"]
    print("PASS_CIRCLE_RADIUS_FROM_CIRCUMFERENCE_UNIFIED_ADAPTER")

if __name__=="__main__": main()
