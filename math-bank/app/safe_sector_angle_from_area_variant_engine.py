from __future__ import annotations
"""Fail-closed exact inverse sector engine: radius + area -> central angle, pi=3.14."""
import hashlib,json,re
from decimal import Decimal,InvalidOperation
from fractions import Fraction
RADIUS_RE=re.compile(r"半径\s*(?P<r>\d+)\s*cm")
AREA_RE=re.compile(r"面積(?:は|が)?\s*(?P<v>\d+(?:\.\d+)?)\s*(?:cm²|cm\^2|cm2)")
ANS_RE=re.compile(r"^(?:中心角\s*=\s*)?(?P<a>\d+)\s*(?:度|°)$")
PI=Fraction(157,50)
SAFE_PAIRS=((6,60),(8,90),(5,180),(10,72),(12,30),(9,40),(4,180),(15,40))
def _norm(v:object)->str:return str(v or "").replace("　"," ").replace("ｃｍ","cm").replace("㎠","cm²")
def _sha(p:dict)->str:return hashlib.sha256(json.dumps(p,ensure_ascii=False,sort_keys=True,separators=(",",":")).encode()).hexdigest()
def _term(fr:Fraction)->bool:
    d=fr.denominator
    for p in (2,5):
        while d%p==0:d//=p
    return d==1
def _dec(fr:Fraction)->str:
    if not _term(fr):raise ValueError
    s=format(Decimal(fr.numerator)/Decimal(fr.denominator),"f");return s.rstrip("0").rstrip(".") if "." in s else s
def _parse(parent:dict):
    if parent.get("figure_refs") or parent.get("choices"):return None
    q=_norm(parent.get("question"))
    if not (("扇形" in q or "おうぎ形" in q) and "中心角" in q and "求" in q and "面積" in q and "円周率" in q and "3.14" in q):return None
    if any(t in q for t in ("弧の長さ","弧長","半径を求","面積を求","図")):return None
    unit_guard=q.replace("cm²","").replace("cm^2","").replace("cm2","")
    if any(t in unit_guard for t in ("m²","mm","km")):return None
    rs=list(RADIUS_RE.finditer(q));ars=list(AREA_RE.finditer(q))
    if len(rs)!=1 or len(ars)!=1:return None
    r=int(rs[0].group("r"))
    try:area=Fraction(Decimal(ars[0].group("v")))
    except (InvalidOperation,ValueError):return None
    if r<=0 or area<=0:return None
    angle=area*360/(PI*r*r)
    if angle.denominator!=1 or not (0<angle<360):return None
    am=ANS_RE.fullmatch(_norm(parent.get("answer")).replace(" ",""))
    if not am or int(am.group("a"))!=angle.numerator or area*360!=PI*r*r*angle:return None
    return rs[0],ars[0],r,area,int(angle)
def can_generate(parent:dict):
    if _parse(parent) is not None:return True,"sector_angle_from_area_pi_3_14_exact"
    if parent.get("figure_refs"):return False,"figure_parent"
    if parent.get("choices"):return False,"choice_parent"
    return False,"sector_angle_from_area_parent_not_exactly_parsed_and_verified"
def generate(parent:dict,count:int):
    if count not in (1,2,3):raise ValueError("count must be 1, 2, or 3")
    parsed=_parse(parent)
    if parsed is None:return [],[],can_generate(parent)[1]
    rm,arm,pr,parea,pa=parsed;q=_norm(parent.get("question"));seed=int(_sha(parent)[:12],16);rows=[];ev=[];seen=set();parent_sig=(str(pr),_dec(parea))
    start=seed%len(SAFE_PAIRS)
    for i in range(count):
        r,a=SAFE_PAIRS[(start+i)%len(SAFE_PAIRS)];area=PI*r*r*Fraction(a,360);sig=(str(r),_dec(area));bump=0
        while sig==parent_sig or sig in seen:
            bump+=1;r,a=SAFE_PAIRS[(start+i+bump)%len(SAFE_PAIRS)];area=PI*r*r*Fraction(a,360);sig=(str(r),_dec(area))
        seen.add(sig)
        if area*360!=PI*r*r*a:raise AssertionError("sector inverse angle identity failed")
        nq=q
        reps=[(rm.start("r"),rm.end("r"),str(r)),(arm.start("v"),arm.end("v"),_dec(area))]
        for s,e,t in sorted(reps,reverse=True):nq=nq[:s]+t+nq[e:]
        rows.append({"question":nq,"answer":f"{a}度","explanation":f"中心角={_dec(area)}×360÷(3.14×{r}×{r})={a}度。","numeric_signature":sig})
        ev.append({"parent_sha256":_sha(parent),"method":"sector_angle_from_area_exact_cross_product","parent_recalculation":f"{_dec(parea)}*360=pi*{pr}^2*{pa}","variant_recalculation":f"{_dec(area)}*360=pi*{r}^2*{a}","independent_check":"area*360=pi*r^2*angle PASS"})
    return rows,ev,"sector_angle_from_area_pi_3_14_exact"
