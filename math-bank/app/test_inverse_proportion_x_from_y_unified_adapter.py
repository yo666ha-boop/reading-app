from __future__ import annotations
import copy
from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256,numeric_tokens
NOW='2026-08-24T10:05:00Z'
def parent():
    p=copy.deepcopy(make_base()[0]); p['id']='U-INV-X'; p['question']='yはxに反比例し、比例定数は24です。y=4のとき、xの値を求めなさい。'; p['answer']='x=6'; p['choices']=[]; p['figure_refs']=[]; p['source']['is_generated_variant']=False; p['source']['parent_id']=None; p['variant_group']=None; return p
def main():
    p=parent(); rows,prov,reason=generate_parent(p,3,NOW); assert reason.startswith('specialized:inverse_proportion:inverse_proportion_x_from_y_exact'); assert len(rows)==len(prov)==3
    ps=tuple(numeric_tokens(p['question'])); seen=set(); expected=parent_record_sha256(p)
    for r,e in zip(rows,prov):
        sig=tuple(numeric_tokens(r['question'])); assert sig!=ps and sig not in seen; seen.add(sig)
        assert r['source']['parent_id']==p['id'] and r['choices']==[] and r['figure_refs']==[]
        assert r.get('taxonomy')==p.get('taxonomy') and r.get('difficulty')==p.get('difficulty') and r.get('format')==p.get('format') and r.get('question_format')==p.get('question_format')
        assert all(r['audit'][k] is True for k in ('problem_answer_verified','structure_verified','figure_refs_verified'))
        assert e['parent_record_sha256']==expected and e['independent_recalculation'] is True and 'inverse_proportion_x_from_y_exact_division_and_product_identity' in e['verification_evidence']
    bad=parent(); bad['answer']='x=5'; assert generate_parent(bad,1,NOW)[0]==[]
    print('PASS_INVERSE_PROPORTION_X_FROM_Y_UNIFIED_PARENT_SHA_METADATA_AUDIT3_NUMERIC_DISTINCT')
if __name__=='__main__': main()
