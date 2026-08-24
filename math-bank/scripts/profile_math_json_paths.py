from __future__ import annotations

import argparse
import json
import zipfile
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path, PurePosixPath
from typing import Any

import verify_source_archives as verifier

DOC_TARGET={'winpass':81,'jitsuren':27,'standard':32}
MAX_DEPTH=12
QUESTION_KEY_HINTS={'q','question','questions','problem','problems','prompt','stem','text'}
ANSWER_KEY_HINTS={'a','ans','answer','answers','solution','solutions','correct','correctanswer','explanation'}


def norm_key(k: Any)->str:
    return ''.join(ch for ch in str(k).casefold() if ch.isalnum())


def walk(value: Any, path: str, depth: int, stats: dict)->None:
    stats['node_types'][f'{path}|{type(value).__name__}'] += 1
    if depth >= MAX_DEPTH:
        stats['depth_truncated'] += 1
        return
    if isinstance(value, dict):
        for key, child in value.items():
            k=str(key)
            p=f'{path}.{k}' if path else k
            stats['object_key_paths'][p] += 1
            nk=norm_key(k)
            if nk in QUESTION_KEY_HINTS:
                stats['question_hint_paths'][p] += 1
            if nk in ANSWER_KEY_HINTS:
                stats['answer_hint_paths'][p] += 1
            walk(child,p,depth+1,stats)
    elif isinstance(value, list):
        stats['list_paths'][path].append(len(value))
        for child in value:
            p=f'{path}[]' if path else '[]'
            walk(child,p,depth+1,stats)
    else:
        stats['scalar_paths'][f'{path}|{type(value).__name__}'] += 1


def new_stats()->dict:
    return {
        'documents':0,
        'parse_errors':[],
        'node_types':Counter(),
        'object_key_paths':Counter(),
        'list_paths':defaultdict(list),
        'scalar_paths':Counter(),
        'question_hint_paths':Counter(),
        'answer_hint_paths':Counter(),
        'depth_truncated':0,
    }


def finalize(stats:dict)->dict:
    return {
        'documents':stats['documents'],
        'parse_errors':stats['parse_errors'],
        'node_types':dict(sorted(stats['node_types'].items())),
        'object_key_paths':dict(sorted(stats['object_key_paths'].items())),
        'list_paths':{
            p:{'occurrences':len(v),'min_len':min(v),'max_len':max(v),'total_items':sum(v)}
            for p,v in sorted(stats['list_paths'].items()) if v
        },
        'scalar_paths':dict(sorted(stats['scalar_paths'].items())),
        'question_hint_paths':dict(sorted(stats['question_hint_paths'].items())),
        'answer_hint_paths':dict(sorted(stats['answer_hint_paths'].items())),
        'depth_truncated':stats['depth_truncated'],
    }


def build(source_dir:Path)->dict:
    identity=verifier.build_report(source_dir)
    out={}
    for logical,item in identity['archives'].items():
        selected=item.get('selected')
        if not selected:
            out[logical]={'status':'BLOCKED_SOURCE_IDENTITY_NOT_EXACT'}
            continue
        stats=new_stats()
        with zipfile.ZipFile(selected['path']) as zf:
            members=sorted((i for i in zf.infolist() if not i.is_dir() and PurePosixPath(i.filename).name.casefold()=='math.json'),key=lambda i:i.filename)
            stats['documents']=len(members)
            for info in members:
                try:
                    obj=json.loads(zf.read(info).decode('utf-8-sig'))
                    walk(obj,'$',0,stats)
                except Exception as exc:
                    stats['parse_errors'].append({'path':info.filename,'error':f'{type(exc).__name__}: {exc}'})
        f=finalize(stats)
        f['status']='PROFILED'
        f['historical_document_target']=DOC_TARGET[logical]
        f['historical_document_count_match']=f['documents']==DOC_TARGET[logical]
        out[logical]=f
    exact=bool(identity.get('ready_for_rebuild_pipeline'))
    ready=exact and all(x.get('historical_document_count_match') is True and not x.get('parse_errors') for x in out.values())
    return {
        'workflow':'Math MATH.json Recursive Schema Path Profile',
        'recorded_at_utc':datetime.now(timezone.utc).isoformat(),
        'source_identity':identity,
        'sources':out,
        'ready_for_schema_specific_extractor':ready,
        'policy':{
            'no_values_changed':True,
            'no_raw_records_promoted':True,
            'key_hints_are_discovery_only':True,
        },
        'next':'Use observed key/list paths to implement exact per-source extraction. Never infer missing question/answer fields from key hints alone.'
    }


def main()->int:
    ap=argparse.ArgumentParser()
    ap.add_argument('--source-dir',type=Path,default=Path('math-bank/source'))
    ap.add_argument('--report',type=Path,default=Path('math-bank/state/source-rebuild-json-path-profile-latest.json'))
    ap.add_argument('--strict',action='store_true')
    args=ap.parse_args()
    report=build(args.source_dir)
    args.report.parent.mkdir(parents=True,exist_ok=True)
    args.report.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False,indent=2))
    return 0 if (not args.strict or report['ready_for_schema_specific_extractor']) else 6

if __name__=='__main__':
    raise SystemExit(main())
