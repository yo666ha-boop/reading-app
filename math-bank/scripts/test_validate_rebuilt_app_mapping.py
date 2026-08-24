from __future__ import annotations

import importlib.util
from pathlib import Path

MODULE_PATH=Path(__file__).with_name("validate_rebuilt_app_mapping.py")
spec=importlib.util.spec_from_file_location("validate_rebuilt_app_mapping",MODULE_PATH); assert spec and spec.loader
m=importlib.util.module_from_spec(spec); spec.loader.exec_module(m)


def rec(book:str,i:int,grade:int)->dict:
    return {"id":f"{book}-{i}","grade":grade,"unit":{"major":"major","minor":"minor","tags":[]},"title":"title","skill":"skill","question_format":"short_answer","difficulty":"standard","source":{"book":book,"document":f"{book}.docx","original_no":str(i),"is_generated_variant":False,"parent_id":None},"question":f"question {book} {i}","choices":None,"answer":f"answer {i}","explanation":"","figure_refs":[],"variant_group":None,"audit":{"problem_answer_verified":True,"structure_verified":True,"figure_refs_verified":True}}

def ev(r:dict)->dict:
    return {"record_id":r["id"],"record_sha256":m.canonical_sha(r),"source_document":r["source"]["document"],"source_locator":{"document":r["source"]["document"],"original_no":r["source"]["original_no"]},"grade_evidence":{"method":"source_section","value":r["grade"]},"unit_evidence":{"method":"source_heading","value":r["unit"]},"skill_evidence":{"method":"source_heading","value":r["skill"]},"question_format_evidence":{"method":"source_structure","value":r["question_format"]},"difficulty_evidence":{"method":"source_label","value":r["difficulty"]}}

def main()->None:
    records=[rec("Winpass",i,1+(i%3)) for i in range(570)]+[rec("実力錬成",i,1+(i%3)) for i in range(237)]+[rec("Standard",i,1+(i%3)) for i in range(317)]
    evidence=[ev(r) for r in records]
    ok=m.validate(records,evidence); assert ok["pass"] is True and ok["records"]==1124
    stale=[dict(x) for x in evidence]; stale[0]["record_sha256"]="0"*64
    report=m.validate(records,stale); assert report["pass"] is False and any(x.get("issue")=="invalid_mapping_evidence" for x in report["issues"])
    missing=evidence[:-1]; report=m.validate(records,missing); assert report["pass"] is False and any(x.get("issue")=="missing_mapping_evidence" for x in report["issues"])
    guessed=[dict(x) for x in evidence]; guessed[1]["skill_evidence"]={}; report=m.validate(records,guessed); assert report["pass"] is False
    contaminated=[dict(x) for x in records]; contaminated[2]=dict(contaminated[2]); contaminated[2]["source"]=dict(contaminated[2]["source"]); contaminated[2]["source"]["is_generated_variant"]=True; contaminated[2]["source"]["book"]="generated"; contaminated[2]["source"]["parent_id"]="x"
    report=m.validate(contaminated,evidence); assert report["pass"] is False
    print("PASS_REBUILT_APP_MAPPING_1124_SCHEMA_EXACT_RECORD_EVIDENCE_GATES")
if __name__=="__main__": main()
