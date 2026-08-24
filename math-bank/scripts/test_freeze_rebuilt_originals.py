from __future__ import annotations

import importlib.util
from pathlib import Path

MODULE_PATH = Path(__file__).with_name("freeze_rebuilt_originals.py")
spec = importlib.util.spec_from_file_location("freeze_rebuilt_originals", MODULE_PATH)
assert spec and spec.loader
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)


def row(book: str, i: int) -> dict:
    return {"id":f"{book}-{i}","grade":1+(i%3),"unit":{"major":"major","minor":"minor","tags":[]},"title":"title","skill":"skill","question_format":"short_answer","difficulty":"standard","source":{"book":book,"document":f"{book}.docx","original_no":str(i),"is_generated_variant":False,"parent_id":None},"question":f"q-{book}-{i}","choices":None,"answer":f"a-{book}-{i}","explanation":"","figure_refs":[],"variant_group":None,"audit":{"problem_answer_verified":True,"structure_verified":True,"figure_refs_verified":True}}

def rows(source: str, count: int) -> list[dict]: return [row(source,i) for i in range(count)]
def evidence(records:list[dict])->list[dict]:
    out=[]
    for r in records:
        out.append({"record_id":r["id"],"record_sha256":m._m.canonical_sha(r),"source_document":r["source"]["document"],"source_locator":{"original_no":r["source"]["original_no"]},"grade_evidence":{"value":r["grade"]},"unit_evidence":{"value":r["unit"]},"skill_evidence":{"value":r["skill"]},"question_format_evidence":{"value":r["question_format"]},"difficulty_evidence":{"value":r["difficulty"]}})
    return out

def main() -> None:
    w=rows("Winpass",570); j=rows("実力錬成",237); s=rows("Standard",317); all_rows=w+j+s; ev=evidence(all_rows)
    combined,manifest=m.freeze(w,j,s,ev,set())
    assert len(combined)==1124 and manifest["records"]==1124
    assert combined[0]["id"]=="Winpass-0" and combined[569]["id"]=="Winpass-569"
    assert combined[570]["id"]=="実力錬成-0" and combined[806]["id"]=="実力錬成-236"
    assert combined[807]["id"]=="Standard-0" and combined[-1]["id"]=="Standard-316"
    assert len(manifest["provenance"])==1124 and len(manifest["combined_payload_sha256"])==64
    assert len(manifest["record_sha256_sequence_sha256"])==64 and len(manifest["mapping_evidence_sha256"])==64
    assert manifest["policy"]["mapping_must_precede_freeze"] is True

    stale=[dict(x) for x in ev]; stale[0]["record_sha256"]="0"*64
    try: m.freeze(w,j,s,stale,set())
    except ValueError: pass
    else: raise AssertionError("stale mapping fingerprint must block freeze")

    changed=[dict(x) for x in w]; changed[0]=dict(changed[0]); changed[0]["source"]=dict(changed[0]["source"]); changed[0]["source"]["is_generated_variant"]=True; changed[0]["source"]["book"]="generated"; changed[0]["source"]["parent_id"]="X"
    try: m.freeze(changed,j,s,ev,set())
    except ValueError: pass
    else: raise AssertionError("generated contamination must block freeze")

    try: m.freeze(w[:-1],j,s,ev[:-1],set())
    except ValueError: pass
    else: raise AssertionError("wrong count must block freeze")
    print("PASS_IMMUTABLE_REBUILT_APP_ORIGINALS_MAPPING_BEFORE_FREEZE_SHA_ORDER_GATES")
if __name__=="__main__": main()
