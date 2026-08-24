from __future__ import annotations

"""Fail-closed exact engine for linear equations a(x+b)=c."""

import hashlib
import json
import re
from fractions import Fraction

COEF=r"[+-]?\d*"
INT=r"[+-]?\d+"
EQ_RE=re.compile(rf"(?P<eq>(?P<a>{COEF})\s*[（(]\s*[xｘ]\s*(?:(?P<sign>[+＋\-−])\s*(?P<b>\d+))?\s*[）)]\s*=\s*(?P<c>{INT}))")
ANS_RE=re.compile(r"^(?:[xｘ]\s*=\s*)?(?P<x>[+-]?\d+(?:/\d+)?)$")


def _norm(v:object)->str:
    return str(v or "").replace("−","-").replace("＋","+").replace("（","(").replace("）",")").replace("　"," ")

def _coef(t:str)->Fraction:
    s=_norm(t).replace(" ","")
    if s in ("","+"): return Fraction(1)
    if s=="-": return Fraction(-1)
    return Fraction(int(s))

def _ft(v:Fraction)->str:
    return str(v.numerator) if v.denominator==1 else f"{v.numerator}/{v.denominator}"

def _sha(parent:dict)->str:
    raw=json.dumps(parent,ensure_ascii=False,sort_keys=True,separators=(",", ":")).encode("utf-8"); return hashlib.sha256(raw).hexdigest()

def _parse(parent:dict):
    if parent.get("figure_refs") or parent.get("choices"): return None
    q=_norm(parent.get("question"))
    if "y=" in q.replace(" ","").lower() or not any(t in q for t in ("方程式","解きなさい","解け","xの値","xを求")): return None
    matches=list(EQ_RE.finditer(q))
    if len(matches)!=1 or q.count("=")!=1: return None
    m=matches[0]; a=_coef(m.group("a")); b=Fraction(0)
    if m.group("b"):
        b=Fraction(int(m.group("b"))); b=-b if _norm(m.group("sign"))=="-" else b
    c=Fraction(int(m.group("c")))
    if a==0: return None
    x=c/a-b
    am=ANS_RE.fullmatch(_norm(parent.get("answer")).replace(" ",""))
    if am is None or Fraction(am.group("x"))!=x or a*(x+b)!=c: return None
    return m,a,b,c,x

def can_generate(parent:dict)->tuple[bool,str]:
    if _parse(parent) is not None: return True,"linear_equation_parentheses_exact"
    if parent.get("figure_refs"): return False,"figure_parent"
    if parent.get("choices"): return False,"choice_parent"
    return False,"linear_equation_parentheses_parent_not_exactly_parsed_and_verified"

def generate(parent:dict,count:int):
    if count not in (1,2,3): raise ValueError("count must be 1, 2, or 3")
    parsed=_parse(parent)
    if parsed is None:
        ok,reason=can_generate(parent); assert not ok; return [],[],reason
    match,pa,pb,pc,px=parsed; q=_norm(parent.get("question")); seed=int(_sha(parent)[:12],16)
    parent_sig=tuple(_ft(v) for v in (pa,pb,pc)); seen=set(); rows=[]; evidence=[]
    for i in range(1,count+1):
        a=Fraction(2+((seed>>(i*5))%7));
        if (seed>>(i+13))&1: a=-a
        b=Fraction(-6+((seed>>(i*7+2))%13)); x=Fraction(-7+((seed>>(i*9+4))%15)); c=a*(x+b)
        sig=tuple(_ft(v) for v in (a,b,c))
        while sig==parent_sig or sig in seen:
            x+=1; c=a*(x+b); sig=tuple(_ft(v) for v in (a,b,c))
        seen.add(sig)
        if c/a-b!=x or a*(x+b)!=c: raise AssertionError("parentheses linear equation identity failed")
        inside="x" + (f"+{_ft(b)}" if b>0 else _ft(b) if b<0 else "")
        lhs=("" if a==1 else "-" if a==-1 else _ft(a))+f"({inside})"; eq=f"{lhs}={_ft(c)}"
        nq=q[:match.start("eq")]+eq+q[match.end("eq"):]
        rows.append({"question":nq,"answer":f"x={_ft(x)}","explanation":f"両辺を{_ft(a)}で割って x+({_ft(b)})={_ft(c/a)}。よってx={_ft(x)}。元の式への代入でも確認。","numeric_signature":sig})
        evidence.append({"parent_sha256":_sha(parent),"method":"linear_equation_parentheses_exact_division_and_recomposition","parent_recalculation":f"x={_ft(pc)}/{_ft(pa)}-({_ft(pb)})={_ft(px)}","variant_recalculation":f"x={_ft(c)}/{_ft(a)}-({_ft(b)})={_ft(x)}","independent_check":f"a*(x+b)={_ft(a)}*({_ft(x)}+({_ft(b)}))={_ft(c)} PASS"})
    return rows,evidence,"linear_equation_parentheses_exact"
