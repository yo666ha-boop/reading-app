from __future__ import annotations

"""Fail-closed exact engine for parallelogram base from height and area."""

import hashlib, json, re

QUESTION_RE=re.compile(r"高さ\s*(?P<height>\d+)\s*(?P<unit>mm|cm|m).*?面積\s*(?P<area>\d+)\s*(?P=unit)(?:²|\^2|2)")
ANSWER_RE=re.compile(r"^(?P<base>\d+)\s*(?P<unit>mm|cm|m)$")


def _norm(v):
    return str(v or "").replace("　"," ").replace("㎠","cm²").replace("㎡","m²").replace("㎟","mm²")


def _sha(parent):
    return hashlib.sha256(json.dumps(parent,ensure_ascii=False,sort_keys=True,separators=(",",":")).encode()).hexdigest()


def _parse(parent):
    if parent.get("figure_refs") or parent.get("choices"):
        return None
    q=_norm(parent.get("question"))
    if "平行四辺形" not in q or "底辺" not in q or not any(t in q for t in ("求め","何")):
        return None
    if any(t in q for t in ("高さを","周","相似","図","グラフ","台形","三角形")):
        return None
    ms=list(QUESTION_RE.finditer(q))
    if len(ms)!=1: return None
    m=ms[0]; height=int(m.group("height")); area=int(m.group("area")); unit=m.group("unit")
    if height<=0 or area<=0 or area%height: return None
    base=area//height
    am=ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ",""))
    if am is None or am.group("unit")!=unit or int(am.group("base"))!=base: return None
    if base*height!=area: return None
    return m,height,area,base,unit


def can_generate(parent):
    if _parse(parent) is not None: return True,"parallelogram_base_from_area_exact"
    if parent.get("figure_refs"): return False,"figure_parent"
    if parent.get("choices"): return False,"choice_parent"
    return False,"parallelogram_base_from_area_parent_not_exactly_parsed_and_verified"


def generate(parent,count):
    if count not in (1,2,3): raise ValueError("count must be 1, 2, or 3")
    parsed=_parse(parent)
    if parsed is None:
        ok,reason=can_generate(parent); assert not ok; return [],[],reason
    m,pheight,parea,pbase,unit=parsed; q=_norm(parent.get("question")); seed=int(_sha(parent)[:12],16)
    seen=set(); rows=[]; evidence=[]
    for i in range(1,count+1):
        height=2+((seed>>(i*5))+i*3)%12
        base=3+((seed>>(i*7+2))+i*5)%14
        area=base*height; sig=(height,area)
        while sig==(pheight,parea) or sig in seen:
            base+=1; area=base*height; sig=(height,area)
        seen.add(sig)
        if area//height!=base or base*height!=area: raise AssertionError("parallelogram base identity failed")
        repl=f"高さ{height}{unit}、面積{area}{unit}²"; nq=q[:m.start()]+repl+q[m.end():]
        rows.append({"question":nq,"answer":f"{base}{unit}","explanation":f"底辺=面積÷高さより、{area}÷{height}={base}{unit}。底辺×高さ={area}{unit}²でも確認済み。","numeric_signature":(str(height),str(area))})
        evidence.append({"parent_sha256":_sha(parent),"method":"parallelogram_base_from_area_exact_inverse_and_recomposition","parent_recalculation":f"{parea}/{pheight}={pbase}{unit}","variant_recalculation":f"{area}/{height}={base}{unit}","independent_check":"base*height == area PASS"})
    return rows,evidence,"parallelogram_base_from_area_exact"
