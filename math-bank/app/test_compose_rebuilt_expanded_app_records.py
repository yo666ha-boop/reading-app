from __future__ import annotations
import importlib.util,json,tempfile
from pathlib import Path
import compose_rebuilt_expanded_app_records as m
import initialize_rebuilt_variant_layer as init
FREEZE=Path(__file__).parents[1]/'scripts'/'freeze_rebuilt_originals.py'
spec=importlib.util.spec_from_file_location('freeze_rebuilt_originals',FREEZE); assert spec and spec.loader
f=importlib.util.module_from_spec(spec); spec.loader.exec_module(f)
def row(book,i): return {'id':f'{book}-{i}','grade':1+(i%3),'unit':{'major':'major','minor':'minor','tags':[]},'title':'title','skill':'skill','question_format':'short_answer','difficulty':'standard','source':{'book':book,'document':f'{book}.docx','original_no':str(i),'is_generated_variant':False,'parent_id':None},'question':f'q-{book}-{i}','choices':None,'answer':f'a-{book}-{i}','explanation':'','figure_refs':[],'variant_group':None,'audit':{'problem_answer_verified':True,'structure_verified':True,'figure_refs_verified':True}}
def evidence(rs): return [{'record_id':r['id'],'record_sha256':f._m.canonical_sha(r),'source_document':r['source']['document'],'source_locator':{'original_no':r['source']['original_no']},'grade_evidence':{'value':r['grade']},'unit_evidence':{'value':r['unit']},'skill_evidence':{'value':r['skill']},'question_format_evidence':{'value':r['question_format']},'difficulty_evidence':{'value':r['difficulty']}} for r in rs]
def main():
    w=[row('Winpass',i) for i in range(570)]; j=[row('実力錬成',i) for i in range(237)]; s=[row('Standard',i) for i in range(317)]; base=w+j+s; frozen,manifest=f.freeze(w,j,s,evidence(base),set())
    with tempfile.TemporaryDirectory() as td:
        td=Path(td); bp=td/'base.json'; mp=td/'manifest.json'; lp=td/'layer.json'; op=td/'app.json'; sp=td/'snapshot.json'
        bp.write_text(json.dumps(frozen,ensure_ascii=False),encoding='utf-8'); mp.write_text(json.dumps(manifest,ensure_ascii=False),encoding='utf-8'); lp.write_text(json.dumps(init.initialize(bp,mp),ensure_ascii=False),encoding='utf-8')
        report=m.compose(bp,mp,lp,op,sp); assert report['status']=='PASS' and report['base_records']==1124 and report['baseline_verified_variants']==0 and report['expanded_verified_variants']==0 and report['final_total']==1124; assert json.loads(op.read_text(encoding='utf-8'))==frozen; assert json.loads(sp.read_text(encoding='utf-8'))==frozen
        bad=json.loads(lp.read_text()); bad['base_canonical_sha256']='0'*64; lp.write_text(json.dumps(bad),encoding='utf-8')
        try: m.compose(bp,mp,lp,op,sp)
        except ValueError: pass
        else: raise AssertionError('wrong layer anchor must block app compose')
    print('PASS_REBUILT_DYNAMIC_ANCHOR_APP_COMPOSER_IMMUTABLE_1124_SNAPSHOT')
if __name__=='__main__': main()
