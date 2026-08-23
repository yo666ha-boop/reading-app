from __future__ import annotations

"""Fail-closed exact engine for one missing value in a simple arithmetic mean.

Accept only text-only, non-choice parents containing one comma-separated list of
4 or 5 entries with exactly one x and all other entries positive integers, plus
an explicit integer/finite-decimal average. The parent answer must be the exact
missing x. Variants are verified by sum(known)+x = average*count and by
recomputing the mean from the completed list.
"""
import hashlib, json, re
from fractions import Fraction

LIST_RE = re.compile(r"(?P<expr>(?:x|-?\d+)(?:\s*[、,，]\s*(?:x|-?\d+)){3,4})", re.IGNORECASE)
AVG_RE = re.compile(r"平均(?:点|値)?\s*(?:は|が|を)?\s*(?P<avg>-?\d+(?:\.\d+)?)")
ANS_RE = re.compile(r"^(?:x\s*=\s*)?(?P<v>-?\d+(?:\.\d+)?)$")


def _norm(v: object) -> str:
    return str(v or "").replace("　", " ").replace("，", ",").replace("．", ".").replace("Ｘ", "x").replace("ｘ", "x")


def _sha(parent: dict) -> str:
    return hashlib.sha256(json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")).hexdigest()


def _frac(s: str) -> Fraction:
    if "." not in s: return Fraction(int(s), 1)
    sign = -1 if s.startswith("-") else 1
    raw = s.lstrip("+-"); whole, dec = raw.split(".", 1)
    return sign * Fraction(int(whole + dec), 10 ** len(dec))


def _fmt(v: Fraction) -> str:
    if v.denominator == 1: return str(v.numerator)
    d=v.denominator
    while d%2==0:d//=2
    while d%5==0:d//=5
    if d!=1: raise ValueError("non-terminating decimal")
    sign="-" if v<0 else ""; num=abs(v.numerator); den=v.denominator; p=0; scale=den
    while scale!=1:
        if scale%2==0: scale//=2
        elif scale%5==0: scale//=5
        p+=1
    scaled=num*(10**p)//den; raw=str(scaled).zfill(p+1)
    return sign+(raw if p==0 else raw[:-p]+"."+raw[-p:])


def _answer(v: object):
    m=ANS_RE.fullmatch(_norm(v).replace(" ",""))
    return _frac(m.group("v")) if m else None


def _parse(parent: dict):
    if parent.get("figure_refs") or parent.get("choices"): return None
    q=_norm(parent.get("question"))
    if "平均" not in q or "x" not in q.lower(): return None
    if any(t in q for t in ("中央値","最頻値","範囲","度数","階級","表","グラフ","加重平均","何人","合計を求め","総和")): return None
    lm=list(LIST_RE.finditer(q)); am=list(AVG_RE.finditer(q))
    if len(lm)!=1 or len(am)!=1: return None
    parts=[p.strip().lower() for p in re.split(r"[、,]",lm[0].group("expr"))]
    if len(parts) not in (4,5) or parts.count("x")!=1: return None
    known=[int(p) for p in parts if p!="x"]
    if any(v<=0 for v in known): return None
    avg=_frac(am[0].group("avg")); n=len(parts); missing=avg*n-sum(known)
    if missing<=0: return None
    try:_fmt(missing)
    except ValueError:return None
    if _answer(parent.get("answer"))!=missing:return None
    complete=[missing if p=="x" else Fraction(int(p),1) for p in parts]
    if sum(complete,Fraction(0,1))/n!=avg:return None
    return lm[0],am[0],parts,avg,missing


def can_generate(parent: dict):
    if _parse(parent) is not None:return True,"one_missing_value_simple_average_exact"
    if parent.get("figure_refs"):return False,"figure_parent"
    if parent.get("choices"):return False,"choice_parent"
    return False,"average_missing_value_parent_not_exactly_parsed_and_verified"


def _variant_parts(seed:int,index:int,n:int):
    avg=12+((seed>>(index*5))+index*7)%18
    d=1+((seed>>(index*7+2))+index)%4
    if n==4:
        known=[avg-d,avg,avg+d]
    else:
        known=[avg-2*d,avg-d,avg+d,avg+2*d]
    pos=(seed+index*3)%n
    parts=[];ki=0
    for j in range(n):
        if j==pos:parts.append("x")
        else:parts.append(str(known[ki]));ki+=1
    missing=Fraction(avg*n-sum(known),1)
    return parts,Fraction(avg,1),missing


def generate(parent:dict,count:int):
    if count not in (1,2,3):raise ValueError("count must be 1, 2, or 3")
    parsed=_parse(parent)
    if parsed is None:return [],[],can_generate(parent)[1]
    lm,am,pparts,pavg,pmissing=parsed;q=_norm(parent.get("question"));seed=int(_sha(parent)[:12],16);n=len(pparts)
    parent_sig=tuple([p for p in pparts if p!="x"]+[_fmt(pavg)]);seen=set();rows=[];ev=[]
    for idx in range(1,count+1):
        parts,avg,missing=_variant_parts(seed,idx,n);sig=tuple([p for p in parts if p!="x"]+[_fmt(avg)])
        bump=0
        while sig==parent_sig or sig in seen:
            bump+=1;avg+=bump
            known=[int(p) for p in parts if p!="x"];missing=avg*n-sum(known);sig=tuple([p for p in parts if p!="x"]+[_fmt(avg)])
        seen.add(sig);known=[int(p) for p in parts if p!="x"]
        if Fraction(sum(known),1)+missing!=avg*n:raise AssertionError("average missing-value sum identity failed")
        complete=[missing if p=="x" else Fraction(int(p),1) for p in parts]
        if sum(complete,Fraction(0,1))/n!=avg:raise AssertionError("average missing-value recomputation failed")
        nq=q
        repl=[(lm.start("expr"),lm.end("expr"),"、".join(parts)),(am.start("avg"),am.end("avg"),_fmt(avg))]
        for s,e,t in sorted(repl,reverse=True):nq=nq[:s]+t+nq[e:]
        rows.append({"question":nq,"answer":_fmt(missing),"explanation":f"合計は平均×個数={_fmt(avg)}×{n}={_fmt(avg*n)}。既知の合計{sum(known)}を引いてx={_fmt(missing)}。","numeric_signature":sig})
        ev.append({"parent_sha256":_sha(parent),"method":"one_missing_average_exact_sum_and_recomputed_mean","parent_recalculation":f"x={_fmt(pavg)}*{n}-known_sum={_fmt(pmissing)}","variant_recalculation":f"x={_fmt(avg)}*{n}-{sum(known)}={_fmt(missing)}","independent_check":"known_sum+x == mean*count AND completed_sum/count == mean PASS"})
    return rows,ev,"one_missing_value_simple_average_exact"
