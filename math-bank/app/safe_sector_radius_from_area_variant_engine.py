from __future__ import annotations

"""Fail-closed exact engine: sector area + central angle -> integer radius (pi=3.14)."""

import hashlib,json,re
from decimal import Decimal,InvalidOperation
from fractions import Fraction
from math import isqrt
PI=Fraction(157,50)
ANGLE_RE=re.compile(r"中心角\s*(?P<a>\d+)\s*(?:度|°)")
AREA_RE=re.compile(r"面積\s*(?:は|が)?\s*(?P<s>\d+(?:\.\d+)?)\s*(?:cm²|cm\^2|cm2)")
ANS_RE=re.compile(r"^(?P<r>\d+)\s*cm$")
SAFE=((6,60),(10,90),(8,180),(5,72),(12,30),(15,40))

def _norm(v:object)->str:return str(v or "").replace("　"," ").replace("ｃｍ","cm").replace("ＣＭ","cm").replace("㎠","cm²").replace("．",".")
def _sha(p:dict)->str:return hashlib.sha256(json.dumps(p,ensure_ascii=False,sort_keys=True,separators=(",", ":")).encode()).hexdigest()
def _frac(t:str):
    try:return Fraction(Decimal(t))
    except (InvalidOperation,ValueError):return None
def _terminates(fr:Fraction)->bool:
    d=fr.denominator
    for p in (2,5):
        while d%p==0:d//=p
    return d==1
def _dec(fr:Fraction)->str:
    if not _terminates(fr):raise ValueError("non-terminating")
    v=Decimal(fr.numerator)/Decimal(fr.denominator);t=format(v,"f");return t.rstrip("0").rstrip(".") if "." in t else t
def _area(r:int,a:int)->Fraction:return PI*r*r*Fraction(a,360)
def _parse(p:dict):
    if p.get("figure_refs") or p.get("choices"):return None
    q=_norm(p.get("question"))
    if not ("扇形" in q or "おうぎ形" in q) or "円周率" not in q or "3.14" not in q or "中心角" not in q or "面積" not in q or "半径" not in q:return None
    if not any(t in q for t in ("半径を求","半径は何","半径はなん")):return None
    q2=q.replace("cm²","").replace("cm^2","").replace("cm2","")
    if any(t in q2 for t in ("弧","周の長さ","中心角を求","直径","図","mm","km")):return None
    aa=list(ANGLE_RE.finditer(q));ss=list(AREA_RE.finditer(q))
    if len(aa)!=1 or len(ss)!=1:return None
    a=int(aa[0].group("a"));area=_frac(ss[0].group("s"))
    if a<=0 or a>=360 or area is None or area<=0:return None
    r2=area*360/(PI*a)
    if r2.denominator!=1:return None
    root=isqrt(r2.numerator)
    if root<=0 or root*root!=r2.numerator:return None
    am=ANS_RE.fullmatch(_norm(p.get("answer")).replace(" ",""))
    if am is None or int(am.group("r"))!=root:return None
    if area*360!=PI*root*root*a:return None
    return aa[0],ss[0],a,area,root
def can_generate(p:dict):
    if _parse(p) is not None:return True,"sector_radius_from_area_pi_3_14_exact_integer_root"
    if p.get("figure_refs"):return False,"figure_parent"
    if p.get("choices"):return False,"choice_parent"
    return False,"sector_radius_from_area_parent_not_exactly_parsed_and_verified"
def generate(p:dict,count:int):
    if count not in (1,2,3):raise ValueError("count must be 1, 2, or 3")
    parsed=_parse(p)
    if parsed is None:
        ok,reason=can_generate(p);assert not ok;return [],[],reason
    am,sm,pa,ps,pr=parsed;q=_norm(p.get("question"));seed=int(_sha(p)[:12],16);parent_sig=(str(pa),_dec(ps));seen=set();rows=[];evidence=[];start=seed%len(SAFE)
    for i in range(count):
        r,a=SAFE[(start+i)%len(SAFE)];area=_area(r,a);sig=(str(a),_dec(area));b=0
        while sig==parent_sig or sig in seen:
            b+=1;r,a=SAFE[(start+i+b)%len(SAFE)];area=_area(r,a);sig=(str(a),_dec(area))
        if not _terminates(area):raise AssertionError("nonterminating safe area")
        seen.add(sig);r2=area*360/(PI*a)
        if r2!=r*r or area*360!=PI*r*r*a:raise AssertionError("sector radius/area identity failed")
        nq=q
        for s,e,t in sorted([(am.start("a"),am.end("a"),str(a)),(sm.start("s"),sm.end("s"),_dec(area))],reverse=True):nq=nq[:s]+t+nq[e:]
        rows.append({"question":nq,"answer":f"{r}cm","explanation":f"半径²={_dec(area)}×360÷(3.14×{a})={r*r} より、半径={r}cm。面積×360=πr²×中心角でも確認。","numeric_signature":sig})
        evidence.append({"parent_sha256":_sha(p),"method":"sector_radius_from_area_exact_square_and_cross_product","parent_recalculation":f"{_dec(ps)}*360/(157/50*{pa})={pr*pr}","variant_recalculation":f"{_dec(area)}*360/(157/50*{a})={r*r}","independent_check":"area*360=pi*radius^2*angle PASS"})
    return rows,evidence,"sector_radius_from_area_pi_3_14_exact_integer_root"
