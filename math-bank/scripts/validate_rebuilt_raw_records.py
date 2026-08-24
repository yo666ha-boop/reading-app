from __future__ import annotations

import argparse, hashlib, json
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

TARGETS={'Winpass':717,'実力錬成':237,'Standard':317}

def norm(v): return str(v or '').strip()
def fingerprint(r:dict)->str:
    payload={k:r.get(k) for k in ('source','document_id','record_index','question','answer','explanation','figure_refs')}
    return hashlib.sha256(json.dumps(payload,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()

def load(path:Path)->list[dict]:
    obj=json.loads(path.read_text(encoding='utf-8'))
    if not isinstance(obj,list) or not all(isinstance(x,dict) for x in obj): raise SystemExit(f'{path}: expected array of objects')
    return obj

def validate(records:list[dict], source:str, asset_manifest:set[str]|None=None)->dict:
    issues=[]; ids=[]; fps=[]; qas=[]; figure_refs=0; missing_figures=[]
    for i,r in enumerate(records):
        rid=norm(r.get('id')); q=norm(r.get('question')); a=norm(r.get('answer'))
        if not rid: issues.append({'index':i,'issue':'blank_id'})
        if not q: issues.append({'index':i,'id':rid,'issue':'blank_question'})
        if not a: issues.append({'index':i,'id':rid,'issue':'blank_answer'})
        if norm(r.get('source')) not in ('',source): issues.append({'index':i,'id':rid,'issue':'source_mismatch','value':r.get('source')})
        refs=r.get('figure_refs',[])
        if refs is None: refs=[]
        if not isinstance(refs,list): issues.append({'index':i,'id':rid,'issue':'figure_refs_not_list'}); refs=[]
        for ref in refs:
            s=norm(ref); figure_refs+=1
            if not s: issues.append({'index':i,'id':rid,'issue':'blank_figure_ref'})
            elif asset_manifest is not None and s not in asset_manifest: missing_figures.append({'index':i,'id':rid,'ref':s})
        ids.append(rid); fps.append(fingerprint(r)); qas.append((q,a))
    duplicate_ids=sorted(k for k,n in Counter(ids).items() if k and n>1)
    duplicate_fingerprints=sorted(k for k,n in Counter(fps).items() if n>1)
    duplicate_question_answer_pairs=sum(1 for n in Counter(qas).values() if n>1)
    expected=TARGETS[source]
    passed=(len(records)==expected and not issues and not duplicate_ids and not duplicate_fingerprints and not missing_figures)
    return {'source':source,'expected_raw':expected,'actual_raw':len(records),'records_with_question':sum(bool(norm(r.get('question'))) for r in records),'records_with_answer':sum(bool(norm(r.get('answer'))) for r in records),'figure_refs':figure_refs,'missing_figure_refs':missing_figures,'issues':issues,'duplicate_ids':duplicate_ids,'duplicate_fingerprints':duplicate_fingerprints,'duplicate_question_answer_pair_groups':duplicate_question_answer_pairs,'pass':passed}

def main()->int:
    ap=argparse.ArgumentParser(); ap.add_argument('--source',choices=sorted(TARGETS),required=True); ap.add_argument('--records',type=Path,required=True); ap.add_argument('--asset-manifest',type=Path); ap.add_argument('--report',type=Path,required=True)
    args=ap.parse_args(); assets=None
    if args.asset_manifest:
        obj=json.loads(args.asset_manifest.read_text(encoding='utf-8'))
        if not isinstance(obj,list): raise SystemExit('asset manifest must be JSON array')
        assets={norm(x) for x in obj if norm(x)}
    result=validate(load(args.records),args.source,assets)
    report={'workflow':'Math Rebuilt Raw Record Validation','recorded_at_utc':datetime.now(timezone.utc).isoformat(),'policy':{'count_is_verification_not_selection':True,'question_required':True,'answer_required':True,'record_fingerprint_unique_required':True,'figure_ref_resolution_required_when_asset_manifest_provided':True,'raw_records_not_promotable_to_originals':True},'result':result,'next':'Pass only into source-specific evidence normalization and full original validation; never promote raw directly.'}
    args.report.parent.mkdir(parents=True,exist_ok=True); args.report.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8'); print(json.dumps(report,ensure_ascii=False,indent=2)); return 0 if result['pass'] else 7
if __name__=='__main__': raise SystemExit(main())
