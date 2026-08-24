from __future__ import annotations

import argparse
import hashlib
import importlib.util
import json
from collections import Counter
from pathlib import Path

APP_VALIDATOR = Path(__file__).parents[1] / "app" / "validate_app_records.py"
spec = importlib.util.spec_from_file_location("validate_app_records", APP_VALIDATOR)
assert spec and spec.loader
_app = importlib.util.module_from_spec(spec)
spec.loader.exec_module(_app)


def canonical_sha(record: dict) -> str:
    raw=json.dumps(record,ensure_ascii=False,sort_keys=True,separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def load_array(path: Path) -> list[dict]:
    obj=json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(obj,list) or not all(isinstance(x,dict) for x in obj):
        raise SystemExit(f"{path}: expected array of objects")
    return obj


def validate(records:list[dict], evidence:list[dict])->dict:
    issues=[]; seen=set(); by_id={}; source_counts=Counter()
    if len(records)!=1124:
        issues.append({"issue":"record_count_mismatch","expected":1124,"actual":len(records)})
    for i,r in enumerate(records):
        try:
            _app.validate_record(r,seen)
        except Exception as exc:
            issues.append({"index":i,"id":r.get("id"),"issue":"app_schema_validation_failed","detail":str(exc)})
            continue
        rid=str(r["id"]).strip(); by_id[rid]=r
        src=r.get("source",{})
        if src.get("is_generated_variant") is not False:
            issues.append({"index":i,"id":rid,"issue":"mapped_parent_must_be_original"})
        if src.get("book") not in ("Winpass","実力錬成","Standard"):
            issues.append({"index":i,"id":rid,"issue":"mapped_parent_invalid_source_book","actual":src.get("book")})
        else:
            source_counts[src["book"]]+=1

    evidence_ids=[str(e.get("record_id","")).strip() for e in evidence]
    duplicates=sorted(k for k,n in Counter(evidence_ids).items() if k and n>1)
    if duplicates:
        issues.append({"issue":"duplicate_mapping_evidence_ids","ids":duplicates[:20]})
    evidence_map={str(e.get("record_id","")).strip():e for e in evidence if str(e.get("record_id","")).strip()}
    missing=sorted(set(by_id)-set(evidence_map)); orphan=sorted(set(evidence_map)-set(by_id))
    if missing: issues.append({"issue":"missing_mapping_evidence","count":len(missing),"ids":missing[:20]})
    if orphan: issues.append({"issue":"orphan_mapping_evidence","count":len(orphan),"ids":orphan[:20]})

    required_evidence_fields=("record_id","record_sha256","source_document","source_locator","grade_evidence","unit_evidence","skill_evidence","question_format_evidence","difficulty_evidence")
    for rid in sorted(set(by_id)&set(evidence_map)):
        r=by_id[rid]; e=evidence_map[rid]; errs=[]
        for key in required_evidence_fields:
            value=e.get(key)
            if value is None or (isinstance(value,str) and not value.strip()): errs.append(f"blank {key}")
        expected=canonical_sha(r)
        if str(e.get("record_sha256","")).strip().lower()!=expected: errs.append("record_sha256 mismatch")
        if not isinstance(e.get("source_locator"),dict) or not e.get("source_locator"): errs.append("source_locator must be nonempty object")
        for key in ("grade_evidence","unit_evidence","skill_evidence","question_format_evidence","difficulty_evidence"):
            if not isinstance(e.get(key),dict) or not e.get(key): errs.append(f"{key} must be nonempty object")
        if errs: issues.append({"record_id":rid,"issue":"invalid_mapping_evidence","errors":errs})

    expected_counts={"Winpass":570,"実力錬成":237,"Standard":317}
    if dict(source_counts)!=expected_counts:
        issues.append({"issue":"mapped_source_counts_mismatch","expected":expected_counts,"actual":dict(source_counts)})
    return {"records":len(records),"mapping_evidence":len(evidence),"source_counts":dict(source_counts),"issues":issues,"pass":not issues,"policy":{"all_1124_app_records_must_validate":True,"every_parent_requires_exact_record_bound_mapping_evidence":True,"mapping_defaults_without_source_evidence_forbidden":True,"source_locator_required":True,"grade_unit_skill_question_format_difficulty_evidence_required":True,"only_pass_may_feed_variant_generation":True}}


def main()->int:
    ap=argparse.ArgumentParser(); ap.add_argument("--records",type=Path,required=True); ap.add_argument("--mapping-evidence",type=Path,required=True); ap.add_argument("--report",type=Path,required=True); args=ap.parse_args()
    result=validate(load_array(args.records),load_array(args.mapping_evidence)); args.report.parent.mkdir(parents=True,exist_ok=True); args.report.write_text(json.dumps(result,ensure_ascii=False,indent=2)+"\n",encoding="utf-8"); print(json.dumps(result,ensure_ascii=False,indent=2)); return 0 if result["pass"] else 12
if __name__=="__main__": raise SystemExit(main())
