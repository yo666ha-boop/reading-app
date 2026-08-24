from __future__ import annotations

"""Fail-closed exact sector arc-length engine for explicit radius/central-angle/pi=3.14 parents."""

import hashlib
import json
import re
from decimal import Decimal, InvalidOperation
from fractions import Fraction

RADIUS_RE=re.compile(r"半径\s*(?P<r>\d+)\s*cm")
ANGLE_RE=re.compile(r"中心角\s*(?P<a>\d+)\s*(?:度|°)")
ANS_RE=re.compile(r"^(?P<v>\d+(?:\.\d+)?)\s*cm$")
PI=Fraction(157,50)
SAFE_PAIRS=((6,60),(8,90),(5,180),(10,72),(12,30),(9,40),(4,180),(15,40))


def _norm(v:object)->str:
    return str(v or "").replace("　"," ").replace("ｃｍ","cm").replace("ＣＭ","cm")

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
    sector=("扇形" in q or "おうぎ形" in q)
    if not sector or "円周率" not in q or "3.14" not in q or "半径" not in q or "中心角" not in q: return None
    if not any(t in q for t in ("弧の長さ","弧長")): return None
    q_without_cm=q.replace("cm","")
    if any(t in q_without_cm for t in ("面積","周の長さ","半径を求","中心角を求","図","mm","km","m")): return None
    rs=list(RADIUS_RE.finditer(q)); aa=list(ANGLE_RE.finditer(q))
    if len(rs)!=1 or len(aa)!=1: return None
    r=int(rs[0].group("r")); angle=int(aa[0].group("a"))
    if r<=0 or angle<=0 or angle>=360: return None
    length=2*PI*r*Fraction(angle,360)
    if not _terminates(length): return None
    am=ANS_RE.fullmatch(_norm(parent.get("answer")).replace(" ",""))
    if am is None: return None
    try: actual=Fraction(Decimal(am.group("v")))
    except (InvalidOperation,ValueError): return None
    if actual!=length or length*360!=2*PI*r*angle: return None
    return rs[0],aa[0],r,angle,length

def can_generate(parent:dict)->tuple[bool,str]:
    if _parse(parent) is not None: return True,"sector_arc_length_pi_3_14_exact_terminating"
    if parent.get("figure_refs"): return False,"figure_parent"
    if parent.get("choices"): return False,"choice_parent"
    return False,"sector_arc_length_parent_not_exactly_parsed_and_verified"

def generate(parent:dict,count:int):
    if count not in (1,2,3): raise ValueError("count must be 1, 2, or 3")
    parsed=_parse(parent)
    if parsed is None:
        ok,reason=can_generate(parent); assert not ok; return [],[],reason
    rm,am,pr,pa,plength=parsed; q=_norm(parent.get("question")); seed=int(_sha(parent)[:12],16); parent_sig=(str(pr),str(pa)); seen=set(); rows=[]; evidence=[]
    start=seed%len(SAFE_PAIRS)
    for i in range(count):
        r,angle=SAFE_PAIRS[(start+i)%len(SAFE_PAIRS)]; sig=(str(r),str(angle)); bump=0
        while sig==parent_sig or sig in seen:
            bump+=1; r,angle=SAFE_PAIRS[(start+i+bump)%len(SAFE_PAIRS)]; sig=(str(r),str(angle))
        seen.add(sig); length=2*PI*r*Fraction(angle,360)
        if not _terminates(length) or length*360!=2*PI*r*angle: raise AssertionError("sector arc identity failed")
        nq=q; reps=[(rm.start("r"),rm.end("r"),str(r)),(am.start("a"),am.end("a"),str(angle))]
        for s,e,t in sorted(reps,reverse=True): nq=nq[:s]+t+nq[e:]
        rows.append({"question":nq,"answer":f"{_dec(length)}cm","explanation":f"弧の長さ=2×3.14×{r}×{angle}/360={_dec(length)}cm。360倍して円周×中心角になることも確認。","numeric_signature":sig})
        evidence.append({"parent_sha256":_sha(parent),"method":"sector_arc_length_exact_fraction_and_360_cross_product","parent_recalculation":f"2*157/50*{pr}*{pa}/360={_dec(plength)}","variant_recalculation":f"2*157/50*{r}*{angle}/360={_dec(length)}","independent_check":"length*360=2*pi*r*angle PASS"})
    return rows,evidence,"sector_arc_length_pi_3_14_exact_terminating"
