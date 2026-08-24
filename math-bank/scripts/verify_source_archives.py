from __future__ import annotations

import argparse
import hashlib
import json
import re
import zipfile
from collections import Counter
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable

EXPECTED_ARCHIVES = {
    "winpass": {"canonical_name":"winpassデータ.zip","sha256":"29bd0cfc8a40287394e8fddf927cb744105e59fed0864e1272aaf1f795d31edf","historical_bytes":8296042,"historical_original_records":570,"historical_raw_diagnostic_records":717},
    "jitsuren": {"canonical_name":"中学実力錬成データ.zip","sha256":"faf6be5a540d9636a8ff07ca6e0c72824ad051a7881f4eb466e8274c58a02f33","historical_bytes":7287279,"historical_original_records":237,"historical_raw_diagnostic_records":237},
    "standard": {"canonical_name":"スタンダードデータ.zip","sha256":"c26dfbe04e9d28796fecd69e07162ebed7c68e20c9a5c2f6418ce203924d3bf6","historical_bytes":9689250,"historical_original_records":317,"historical_raw_diagnostic_records":317},
}
_COPY_SUFFIX=re.compile(r"\s*\(\d+\)$")
@dataclass(frozen=True)
class ArchiveCandidate:
    path:Path; sha256:str; size:int
def sha256_file(path:Path)->str:
    h=hashlib.sha256()
    with path.open('rb') as fh:
        for chunk in iter(lambda:fh.read(1024*1024),b''): h.update(chunk)
    return h.hexdigest()
def normalized_zip_name(name:str)->str:
    p=Path(name)
    if p.suffix.lower()!='.zip': return name
    return _COPY_SUFFIX.sub('',p.stem).casefold()+'.zip'
def expected_normalized_name(spec:dict)->str: return normalized_zip_name(str(spec['canonical_name']))
def find_candidates(source_dir:Path,spec:dict)->list[ArchiveCandidate]:
    wanted=expected_normalized_name(spec); out=[]
    for path in sorted(source_dir.glob('*.zip')):
        if normalized_zip_name(path.name)==wanted: out.append(ArchiveCandidate(path,sha256_file(path),path.stat().st_size))
    return out
def inspect_zip(path:Path)->dict:
    with zipfile.ZipFile(path) as zf:
        infos=zf.infolist(); files=[i for i in infos if not i.is_dir()]; names=[i.filename for i in files]; bad=zf.testzip()
        return {'zip_valid':bad is None,'first_bad_member':bad,'file_members':len(files),'directory_members':sum(i.is_dir() for i in infos),'uncompressed_bytes':sum(i.file_size for i in files),'extension_counts':dict(sorted(Counter(Path(n).suffix.lower() or '<none>' for n in names).items())),'duplicate_member_names':sorted(n for n,c in Counter(names).items() if c>1),'sample_members':names[:20]}
def verify_archive(source_dir:Path,logical_name:str,spec:dict)->dict:
    candidates=find_candidates(source_dir,spec); expected_sha=str(spec['sha256']); expected_bytes=spec.get('historical_bytes'); exact=[c for c in candidates if c.sha256==expected_sha and (expected_bytes is None or c.size==expected_bytes)]
    result={'logical_name':logical_name,'canonical_name':spec['canonical_name'],'expected_sha256':expected_sha,'expected_bytes':expected_bytes,'historical_original_records':spec['historical_original_records'],'historical_raw_diagnostic_records':spec['historical_raw_diagnostic_records'],'candidates':[{'path':str(c.path),'name':c.path.name,'bytes':c.size,'sha256':c.sha256} for c in candidates],'status':'MISSING','selected':None,'zip_inspection':None}
    if not candidates: return result
    if not exact:
        sha_matches=[c for c in candidates if c.sha256==expected_sha]
        size_matches=[c for c in candidates if expected_bytes is None or c.size==expected_bytes]
        if not sha_matches and size_matches: result['status']='HASH_MISMATCH'
        elif sha_matches and not any(expected_bytes is None or c.size==expected_bytes for c in sha_matches): result['status']='SIZE_MISMATCH'
        else: result['status']='HASH_OR_SIZE_MISMATCH'
        return result
    result['status']='EXACT_MATCH_DUPLICATED_UPLOAD' if len(exact)>1 else 'EXACT_MATCH'; selected=exact[0]; result['selected']={'path':str(selected.path),'name':selected.path.name,'bytes':selected.size,'sha256':selected.sha256}
    try:
        result['zip_inspection']=inspect_zip(selected.path)
        if not result['zip_inspection']['zip_valid']: result['status']='ZIP_CRC_FAILURE'
    except (zipfile.BadZipFile,OSError) as exc:
        result['status']='INVALID_ZIP'; result['zip_inspection']={'error':f'{type(exc).__name__}: {exc}'}
    return result
def build_report(source_dir:Path,specs:dict[str,dict]|None=None)->dict:
    specs=specs or EXPECTED_ARCHIVES; archives={n:verify_archive(source_dir,n,s) for n,s in specs.items()}; exact_statuses={'EXACT_MATCH','EXACT_MATCH_DUPLICATED_UPLOAD'}; all_exact=all(x['status'] in exact_statuses for x in archives.values()); all_zip_valid=all(bool(x.get('zip_inspection') and x['zip_inspection'].get('zip_valid')) for x in archives.values()); ready=all_exact and all_zip_valid
    return {'workflow':'Math Source Archive Exact Identity Verification','recorded_at_utc':datetime.now(timezone.utc).isoformat(),'source_dir':str(source_dir),'mode':'SOURCE_REBUILD_INPUT_VERIFICATION','identity_basis':'historical source-recovery state with actual SHA-256 and byte sizes','policy':{'renamed_copy_suffix_allowed':'trailing (N) before .zip may differ','content_identity':'SHA-256 and recorded byte size must exactly match recovered historical source archive','hash_mismatch_fail_closed':True,'raw_diagnostic_records_never_promote_directly':True,'winpass_717_to_570_count_forcing_forbidden':True,'reconstruction_from_exact_sources_allowed_only_after_full_reaudit':True,'historical_canonical_bytes_are_not_recreated_by_claim':True,'new_rebuilt_base_requires_problem_answer_figure_duplicate_structure_gates':True},'historical_targets':{'documents_total':140,'raw_diagnostic_records':{'winpass':717,'jitsuren':237,'standard':317,'total':1271},'authoritative_original_records':{'winpass':570,'jitsuren':237,'standard':317,'total':1124}},'archives':archives,'all_expected_archives_exact':all_exact,'all_selected_archives_zip_valid':all_zip_valid,'exact_source_archives_verified_for_rebuild':ready,'promotable_to_historical_canonical_without_revalidation':False,'ready_for_rebuild_pipeline':ready,'ready_for_real_rebuild':ready,'next':'If exact sources are verified, recover prior generated layers first; only recompute missing layers. Reproduce 140 documents, raw 717/237/317, establish Winpass570 by evidence, then fully revalidate 1124 originals.'}
def main(argv:Iterable[str]|None=None)->int:
    p=argparse.ArgumentParser(); p.add_argument('--source-dir',type=Path,default=Path('math-bank/source')); p.add_argument('--report',type=Path,default=Path('math-bank/state/source-rebuild-archive-verification-latest.json')); p.add_argument('--strict',action='store_true'); a=p.parse_args(list(argv) if argv is not None else None); report=build_report(a.source_dir); a.report.parent.mkdir(parents=True,exist_ok=True); a.report.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8'); print(json.dumps(report,ensure_ascii=False,indent=2)); return 2 if a.strict and not report['ready_for_rebuild_pipeline'] else 0
if __name__=='__main__': raise SystemExit(main())
