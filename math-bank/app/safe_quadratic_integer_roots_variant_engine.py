from __future__ import annotations

"""Fail-closed exact engine for monic quadratic equations with two integer roots."""

import hashlib
import json
import math
import re

EQ_RE=re.compile(r"(?P<eq>[xｘ]\s*(?:\^\s*2|²)\s*(?P<bs>[+＋\-−])\s*(?P<b>\d*)\s*[xｘ]\s*(?P<cs>[+＋\-−])\s*(?P<c>\d+)\s*=\s*0)")
ANS_RE=re.compile(r"^(?:[xｘ]\s*=\s*)?(?P<a>[+-]?\d+)\s*[,、]\s*(?:[xｘ]\s*=\s*)?(?P<b>[+-]?\d+)$")


def _norm(v:object)->str:
    return str(v or "").replace("−","-").replace("＋","+").replace("　"," ")


def _sha(parent:dict)->str:
    raw=json.dumps(parent,ensure_ascii=False,sort_keys=True,separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _signed(sign:str,digits:str, *, implicit_one:bool=False)->int:
    n=1 if implicit_one and digits=="" else int(digits)
    return -n if _norm(sign)=="-" else n


def _parse(parent:dict):
    if parent.get("figure_refs") or parent.get("choices"): return None
    q=_norm(parent.get("question"))
    if any(t in q for t in ("因数分解","解の公式","グラフ","関数","文章題","近似")): return None
    if "方程式" not in q and not any(t in q for t in ("解き","解を","解は")): return None
    matches=list(EQ_RE.finditer(q))
    if len(matches)!=1 or q.count("=")!=1: return None
    m=matches[0]; b=_signed(m.group("bs"),m.group("b"),implicit_one=True); c=_signed(m.group("cs"),m.group("c"))
    disc=b*b-4*c
    if disc<=0: return None
    s=math.isqrt(disc)
    if s*s!=disc or (-b+s)%2 or (-b-s)%2: return None
    roots=tuple(sorted(((-b+s)//2,(-b-s)//2)))
    if roots[0]==roots[1]: return None
    am=ANS_RE.fullmatch(_norm(parent.get("answer")).replace(" ",""))
    if am is None or tuple(sorted((int(am.group("a")),int(am.group("b")))))!=roots: return None
    r1,r2=roots
    if r1+r2!=-b or r1*r2!=c or r1*r1+b*r1+c!=0 or r2*r2+b*r2+c!=0: return None
    return m,b,c,disc,s,roots


def can_generate(parent:dict)->tuple[bool,str]:
    if _parse(parent) is not None: return True,"quadratic_monic_two_integer_roots_exact"
    if parent.get("figure_refs"): return False,"figure_parent"
    if parent.get("choices"): return False,"choice_parent"
    return False,"quadratic_integer_roots_parent_not_exactly_parsed_and_verified"


def _equation(b:int,c:int)->str:
    out="x²"
    if b>0: out += "+x" if b==1 else f"+{b}x"
    else: out += "-x" if b==-1 else f"{b}x"
    if c>0: out += f"+{c}"
    else: out += str(c)
    return out+"=0"


def generate(parent:dict,count:int):
    if count not in (1,2,3): raise ValueError("count must be 1, 2, or 3")
    parsed=_parse(parent)
    if parsed is None:
        ok,reason=can_generate(parent); assert not ok
        return [],[],reason
    match,pb,pc,pdisc,ps,proots=parsed; q=_norm(parent.get("question")); seed=int(_sha(parent)[:12],16)
    parent_sig=(str(pb),str(pc)); seen=set(); rows=[]; evidence=[]
    for i in range(1,count+1):
        r1=-6+((seed>>(i*5))%13); r2=-6+((seed>>(i*7+3))%13)
        if r1==r2: r2+=2
        if r1>r2: r1,r2=r2,r1
        b=-(r1+r2); c=r1*r2; sig=(str(b),str(c))
        while sig==parent_sig or sig in seen or r1==r2:
            r2+=1
            if r1>r2: r1,r2=r2,r1
            b=-(r1+r2); c=r1*r2; sig=(str(b),str(c))
        seen.add(sig); disc=b*b-4*c; s=math.isqrt(disc)
        if s*s!=disc or r1+r2!=-b or r1*r2!=c or r1*r1+b*r1+c or r2*r2+b*r2+c: raise AssertionError("quadratic integer roots identities failed")
        eq=_equation(b,c); nq=q[:match.start("eq")]+eq+q[match.end("eq"):]
        rows.append({"question":nq,"answer":f"x={r1}, x={r2}","explanation":f"判別式D={disc}={s}²。解はx={r1},{r2}。和={r1+r2}、積={r1*r2}も係数と一致。","numeric_signature":sig})
        evidence.append({"parent_sha256":_sha(parent),"method":"quadratic_monic_integer_roots_discriminant_vieta_and_substitution","parent_recalculation":f"D={pdisc}={ps}^2 roots={proots[0]},{proots[1]}","variant_recalculation":f"D={disc}={s}^2 roots={r1},{r2}","independent_check":f"sum={r1+r2}=-b={-b} product={r1*r2}=c={c} AND both_substitute_to_0 PASS"})
    return rows,evidence,"quadratic_monic_two_integer_roots_exact"
