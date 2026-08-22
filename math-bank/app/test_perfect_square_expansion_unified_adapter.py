from __future__ import annotations
import copy
from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256
NOW="2026-08-23T00:00:00Z"

def main():
    p=copy.deepcopy(make_base()[0]); p["id"]="U-PSQEXP"; p["question"]="(x+3)²を展開しなさい。"; p["answer"]="x²+6x+9"; p["choices"]=None; p["figure_refs"]=[]; p["source"]["is_generated_variant"]=False; p["source"]["parent_id"]=None; p["variant_group"]=None
    rows,prov,reason=generate_parent(p,3,NOW)
    assert reason.startswith("specialized:perfect_square_expansion:") and len(rows)==len(prov)==3
    expected=parent_record_sha256(p)
    for row,e in zip(rows,prov):
        assert row["source"]["parent_id"]==p["id"]
        assert row.get("taxonomy")==p.get("taxonomy") and row.get("difficulty")==p.get("difficulty") and row.get("format")==p.get("format")
        assert row.get("choices")==p.get("choices") and row.get("figure_refs")==p.get("figure_refs")
        assert all(row["audit"].get(k) is True for k in ("problem_answer_verified","structure_verified","figure_refs_verified"))
        assert e["parent_record_sha256"]==expected and e["independent_recalculation"] is True and "engine=perfect_square_expansion" in e["verification_evidence"]
    print("PASS_PERFECT_SQUARE_EXPANSION_UNIFIED_PARENT_SHA_METADATA_AUDIT_AND_RECALCULATION")
if __name__=="__main__": main()
