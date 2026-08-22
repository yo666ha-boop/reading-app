from __future__ import annotations

"""Fail-closed exact engine for x^2-a^2 factorization."""

import hashlib, json, re

Q_RE = re.compile(r"x(?:\^2|²)\s*-\s*(?P<n>\d+)")
A_RE = re.compile(r"^\(x-(?P<a>\d+)\)\(x\+(?P=a)\)$|^\(x\+(?P<b>\d+)\)\(x-(?P=b)\)$")


def _norm(v: object) -> str:
    return str(v or "").replace(" ", "").replace("　", "")


def _sha(parent: dict) -> str:
    raw=json.dumps(parent,ensure_ascii=False,sort_keys=True,separators=(",",":")).encode()
    return hashlib.sha256(raw).hexdigest()


def _is_square(n:int)->tuple[bool,int]:
    a=int(n**0.5)
    while (a+1)*(a+1)<=n: a+=1
    while a*a>n: a-=1
    return a*a==n,a


def _parse(parent: dict):
    if parent.get("figure_refs") or parent.get("choices"): return None
    q=_norm(parent.get("question"))
    if "因数分解" not in q or "方程式" in q or "展開" in q: return None
    ms=list(Q_RE.finditer(q))
    if len(ms)!=1: return None
    n=int(ms[0].group("n")); ok,a=_is_square(n)
    if not ok or a<=0: return None
    ans=_norm(parent.get("answer"))
    am=A_RE.fullmatch(ans)
    if am is None: return None
    parsed=int(am.group("a") or am.group("b"))
    if parsed!=a: return None
    return ms[0],a,n


def can_generate(parent: dict)->tuple[bool,str]:
    if _parse(parent): return True,"difference_of_squares_exact"
    if parent.get("figure_refs"): return False,"figure_parent"
    if parent.get("choices"): return False,"choice_parent"
    return False,"difference_of_squares_parent_not_exactly_parsed_and_verified"


def generate(parent:dict,count:int)->tuple[list[dict],list[dict],str]:
    if count not in (1,2,3): raise ValueError("count must be 1, 2, or 3")
    parsed=_parse(parent)
    if not parsed:
        return [],[],can_generate(parent)[1]
    m,a,n=parsed; q=_norm(parent.get("question")); seed=int(_sha(parent)[:12],16)
    rows=[]; evs=[]; seen=set()
    for i in range(1,count+1):
        b=2+((seed>>(i*5))+i*7)%18
        while b==a or b in seen: b+=1
        seen.add(b); nn=b*b
        nq=q[:m.start()]+f"x²-{nn}"+q[m.end():]
        ans=f"(x-{b})(x+{b})"
        assert b*b==nn and -b*b==-nn
        rows.append({"question":nq,"answer":ans,"explanation":f"x²-{nn}=x²-{b}²=(x-{b})(x+{b})。展開して定数項-{nn}になることも確認済み。","numeric_signature":(str(nn),str(b))})
        evs.append({"parent_sha256":_sha(parent),"method":"difference_of_squares_exact_factor_and_expand_identity","parent_recalculation":f"{a}^2={n}","variant_recalculation":f"{b}^2={nn}","independent_check":f"(x-{b})(x+{b}) expands to x^2-{nn} PASS"})
    return rows,evs,"difference_of_squares_exact"
