from __future__ import annotations
import copy
from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import numeric_tokens, parent_record_sha256
NOW="2026-08-24T08:23:00Z"


def make_parent(*, reverse=False):
    parent=copy.deepcopy(make_base()[0]); parent["id"]="U-DISCOUNT-REV" if reverse else "U-DISCOUNT"
    if reverse:
        parent["question"]="25%引きで900円になりました。定価は何円ですか。"; parent["answer"]="1200円"
    else:
        parent["question"]="定価1200円の商品を25%引きで買います。代金は何円ですか。"; parent["answer"]="900円"
    parent["choices"]=[]; parent["figure_refs"]=[]; parent["source"]["is_generated_variant"]=False; parent["source"]["parent_id"]=None; parent["variant_group"]=None
    return parent


def assert_unified(parent, expected_reason):
    rows,prov,reason=generate_parent(parent,3,NOW); assert reason.startswith("specialized:discount_price:"+expected_reason)
    assert len(rows)==len(prov)==3
    expected_sha=parent_record_sha256(parent); parent_sig=tuple(numeric_tokens(parent["question"])); seen=set()
    for row,evidence in zip(rows,prov):
        sig=tuple(numeric_tokens(row["question"])); assert sig!=parent_sig and sig not in seen; seen.add(sig)
        assert row["source"]["parent_id"]==parent["id"]
        assert row.get("taxonomy")==parent.get("taxonomy") and row.get("difficulty")==parent.get("difficulty")
        assert row.get("format")==parent.get("format") and row.get("question_format")==parent.get("question_format")
        assert row.get("choices")==parent.get("choices") and row.get("figure_refs")==parent.get("figure_refs")
        assert evidence["parent_record_sha256"]==expected_sha and evidence["independent_recalculation"] is True
        assert "engine=discount_price" in evidence["verification_evidence"]
        audit=row.get("audit") or {}; assert audit.get("problem_answer_verified") is True and audit.get("structure_verified") is True and audit.get("figure_refs_verified") is True
    return rows


def main():
    forward=assert_unified(make_parent(),"discount_final_price_integer_yen_exact")
    reverse=assert_unified(make_parent(reverse=True),"discount_original_price_integer_yen_exact")
    assert all("定価1200円" not in row["question"] for row in forward)
    assert all("定価は何円" in row["question"] for row in reverse)
    print("PASS_DISCOUNT_PRICE_UNIFIED_ADAPTER_FORWARD_REVERSE_PARENT_SHA_METADATA_AUDIT_AND_RECALCULATION")

if __name__=="__main__": main()
