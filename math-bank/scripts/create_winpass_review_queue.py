from __future__ import annotations

import argparse, hashlib, json
from datetime import datetime, timezone
from pathlib import Path

def load(path:Path)->list[dict]:
    obj=json.loads(path.read_text(encoding='utf-8'))
    if not isinstance(obj,list) or not all(isinstance(x,dict) for x in obj): raise SystemExit('records must be array of objects')
    return obj

def fp(r:dict)->str:
    payload={k:r.get(k) for k in ('id','source','document_id','record_index','question','answer','explanation','figure_refs')}
    return hashlib.sha256(json.dumps(payload,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()

def build(records:list[dict])->dict:
    if len(records)!=717: raise SystemExit(f'Winpass raw must be 717, got {len(records)}')
    ids=[str(r.get('id','')).strip() for r in records]
    if any(not x for x in ids) or len(set(ids))!=717: raise SystemExit('Winpass raw ids must be 717 unique nonblank ids')
    queue=[]
    for r in records:
        queue.append({'record_id':str(r['id']),'record_fingerprint_sha256':fp(r),'document_id':r.get('document_id'),'record_index':r.get('record_index'),'action':'','reason':'','evidence':[],'review_status':'PENDING_EVIDENCE'})
    return {'workflow':'Winpass 717 Evidence Review Queue','recorded_at_utc':datetime.now(timezone.utc).isoformat(),'raw_records':717,'historical_validated_reference':570,'historical_excluded_reference':147,'policy':{'historical_counts_are_verification_only':True,'no_count_forcing':True,'every_record_requires_explicit_decision':True,'every_exclusion_requires_source_evidence':True,'record_fingerprint_binding_required':True},'queue':queue,'completed_decisions':0,'pending':717,'ready_for_normalization_audit':False}

def main()->int:
    ap=argparse.ArgumentParser(); ap.add_argument('--records',type=Path,required=True); ap.add_argument('--out',type=Path,required=True); args=ap.parse_args(); report=build(load(args.records)); args.out.parent.mkdir(parents=True,exist_ok=True); args.out.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8'); print(json.dumps({k:v for k,v in report.items() if k!='queue'},ensure_ascii=False,indent=2)); return 0
if __name__=='__main__': raise SystemExit(main())
