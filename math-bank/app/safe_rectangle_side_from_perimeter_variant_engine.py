from __future__ import annotations

"""Fail-closed exact engine for a rectangle missing side from perimeter and one known side."""

import hashlib
import json
import re

KNOWN_RE = re.compile(r"(?P<label>たて|縦|よこ|横)\s*(?P<known>\d+)\s*(?P<unit>mm|cm|m)")
PERIM_RE = re.compile(r"(?:周の長さ|周りの長さ|まわりの長さ)\s*(?:が|は)?\s*(?P<perim>\d+)\s*(?P<unit>mm|cm|m)")
ANSWER_RE = re.compile(r"^(?P<missing>\d+)\s*(?P<unit>mm|cm|m)$")


def _norm(value: object) -> str:
    return str(value or "").replace("　", " ")


def _sha(parent: dict) -> str:
    return hashlib.sha256(json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")).hexdigest()


def _parse_parent(parent: dict):
    if parent.get("figure_refs") or parent.get("choices"):
        return None
    q = _norm(parent.get("question"))
    if "長方形" not in q or "長さ" not in q or "求" not in q or not any(t in q for t in ("周の長さ", "周りの長さ", "まわりの長さ")):
        return None
    if any(t in q for t in ("面積", "正方形", "対角線", "図", "グラフ")):
        return None
    kms=list(KNOWN_RE.finditer(q)); pms=list(PERIM_RE.finditer(q))
    if len(kms)!=1 or len(pms)!=1:
        return None
    km,pm=kms[0],pms[0]
    known=int(km.group("known")); perim=int(pm.group("perim")); unit=km.group("unit")
    if unit!=pm.group("unit") or known<=0 or perim<=0 or perim%2:
        return None
    target_vertical=any(t in q for t in ("たての長さ","縦の長さ")); target_horizontal=any(t in q for t in ("よこの長さ","横の長さ"))
    if target_vertical==target_horizontal:
        return None
    known_vertical=km.group("label") in ("たて","縦")
    if known_vertical==target_vertical:
        return None
    missing=perim//2-known
    if missing<=0:
        return None
    ans=ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ",""))
    if ans is None or ans.group("unit")!=unit or int(ans.group("missing"))!=missing:
        return None
    if 2*(known+missing)!=perim or perim//2-missing!=known:
        return None
    return km,pm,known,missing,perim,unit,target_vertical


def can_generate(parent: dict) -> tuple[bool,str]:
    if _parse_parent(parent) is not None:
        return True,"rectangle_missing_side_from_perimeter_exact"
    if parent.get("figure_refs"):
        return False,"figure_parent"
    if parent.get("choices"):
        return False,"choice_parent"
    return False,"rectangle_missing_side_from_perimeter_parent_not_exactly_parsed_and_verified"


def generate(parent: dict,count:int):
    if count not in (1,2,3):
        raise ValueError("count must be 1, 2, or 3")
    parsed=_parse_parent(parent)
    if parsed is None:
        ok,reason=can_generate(parent); assert not ok; return [],[],reason
    km,pm,parent_known,parent_missing,parent_perim,unit,target_vertical=parsed
    q=_norm(parent.get("question")); seed=int(_sha(parent)[:12],16); seen=set(); rows=[]; evidence=[]
    for index in range(1,count+1):
        known=2+((seed>>(index*5))+index*3)%12; missing=3+((seed>>(index*7+2))+index*5)%14; sig=(known,missing)
        while sig==(parent_known,parent_missing) or sig in seen:
            missing+=1; sig=(known,missing)
        seen.add(sig); perim=2*(known+missing)
        if perim//2-known!=missing or perim//2-missing!=known:
            raise AssertionError("rectangle perimeter missing-side identity failed")
        known_label="横" if target_vertical else "たて"
        replacements=[(km.start(),km.end(),f"{known_label}{known}{unit}"),(pm.start(),pm.end(),f"周の長さ{perim}{unit}")]
        new_q=q
        for start,end,repl in sorted(replacements,reverse=True): new_q=new_q[:start]+repl+new_q[end:]
        rows.append({"question":new_q,"answer":f"{missing}{unit}","explanation":f"半周={perim}÷2={perim//2}{unit}。求める辺={perim//2}-{known}={missing}{unit}。2×({known}+{missing})={perim}{unit}でも確認済み。","numeric_signature":(str(known),str(perim))})
        evidence.append({"parent_sha256":_sha(parent),"method":"rectangle_missing_side_from_perimeter_half_and_recomposition","parent_recalculation":f"{parent_perim}÷2-{parent_known}={parent_missing}{unit}","variant_recalculation":f"{perim}÷2-{known}={missing}{unit}","independent_check":"P/2-known == missing AND 2*(known+missing) == P PASS"})
    return rows,evidence,"rectangle_missing_side_from_perimeter_exact"
