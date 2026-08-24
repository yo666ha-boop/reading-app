from __future__ import annotations

"""Fail-closed exact engine for one-variable linear equations."""

import hashlib
import json
import re
from fractions import Fraction

from safe_linear_equation_both_sides_variant_engine import generate as generate_both_sides

COEF=r"[+-]?\d*"
INT=r"[+-]?\d+"
EQUATION_RE=re.compile(rf"(?P<eq>(?P<a>{COEF})\s*[xｘ]\s*(?:(?P<sign>[+＋\-−])\s*(?P<b>\d+))?\s*=\s*(?P<c>{INT}))")
ANSWER_RE=re.compile(r"^(?:[xｘ]\s*=\s*)?(?P<x>[+-]?\d+(?:/\d+)?)$")


def _norm(v:object)->str:
    return str(v or "").replace("−","-").replace("＋","+").replace("　"," ")


def _coef(text:str)->Fraction:
    t=_norm(text).replace(" ","")
    if t in ("","+"): return Fraction(1)
    if t=="-": return Fraction(-1)
    return Fraction(int(t))


def _ft(v:Fraction)->str:
    return str(v.numerator) if v.denominator==1 else f"{v.numerator}/{v.denominator}"


def _sha(parent:dict)->str:
    raw=json.dumps(parent,ensure_ascii=False,sort_keys=True,separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _parse(parent:dict):
    if parent.get("figure_refs") or parent.get("choices"): return None
    q=_norm(parent.get("question"))
    if "y=" in q.replace(" ","").lower() or "ｙ=" in q.replace(" ",""):
        return None
    if not any(t in q for t in ("方程式","解きなさい","解け","xの値","x の値","xを求","ｘの値","ｘを求")):
        return None
    matches=list(EQUATION_RE.finditer(q))
    if len(matches)!=1 or q.count("=")!=1:
        return None
    m=matches[0]; a=_coef(m.group("a")); b=Fraction(0)
    if m.group("b"):
        b=Fraction(int(m.group("b")))
        if _norm(m.group("sign"))=="-": b=-b
    c=Fraction(int(m.group("c")))
    if a==0: return None
    x=(c-b)/a
    am=ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ",""))
    if am is None or Fraction(am.group("x"))!=x or a*x+b!=c:
        return None
    return m,a,b,c,x


def can_generate(parent:dict)->tuple[bool,str]:
    rows,_,reason=generate_both_sides(parent,1)
    if rows: return True,reason
    if _parse(parent) is not None: return True,"linear_equation_ax_plus_b_equals_c_exact"
    if parent.get("figure_refs"): return False,"figure_parent"
    if parent.get("choices"): return False,"choice_parent"
    return False,"linear_equation_parent_not_exactly_parsed_and_verified"


def generate(parent:dict,count:int):
    if count not in (1,2,3): raise ValueError("count must be 1, 2, or 3")
    rows,evidence,reason=generate_both_sides(parent,count)
    if rows: return rows,evidence,reason
    parsed=_parse(parent)
    if parsed is None:
        ok,reason=can_generate(parent); assert not ok
        return [],[],reason
    match,pa,pb,pc,px=parsed; q=_norm(parent.get("question")); seed=int(_sha(parent)[:12],16)
    parent_sig=(_ft(pa),_ft(pb),_ft(pc)); seen=set(); rows=[]; evidence=[]
    for i in range(1,count+1):
        a=Fraction(1+((seed>>(i*5))%8))
        if ((seed>>(i+19))&1): a=-a
        x=Fraction(-8+((seed>>(i*7+2))%17))
        b=Fraction(-9+((seed>>(i*9+3))%19))
        c=a*x+b; sig=(_ft(a),_ft(b),_ft(c))
        while sig==parent_sig or sig in seen:
            x+=1; c=a*x+b; sig=(_ft(a),_ft(b),_ft(c))
        seen.add(sig)
        if (c-b)/a!=x or a*x+b!=c: raise AssertionError("linear equation inverse/recomposition identity failed")
        lhs="x" if a==1 else "-x" if a==-1 else f"{_ft(a)}x"
        if b>0: lhs+=f"+{_ft(b)}"
        elif b<0: lhs+=_ft(b)
        equation=f"{lhs}={_ft(c)}"
        nq=q[:match.start("eq")]+equation+q[match.end("eq"):]
        rows.append({"question":nq,"answer":f"x={_ft(x)}","explanation":f"{equation} より x=(c-b)/a={_ft(x)}。左辺へ代入して {_ft(c)} になることも確認。","numeric_signature":sig})
        evidence.append({"parent_sha256":_sha(parent),"method":"linear_equation_exact_inverse_and_forward_recomposition","parent_recalculation":f"x=({_ft(pc)}-({_ft(pb)}))/{_ft(pa)}={_ft(px)}","variant_recalculation":f"x=({_ft(c)}-({_ft(b)}))/{_ft(a)}={_ft(x)}","independent_check":f"a*x+b={_ft(a)}*{_ft(x)}+({_ft(b)})={_ft(c)} PASS"})
    return rows,evidence,"linear_equation_ax_plus_b_equals_c_exact"
