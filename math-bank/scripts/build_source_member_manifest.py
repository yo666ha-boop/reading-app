from __future__ import annotations

import argparse
import hashlib
import json
import zipfile
from datetime import datetime, timezone
from pathlib import Path, PurePosixPath

import verify_source_archives as verifier

IMAGE_EXTS={'.png','.jpg','.jpeg','.gif','.bmp','.webp','.svg','.emf','.wmf'}
DOC_TARGET={'winpass':81,'jitsuren':27,'standard':32}


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def build(source_dir: Path, archive_specs: dict | None = None, doc_targets: dict | None = None, total_doc_target: int = 140) -> dict:
    archive_specs=archive_specs or verifier.EXPECTED_ARCHIVES
    doc_targets=doc_targets or DOC_TARGET
    identity=verifier.build_report(source_dir, archive_specs)
    sources={}
    for logical,item in identity['archives'].items():
        selected=item.get('selected')
        if not selected:
            sources[logical]={'status':'BLOCKED_SOURCE_IDENTITY_NOT_EXACT','members':[]}
            continue
        rows=[]
        with zipfile.ZipFile(selected['path']) as zf:
            for info in sorted((i for i in zf.infolist() if not i.is_dir()), key=lambda i:i.filename):
                data=zf.read(info)
                pp=PurePosixPath(info.filename)
                kind='math_json' if pp.name.casefold()=='math.json' else ('figure' if pp.suffix.casefold() in IMAGE_EXTS else 'other')
                rows.append({'path':info.filename,'kind':kind,'bytes':len(data),'sha256':sha256_bytes(data)})
        math_count=sum(r['kind']=='math_json' for r in rows)
        figure_count=sum(r['kind']=='figure' for r in rows)
        target=doc_targets.get(logical)
        sources[logical]={
            'status':'EXACT_SOURCE_PROFILED',
            'source_zip':selected,
            'members':rows,
            'member_count':len(rows),
            'math_json_documents':math_count,
            'figure_members':figure_count,
            'historical_document_target':target,
            'historical_document_count_match':target is None or math_count==target,
        }
    exact=bool(identity.get('ready_for_rebuild_pipeline'))
    total_docs=sum(x.get('math_json_documents',0) for x in sources.values())
    doc_match=exact and total_docs==total_doc_target and all(x.get('historical_document_count_match') is True for x in sources.values())
    all_member_keys=[]
    for logical in sorted(sources):
        for row in sources[logical].get('members',[]):
            all_member_keys.append(f"{logical}\0{row['path']}\0{row['bytes']}\0{row['sha256']}\n".encode())
    manifest_sha=sha256_bytes(b''.join(all_member_keys)) if all_member_keys else None
    return {
      'workflow':'Math Reuploaded Source Exact Member Manifest',
      'recorded_at_utc':datetime.now(timezone.utc).isoformat(),
      'source_identity':identity,
      'sources':sources,
      'math_json_documents_total':total_docs,
      'document_target_total':total_doc_target,
      'historical_140_documents_match':total_docs==140 if total_doc_target==140 else None,
      'all_document_targets_match':doc_match,
      'manifest_sha256':manifest_sha,
      'ready_for_raw_extraction':exact and doc_match,
      'policy':{
        'member_sha256_before_extraction_required':True,
        'raw_record_promotion_forbidden':True,
        'winpass_count_forcing_forbidden':True,
      },
      'next':'If ready, inspect actual MATH.json shapes and extract raw problem-answer slots with source member SHA/path evidence attached to every record.'
    }


def main()->int:
    ap=argparse.ArgumentParser()
    ap.add_argument('--source-dir',type=Path,default=Path('math-bank/source'))
    ap.add_argument('--report',type=Path,default=Path('math-bank/state/source-rebuild-member-manifest-latest.json'))
    ap.add_argument('--strict',action='store_true')
    args=ap.parse_args()
    report=build(args.source_dir)
    args.report.parent.mkdir(parents=True,exist_ok=True)
    args.report.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False,indent=2))
    return 0 if (not args.strict or report['ready_for_raw_extraction']) else 5

if __name__=='__main__':
    raise SystemExit(main())
