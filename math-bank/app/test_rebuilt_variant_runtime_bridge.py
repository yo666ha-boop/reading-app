from __future__ import annotations
import json,importlib.util,tempfile
from pathlib import Path
import generate_rebuilt_safe_verified_variants as bridge
import initialize_rebuilt_variant_layer as init
FREEZE=Path(__file__).parents[1]/"scripts"/"freeze_rebuilt_originals.py"
spec=importlib.util.spec_from_file_location("freeze_rebuilt_originals",FREEZE); assert spec and spec.loader
f=importlib.util.module_from_spec(spec); spec.loader.exec_module(f)
def row(book,i): return {"id":f"{book}-{i}","grade":1+(i%3),"unit":{"major":"major","minor":"minor","tags":[]},"title":"title","skill":"skill","question_format":"short_answer","difficulty":"standard","source":{"book":book,"document":f"{book}.docx","original_no":str(i),"is_generated_variant":False,"parent_id":None},"question":f"q-{book}-{i}","choices":None,"answer":f"a-{book}-{i}","explanation":"","figure_refs":[],"variant_group":None,"audit":{"problem_answer_verified":True,"structure_verified":True,"figure_refs_verified":True}}
def evidence(rs): return [{"record_id":r["id"],"record_sha256":f._m.canonical_sha(r),"source_document":r["source"]["document"],"source_locator":{"original_no":r["source"]["original_no"]},"grade_evidence":{"value":r["grade"]},"unit_evidence":{"value":r["unit"]},"skill_evidence":{"value":r["skill"]},"question_format_evidence":{"value":r["question_format"]},"difficulty_evidence":{"value":r["difficulty"]}} for r in rs]
def main():
    w=[row("Winpass",i) for i in range(570)]; j=[row("実力錬成",i) for i in range(237)]; s=[row("Standard",i) for i in range(317)]; base=w+j+s; frozen,manifest=f.freeze(w,j,s,evidence(base),set())
    with tempfile.TemporaryDirectory() as td:
        td=Path(td); bp=td/"base.json"; mp=td/"manifest.json"; bp.write_text(json.dumps(frozen,ensure_ascii=False),encoding="utf-8"); mp.write_text(json.dumps(manifest,ensure_ascii=False),encoding="utf-8")
        layer=init.initialize(bp,mp); assert layer["base_canonical_sha256"]==manifest["combined_payload_sha256"] and layer["variants"]==[]
        anchor=bridge.configure(bp,mp); assert anchor==manifest["combined_payload_sha256"] and bridge.unified.BASE_CANONICAL_SHA256==anchor
        bad=dict(manifest); bad["combined_payload_sha256"]="0"*64; mp.write_text(json.dumps(bad,ensure_ascii=False),encoding="utf-8")
        try: bridge.configure(bp,mp)
        except ValueError: pass
        else: raise AssertionError("drifted freeze manifest must block rebuilt variant runtime")
    print("PASS_REBUILT_VARIANT_DYNAMIC_ANCHOR_INITIALIZER_RUNTIME_BRIDGE")
if __name__=="__main__": main()
