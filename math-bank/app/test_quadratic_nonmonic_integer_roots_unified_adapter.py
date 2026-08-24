from __future__ import annotations

import copy
from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import numeric_tokens, parent_record_sha256

NOW="2026-08-24T05:00:00Z"


def main():
    p=copy.deepcopy(make_base()[0]); p["id"]="U-Q-NONMONIC"; p["question"]="二次方程式 2x²-10x+12=0 を解きなさい。"; p["answer"]="x=2, x=3"; p["choices"]=[]; p["figure_refs"]=[]; p["source"]["is_generated_variant"]=False; p["source"]["parent_id"]=None; p["variant_group"]=None
    rows,prov,reason=generate_parent(p,3,NOW)
    assert reason.startswith("specialized:quadratic_square_equation:quadratic_nonmonic_two_integer_roots_exact")
    assert len(rows)==len(prov)==3
    assert len({tuple(numeric_tokens(row["question"])) for row in rows})==3
    assert all(tuple(numeric_tokens(row["question"])) != tuple(numeric_tokens(p["question"])) for row in rows)
    expected=parent_record_sha256(p)
    for row,ev in zip(rows,prov):
        assert row["source"]["parent_id"]==p["id"]
        assert row.get("taxonomy")==p.get("taxonomy") and row.get("difficulty")==p.get("difficulty")
        assert row.get("format")==p.get("format") and row.get("question_format")==p.get("question_format")
        assert row.get("choices")==p.get("choices") and row.get("figure_refs")==p.get("figure_refs")
        audit=row.get("audit") or {}; assert all(audit.get(k) is True for k in ("problem_answer_verified","structure_verified","figure_refs_verified"))
        assert ev["parent_record_sha256"]==expected and ev["independent_recalculation"] is True
        assert "engine=quadratic_square_equation" in ev["verification_evidence"]
        assert "both_substitute_to_0 PASS" in ev["verification_evidence"]
    print("PASS_QUADRATIC_NONMONIC_INTEGER_ROOTS_UNIFIED_PARENT_CONTRACT")

if __name__=="__main__": main()
