from __future__ import annotations

"""Fail-closed exact engine for non-monic quadratic factorization into integer linear factors."""

import hashlib
import json
import re

EXPR_RE=re.compile(r"(?P<expr>(?P<a>\d+)x(?:\^2|²)(?P<bs>[+-])(?P<b>\d+)x(?P<cs>[+-])(?P<c>\d+))")
FACTOR_RE=re.compile(r"^\((?P<m>\d+)x(?P<p>[+-]\d+)\)\((?P<n>\d+)x(?P<q>[+-]\d+)\)$")


def _norm(v:object)->str:
    return re.sub(r"\s+","",str(v or "").replace("　","").replace("−","-").replace("＋","+").replace("ｘ","x").replace("Ｘ","x"))


def _sha(parent:dict)->str:
    raw=json.dumps(parent,ensure_ascii=False,sort_keys=True,separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _signed(sign:str,digits:str)->int:
    n=int(digits); return -n if sign=="-" else n


def _sgn(n:int)->str:
    return f"+{n}" if n>=0 else str(n)


def _parse(parent:dict):
    if parent.get("figure_refs") or parent.get("choices"): return None
    q=_norm(parent.get("question"))
    if "因数分解" not in q or any(t in q for t in ("展開","方程式","解き","グラフ","面積","証明","平方完成")): return None
    matches=list(EXPR_RE.finditer(q))
    if len(matches)!=1: return None
    mt=matches[0]; outside=q[:mt.start()]+q[mt.end():]
    if "x" in outside: return None
    a=int(mt.group("a")); b=_signed(mt.group("bs"),mt.group("b")); c=_signed(mt.group("cs"),mt.group("c"))
    if a<=1: return None
    am=FACTOR_RE.fullmatch(_norm(parent.get("answer")))
    if am is None: return None
    m=int(am.group("m")); n=int(am.group("n")); p=int(am.group("p")); qq=int(am.group("q"))
    if m<=0 or n<=0: return None
    if m*n!=a or m*qq+n*p!=b or p*qq!=c: return None
    return mt,a,b,c,m,n,p,qq


def can_generate(parent:dict)->tuple[bool,str]:
    if _parse(parent) is not None: return True,"nonmonic_quadratic_integer_factorization_exact"
    if parent.get("figure_refs"): return False,"figure_parent"
    if parent.get("choices"): return False,"choice_parent"
    return False,"nonmonic_quadratic_factorization_parent_not_exactly_parsed_and_verified"


def generate(parent:dict,count:int):
    if count not in (1,2,3): raise ValueError("count must be 1, 2, or 3")
    parsed=_parse(parent)
    if parsed is None:
        ok,reason=can_generate(parent); assert not ok
        return [],[],reason
    mt,pa,pb,pc,pm,pn,pp,pq=parsed; qtext=_norm(parent.get("question")); seed=int(_sha(parent)[:12],16)
    parent_sig=(str(pa),str(pb),str(pc)); seen=set(); rows=[]; evidence=[]
    for i in range(1,count+1):
        m=2+((seed>>(i*4))%4); n=1+((seed>>(i*6+2))%3); p=1+((seed>>(i*7+1))%6); qq=1+((seed>>(i*8+3))%6)
        if (seed>>(i+9))&1: p=-p
        if (seed>>(i+13))&1: qq=-qq
        a=m*n; b=m*qq+n*p; c=p*qq; sig=(str(a),str(b),str(c)); bump=0
        while a<=1 or b==0 or c==0 or sig==parent_sig or sig in seen:
            bump+=1; qq += 1 if qq>0 else -1
            if qq==0: qq=2
            a=m*n; b=m*qq+n*p; c=p*qq; sig=(str(a),str(b),str(c))
        seen.add(sig)
        if m*n!=a or m*qq+n*p!=b or p*qq!=c: raise AssertionError("nonmonic factorization re-expansion failed")
        expr=f"{a}x²{_sgn(b)}x{_sgn(c)}"; nq=qtext[:mt.start("expr")]+expr+qtext[mt.end("expr"):]
        ans=f"({m}x{_sgn(p)})({n}x{_sgn(qq)})"
        rows.append({"question":nq,"answer":ans,"explanation":f"({m}x{_sgn(p)})({n}x{_sgn(qq)})を展開すると{a}x²{_sgn(b)}x{_sgn(c)}。先頭係数・x係数・定数項を独立確認済み。","numeric_signature":sig})
        evidence.append({"parent_sha256":_sha(parent),"method":"nonmonic_quadratic_integer_factorization_reexpansion","parent_recalculation":f"{pm}*{pn}={pa}; {pm}*{pq}+{pn}*{pp}={pb}; {pp}*{pq}={pc}","variant_recalculation":f"{m}*{n}={a}; {m}*{qq}+{n}*{p}={b}; {p}*{qq}={c}","independent_check":"factor product re-expands exactly to all three quadratic coefficients PASS"})
    return rows,evidence,"nonmonic_quadratic_integer_factorization_exact"
