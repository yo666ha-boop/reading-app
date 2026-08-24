from __future__ import annotations
import copy
from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256

NOW="2026-08-23T00:00:00Z"

def parent():
    p=copy.deepcopy(make_base()[0]); p["id"]="U-TRI-EXTERIOR"
    p["question"]="三角形の外角について、となり合わない2つの内角が50°と60°です。この外角を求めなさい。"
    p["answer"]="110°"; p["choices"]=[]; p["figure_refs"]=[]
    p["source"]["is_generated_variant"]=False; p["source"]["parent_id"]=None; p["variant_group"]=None
    return p

def interior_parent():
    p=copy.deepcopy(make_base()[0]); p["id"]="U-TRI-INTERIOR-MISSING"
    p["question"]="三角形の2つの角が50°と60°です。残りの角を求めなさい。"
    p["answer"]="70°"; p["choices"]=[]; p["figure_refs"]=[]
    p["source"]["is_generated_variant"]=False; p["source"]["parent_id"]=None; p["variant_group"]=None
    return p

def assert_common_contract(p,rows,prov):
    assert len(rows)==len(prov)==3 and len({r["question"] for r in rows})==3
    expected=parent_record_sha256(p)
    for r,e in zip(rows,prov):
        assert r["source"]["parent_id"]==p["id"] and r["choices"]==[] and r["figure_refs"]==[]
        assert r["audit"]["problem_answer_verified"] is True and r["audit"]["structure_verified"] is True and r["audit"]["figure_refs_verified"] is True
        assert e["parent_record_sha256"]==expected and e["independent_recalculation"] is True

def main():
    p=parent(); rows,prov,reason=generate_parent(p,3,NOW)
    assert reason.startswith("specialized:triangle_exterior_angle:")
    assert_common_contract(p,rows,prov)
    for e in prov:
        assert "triangle_exterior_remote_sum_and_supplement_identity" in e["verification_evidence"] and "180 PASS" in e["verification_evidence"]

    # The unified runtime intentionally routes ordinary third-angle questions
    # through the earlier triangle_area family, whose delegated third-angle
    # contract is already exact and independently sum-checked.
    ip=interior_parent(); rows,prov,reason=generate_parent(ip,3,NOW)
    assert reason=="specialized:triangle_area:triangle_two_integer_angles_third_exact", reason
    assert_common_contract(ip,rows,prov)
    for e in prov:
        assert "triangle_third_angle_exact_subtraction_and_sum_identity" in e["verification_evidence"] and "=180 PASS" in e["verification_evidence"]

    bad=parent(); bad["answer"]="111°"
    rows,prov,reason=generate_parent(bad,1,NOW); assert rows==[] and prov==[] and "triangle_angle_parent_not_exactly_parsed_and_verified" in reason
    bad2=interior_parent(); bad2["answer"]="71°"
    rows,prov,reason=generate_parent(bad2,1,NOW); assert rows==[] and prov==[] and "triangle_third_angle_parent_not_exactly_parsed_and_verified" in reason
    print("PASS_TRIANGLE_EXTERIOR_AND_INTERIOR_MISSING_UNIFIED_PARENT_SHA_EMPTY_CHOICES_AUDIT3_AND_IDENTITIES")

if __name__=="__main__": main()
