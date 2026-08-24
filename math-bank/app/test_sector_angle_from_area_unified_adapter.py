from __future__ import annotations
import copy
from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import numeric_tokens,parent_record_sha256
NOW="2026-08-24T00:00:00Z"
def main():
    p=copy.deepcopy(make_base()[0]);p["id"]="U-SAFA";p["question"]="半径6cm、面積18.84cm²の扇形の中心角を求めなさい。円周率は3.14とする。";p["answer"]="60度";p["choices"]=None;p["figure_refs"]=[];p["source"]["is_generated_variant"]=False;p["source"]["parent_id"]=None;p["variant_group"]=None
    rows,prov,reason=generate_parent(p,3,NOW);assert reason.startswith("specialized:circle_area_pi_3_14:sector_angle_from_area_pi_3_14_exact");assert len(rows)==len(prov)==3
    ps=tuple(numeric_tokens(p["question"]));ss={tuple(numeric_tokens(r["question"])) for r in rows};assert ps not in ss and len(ss)==3
    expected=parent_record_sha256(p)
    for row,ev in zip(rows,prov):
        assert row["source"]["parent_id"]==p["id"] and row.get("taxonomy")==p.get("taxonomy") and row.get("difficulty")==p.get("difficulty")
        assert row.get("choices")==p.get("choices") and row.get("figure_refs")==p.get("figure_refs")
        audit=row.get("audit") or {};assert all(audit.get(k) is True for k in ("problem_answer_verified","structure_verified","figure_refs_verified"))
        assert ev["parent_record_sha256"]==expected and ev["independent_recalculation"] is True and "sector_angle_from_area_exact_cross_product" in ev["verification_evidence"]
    print("PASS_SECTOR_ANGLE_FROM_AREA_UNIFIED_ADAPTER")
if __name__=="__main__":main()
