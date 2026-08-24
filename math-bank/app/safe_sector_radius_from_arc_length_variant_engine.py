from __future__ import annotations

"""Fail-closed exact engine: sector arc length + central angle -> radius (pi=3.14)."""

import hashlib
import json
import re
from decimal import Decimal, InvalidOperation
from fractions import Fraction

PI=Fraction(157,50)
ANGLE_RE=re.compile(r"中心角\s*(?P<a>\d+)\s*(?:度|°)")
LENGTH_RE=re.compile(r"弧(?:の長さ|長)?\s*(?:は|が)?\s*(?P<l>\d+(?:\.\d+)?)\s*cm")
ANS_RE=re.compile(r"^(?P<r>\d+(?:\.\d+)?)\s*cm$")
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
    if "円周率" not in q or "3.14" not in q or "中心角" not in q or "弧" not in q or "半径" not in q: return None
    if not any(t in q for t in ("半径を求","半径は何","半径はなん")): return None
    q_no_cm=q.replace("cm","")
    if any(t in q_no_cm for t in ("面積","周の長さ","中心角を求","直径","図","mm","km","m²")): return None
    aa=list(ANGLE_RE.finditer(q)); ls=list(LENGTH_RE.finditer(q))
    if len(aa)!=1 or len(ls)!=1: return None
    angle=int(aa[0].group("a")); length=_frac_decimal(ls[0].group("l"))
    if angle<=0 or angle>=360 or length is None or length<=0: return None
    radius=length*360/(2*PI*angle)
    if radius<=0 or not _terminates(radius): return None
    am=ANS_RE.fullmatch(_norm(parent.get("answer")).replace(" ",""))
    if am is None: return None
    actual=_frac_decimal(am.group("r"))
    if actual!=radius or length*360!=2*PI*radius*angle: return None
    return aa[0],ls[0],angle,length,radius

def can_generate(parent:dict)->tuple[bool,str]:
    if _parse(parent) is not None: return True,"sector_radius_from_arc_length_pi_3_14_exact"
    if parent.get("figure_refs"): return False,"figure_parent"
    if parent.get("choices"): return False,"choice_parent"
    return False,"sector_radius_from_arc_length_parent_not_exactly_parsed_and_verified"

def generate(parent:dict,count:int):
    if count not in (1,2,3): raise ValueError("count must be 1, 2, or 3")
    parsed=_parse(parent)
    if parsed is None:
        ok,reason=can_generate(parent); assert not ok; return [],[],reason
    am,lm,pa,pl,pr=parsed; q=_norm(parent.get("question")); seed=int(_sha(parent)[:12],16); parent_sig=(str(pa),_dec(pl)); seen=set(); rows=[]; evidence=[]; start=seed%len(SAFE_TRIPLES)
    for i in range(count):
        r,length,angle=SAFE_TRIPLES[(start+i)%len(SAFE_TRIPLES)]; sig=(str(angle),_dec(length)); bump=0
        while sig==parent_sig or sig in seen:
            bump+=1; r,length,angle=SAFE_TRIPLES[(start+i+bump)%len(SAFE_TRIPLES)]; sig=(str(angle),_dec(length))
        seen.add(sig); calc=length*360/(2*PI*angle)
        if calc!=r or length*360!=2*PI*r*angle: raise AssertionError("sector radius/arc identity failed")
        nq=q; reps=[(am.start("a"),am.end("a"),str(angle)),(lm.start("l"),lm.end("l"),_dec(length))]
        for s,e,t in sorted(reps,reverse=True): nq=nq[:s]+t+nq[e:]
        rows.append({"question":nq,"answer":f"{r}cm","explanation":f"半径={_dec(length)}×360÷(2×3.14×{angle})={r}cm。弧の長さ×360=2πr×中心角でも確認。","numeric_signature":sig})
        evidence.append({"parent_sha256":_sha(parent),"method":"sector_radius_from_arc_length_exact_fraction_cross_product","parent_recalculation":f"{_dec(pl)}*360/(2*157/50*{pa})={_dec(pr)}","variant_recalculation":f"{_dec(length)}*360/(2*157/50*{angle})={r}","independent_check":"arc_length*360=2*pi*radius*angle PASS"})
    return rows,evidence,"sector_radius_from_arc_length_pi_3_14_exact"
