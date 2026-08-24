from __future__ import annotations

"""Fail-closed exact inverse for a missing rectangular-prism base side from volume."""

import hashlib, json, re

SIDE_RE=re.compile(r"(?P<label>たて|縦|よこ|横)\s*(?P<known>\d+)\s*cm")
HEIGHT_RE=re.compile(r"高さ\s*(?P<height>\d+)\s*cm")
VOLUME_RE=re.compile(r"体積(?:が|は)?\s*(?P<volume>\d+)\s*(?:cm\^?3|cm³|㎤)")
ANSWER_RE=re.compile(r"^(?P<value>\d+)\s*cm$")

def _norm(v): return str(v or "").replace("　"," ").replace("ｃｍ","cm").replace("ＣＭ","cm").replace("立方センチメートル","cm³")
def _sha(p): return hashlib.sha256(json.dumps(p,ensure_ascii=False,sort_keys=True,separators=(",",":")).encode()).hexdigest()

def _parse_parent(parent):
    if parent.get("figure_refs") or parent.get("choices"): return None
    q=_norm(parent.get("question"))
    if "直方体" not in q or "体積" not in q or "高さ" not in q: return None
    if any(t in q for t in ("表面積","立方体","展開図","図","容積","mL","mm","メートル")): return None
    sm=list(SIDE_RE.finditer(q)); hm=list(HEIGHT_RE.finditer(q)); vm=list(VOLUME_RE.finditer(q))
    if len(sm)!=1 or len(hm)!=1 or len(vm)!=1: return None
    s,h,v=sm[0],hm[0],vm[0]; label=s.group("label"); missing="よこ" if label in ("たて","縦") else "たて"
    if not any(t in q for t in (f"{missing}を求",f"{missing}の長さ",f"{missing}は何")): return None
    known=int(s.group("known")); height=int(h.group("height")); volume=int(v.group("volume"))
    denom=known*height
    if min(known,height,volume)<=0 or volume%denom: return None
    missing_value=volume//denom
    if missing_value<=0: return None
    am=ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ",""))
    if am is None or int(am.group("value"))!=missing_value: return None
    if known*height*missing_value!=volume: return None
    return s,h,v,label,missing,known,height,volume,missing_value

def can_generate(parent):
    if _parse_parent(parent) is not None: return True,"rectangular_prism_side_from_volume_exact"
    if parent.get("figure_refs"): return False,"figure_parent"
    if parent.get("choices"): return False,"choice_parent"
    return False,"rectangular_prism_side_from_volume_parent_not_exactly_parsed_and_verified"

def generate(parent,count):
    if count not in (1,2,3): raise ValueError("count must be 1, 2, or 3")
    parsed=_parse_parent(parent)
    if parsed is None:
        ok,reason=can_generate(parent); assert not ok; return [],[],reason
    s,h,v,label,missing,pk,ph,pv,pm=parsed; q=_norm(parent.get("question")); seed=int(_sha(parent)[:12],16)
    ps=(str(pk),str(ph),str(pv)); seen=set(); rows=[]; evidence=[]
    for i in range(1,count+1):
        known=2+((seed>>(i*4))+i*3)%12; height=2+((seed>>(i*6+2))+i*5)%10; missing_value=2+((seed>>(i*7+1))+i*7)%14
        volume=known*height*missing_value; sig=(str(known),str(height),str(volume)); bump=0
        while sig==ps or sig in seen:
            bump+=1; missing_value+=bump; volume=known*height*missing_value; sig=(str(known),str(height),str(volume))
        seen.add(sig)
        if volume%(known*height) or volume//(known*height)!=missing_value: raise AssertionError("rectangular prism side inverse failed")
        repls=[(s.start(),s.end(),f"{label}{known}cm"),(h.start(),h.end(),f"高さ{height}cm"),(v.start(),v.end(),f"体積が{volume}cm³")]
        nq=q
        for st,en,r in sorted(repls,reverse=True): nq=nq[:st]+r+nq[en:]
        rows.append({"question":nq,"answer":f"{missing_value}cm","explanation":f"求める辺=体積÷(既知の辺×高さ)より、{volume}÷({known}×{height})={missing_value}cm。積に戻して確認済み。","numeric_signature":sig})
        evidence.append({"parent_sha256":_sha(parent),"method":"rectangular_prism_side_from_volume_exact_division_and_recomposition","parent_recalculation":f"{pv}÷({pk}×{ph})={pm}cm","variant_recalculation":f"{volume}÷({known}×{height})={missing_value}cm","independent_check":"volume/(known*height) == missing_side AND known*height*missing_side == volume PASS"})
    return rows,evidence,"rectangular_prism_side_from_volume_exact"
