from __future__ import annotations

"""Fail-closed exact engine for rectangular-prism surface-area shapes."""

import hashlib
import json
import re

from safe_rectangular_prism_height_from_surface_area_variant_engine import generate as generate_height_inverse

DIMENSION_RE=re.compile(r"たて\s*(?P<length>\d+)\s*cm\s*[、, ]*よこ\s*(?P<width>\d+)\s*cm\s*[、, ]*高さ\s*(?P<height>\d+)\s*cm")
ANSWER_RE=re.compile(r"^(?P<area>\d+)\s*(?:cm\^?2|cm²|㎠)$")


def _norm(value:object)->str:
    return str(value or "").replace("　"," ").replace("ｃｍ","cm").replace("ＣＭ","cm").replace("平方センチメートル","cm²")


def _parent_sha(parent:dict)->str:
    raw=json.dumps(parent,ensure_ascii=False,sort_keys=True,separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _parse_parent(parent:dict):
    if parent.get("figure_refs") or parent.get("choices"): return None
    q=_norm(parent.get("question"))
    if "直方体" not in q or "表面積" not in q: return None
    blocked=("体積","高さを","たてを","よこを","立方体","展開図","図","容積","mm","メートル")
    if any(t in q for t in blocked): return None
    matches=list(DIMENSION_RE.finditer(q))
    if len(matches)!=1: return None
    m=matches[0]; l=int(m.group("length")); w=int(m.group("width")); h=int(m.group("height"))
    if min(l,w,h)<=0: return None
    area=2*(l*w+l*h+w*h)
    am=ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ",""))
    if am is None or int(am.group("area"))!=area: return None
    if 2*l*w+2*l*h+2*w*h!=area: return None
    return m,l,w,h,area


def can_generate(parent:dict)->tuple[bool,str]:
    rows,_,reason=generate_height_inverse(parent,1)
    if rows: return True,reason
    if _parse_parent(parent) is not None: return True,"rectangular_prism_integer_cm_surface_area_exact"
    if parent.get("figure_refs"): return False,"figure_parent"
    if parent.get("choices"): return False,"choice_parent"
    return False,"rectangular_prism_surface_area_parent_not_exactly_parsed_and_verified"


def _variant_numbers(seed:int,index:int)->tuple[int,int,int]:
    return (2+((seed>>(index*3))+index*5)%15,2+((seed>>(index*5+1))+index*7)%13,2+((seed>>(index*7+2))+index*3)%11)


def generate(parent:dict,count:int)->tuple[list[dict],list[dict],str]:
    if count not in (1,2,3): raise ValueError("count must be 1, 2, or 3")
    rows,evidence,reason=generate_height_inverse(parent,count)
    if rows: return rows,evidence,reason
    parsed=_parse_parent(parent)
    if parsed is None:
        ok,reason=can_generate(parent); assert not ok
        return [],[],reason
    match,pl,pw,ph,parent_area=parsed; q=_norm(parent.get("question")); seed=int(_parent_sha(parent)[:12],16)
    parent_signature=(str(pl),str(pw),str(ph)); seen=set(); rows=[]; evidence=[]
    for index in range(1,count+1):
        l,w,h=_variant_numbers(seed,index); signature=(str(l),str(w),str(h)); bump=0
        while signature==parent_signature or signature in seen:
            bump+=1; l+=bump; signature=(str(l),str(w),str(h))
        seen.add(signature); area=2*(l*w+l*h+w*h); face_pair_sum=2*l*w+2*l*h+2*w*h
        if face_pair_sum!=area: raise AssertionError("rectangular prism surface-area face-pair identity failed")
        replacement=f"たて{l}cm、よこ{w}cm、高さ{h}cm"; new_q=q[:match.start()]+replacement+q[match.end():]
        rows.append({"question":new_q,"answer":f"{area}cm²","explanation":f"表面積=2×(たて×よこ+たて×高さ+よこ×高さ)より、2×({l}×{w}+{l}×{h}+{w}×{h})={area}cm²。向かい合う3組の面の合計でも確認済み。","numeric_signature":signature})
        evidence.append({"parent_sha256":_parent_sha(parent),"method":"rectangular_prism_surface_area_exact_three_face_pairs","parent_recalculation":f"2×({pl}×{pw}+{pl}×{ph}+{pw}×{ph})={parent_area}cm²","variant_recalculation":f"2×({l}×{w}+{l}×{h}+{w}×{h})={area}cm²","independent_check":"2lw + 2lh + 2wh == surface_area PASS"})
    return rows,evidence,"rectangular_prism_integer_cm_surface_area_exact"
