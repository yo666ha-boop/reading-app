from __future__ import annotations
import importlib.util
from pathlib import Path
MODULE_PATH=Path(__file__).with_name("validate_frozen_rebuilt_originals.py")
spec=importlib.util.spec_from_file_location("validate_frozen_rebuilt_originals",MODULE_PATH); assert spec and spec.loader
m=importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
def row(book,i): return {"id":f"{book}-{i}","grade":1+(i%3),"unit":{"major":"major","minor":"minor","tags":[]},"title":"title","skill":"skill","question_format":"short_answer","difficulty":"standard","source":{"book":book,"document":f"{book}.docx","original_no":str(i),"is_generated_variant":False,"parent_id":None},"question":f"q-{book}-{i}","choices":None,"answer":f"a-{book}-{i}","explanation":"","figure_refs":[],"variant_group":None,"audit":{"problem_answer_verified":True,"structure_verified":True,"figure_refs_verified":True}}
def rows(book,n): return [row(book,i) for i in range(n)]
def evidence(rs): return [{"record_id":r["id"],"record_sha256":m._f._m.canonical_sha(r),"source_document":r["source"]["document"],"source_locator":{"original_no":r["source"]["original_no"]},"grade_evidence":{"value":r["grade"]},"unit_evidence":{"value":r["unit"]},"skill_evidence":{"value":r["skill"]},"question_format_evidence":{"value":r["question_format"]},"difficulty_evidence":{"value":r["difficulty"]}} for r in rs]
def main():
    w=rows("Winpass",570); j=rows("実力錬成",237); s=rows("Standard",317); all_rows=w+j+s
    frozen,manifest=m._f.freeze(w,j,s,evidence(all_rows),set()); ok=m.validate(frozen,manifest); assert ok["pass"] is True
    changed=[dict(x) for x in frozen]; changed[10]=dict(changed[10]); changed[10]["answer"]="changed"; report=m.validate(changed,manifest); assert report["pass"] is False; assert any(x["issue"]=="combined_payload_sha256_mismatch" for x in report["issues"]); assert any(x.get("issue")=="record_sha256_mismatch" for x in report["issues"])
    bad=dict(manifest); bad["record_sha256_sequence_sha256"]="0"*64; report=m.validate(frozen,bad); assert report["pass"] is False; assert any(x["issue"]=="record_sha256_sequence_mismatch" for x in report["issues"])
    badp=dict(manifest); badp["provenance"]=[dict(x) for x in manifest["provenance"]]; badp["provenance"][570]["source"]="Winpass"; report=m.validate(frozen,badp); assert report["pass"] is False; assert any(x.get("issue")=="source_order_mismatch" for x in report["issues"])
    print("PASS_FROZEN_REBUILT_APP_ORIGINALS_FULL_SHA_EXACT_MANIFEST_PARENT_BINDING_GATES")
if __name__=="__main__": main()
