from __future__ import annotations

import copy
from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import numeric_tokens, parent_record_sha256

NOW="2026-08-24T00:00:00Z"

def main():
    p=copy.deepcopy(make_base()[0]); p["id"]="U-AFF-X"; p["question"]="y=3x+2で、y=20のときのxの値を求めなさい。"; p["answer"]="x=6"; p["choices"]=None; p["figure_refs"]=[]; p["source"]["is_generated_variant"]=False; p["source"]["parent_id"]=None; p["variant_group"]=None
    rows,prov,reason=generate_parent(p,3,NOW)
    assert reason.startswith("specialized:affine:affine_x_from_y_exact")
    assert len(rows)==len(prov)==3
    parent_sig=tuple(numeric_tokens(p["question"])); sibling_sigs={tuple(numeric_tokens(row["question"])) for row in rows}
    assert parent_sig not in sibling_sigs and len(sibling_sigs)==3
    assert all(row["question"]!=p["question"] for row in rows)
    expected=parent_record_sha256(p)
    for row,ev in zip(rows,prov):
        assert row["source"]["parent_id"]==p["id"]
        assert row.get("taxonomy")==p.get("taxonomy") and row.get("difficulty")==p.get("difficulty")
        assert row.get("choices")==p.get("choices") and row.get("figure_refs")==p.get("figure_refs")
        audit=row.get("audit") or {}; assert all(audit.get(k) is True for k in ("problem_answer_verified","structure_verified","figure_refs_verified"))
        assert ev["parent_record_sha256"]==expected and ev["independent_recalculation"] is True
        assert "affine_x_from_y_exact_inverse_and_forward_recomposition" in ev["verification_evidence"]
    print("PASS_AFFINE_X_FROM_Y_UNIFIED_ADAPTER_SIBLING_UNIQUENESS")

if __name__=="__main__": main()
