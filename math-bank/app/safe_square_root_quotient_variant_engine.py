from __future__ import annotations

"""Fail-closed exact engine for quotients sqrt(a) / sqrt(b) with integer result."""

import hashlib
import json
import math
import re

QUOT_RE=re.compile(r"(?P<expr>√\s*(?P<a>\d+)\s*[÷/]\s*√\s*(?P<b>\d+))")
ANS_RE=re.compile(r"^(?P<v>\d+)$")

def _norm(v:object)->str: return str(v or "").replace("　"," ").replace("／","/")
def _sha(parent:dict)->str:
    raw=json.dumps(parent,ensure_ascii=False,sort_keys=True,separators=(",", ":")).encode("utf-8"); return hashlib.sha256(raw).hexdigest()

def _parse(parent:dict):
    if parent.get("figure_refs") or parent.get("choices"): return None
    q=_norm(parent.get("question"))
    if not any(t in q for t in ("計算","求め","値")): return None
    if any(t in q for t in ("×","*","+","−","-","方程式","近似","有理化")): return None
    ms=list(QUOT_RE.finditer(q))
    if len(ms)!=1 or q.count("√")!=2: return None
    m=ms[0]; a=int(m.group("a")); b=int(m.group("b"))
    if a<=0 or b<=0 or a%b!=0: return None
    ratio=a//b; root=math.isqrt(ratio)
    if root*root!=ratio: return None
    am=ANS_RE.fullmatch(str(parent.get("answer") or "").replace(" ",""))
    if am is None or int(am.group("v"))!=root or b*root*root!=a: return None
    return m,a,b,root

def can_generate(parent:dict)->tuple[bool,str]:
    if _parse(parent) is not None: return True,"square_root_quotient_integer_exact"
    if parent.get("figure_refs"): return False,"figure_parent"
    if parent.get("choices"): return False,"choice_parent"
    return False,"square_root_quotient_parent_not_exactly_parsed_and_verified"

def generate(parent:dict,count:int):
    if count not in (1,2,3): raise ValueError("count must be 1, 2, or 3")
    parsed=_parse(parent)
    if parsed is None:
        ok,reason=can_generate(parent); assert not ok; return [],[],reason
    match,pa,pb,proot=parsed; q=_norm(parent.get("question")); seed=int(_sha(parent)[:12],16)
    pool=(2,3,5,6,7,10,11,13); parent_sig=(pa,pb,proot); seen=set(); rows=[]; evidence=[]
    for i in range(1,count+1):
        b=pool[((seed>>(i*5))+i*3)%len(pool)]; root=2+((seed>>(i*7+2))+i*5)%8; a=b*root*root; sig=(a,b,root)
        while sig==parent_sig or sig in seen:
            root+=1; a=b*root*root; sig=(a,b,root)
        seen.add(sig)
        if a%b!=0 or math.isqrt(a//b)!=root or b*root*root!=a: raise AssertionError("square root quotient identity failed")
        nq=q[:match.start("expr")]+f"√{a}÷√{b}"+q[match.end("expr"):]
        rows.append({"question":nq,"answer":str(root),"explanation":f"√{a}÷√{b}=√({a}÷{b})=√{a//b}={root}。{b}×{root}²={a}でも確認。","numeric_signature":tuple(map(str,sig))})
        evidence.append({"parent_sha256":_sha(parent),"method":"square_root_quotient_exact_ratio_square_and_recomposition","parent_recalculation":f"{pa}/{pb}={proot}^2 and {pb}*{proot}^2={pa}","variant_recalculation":f"{a}/{b}={root}^2","independent_check":f"{b}*{root}^2={a} PASS"})
    return rows,evidence,"square_root_quotient_integer_exact"
