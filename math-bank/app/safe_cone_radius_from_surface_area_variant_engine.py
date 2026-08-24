from __future__ import annotations

"""Fail-closed exact inverse: cone surface area + slant -> radius, pi=3.14."""
from decimal import Decimal,InvalidOperation
import hashlib,json,math,re
SLANT_RE=re.compile(r"母線\s*(?:の長さ\s*)?(?P<slant>\d+)\s*cm")
SURFACE_RE=re.compile(r"表面積(?:は|が)?\s*(?P<surface>\d+(?:\.\d+)?)\s*(?:cm²|cm\^2|cm2)")
ANSWER_RE=re.compile(r"^(?P<radius>\d+)\s*cm$")
PI=Decimal("3.14")
def _norm(v:object)->str:return str(v or "").replace("　"," ").replace("ｃｍ","cm").replace("ＣＭ","cm").replace("㎠","cm²")
def _sha(p:dict)->str:return hashlib.sha256(json.dumps(p,ensure_ascii=False,sort_keys=True,separators=(",",":")).encode()).hexdigest()
def _fmt(v:Decimal)->str:
    t=format(v,"f");return t.rstrip("0").rstrip(".") if "." in t else t
def _parse(parent:dict):
    if parent.get("figure_refs") or parent.get("choices"):return None
    q=_norm(parent.get("question"))
    if not any(t in q for t in ("円すい","円錐")) or "表面積" not in q or "半径" not in q or "求" not in q or "円周率" not in q or "3.14" not in q:return None
    if any(t in q for t in ("体積","高さ","直径","側面積を求","底面積を求","円柱","球","図","グラフ","mm","km")):return None
    if re.search(r"(?<!c)m(?:²|\^2|2)",q,re.IGNORECASE):return None
    ls=list(SLANT_RE.finditer(q));ss=list(SURFACE_RE.finditer(q))
    if len(ls)!=1 or len(ss)!=1:return None
    l=int(ls[0].group("slant"))
    try:S=Decimal(ss[0].group("surface"))
    except InvalidOperation:return None
    if l<=0 or S<=0:return None
    normalized=S/PI
    if normalized!=normalized.to_integral_value():return None
    n=int(normalized);disc=l*l+4*n;root=math.isqrt(disc)
    if root*root!=disc or (-l+root)<=0 or (-l+root)%2:return None
    r=(-l+root)//2
    am=ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ",""))
    if not am or int(am.group("radius"))!=r:return None
    if PI*Decimal(r)*Decimal(r+l)!=S or r*r+l*r!=n:return None
    return ls[0],ss[0],l,S,r,n,disc
def can_generate(parent:dict):
    if _parse(parent) is not None:return True,"cone_radius_from_surface_area_pi_3_14_exact_integer_root"
    if parent.get("figure_refs"):return False,"figure_parent"
    if parent.get("choices"):return False,"choice_parent"
    return False,"cone_radius_from_surface_area_parent_not_exactly_parsed_and_verified"
def generate(parent:dict,count:int):
    if count not in (1,2,3):raise ValueError("count must be 1, 2, or 3")
    parsed=_parse(parent)
    if parsed is None:return [],[],can_generate(parent)[1]
    lm,sm,pl,pS,pr,pn,pdisc=parsed;q=_norm(parent.get("question"));seed=int(_sha(parent)[:12],16);rows=[];ev=[];seen=set();parent_sig=(pr,pl)
    for i in range(1,count+1):
        r=2+((seed>>(i*5))+i*3)%8;l=r+1+((seed>>(i*7+2))+i*5)%9;sig=(r,l)
        while sig==parent_sig or sig in seen:l+=1;sig=(r,l)
        seen.add(sig);S=PI*Decimal(r)*Decimal(r+l);n=r*(r+l);disc=l*l+4*n;root=math.isqrt(disc)
        if root*root!=disc or (-l+root)//2!=r or PI*Decimal(r)*Decimal(r+l)!=S:raise AssertionError("cone radius inverse identity failed")
        nq=q
        repl=[(lm.start(),lm.end(),f"母線{l}cm"),(sm.start(),sm.end(),f"表面積{_fmt(S)}cm²")]
        for a,b,t in sorted(repl,reverse=True):nq=nq[:a]+t+nq[b:]
        rows.append({"question":nq,"answer":f"{r}cm","explanation":f"表面積=3.14×r×(r+{l})より、{_fmt(S)}÷3.14={n}。r²+{l}r={n}を満たす正の整数はr={r}。","numeric_signature":(str(l),_fmt(S),"3.14")})
        ev.append({"parent_sha256":_sha(parent),"method":"cone_radius_from_surface_area_exact_quadratic_integer_root_and_recomposition","parent_recalculation":f"S/pi={pn}; discriminant={pdisc}; r={pr}; pi*r*(r+l)={_fmt(pS)}","variant_recalculation":f"S/pi={n}; discriminant={disc}={root}^2; r={r}","independent_check":f"3.14*{r}*({r}+{l})={_fmt(S)} AND {r}^2+{l}*{r}={n} PASS"})
    return rows,ev,"cone_radius_from_surface_area_pi_3_14_exact_integer_root"
