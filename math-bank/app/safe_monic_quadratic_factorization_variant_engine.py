from __future__ import annotations

"""Fail-closed exact engine for quadratic factorization families."""

import hashlib
import json
import re

from safe_common_factor_quadratic_variant_engine import generate as generate_common_factor
from safe_nonmonic_quadratic_factorization_variant_engine import generate as generate_nonmonic
from safe_perfect_square_factorization_variant_engine import generate as generate_perfect_square

EXPR_RE = re.compile(r"x(?:\^2|²)\s*(?P<b>[+-]\s*\d+)\s*x\s*(?P<c>[+-]\s*\d+)")
FACTOR_RE = re.compile(r"^\(x(?P<p>[+-]\d+)\)\(x(?P<q>[+-]\d+)\)$")


def _norm(value: object) -> str:
    return str(value or "").replace("　", " ").replace("−", "-").replace("＋", "+").replace("ｘ", "x").replace("Ｘ", "x")


def _compact(value: object) -> str:
    return re.sub(r"\s+", "", _norm(value))


def _parent_sha(parent: dict) -> str:
    raw=json.dumps(parent,ensure_ascii=False,sort_keys=True,separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _signed(n:int)->str:
    return f"+{n}" if n>=0 else str(n)


def _parse_parent(parent:dict):
    if parent.get("figure_refs") or parent.get("choices"): return None
    q=_compact(parent.get("question"))
    if "因数分解" not in q or any(t in q for t in ("展開","方程式","解き","グラフ","面積","証明","平方完成")): return None
    matches=list(EXPR_RE.finditer(q))
    if len(matches)!=1: return None
    m=matches[0]; outside=q[:m.start()]+q[m.end():]
    if "x" in outside: return None
    b=int(m.group("b").replace(" ","")); c=int(m.group("c").replace(" ",""))
    am=FACTOR_RE.fullmatch(_compact(parent.get("answer")))
    if am is None: return None
    p=int(am.group("p")); qq=int(am.group("q"))
    if p+qq!=b or p*qq!=c or (1,p+qq,p*qq)!=(1,b,c): return None
    return m,b,c,p,qq


def can_generate(parent:dict)->tuple[bool,str]:
    if _parse_parent(parent) is not None: return True,"monic_quadratic_integer_factorization_exact"
    rows,_,reason=generate_perfect_square(parent,1)
    if rows: return True,reason
    rows,_,reason=generate_common_factor(parent,1)
    if rows: return True,reason
    rows,_,reason=generate_nonmonic(parent,1)
    if rows: return True,reason
    if parent.get("figure_refs"): return False,"figure_parent"
    if parent.get("choices"): return False,"choice_parent"
    return False,"quadratic_factorization_parent_not_exactly_parsed_and_verified"


def _variant_factors(seed:int,index:int)->tuple[int,int]:
    p=2+((seed>>(index*5))+index*3)%8; q=2+((seed>>(index*7+2))+index*5)%8
    if (seed>>index)&1: p=-p
    if (seed>>(index+3))&1: q=-q
    return p,q


def generate(parent:dict,count:int)->tuple[list[dict],list[dict],str]:
    if count not in (1,2,3): raise ValueError("count must be 1, 2, or 3")
    parsed=_parse_parent(parent)
    if parsed is None:
        rows,evidence,reason=generate_perfect_square(parent,count)
        if rows: return rows,evidence,reason
        rows,evidence,reason=generate_common_factor(parent,count)
        if rows: return rows,evidence,reason
        rows,evidence,reason=generate_nonmonic(parent,count)
        if rows: return rows,evidence,reason
        ok,reason=can_generate(parent); assert not ok
        return [],[],reason
    match,parent_b,parent_c,parent_p,parent_q=parsed; qtext=_compact(parent.get("question")); seed=int(_parent_sha(parent)[:12],16)
    parent_signature=(str(parent_b),str(parent_c)); seen=set(); rows=[]; evidence=[]
    for index in range(1,count+1):
        p,qq=_variant_factors(seed,index); b=p+qq; c=p*qq; signature=(str(b),str(c)); bump=0
        while signature==parent_signature or signature in seen or c==0:
            bump+=1; qq+=bump
            if qq==0: qq+=1
            b=p+qq; c=p*qq; signature=(str(b),str(c))
        seen.add(signature)
        if p+qq!=b or p*qq!=c or (1,p+qq,p*qq)!=(1,b,c): raise AssertionError("monic quadratic factorization independent verification failed")
        replacement=f"x²{_signed(b)}x{_signed(c)}"; new_question=qtext[:match.start()]+replacement+qtext[match.end():]; answer=f"(x{_signed(p)})(x{_signed(qq)})"
        rows.append({"question":new_question,"answer":answer,"explanation":f"和が{b}、積が{c}になる2数は{p}と{qq}。展開して元の式に戻ることも確認済み。","numeric_signature":signature})
        evidence.append({"parent_sha256":_parent_sha(parent),"method":"monic_quadratic_sum_product_and_reexpansion","parent_recalculation":f"{parent_p}+{parent_q}={parent_b}; {parent_p}*{parent_q}={parent_c}","variant_recalculation":f"{p}+{qq}={b}; {p}*{qq}={c}","independent_check":"expanded coefficients (1,p+q,p*q) exactly match quadratic coefficients PASS"})
    return rows,evidence,"monic_quadratic_integer_factorization_exact"
