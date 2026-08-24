from __future__ import annotations

"""Fail-closed exact engine for rectangular-prism surface area -> height."""

import hashlib
import json
import re

DATA_RE=re.compile(r"たて\s*(?P<l>\d+)\s*cm\s*[、, ]*よこ\s*(?P<w>\d+)\s*cm\s*[、, ]*表面積\s*(?P<s>\d+)\s*(?:cm²|cm\^2|cm2|㎠)")
ANSWER_RE=re.compile(r"^(?P<h>\d+)\s*cm$")


def _norm(v:object)->str:
    return str(v or "").replace("　"," ").replace("ｃｍ","cm").replace("ＣＭ","cm").replace("㎠","cm²")


def _sha(parent:dict)->str:
    return hashlib.sha256(json.dumps(parent,ensure_ascii=False,sort_keys=True,separators=(",", ":")).encode("utf-8")).hexdigest()


def _parse_parent(parent:dict):
    if parent.get("figure_refs") or parent.get("choices"): return None
    q=_norm(parent.get("question"))
    if "直方体" not in q or "表面積" not in q or not any(t in q for t in ("高さを求","高さは何")): return None
    blocked=("体積","立方体","展開図","図","mm","メートル")
    if any(t in q for t in blocked): return None
    ms=list(DATA_RE.finditer(q))
    if len(ms)!=1: return None
    m=ms[0]; l=int(m.group("l")); w=int(m.group("w")); s=int(m.group("s"))
    if min(l,w,s)<=0 or s%2: return None
    numerator=s//2-l*w; denominator=l+w
    if numerator<=0 or numerator%denominator: return None
    h=numerator//denominator
    am=ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ",""))
    if am is None or int(am.group("h"))!=h: return None
    if 2*(l*w+l*h+w*h)!=s: return None
    return m,l,w,s,h


def can_generate(parent:dict)->tuple[bool,str]:
    if _parse_parent(parent) is not None: return True,"rectangular_prism_height_from_surface_area_exact"
    if parent.get("figure_refs"): return False,"figure_parent"
    if parent.get("choices"): return False,"choice_parent"
    return False,"rectangular_prism_height_from_surface_area_parent_not_exactly_parsed_and_verified"


def generate(parent:dict,count:int)->tuple[list[dict],list[dict],str]:
    if count not in (1,2,3): raise ValueError("count must be 1, 2, or 3")
    parsed=_parse_parent(parent)
    if parsed is None:
        ok,reason=can_generate(parent); assert not ok
        return [],[],reason
    match,pl,pw,ps,ph=parsed; q=_norm(parent.get("question")); seed=int(_sha(parent)[:12],16)
    seen=set(); rows=[]; evidence=[]
    for index in range(1,count+1):
        l=2+((seed>>(index*4))+index*3)%12; w=2+((seed>>(index*6+2))+index*5)%10; h=2+((seed>>(index*7+3))+index*7)%11
        s=2*(l*w+l*h+w*h); sig=(str(l),str(w),str(s))
        while sig==(str(pl),str(pw),str(ps)) or sig in seen:
            h+=1; s=2*(l*w+l*h+w*h); sig=(str(l),str(w),str(s))
        seen.add(sig)
        if (s//2-l*w)!=(l+w)*h or 2*(l*w+l*h+w*h)!=s: raise AssertionError("prism surface height inverse identity failed")
        repl=f"たて{l}cm、よこ{w}cm、表面積{s}cm²"
        new_q=q[:match.start()]+repl+q[match.end():]
        rows.append({"question":new_q,"answer":f"{h}cm","explanation":f"表面積の半分から底面{l}×{w}を引くと、高さ×({l}+{w})。よって高さ=({s}/2-{l*w})/({l}+{w})={h}cm。表面積へ戻して確認済み。","numeric_signature":sig})
        evidence.append({"parent_sha256":_sha(parent),"method":"rectangular_prism_height_from_surface_area_exact_linear_inverse_and_recomposition","parent_recalculation":f"({ps}/2-{pl*pw})/({pl}+{pw})={ph}","variant_recalculation":f"({s}/2-{l*w})/({l}+{w})={h}","independent_check":"S/2-lw == h(l+w) AND 2(lw+lh+wh)==S PASS"})
    return rows,evidence,"rectangular_prism_height_from_surface_area_exact"
