from __future__ import annotations

"""Fail-closed exact engine for a missing trapezoid base from area.

Accepts only text-only, non-choice parents that give area, height, and exactly
one of upper/lower base in one unit, then ask for the other base. The parent is
accepted only when 2A/h-known is a positive integer and recomposes exactly.
"""

import hashlib
import json
import re

GIVEN_RE = re.compile(r"(?P<label>上底|下底)\s*(?P<known>\d+)\s*(?P<unit>mm|cm|m)")
HEIGHT_RE = re.compile(r"高さ\s*(?P<height>\d+)\s*(?P<unit>mm|cm|m)")
AREA_RE = re.compile(r"面積\s*(?P<area>\d+)\s*(?P<unit>mm|cm|m)(?:²|\^2|2)")
ANSWER_RE = re.compile(r"^(?P<value>\d+)\s*(?P<unit>mm|cm|m)$")

def _norm(value: object) -> str:
    return (str(value or "").replace("　", " ").replace("㎠", "cm²")
            .replace("㎡", "m²").replace("㎟", "mm²"))

def _sha(parent: dict) -> str:
    raw=json.dumps(parent,ensure_ascii=False,sort_keys=True,separators=(",",":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()

def _parse_parent(parent: dict):
    if parent.get("figure_refs") or parent.get("choices"):
        return None
    q=_norm(parent.get("question"))
    if "台形" not in q or "面積" not in q or "高さ" not in q: return None
    blocked=("周","周囲","図","複合","相似","比","平行四辺形","三角形")
    if any(t in q for t in blocked): return None
    gm=list(GIVEN_RE.finditer(q)); hm=list(HEIGHT_RE.finditer(q)); am=list(AREA_RE.finditer(q))
    if len(gm)!=1 or len(hm)!=1 or len(am)!=1: return None
    g,h,a=gm[0],hm[0],am[0]
    label=g.group("label"); missing="下底" if label=="上底" else "上底"
    if f"{missing}を" not in q and f"{missing}の長さ" not in q: return None
    if f"{label}を" in q or f"{label}の長さ" in q: return None
    unit=g.group("unit")
    if h.group("unit")!=unit or a.group("unit")!=unit: return None
    known=int(g.group("known")); height=int(h.group("height")); area=int(a.group("area"))
    if min(known,height,area)<=0: return None
    doubled=2*area
    if doubled % height: return None
    total=doubled//height; missing_value=total-known
    if missing_value<=0: return None
    ans=ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ",""))
    if ans is None or ans.group("unit")!=unit or int(ans.group("value"))!=missing_value: return None
    if (known+missing_value)*height != doubled: return None
    return g,h,a,label,missing,known,height,area,missing_value,unit

def can_generate(parent: dict) -> tuple[bool,str]:
    if _parse_parent(parent) is not None: return True,"trapezoid_base_from_area_exact"
    if parent.get("figure_refs"): return False,"figure_parent"
    if parent.get("choices"): return False,"choice_parent"
    return False,"trapezoid_base_from_area_parent_not_exactly_parsed_and_verified"

def generate(parent: dict,count: int) -> tuple[list[dict],list[dict],str]:
    if count not in (1,2,3): raise ValueError("count must be 1, 2, or 3")
    parsed=_parse_parent(parent)
    if parsed is None:
        ok,reason=can_generate(parent); assert not ok
        return [],[],reason
    g,h,a,label,missing,parent_known,parent_height,parent_area,parent_missing,unit=parsed
    q=_norm(parent.get("question")); seed=int(_sha(parent)[:12],16)
    parent_sig=(str(parent_known),str(parent_height),str(parent_area)); seen=set(); rows=[]; evidence=[]
    for index in range(1,count+1):
        known=2+((seed>>(index*4))+index*3)%12
        height=2+((seed>>(index*6+2))+index*5)%10
        missing_value=known+1+((seed>>(index*7+1))+index*7)%12
        area=(known+missing_value)*height//2
        if ((known+missing_value)*height)%2:
            missing_value+=1; area=(known+missing_value)*height//2
        sig=(str(known),str(height),str(area)); bump=0
        while sig==parent_sig or sig in seen:
            bump+=1; missing_value+=2*bump; area=(known+missing_value)*height//2; sig=(str(known),str(height),str(area))
        seen.add(sig)
        doubled=2*area
        if doubled%height or doubled//height-known!=missing_value or (known+missing_value)*height!=doubled:
            raise AssertionError("trapezoid base inverse identity failed")
        repls=[(g.start(),g.end(),f"{label}{known}{unit}"),(h.start(),h.end(),f"高さ{height}{unit}"),(a.start(),a.end(),f"面積{area}{unit}²")]
        new_q=q
        for start,end,repl in sorted(repls,reverse=True): new_q=new_q[:start]+repl+new_q[end:]
        rows.append({"question":new_q,"answer":f"{missing_value}{unit}","explanation":f"台形の面積×2÷高さで上底+下底を求め、既知の底辺を引く。2×{area}÷{height}-{known}={missing_value}{unit}。再合成でも確認済み。","numeric_signature":sig})
        evidence.append({"parent_sha256":_sha(parent),"method":"trapezoid_base_from_area_exact_inverse_and_recomposition","parent_recalculation":f"2×{parent_area}÷{parent_height}-{parent_known}={parent_missing}{unit}","variant_recalculation":f"2×{area}÷{height}-{known}={missing_value}{unit}","independent_check":"2*area/height-known == missing_base AND (known+missing_base)*height == 2*area PASS"})
    return rows,evidence,"trapezoid_base_from_area_exact"
