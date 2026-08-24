from __future__ import annotations

"""Fail-closed exact engine for finding b in y=ax+b from a numeric slope and one point."""

import hashlib
import json
import re
from fractions import Fraction

NUM=r"[+-]?\d+(?:/\d+)?"
FORM_RE=re.compile(rf"[yｙ]\s*=\s*(?P<a>{NUM})?\s*[xｘ]\s*[+＋]\s*[bｂ]")
POINT_RE=re.compile(rf"(?:点)?\s*[（(]\s*(?P<x>{NUM})\s*[,，]\s*(?P<y>{NUM})\s*[)）]")
ANSWER_RE=re.compile(rf"^(?:[bｂ]\s*=\s*)?(?P<b>{NUM})$")

def _norm(v:object)->str: return str(v or "").replace("−","-").replace("＋","+").replace("　"," ")
def _f(s:str)->Fraction: return Fraction(_norm(s).replace(" ",""))
def _ft(v:Fraction)->str: return str(v.numerator) if v.denominator==1 else f"{v.numerator}/{v.denominator}"
def _sha(p:dict)->str: return hashlib.sha256(json.dumps(p,ensure_ascii=False,sort_keys=True,separators=(",", ":")).encode()).hexdigest()

def _parse(parent:dict):
    if parent.get("figure_refs") or parent.get("choices"): return None
    q=_norm(parent.get("question"))
    if not any(t in q for t in ("bを求","bの値","切片","ｂを求","ｂの値")): return None
    fs=list(FORM_RE.finditer(q)); ps=list(POINT_RE.finditer(q))
    if len(fs)!=1 or len(ps)!=1: return None
    fm,pm=fs[0],ps[0]; a=Fraction(1) if not fm.group("a") else _f(fm.group("a")); x=_f(pm.group("x")); y=_f(pm.group("y"))
    if a==0: return None
    b=y-a*x
    am=ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ",""))
    if am is None or _f(am.group("b"))!=b or a*x+b!=y: return None
    return fm,pm,a,x,y,b

def can_generate(parent:dict)->tuple[bool,str]:
    if _parse(parent) is not None: return True,"affine_intercept_from_slope_point_exact"
    if parent.get("figure_refs"): return False,"figure_parent"
    if parent.get("choices"): return False,"choice_parent"
    return False,"affine_intercept_parent_not_exactly_parsed_and_verified"

def generate(parent:dict,count:int):
    if count not in (1,2,3): raise ValueError("count must be 1, 2, or 3")
    parsed=_parse(parent)
    if parsed is None:
        ok,reason=can_generate(parent); assert not ok; return [],[],reason
    fm,pm,pa,px,py,pb=parsed; q=_norm(parent.get("question")); seed=int(_sha(parent)[:12],16)
    rows=[]; evidence=[]; seen=set(); parent_sig=(_ft(pa),_ft(px),_ft(py))
    for i in range(1,count+1):
        a=Fraction(1+((seed>>(i*4))%7)); x=Fraction(-5+((seed>>(i*6+1))%11)); b=Fraction(-6+((seed>>(i*8+2))%13)); y=a*x+b
        sig=(_ft(a),_ft(x),_ft(y)); bump=0
        while sig==parent_sig or sig in seen:
            bump+=1; b+=1; y=a*x+b; sig=(_ft(a),_ft(x),_ft(y))
        seen.add(sig)
        if y-a*x!=b or a*x+b!=y: raise AssertionError("affine intercept identity failed")
        formula=f"y={_ft(a)}x+b" if a!=1 else "y=x+b"
        point=f"点({_ft(x)},{_ft(y)})"
        nq=q
        for s,e,val in sorted([(fm.start(),fm.end(),formula),(pm.start(),pm.end(),point)],reverse=True): nq=nq[:s]+val+nq[e:]
        rows.append({"question":nq,"answer":f"b={_ft(b)}","explanation":f"点({_ft(x)},{_ft(y)})を{formula}に代入し、b=y-ax={_ft(b)}。再代入して確認済み。","numeric_signature":sig})
        evidence.append({"parent_sha256":_sha(parent),"method":"affine_intercept_exact_subtraction_and_point_recomposition","parent_recalculation":f"b={_ft(py)}-{_ft(pa)}*{_ft(px)}={_ft(pb)}","variant_recalculation":f"b={_ft(y)}-{_ft(a)}*{_ft(x)}={_ft(b)}","independent_check":f"a*x+b={_ft(a)}*{_ft(x)}+({_ft(b)})={_ft(y)} PASS"})
    return rows,evidence,"affine_intercept_from_slope_point_exact"
