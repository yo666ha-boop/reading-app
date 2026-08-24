from __future__ import annotations

"""Fail-closed exact sector-area engine for explicit radius/central-angle/pi=3.14 parents."""

import hashlib
import json
import re
from decimal import Decimal, InvalidOperation
from fractions import Fraction

RADIUS_RE=re.compile(r"半径\s*(?P<r>\d+)\s*cm")
ANGLE_RE=re.compile(r"中心角\s*(?P<a>\d+)\s*(?:度|°)")
ANS_RE=re.compile(r"^(?P<v>\d+(?:\.\d+)?)\s*(?:cm²|cm\^2|cm2)$")
PI=Fraction(157,50)
SAFE_PAIRS=((6,60),(8,90),(5,180),(10,72),(12,30),(9,40),(4,180),(15,40))


def _norm(v:object)->str:
    return str(v or "").replace("　"," ").replace("ｃｍ","cm").replace("ＣＭ","cm").replace("㎠","cm²")

def _sha(parent:dict)->str:
    raw=json.dumps(parent,ensure_ascii=False,sort_keys=True,separators=(",", ":")).encode("utf-8"); return hashlib.sha256(raw).hexdigest()

def _terminates(fr:Fraction)->bool:
    d=fr.denominator
    for p in (2,5):
        while d%p==0: d//=p
    return d==1

def _dec(fr:Fraction)->str:
    if not _terminates(fr): raise ValueError("non-terminating")
    value=Decimal(fr.numerator)/Decimal(fr.denominator); text=format(value,"f")
    return text.rstrip("0").rstrip(".") if "." in text else text

def _parse(parent:dict):
    if parent.get("figure_refs") or parent.get("choices"): return None
    q=_norm(parent.get("question"))
    if not all(t in q for t in ("扇形","面積","円周率","3.14","半径","中心角")) and not all(t in q for t in ("おうぎ形","面積","円周率","3.14","半径","中心角")): return None
    if any(t in q for t in ("弧の長さ","弧長","周の長さ","半径を求","中心角を求","図","m²","mm","km")): return None
    rs=list(RADIUS_RE.finditer(q)); aa=list(ANGLE_RE.finditer(q))
    if len(rs)!=1 or len(aa)!=1: return None
    r=int(rs[0].group("r")); angle=int(aa[0].group("a"))
    if r<=0 or angle<=0 or angle>=360: return None
    area=PI*r*r*Fraction(angle,360)
    if not _terminates(area): return None
    am=ANS_RE.fullmatch(_norm(parent.get("answer")).replace(" ",""))
    if am is None: return None
    try: actual=Fraction(Decimal(am.group("v")))
    except (InvalidOperation,ValueError): return None
    if actual!=area or area*360!=PI*r*r*angle: return None
    return rs[0],aa[0],r,angle,area

def can_generate(parent:dict)->tuple[bool,str]:
    if _parse(parent) is not None: return True,"sector_area_pi_3_14_exact_terminating"
    if parent.get("figure_refs"): return False,"figure_parent"
    if parent.get("choices"): return False,"choice_parent"
    return False,"sector_area_parent_not_exactly_parsed_and_verified"

def generate(parent:dict,count:int):
    if count not in (1,2,3): raise ValueError("count must be 1, 2, or 3")
    parsed=_parse(parent)
    if parsed is None:
        ok,reason=can_generate(parent); assert not ok; return [],[],reason
    rm,am,pr,pa,parea=parsed; q=_norm(parent.get("question")); seed=int(_sha(parent)[:12],16); parent_sig=(str(pr),str(pa)); seen=set(); rows=[]; evidence=[]
    start=seed%len(SAFE_PAIRS)
    for i in range(count):
        r,angle=SAFE_PAIRS[(start+i)%len(SAFE_PAIRS)]; sig=(str(r),str(angle)); bump=0
        while sig==parent_sig or sig in seen:
            bump+=1; r,angle=SAFE_PAIRS[(start+i+bump)%len(SAFE_PAIRS)]; sig=(str(r),str(angle))
        seen.add(sig); area=PI*r*r*Fraction(angle,360)
        if not _terminates(area) or area*360!=PI*r*r*angle: raise AssertionError("sector area identity failed")
        nq=q
        reps=[(rm.start("r"),rm.end("r"),str(r)),(am.start("a"),am.end("a"),str(angle))]
        for s,e,t in sorted(reps,reverse=True): nq=nq[:s]+t+nq[e:]
        rows.append({"question":nq,"answer":f"{_dec(area)}cm²","explanation":f"扇形の面積=3.14×{r}×{r}×{angle}/360={_dec(area)}cm²。360倍して元の円面積×中心角になることも確認。","numeric_signature":sig})
        evidence.append({"parent_sha256":_sha(parent),"method":"sector_area_exact_fraction_and_360_cross_product","parent_recalculation":f"157/50*{pr}^2*{pa}/360={_dec(parea)}","variant_recalculation":f"157/50*{r}^2*{angle}/360={_dec(area)}","independent_check":f"area*360=pi*r^2*angle PASS"})
    return rows,evidence,"sector_area_pi_3_14_exact_terminating"
