from __future__ import annotations

"""Fail-closed exact engine for triangle height from base and area."""

import hashlib, json, re

QUESTION_RE=re.compile(r"底辺\s*(?P<base>\d+)\s*(?P<unit>mm|cm|m).*?面積\s*(?P<area>\d+)\s*(?P=unit)(?:²|\^2|2)")
ANSWER_RE=re.compile(r"^(?P<height>\d+)\s*(?P<unit>mm|cm|m)$")


def _norm(v):
    return str(v or "").replace("　"," ").replace("㎠","cm²").replace("㎡","m²").replace("㎟","mm²")


def _sha(parent):
    return hashlib.sha256(json.dumps(parent,ensure_ascii=False,sort_keys=True,separators=(",",":")).encode()).hexdigest()


def _parse(parent):
    if parent.get("figure_refs") or parent.get("choices"):
        return None
    q=_norm(parent.get("question"))
    if "三角形" not in q or "高さ" not in q or not any(t in q for t in ("求め","何")):
        return None
    if any(t in q for t in ("底辺を","周","相似","図","グラフ","台形","平行四辺形")):
        return None
    ms=list(QUESTION_RE.finditer(q))
    if len(ms)!=1: return None
    m=ms[0]; base=int(m.group("base")); area=int(m.group("area")); unit=m.group("unit")
    if base<=0 or area<=0 or (2*area)%base: return None
    height=2*area//base
    am=ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ",""))
    if am is None or am.group("unit")!=unit or int(am.group("height"))!=height: return None
    if base*height!=2*area: return None
    return m,base,area,height,unit


def can_generate(parent):
    if _parse(parent) is not None: return True,"triangle_height_from_area_exact"
    if parent.get("figure_refs"): return False,"figure_parent"
    if parent.get("choices"): return False,"choice_parent"
    return False,"triangle_height_from_area_parent_not_exactly_parsed_and_verified"


def generate(parent,count):
    if count not in (1,2,3): raise ValueError("count must be 1, 2, or 3")
    parsed=_parse(parent)
    if parsed is None:
        ok,reason=can_generate(parent); assert not ok; return [],[],reason
    m,pbase,parea,pheight,unit=parsed; q=_norm(parent.get("question")); seed=int(_sha(parent)[:12],16)
    seen=set(); rows=[]; evidence=[]
    for i in range(1,count+1):
        base=2+((seed>>(i*5))+i*5)%13
        height=2+((seed>>(i*7+2))+i*3)%12
        if base*height%2: height+=1
        area=base*height//2; sig=(base,area)
        while sig==(pbase,parea) or sig in seen:
            height+=2; area=base*height//2; sig=(base,area)
        seen.add(sig)
        if 2*area!=base*height or 2*area//base!=height: raise AssertionError("triangle height identity failed")
        repl=f"底辺{base}{unit}、面積{area}{unit}²"; nq=q[:m.start()]+repl+q[m.end():]
        rows.append({"question":nq,"answer":f"{height}{unit}","explanation":f"高さ=2×面積÷底辺より、2×{area}÷{base}={height}{unit}。底辺×高さ÷2={area}{unit}²でも確認済み。","numeric_signature":(str(base),str(area))})
        evidence.append({"parent_sha256":_sha(parent),"method":"triangle_height_from_area_exact_inverse_and_recomposition","parent_recalculation":f"2*{parea}/{pbase}={pheight}{unit}","variant_recalculation":f"2*{area}/{base}={height}{unit}","independent_check":"base*height == 2*area PASS"})
    return rows,evidence,"triangle_height_from_area_exact"
