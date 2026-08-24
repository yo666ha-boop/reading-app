from __future__ import annotations
import argparse,hashlib,json
from datetime import datetime,timezone
from pathlib import Path
from validate_app_records import load_records
import validate_rebuilt_expanded_variant_layer as rebuilt

def sha256_path(path:Path)->str:
    h=hashlib.sha256()
    with path.open('rb') as f:
        for chunk in iter(lambda:f.read(1024*1024),b''): h.update(chunk)
    return h.hexdigest()
def atomic_json(path:Path,obj:object)->None:
    path.parent.mkdir(parents=True,exist_ok=True); tmp=path.with_suffix(path.suffix+'.tmp'); tmp.write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n',encoding='utf-8'); tmp.replace(path)
def compose(base_path:Path,manifest_path:Path,layer_path:Path,output_path:Path,snapshot_path:Path,*,require_full_parent_coverage:bool=False)->dict:
    base=load_records(base_path)
    validation=rebuilt.load_and_validate(base_path,manifest_path,layer_path,require_full_parent_coverage=require_full_parent_coverage)
    manifest=json.loads(manifest_path.read_text(encoding='utf-8')); anchor=str(manifest['combined_payload_sha256'])
    variants,provenance,layer_anchor=rebuilt.legacy.load_layer(layer_path)
    if layer_anchor!=anchor: raise ValueError('layer/base immutable anchor mismatch after validation')
    atomic_json(snapshot_path,base); atomic_json(output_path,base+variants)
    return {'status':'PASS','mode':'IMMUTABLE_REBUILT_1124_PLUS_VERIFIED_EXPANDED_VARIANTS','recorded_at_utc':datetime.now(timezone.utc).isoformat(),'base_file':str(base_path),'base_file_sha256':sha256_path(base_path),'base_snapshot_file':str(snapshot_path),'base_snapshot_sha256':sha256_path(snapshot_path),'rebuilt_base_payload_sha256_anchor':anchor,'freeze_manifest_file':str(manifest_path),'freeze_manifest_sha256':sha256_path(manifest_path),'expanded_layer_file':str(layer_path),'expanded_layer_sha256':sha256_path(layer_path),'output_file':str(output_path),'output_sha256':sha256_path(output_path),'base_records':validation['base_records'],'base_originals':validation['base_originals'],'baseline_verified_variants':validation['baseline_verified_variants'],'expanded_verified_variants':validation['expanded_verified_variants'],'final_total':validation['composed_total'],'expanded_parent_coverage':validation['expanded_parent_coverage'],'expanded_parent_target':validation['expanded_parent_target'],'expanded_parent_coverage_percent':validation['expanded_parent_coverage_percent'],'uncovered_parent_count':validation['uncovered_parent_count'],'require_full_parent_coverage':require_full_parent_coverage,'publication_expansion_ready':bool(validation['uncovered_parent_count']==0 and validation['expanded_verified_variants']>=1124),'policy':{'old_1231_snapshot_not_used_in_rebuilt_mode':True,'immutable_rebuilt_1124_snapshot_preserved':True,'dynamic_freeze_anchor_required':True,'only_strict_parent_bound_variants_appended':True}}
def main()->int:
    ap=argparse.ArgumentParser(); ap.add_argument('base'); ap.add_argument('freeze_manifest'); ap.add_argument('expanded'); ap.add_argument('output'); ap.add_argument('--report',required=True); ap.add_argument('--base-snapshot',required=True); ap.add_argument('--require-full-parent-coverage',action='store_true'); ns=ap.parse_args()
    try: report=compose(Path(ns.base),Path(ns.freeze_manifest),Path(ns.expanded),Path(ns.output),Path(ns.base_snapshot),require_full_parent_coverage=ns.require_full_parent_coverage)
    except Exception as exc: print(f'FAIL_CLOSED: {exc}'); return 17
    atomic_json(Path(ns.report),report); print(json.dumps(report,ensure_ascii=False,indent=2)); return 0
if __name__=='__main__': raise SystemExit(main())
