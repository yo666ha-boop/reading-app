from __future__ import annotations

import io
import json
import os
import subprocess
import zipfile
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlencode

REPO = os.environ.get('GITHUB_REPOSITORY','yo666ha-boop/reading-app')
TOKEN = os.environ.get('GITHUB_TOKEN','')
API='https://api.github.com'
BRANCH='math-problem-bank-bootstrap'
SINCE='2026-08-19T00:00:00Z'
UNTIL='2026-08-21T00:00:00Z'
OUT=Path('math-bank/state/historical-generation-log-clues-latest.json')
PERSISTED_RUN_LEDGER=Path('math-bank/state/actions-log-recovery-latest.json')
TERMS=[
 'b532d64f83bb0cb0444a6b556e2490a9b56366d5c3916256ae2e96572eb1abe3',
 'c50053ba1765e81e256aaa95b67f94071cec3b6bb625deef801b71b0af5ae984',
 '0e96efc7097c61ddfc1c5218da90e7ea92cbb4fd0a1e9babccfcad3756731af2',
 '16c71b87744a3c00bb29b53d63bdaf727feaae86a5d7a505b83920c8dfefc63a',
 '25winpasst1suhy000417','25winpasst1suhy000521','25winpasst1suhy000522','25winpasst1suhy000625',
 'winpass_verified_union570_authoritative_norm_20260820',
 'jitsuren_verified_union225_complete27_20260820',
 '1271/1271','717/717','source-forensics','source recovery','source-recovery',
 'stage4_answer','stage5_question','answer_asset_index','combined_diagnostic',
 'raw_scoring_slots','canonical_unique_docs','partial_verified_winpass_records',
 'word_math_m_t','own_paragraph_extraction','tandem_repeat_prefix',
]


def curl(url:str, timeout:int=180)->bytes:
    cmd=['curl','-fsSL','--max-time',str(timeout),'-H','Accept: application/vnd.github+json','-H','X-GitHub-Api-Version: 2022-11-28']
    if TOKEN: cmd += ['-H',f'Authorization: Bearer {TOKEN}']
    cmd.append(url)
    p=subprocess.run(cmd,stdout=subprocess.PIPE,stderr=subprocess.PIPE,timeout=timeout+10)
    if p.returncode: raise RuntimeError(p.stderr.decode('utf-8','replace')[:500])
    return p.stdout


def jget(url:str)->dict:
    return json.loads(curl(url,90).decode('utf-8'))


def load_seed_runs()->dict[int,dict]:
    out:dict[int,dict]={}
    try:
        ledger=json.loads(PERSISTED_RUN_LEDGER.read_text(encoding='utf-8'))
    except Exception:
        return out
    rows=ledger.get('run_cache') or ledger.get('runs') or []
    for row in rows:
        if not isinstance(row,dict): continue
        rid=int(row.get('run_id') or 0)
        observed=str(row.get('updated_at') or '')
        if not rid or not (SINCE <= observed < UNTIL): continue
        out[rid]={
          'id':rid,'name':row.get('name'),'status':row.get('status'),'conclusion':row.get('conclusion'),
          'head_sha':row.get('head_sha'),'created_at':None,'updated_at':observed,'seed_source':'persisted_actions_log_ledger'
        }
    return out


def supplement_recent_api(runs:dict[int,dict])->None:
    # The repository now has enough runs that Aug19-Aug20 may be beyond the API's practical recent-page window.
    # We still scan recent pages and merge anything in-window, while the persisted ledger is the authoritative seed.
    for page in range(1,11):
        q=urlencode({'branch':BRANCH,'per_page':100,'page':page})
        obj=jget(f'{API}/repos/{REPO}/actions/runs?{q}')
        batch=obj.get('workflow_runs') or []
        for r in batch:
            observed=str(r.get('created_at') or r.get('updated_at') or '')
            if SINCE <= observed < UNTIL:
                rr=dict(r); rr['seed_source']='live_api'; runs[int(r['id'])]=rr
        if len(batch)<100: break


def main()->int:
    if not TOKEN:
        print('BLOCKED GITHUB_TOKEN'); return 2
    seeded=load_seed_runs()
    runs_by_id=dict(seeded)
    api_error=None
    try:
        supplement_recent_api(runs_by_id)
    except Exception as exc:
        # The persisted ledger is sufficient to continue. Record the live-listing failure without discarding seeded coverage.
        api_error=f'{type(exc).__name__}: {exc}'
    runs=sorted(runs_by_id.values(),key=lambda r:str(r.get('updated_at') or r.get('created_at') or ''))
    report={
      'scan':'historical_math_generation_workflow_logs',
      'repo':REPO,'branch':BRANCH,'window':{'since':SINCE,'until':UNTIL},'terms':TERMS,
      'persisted_ledger_seed_runs':len(seeded),'runs_in_window':len(runs),'live_api_listing_error':api_error,
      'completed_runs':0,'run_download_failures':0,'log_members_seen':0,'text_members_scanned':0,'matching_lines':0,
      'matches':[],'errors':[],'scan_complete':True,'completed_at_utc':None,
      'policy':'The persisted historical run ledger is used because current API pagination no longer reaches all Aug19-Aug20 runs. Log text is forensic pipeline evidence only and never substitutes for validating recovered data.'
    }
    term_low=[t.lower() for t in TERMS]
    for r in runs:
        if r.get('status')!='completed':
            continue
        report['completed_runs']+=1
        try:
            raw=curl(f"{API}/repos/{REPO}/actions/runs/{r['id']}/logs",180)
            with zipfile.ZipFile(io.BytesIO(raw)) as zf:
                for info in zf.infolist():
                    if info.is_dir() or info.file_size>50*1024*1024: continue
                    report['log_members_seen']+=1
                    text=zf.read(info).decode('utf-8','replace')
                    report['text_members_scanned']+=1
                    lines=text.splitlines()
                    for i,line in enumerate(lines):
                        low=line.lower()
                        matched=[TERMS[j] for j,t in enumerate(term_low) if t in low]
                        if not matched: continue
                        report['matching_lines']+=1
                        if len(report['matches'])<2000:
                            lo=max(0,i-4); hi=min(len(lines),i+5)
                            report['matches'].append({
                              'run_id':r.get('id'),'workflow':r.get('name'),'head_sha':r.get('head_sha'),
                              'observed_at':r.get('updated_at') or r.get('created_at'),'seed_source':r.get('seed_source'),
                              'member':info.filename,'line_number':i+1,'matched':matched,
                              'context':'\n'.join(lines[lo:hi])[:10000]
                            })
        except Exception as exc:
            report['run_download_failures']+=1
            report['scan_complete']=False
            report['errors'].append({'run_id':r.get('id'),'workflow':r.get('name'),'error':f'{type(exc).__name__}: {exc}'})
    report['completed_at_utc']=datetime.now(timezone.utc).isoformat()
    OUT.parent.mkdir(parents=True,exist_ok=True)
    OUT.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False,indent=2))
    return 0

if __name__=='__main__':
    raise SystemExit(main())
