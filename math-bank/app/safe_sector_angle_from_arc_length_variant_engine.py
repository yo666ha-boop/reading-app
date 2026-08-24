from __future__ import annotations

"""Fail-closed exact engine: sector radius + arc length -> central angle (pi=3.14)."""

import hashlib
import json
import re
from decimal import Decimal, InvalidOperation
from fractions import Fraction

PI=Fraction(157,50)
RADIUS_RE=re.compile(r"半径\s*(?P<r>\d+)\s*cm")
LENGTH_RE=re.compile(r"弧(?:の長さ|長)?\s*(?:は|が)?\s*(?P<l>\d+(?:\.\d+)?)\s*cm")
ANS_RE=re.compile(r"^(?P<a>\d+)\s*(?:度|°)$")
SAFE_TRIPLES=((10,Fraction(157,10),90),(5,Fraction(157,10),180),(8,Fraction(314,25),90),(6,Fraction(157,25),60),(12,Fraction(157,25),30),(15,Fraction(157,15),40))


def _norm(v:object)->str:
    return str(v or "").replace("　"," ").replace("ｃｍ","cm").replace("ＣＭ","cm").replace("．",".")

def _sha(parent:dict)->str:
    raw=json.dumps(parent,ensure_ascii=False,sort_keys=True,separators=(",", ":")).encode("utf-8"); return hashlib.sha256(raw).hexdigest()

def _frac_decimal(text:str):
    try: return Fraction(Decimal(text))
    except (InvalidOperation,ValueError): return None

def _terminates(fr:Fraction)->bool:
    d=fr.denominator
    for p in (2,5):
        while d%p==0: d//=p
    return d==1

def _dec(fr:Fraction)->str:
    if not _terminates(fr): raise ValueError("non-terminating")
    v=Decimal(fr.numerator)/Decimal(fr.denominator); t=format(v,"f")
    return t.rstrip("0").rstrip(".") if "." in t else t

def _parse(parent:dict):
    if parent.get("figure_refs") or parent.get("choices"): return None
    q=_norm(parent.get("question"))
    if not ("扇形" in q or "おうぎ形" in q): return None
    if "円周率" not in q or "3.14" not in q or "半径" not in q or "中心角" not in q or "弧" not in q: return None
    if not any(t in q for t in ("中心角を求","中心角は何","中心角はなん")): return None
    q_no_cm=q.replace("cm","")
    if any(t in q_no_cm for t in ("面積","周の長さ","半径を求","直径","図","mm","km","m²")): return None
    rs=list(RADIUS_RE.finditer(q)); ls=list(LENGTH_RE.finditer(q))
    if len(rs)!=1 or len(ls)!=1: return None
    r=int(rs[0].group("r")); length=_frac_decimal(ls[0].group("l"))
    if r<=0 or length is None or length<=0: return None
    angle=length*360/(2*PI*r)
    if angle.denominator!=1 or angle<=0 or angle>=360: return None
    am=ANS_RE.fullmatch(_norm(parent.get("answer")).replace(" ",""))
    if am is None or int(am.group("a"))!=angle.numerator: return None
    if length*360!=2*PI*r*angle: return None
    return rs[0],ls[0],r,length,int(angle)

def can_generate(parent:dict)->tuple[bool,str]:
    if _parse(parent) is not None: return True,"sector_angle_from_arc_length_pi_3_14_exact"
    if parent.get("figure_refs"): return False,"figure_parent"
    if parent.get("choices"): return False,"choice_parent"
    return False,"sector_angle_from_arc_length_parent_not_exactly_parsed_and_verified"

def generate(parent:dict,count:int):
    if count not in (1,2,3): raise ValueError("count must be 1, 2, or 3")
    parsed=_parse(parent)
    if parsed is None:
        ok,reason=can_generate(parent); assert not ok; return [],[],reason
    rm,lm,pr,pl,pa=parsed; q=_norm(parent.get("question")); seed=int(_sha(parent)[:12],16); parent_sig=(str(pr),_dec(pl)); seen=set(); rows=[]; evidence=[]; start=seed%len(SAFE_TRIPLES)
    for i in range(count):
        r,length,angle=SAFE_TRIPLES[(start+i)%len(SAFE_TRIPLES)]; sig=(str(r),_dec(length)); bump=0
        while sig==parent_sig or sig in seen:
            bump+=1; r,length,angle=SAFE_TRIPLES[(start+i+bump)%len(SAFE_TRIPLES)]; sig=(str(r),_dec(length))
        seen.add(sig)
        calc=length*360/(2*PI*r)
        if calc!=angle or length*360!=2*PI*r*angle: raise AssertionError("sector angle/arc identity failed")
        nq=q; reps=[(rm.start("r"),rm.end("r"),str(r)),(lm.start("l"),lm.end("l"),_dec(length))]
        for s,e,t in sorted(reps,reverse=True): nq=nq[:s]+t+nq[e:]
        rows.append({"question":nq,"answer":f"{angle}度","explanation":f"中心角={_dec(length)}×360÷(2×3.14×{r})={angle}度。弧の長さ×360=円周×中心角でも確認。","numeric_signature":sig})
        evidence.append({"parent_sha256":_sha(parent),"method":"sector_angle_from_arc_length_exact_fraction_cross_product","parent_recalculation":f"{_dec(pl)}*360/(2*157/50*{pr})={pa}","variant_recalculation":f"{_dec(length)}*360/(2*157/50*{r})={angle}","independent_check":"arc_length*360=2*pi*r*angle PASS"})
    return rows,evidence,"sector_angle_from_arc_length_pi_3_14_exact"
