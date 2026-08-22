from __future__ import annotations
import copy
from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256

NOW="2026-08-22T10:10:00Z"

def main():
    parent=copy.deepcopy(make_base()[0])
    parent["id"]="U-IQR"
    parent["question"]="データ 2、4、5、7、9、10、12、15 の四分位範囲を求めなさい。"
    parent["answer"]="6.5"
    parent["choices"]=None; parent["figure_refs"]=[]
    parent["source"]["is_generated_variant"]=False
    parent["source"]["parent_id"]=None
    parent["variant_group"]=None
    rows,prov,reason=generate_parent(parent,3,NOW)
    assert reason.startswith("specialized:interquartile_range:")
    assert len(rows)==len(prov)==3
    expected=parent_record_sha256(parent)
    for row,p in zip(rows,prov):
        assert row["source"]["parent_id"]==parent["id"]
        assert row.get("taxonomy")==parent.get("taxonomy")
        assert row.get("difficulty")==parent.get("difficulty")
        assert row.get("format")==parent.get("format")
        assert row.get("choices")==parent.get("choices")
        assert row.get("figure_refs")==parent.get("figure_refs")
        assert row["audit"]["problem_answer_verified"] is True
        assert row["audit"]["structure_verified"] is True
        assert row["audit"]["figure_refs_verified"] is True
        assert p["parent_record_sha256"]==expected
        assert p["independent_recalculation"] is True
        assert "engine=interquartile_range" in p["verification_evidence"]
    print("PASS_INTERQUARTILE_RANGE_UNIFIED_PARENT_CONTRACT")

if __name__=="__main__": main()
