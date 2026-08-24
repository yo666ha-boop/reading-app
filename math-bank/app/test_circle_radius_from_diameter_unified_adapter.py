from __future__ import annotations
import copy
from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256,numeric_tokens
NOW='2026-08-24T10:22:00Z'
def parent():
    p=copy.deepcopy(make_base()[0]); p['id']='U-C-R-D'; p['question']='直径12cmの円があります。この円の半径を求めなさい。'; p['answer']='6cm'; p['choices']=[]; p['figure_refs']=[]; p['source']['is_generated_variant']=False; p['source']['parent_id']=None; p['variant_group']=None; return p
def main():
    p=parent(); rows,prov,reason=generate_parent(p,3,NOW); assert reason.startswith('specialized:circle_circumference_pi_3_14:circle_radius_from_diameter_exact'); assert len(rows)==len(prov)==3
    ps=tuple(numeric_tokens(p['question'])); seen=set(); expected=parent_record_sha256(p)
    for r,e in zip(rows,prov):
        sig=tuple(numeric_tokens(r['question'])); assert sig!=ps and sig not in seen; seen.add(sig)
        assert r['source']['parent_id']==p['id'] and r['choices']==[] and r['figure_refs']==[]
        assert r.get('taxonomy')==p.get('taxonomy') and r.get('difficulty')==p.get('difficulty') and r.get('format')==p.get('format') and r.get('question_format')==p.get('question_format')
        assert all(r['audit'][k] is True for k in ('problem_answer_verified','structure_verified','figure_refs_verified'))
        assert e['parent_record_sha256']==expected and e['independent_recalculation'] is True and 'circle_radius_from_diameter_exact_halving_and_doubling_identities' in e['verification_evidence']
    bad=parent(); bad['answer']='5cm'; assert generate_parent(bad,1,NOW)[0]==[]
    print('PASS_CIRCLE_RADIUS_FROM_DIAMETER_UNIFIED_PARENT_SHA_METADATA_AUDIT3_NUMERIC_DISTINCT')
if __name__=='__main__': main()
