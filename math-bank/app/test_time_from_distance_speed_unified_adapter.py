from __future__ import annotations
import copy
from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256
NOW="2026-08-24T00:00:00Z"

def main():
    parent=copy.deepcopy(make_base()[0]); parent["id"]="U-TIME-INV"; parent["question"]="時速60kmで180km進むには何時間かかりますか。"; parent["answer"]="3時間"; parent["choices"]=None; parent["figure_refs"]=[]; parent["source"]["is_generated_variant"]=False; parent["source"]["parent_id"]=None; parent["variant_group"]=None
    rows,prov,reason=generate_parent(parent,3,NOW); assert reason.startswith("specialized:speed_distance:time_from_distance_speed_exact"); assert len(rows)==len(prov)==3; expected=parent_record_sha256(parent)
    for row,evidence in zip(rows,prov):
        assert row["source"]["parent_id"]==parent["id"] and row.get("taxonomy")==parent.get("taxonomy") and row.get("difficulty")==parent.get("difficulty") and row.get("choices")==parent.get("choices") and row.get("figure_refs")==parent.get("figure_refs")
        audit=row.get("audit") or {}; assert audit.get("problem_answer_verified") is True and audit.get("structure_verified") is True and audit.get("figure_refs_verified") is True
        assert evidence["parent_record_sha256"]==expected and evidence["independent_recalculation"] is True and "time_from_distance_speed_exact_division_and_product_recomposition" in evidence["verification_evidence"]
    print("PASS_TIME_FROM_DISTANCE_SPEED_UNIFIED_ADAPTER")
if __name__=="__main__": main()
