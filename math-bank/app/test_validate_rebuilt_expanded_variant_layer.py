from __future__ import annotations

import json
from pathlib import Path
import importlib.util
import tempfile

import validate_rebuilt_expanded_variant_layer as m

FREEZE_PATH=Path(__file__).parents[1]/"scripts"/"freeze_rebuilt_originals.py"
spec=importlib.util.spec_from_file_location("freeze_rebuilt_originals",FREEZE_PATH); assert spec and spec.loader
f=importlib.util.module_from_spec(spec); spec.loader.exec_module(f)

def row(book,i): return {"id":f"{book}-{i}","grade":1+(i%3),"unit":{"major":"major","minor":"minor","tags":[]},"title":"title","skill":"skill","question_format":"short_answer","difficulty":"standard","source":{"book":book,"document":f"{book}.docx","original_no":str(i),"is_generated_variant":False,"parent_id":None},"question":f"q-{book}-{i}","choices":None,"answer":f"a-{book}-{i}","explanation":"","figure_refs":[],"variant_group":None,"audit":{"problem_answer_verified":True,"structure_verified":True,"figure_refs_verified":True}}
def evidence(rs): return [{"record_id":r["id"],"record_sha256":f._m.canonical_sha(r),"source_document":r["source"]["document"],"source_locator":{"original_no":r["source"]["original_no"]},"grade_evidence":{"value":r["grade"]},"unit_evidence":{"value":r["unit"]},"skill_evidence":{"value":r["skill"]},"question_format_evidence":{"value":r["question_format"]},"difficulty_evidence":{"value":r["difficulty"]}} for r in rs]
def main():
    w=[row("Winpass",i) for i in range(570)]; j=[row("実力錬成",i) for i in range(237)]; s=[row("Standard",i) for i in range(317)]; base=w+j+s
    frozen,manifest=f.freeze(w,j,s,evidence(base),set()); anchor=m.configure_rebuilt_mode(frozen,manifest); assert anchor==manifest["combined_payload_sha256"]
    result=m.legacy.validate_layer(frozen,[],[],require_full_parent_coverage=False); assert result["expanded_parent_coverage"]==0
    layer={"schema_version":"1.0","base_canonical_sha256":anchor,"variants":[],"provenance":[]}
    with tempfile.TemporaryDirectory() as td:
        td=Path(td); bp=td/"base.json"; mp=td/"manifest.json"; lp=td/"layer.json"
        bp.write_text(json.dumps(frozen,ensure_ascii=False),encoding="utf-8"); mp.write_text(json.dumps(manifest,ensure_ascii=False),encoding="utf-8"); lp.write_text(json.dumps(layer,ensure_ascii=False),encoding="utf-8")
        out=m.load_and_validate(bp,mp,lp); assert out["mode"]=="REBUILT_1124_DYNAMIC_IMMUTABLE_BASE" and out["rebuilt_base_sha256"]==anchor
        bad=dict(layer); bad["base_canonical_sha256"]="0"*64; lp.write_text(json.dumps(bad),encoding="utf-8")
        try: m.load_and_validate(bp,mp,lp)
        except ValueError: pass
        else: raise AssertionError("wrong rebuilt anchor must fail")
    print("PASS_REBUILT_1124_DYNAMIC_ANCHOR_EXPANDED_VALIDATOR_NO_OLD_1231_DEPENDENCY")
if __name__=="__main__": main()
