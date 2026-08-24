from __future__ import annotations

import argparse
import importlib.util
import json
from pathlib import Path

FREEZE_PATH=Path(__file__).with_name("freeze_rebuilt_originals.py")
spec=importlib.util.spec_from_file_location("freeze_rebuilt_originals",FREEZE_PATH); assert spec and spec.loader
_f=importlib.util.module_from_spec(spec); spec.loader.exec_module(_f)

def load_obj(path:Path)->object: return json.loads(path.read_text(encoding="utf-8"))

def validate(records:list[dict],manifest:dict)->dict:
    issues=[]
    if len(records)!=1124: issues.append({"issue":"record_count_mismatch","expected":1124,"actual":len(records)})
    if manifest.get("records")!=len(records): issues.append({"issue":"manifest_record_count_mismatch","manifest":manifest.get("records"),"actual":len(records)})
    payload_sha=_f.payload_sha256(records)
    if manifest.get("combined_payload_sha256")!=payload_sha: issues.append({"issue":"combined_payload_sha256_mismatch","expected":payload_sha,"actual":manifest.get("combined_payload_sha256")})
    provenance=manifest.get("provenance")
    if not isinstance(provenance,list): provenance=[]; issues.append({"issue":"provenance_not_list"})
    if len(provenance)!=len(records): issues.append({"issue":"provenance_count_mismatch","expected":len(records),"actual":len(provenance)})
    full_shas=[]; extraction_fps=[]; counts={"Winpass":0,"実力錬成":0,"Standard":0}; order=["Winpass"]*570+["実力錬成"]*237+["Standard"]*317
    for i,r in enumerate(records):
        full_sha=_f._m.canonical_sha(r); extraction_fp=_f._v.fingerprint(r); full_shas.append(full_sha); extraction_fps.append(extraction_fp)
        if i>=len(provenance): continue
        p=provenance[i]
        if not isinstance(p,dict): issues.append({"index":i,"issue":"provenance_not_object"}); continue
        source=str(p.get("source","")).strip(); expected_source=order[i] if i<len(order) else None
        if p.get("combined_index")!=i: issues.append({"index":i,"issue":"combined_index_mismatch","actual":p.get("combined_index")})
        if source!=expected_source: issues.append({"index":i,"issue":"source_order_mismatch","expected":expected_source,"actual":source})
        if source in counts: counts[source]+=1
        local=i if source=="Winpass" else i-570 if source=="実力錬成" else i-807 if source=="Standard" else None
        if p.get("source_index")!=local: issues.append({"index":i,"issue":"source_index_mismatch","expected":local,"actual":p.get("source_index")})
        rid=str(r.get("id","")).strip()
        if str(p.get("record_id","")).strip()!=rid: issues.append({"index":i,"issue":"record_id_mismatch","expected":rid,"actual":p.get("record_id")})
        if str(p.get("record_sha256","")).strip().lower()!=full_sha: issues.append({"index":i,"issue":"record_sha256_mismatch","expected":full_sha,"actual":p.get("record_sha256")})
        if str(p.get("record_extraction_fingerprint_sha256","")).strip().lower()!=extraction_fp: issues.append({"index":i,"issue":"record_extraction_fingerprint_mismatch","expected":extraction_fp,"actual":p.get("record_extraction_fingerprint_sha256")})
    full_seq=_f.payload_sha256(full_shas); extraction_seq=_f.payload_sha256(extraction_fps)
    if manifest.get("record_sha256_sequence_sha256")!=full_seq: issues.append({"issue":"record_sha256_sequence_mismatch","expected":full_seq,"actual":manifest.get("record_sha256_sequence_sha256")})
    if manifest.get("extraction_fingerprint_sequence_sha256")!=extraction_seq: issues.append({"issue":"extraction_fingerprint_sequence_mismatch","expected":extraction_seq,"actual":manifest.get("extraction_fingerprint_sequence_sha256")})
    expected_counts={"Winpass":570,"実力錬成":237,"Standard":317}
    if manifest.get("source_counts")!=expected_counts: issues.append({"issue":"manifest_source_counts_mismatch","actual":manifest.get("source_counts")})
    if counts!=expected_counts: issues.append({"issue":"provenance_source_counts_mismatch","actual":counts})
    return {"records":len(records),"combined_payload_sha256":payload_sha,"record_sha256_sequence_sha256":full_seq,"extraction_fingerprint_sequence_sha256":extraction_seq,"source_counts":counts,"issues":issues,"pass":not issues,"policy":{"manifest_and_records_must_match_exactly":True,"mapped_full_record_sha_binding_required":True,"extraction_fingerprint_binding_required":True,"fixed_source_order_required":True,"only_pass_may_feed_variant_parent_binding":True}}

def main()->int:
    ap=argparse.ArgumentParser(); ap.add_argument("--records",type=Path,required=True); ap.add_argument("--manifest",type=Path,required=True); ap.add_argument("--report",type=Path,required=True); args=ap.parse_args(); records=load_obj(args.records); manifest=load_obj(args.manifest)
    if not isinstance(records,list) or not all(isinstance(x,dict) for x in records): raise SystemExit("records must be array of objects")
    if not isinstance(manifest,dict): raise SystemExit("manifest must be object")
    result=validate(records,manifest); args.report.parent.mkdir(parents=True,exist_ok=True); args.report.write_text(json.dumps(result,ensure_ascii=False,indent=2)+"\n",encoding="utf-8"); print(json.dumps(result,ensure_ascii=False,indent=2)); return 0 if result["pass"] else 11
if __name__=="__main__": raise SystemExit(main())
