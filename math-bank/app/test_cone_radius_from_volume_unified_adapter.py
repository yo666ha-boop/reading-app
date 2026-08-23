from __future__ import annotations
import copy
from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256
NOW="2026-08-24T00:00:00Z"

def main():
    parent=copy.deepcopy(make_base()[0]); parent["id"]="U-CONE-R-INV"; parent["question"]="高さ10cm、体積94.2cm³の円すいの半径を、円周率を3.14として求めなさい。"; parent["answer"]="3cm"; parent["choices"]=None; parent["figure_refs"]=[]; parent["source"]["is_generated_variant"]=False; parent["source"]["parent_id"]=None; parent["variant_group"]=None
    rows,prov,reason=generate_parent(parent,3,NOW)
    assert reason.startswith("specialized:cone_volume_pi_3_14:cone_radius_from_volume_pi_3_14_exact")
    assert len(rows)==len(prov)==3 and len({r["question"] for r in rows})==3
    sha=parent_record_sha256(parent)
    for row,e in zip(rows,prov):
        assert row["source"]["parent_id"]==parent["id"] and row.get("taxonomy")==parent.get("taxonomy") and row.get("difficulty")==parent.get("difficulty") and row.get("format")==parent.get("format") and row.get("choices")==parent.get("choices") and row.get("figure_refs")==parent.get("figure_refs")
        assert all(row["audit"][k] is True for k in ("problem_answer_verified","structure_verified","figure_refs_verified"))
        assert e["parent_record_sha256"]==sha and e["independent_recalculation"] is True
        assert "engine=cone_volume_pi_3_14" in e["verification_evidence"] and "cone_radius_exact_triple_volume_division_square_root_and_recomposition" in e["verification_evidence"] and "PASS" in e["verification_evidence"]
    print("PASS_CONE_RADIUS_FROM_VOLUME_UNIFIED_PARENT_CONTRACT")

if __name__=="__main__": main()
