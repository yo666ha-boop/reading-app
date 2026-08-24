from __future__ import annotations

"""Fail-closed exact inverse engine for y=ax+b with explicit y, asking x."""

import hashlib
import json
import re
from fractions import Fraction

NUM=r"[+-]?\d+(?:/\d+)?"
FORMULA_RE=re.compile(rf"(?P<formula>[yｙ]\s*=\s*(?P<a>{NUM})?\s*[xｘ]\s*(?:(?P<sign>[+＋\-−])\s*(?P<b>\d+(?:/\d+)?))?)")
Y_VALUE_RE=re.compile(rf"[yｙ]\s*=\s*(?P<y>{NUM})")
ANSWER_RE=re.compile(rf"^(?:[xｘ]\s*=\s*)?(?P<x>{NUM})$")

def _norm(v:object)->str:
    return str(v or "").replace("−","-").replace("＋","+").replace("　"," ")

def _f(s:str)->Fraction: return Fraction(_norm(s).replace(" ",""))
def _ft(v:Fraction)->str: return str(v.numerator) if v.denominator==1 else f"{v.numerator}/{v.denominator}"
def _sha(p:dict)->str: return hashlib.sha256(json.dumps(p,ensure_ascii=False,sort_keys=True,separators=(",", ":")).encode()).hexdigest()

def _parse(parent:dict):
    if parent.get("figure_refs") or parent.get("choices"): return None
    q=_norm(parent.get("question"))
    if not any(t in q for t in ("xの値","x の値","xを求","ｘの値","ｘを求")): return None
    fs=list(FORMULA_RE.finditer(q)); ys=list(Y_VALUE_RE.finditer(q))
    if len(fs)!=1 or len(ys)!=1: return None
    fm,ym=fs[0],ys[0]
    a=Fraction(1) if not fm.group("a") else _f(fm.group("a")); b=Fraction(0)
    if fm.group("b"):
        b=_f(fm.group("b"));
        if _norm(fm.group("sign"))=="-": b=-b
    if a==0: return None
    y=_f(ym.group("y")); x=(y-b)/a
    am=ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ",""))
    if am is None or _f(am.group("x"))!=x or a*x+b!=y: return None
    return fm,ym,a,b,y,x

def can_generate(parent:dict)->tuple[bool,str]:
    if _parse(parent) is not None: return True,"affine_x_from_y_exact"
    if parent.get("figure_refs"): return False,"figure_parent"
    if parent.get("choices"): return False,"choice_parent"
    return False,"affine_x_from_y_parent_not_exactly_parsed_and_verified"

def generate(parent:dict,count:int):
    if count not in (1,2,3): raise ValueError("count must be 1, 2, or 3")
    parsed=_parse(parent)
    if parsed is None:
        ok,reason=can_generate(parent); assert not ok; return [],[],reason
    fm,ym,pa,pb,py,px=parsed; q=_norm(parent.get("question")); seed=int(_sha(parent)[:12],16)
    seen=set(); rows=[]; evidence=[]; parent_sig=(_ft(pa),_ft(pb),_ft(py))
    for i in range(1,count+1):
        a=Fraction(1+((seed>>(i*4))%7)); b=Fraction(-5+((seed>>(i*6+1))%11)); x=Fraction(-6+((seed>>(i*8+2))%13))
        if a==0: a=Fraction(i+1)
        y=a*x+b; sig=(_ft(a),_ft(b),_ft(y)); bump=0
        while sig==parent_sig or sig in seen:
            bump+=1; x+=1; y=a*x+b; sig=(_ft(a),_ft(b),_ft(y))
        seen.add(sig)
        if (y-b)/a!=x or a*x+b!=y: raise AssertionError("affine inverse identity failed")
        formula="y=x" if a==1 else f"y={_ft(a)}x"
        if b>0: formula+=f"+{_ft(b)}"
        elif b<0: formula+=_ft(b)
        nq=q
        reps=[(fm.start("formula"),fm.end("formula"),formula),(ym.start("y"),ym.end("y"),_ft(y))]
        for s,e,val in sorted(reps,reverse=True): nq=nq[:s]+val+nq[e:]
        rows.append({"question":nq,"answer":f"x={_ft(x)}","explanation":f"{formula} に y={_ft(y)} を代入し、x=(y-b)/a={_ft(x)}。元の式へ戻して確認済み。","numeric_signature":sig})
        evidence.append({"parent_sha256":_sha(parent),"method":"affine_x_from_y_exact_inverse_and_forward_recomposition","parent_recalculation":f"x=({_ft(py)}-{_ft(pb)})/{_ft(pa)}={_ft(px)}","variant_recalculation":f"x=({_ft(y)}-{_ft(b)})/{_ft(a)}={_ft(x)}","independent_check":f"a*x+b={_ft(a)}*{_ft(x)}+({_ft(b)})={_ft(y)} PASS"})
    return rows,evidence,"affine_x_from_y_exact"
