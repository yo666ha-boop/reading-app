from __future__ import annotations
import copy
from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256
NOW="2026-08-22T00:00:00Z"
def main():
    p=copy.deepcopy(make_base()[0]); p["id"]="U-PYTH"; p["question"]="直角をはさむ2辺が3cmと4cmの直角三角形があります。斜辺の長さを求めなさい。"; p["answer"]="5cm"; p["choices"]=[]; p["figure_refs"]=[]; p["source"]["is_generated_variant"]=False; p["source"]["parent_id"]=None; p["variant_group"]=None
    rows,prov,reason=generate_parent(p,3,NOW); assert reason.startswith("specialized:pythagorean_hypotenuse:"); assert len(rows)==len(prov)==3
    sha=parent_record_sha256(p)
    for r,e in zip(rows,prov):
        assert r["source"]["parent_id"]==p["id"] and r.get("taxonomy")==p.get("taxonomy") and r.get("difficulty")==p.get("difficulty") and r.get("choices")==p.get("choices") and r.get("figure_refs")==p.get("figure_refs")
        a=r.get("audit") or {}; assert a.get("problem_answer_verified") is True and a.get("structure_verified") is True and a.get("figure_refs_verified") is True
        assert e["parent_record_sha256"]==sha and e["independent_recalculation"] is True and "engine=pythagorean_hypotenuse" in e["verification_evidence"] and "PASS" in e["verification_evidence"]
    print("PASS_PYTHAGOREAN_HYPOTENUSE_UNIFIED_ADAPTER")
if __name__=="__main__": main()
