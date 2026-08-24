from __future__ import annotations

import copy
from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256

NOW="2026-08-24T02:00:00Z"

def main():
    p=copy.deepcopy(make_base()[0]); p["id"]="U-ROOT-QUOT"; p["question"]="√18÷√2を計算しなさい。"; p["answer"]="3"; p["choices"]=None; p["figure_refs"]=[]; p["source"]["is_generated_variant"]=False; p["source"]["parent_id"]=None; p["variant_group"]=None
    rows,prov,reason=generate_parent(p,3,NOW)
    assert reason.startswith("specialized:square_root_simplification:square_root_quotient_integer_exact")
    assert len(rows)==len(prov)==3
    expected=parent_record_sha256(p); surfaces=set()
    for row,ev in zip(rows,prov):
        assert row["source"]["parent_id"]==p["id"]
        assert row.get("taxonomy")==p.get("taxonomy") and row.get("difficulty")==p.get("difficulty")
        assert row.get("choices")==p.get("choices") and row.get("figure_refs")==p.get("figure_refs")
        audit=row.get("audit") or {}; assert all(audit.get(k) is True for k in ("problem_answer_verified","structure_verified","figure_refs_verified"))
        assert ev["parent_record_sha256"]==expected and ev["independent_recalculation"] is True
        assert "square_root_quotient_exact_ratio_square_and_recomposition" in ev["verification_evidence"]
        nums=tuple(__import__("re").findall(r"\d+",row["question"])); assert nums not in surfaces; surfaces.add(nums)
    print("PASS_SQUARE_ROOT_QUOTIENT_UNIFIED_ADAPTER")
if __name__=="__main__": main()
