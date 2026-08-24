from __future__ import annotations

"""Fail-closed exact engine for one-variable linear equations ax+b=cx+d."""

import hashlib
import json
import re
from fractions import Fraction

COEF=r"[+-]?\d*"
EQ_RE=re.compile(rf"(?P<eq>(?P<a>{COEF})\s*[xｘ]\s*(?:(?P<ls>[+＋\-−])\s*(?P<b>\d+))?\s*=\s*(?P<c>{COEF})\s*[xｘ]\s*(?:(?P<rs>[+＋\-−])\s*(?P<d>\d+))?)")
ANSWER_RE=re.compile(r"^(?:[xｘ]\s*=\s*)?(?P<x>[+-]?\d+(?:/\d+)?)$")


def _norm(v:object)->str:
    return str(v or "").replace("−","-").replace("＋","+").replace("　"," ")


def _coef(text:str)->Fraction:
    t=_norm(text).replace(" ","")
    if t in ("","+"): return Fraction(1)
    if t=="-": return Fraction(-1)
    return Fraction(int(t))


def _signed(sign:str|None, digits:str|None)->Fraction:
    if not digits: return Fraction(0)
    v=Fraction(int(digits))
    return -v if _norm(sign)=="-" else v


def _ft(v:Fraction)->str:
    return str(v.numerator) if v.denominator==1 else f"{v.numerator}/{v.denominator}"


def _sha(parent:dict)->str:
    raw=json.dumps(parent,ensure_ascii=False,sort_keys=True,separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _parse(parent:dict):
    if parent.get("figure_refs") or parent.get("choices"): return None
    q=_norm(parent.get("question"))
    compact=q.replace(" ","").lower()
    if "y=" in compact or "ｙ=" in compact: return None
    if not any(t in q for t in ("方程式","解きなさい","解け","xの値","x の値","xを求","ｘの値","ｘを求")): return None
    matches=list(EQ_RE.finditer(q))
    if len(matches)!=1 or q.count("=")!=1: return None
    m=matches[0]; a=_coef(m.group("a")); b=_signed(m.group("ls"),m.group("b")); c=_coef(m.group("c")); d=_signed(m.group("rs"),m.group("d"))
    if a==c: return None
    x=(d-b)/(a-c)
    am=ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ",""))
    if am is None or Fraction(am.group("x"))!=x or a*x+b!=c*x+d: return None
    return m,a,b,c,d,x


def can_generate(parent:dict)->tuple[bool,str]:
    if _parse(parent) is not None: return True,"linear_equation_both_sides_exact"
    if parent.get("figure_refs"): return False,"figure_parent"
    if parent.get("choices"): return False,"choice_parent"
    return False,"linear_equation_both_sides_parent_not_exactly_parsed_and_verified"


def _term(coef:Fraction)->str:
    if coef==1: return "x"
    if coef==-1: return "-x"
    return f"{_ft(coef)}x"


def _expr(coef:Fraction,const:Fraction)->str:
    out=_term(coef)
    if const>0: out+=f"+{_ft(const)}"
    elif const<0: out+=_ft(const)
    return out


def generate(parent:dict,count:int):
    if count not in (1,2,3): raise ValueError("count must be 1, 2, or 3")
    parsed=_parse(parent)
    if parsed is None:
        ok,reason=can_generate(parent); assert not ok
        return [],[],reason
    match,pa,pb,pc,pd,px=parsed; q=_norm(parent.get("question")); seed=int(_sha(parent)[:12],16)
    parent_sig=(_ft(pa),_ft(pb),_ft(pc),_ft(pd)); seen=set(); rows=[]; evidence=[]
    for i in range(1,count+1):
        a=Fraction(2+((seed>>(i*4))%7)); c=Fraction(-3+((seed>>(i*6+2))%7))
        if a==c: c-=1
        x=Fraction(-7+((seed>>(i*8+3))%15)); b=Fraction(-8+((seed>>(i*10+5))%17)); d=(a-c)*x+b
        sig=(_ft(a),_ft(b),_ft(c),_ft(d)); bump=0
        while sig==parent_sig or sig in seen:
            bump+=1; x+=1; d=(a-c)*x+b; sig=(_ft(a),_ft(b),_ft(c),_ft(d))
        seen.add(sig)
        if (d-b)/(a-c)!=x or a*x+b!=c*x+d: raise AssertionError("two-sided linear equation identity failed")
        equation=f"{_expr(a,b)}={_expr(c,d)}"
        nq=q[:match.start("eq")]+equation+q[match.end("eq"):]
        rows.append({"question":nq,"answer":f"x={_ft(x)}","explanation":f"xの項と定数項を整理すると (a-c)x=d-b。x={_ft(x)}。両辺へ代入して一致も確認。","numeric_signature":sig})
        evidence.append({"parent_sha256":_sha(parent),"method":"linear_equation_both_sides_exact_rearrangement_and_recomposition","parent_recalculation":f"x=({_ft(pd)}-({_ft(pb)}))/({_ft(pa)}-({_ft(pc)}))={_ft(px)}","variant_recalculation":f"x=({_ft(d)}-({_ft(b)}))/({_ft(a)}-({_ft(c)}))={_ft(x)}","independent_check":f"lhs={_ft(a*x+b)} rhs={_ft(c*x+d)} PASS"})
    return rows,evidence,"linear_equation_both_sides_exact"
