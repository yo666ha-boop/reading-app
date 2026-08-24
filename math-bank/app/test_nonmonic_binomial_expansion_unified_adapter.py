from __future__ import annotations
import copy
from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256
NOW="2026-08-24T06:00:00Z"
def main():
    p=copy.deepcopy(make_base()[0]); p["id"]="U-EXP-NONMONIC"; p["question"]="(2x+3)(3x-4)を展開しなさい。"; p["answer"]="6x²+x-12"; p["choices"]=[]; p["figure_refs"]=[]; p["source"]["is_generated_variant"]=False; p["source"]["parent_id"]=None; p["variant_group"]=None
    rows,prov,reason=generate_parent(p,3,NOW)
    assert reason.startswith("specialized:binomial_expansion:nonmonic_binomial_integer_expansion_exact")
    assert len(rows)==len(prov)==3 and len({tuple(r["numeric_signature"]) for r in rows})==3
    expected=parent_record_sha256(p)
    for r,e in zip(rows,prov):
        assert r["source"]["parent_id"]==p["id"] and r.get("taxonomy")==p.get("taxonomy") and r.get("difficulty")==p.get("difficulty")
        assert r.get("choices")==p.get("choices") and r.get("figure_refs")==p.get("figure_refs")
        a=r.get("audit") or {}; assert all(a.get(k) is True for k in ("problem_answer_verified","structure_verified","figure_refs_verified"))
        assert e["parent_record_sha256"]==expected and e["independent_recalculation"] is True
        assert "engine=binomial_expansion" in e["verification_evidence"] and "all three expanded coefficients" in e["verification_evidence"]
    print("PASS_NONMONIC_BINOMIAL_EXPANSION_UNIFIED_PARENT_CONTRACT")
if __name__=="__main__": main()
