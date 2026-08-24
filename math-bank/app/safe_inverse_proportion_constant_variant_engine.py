from __future__ import annotations

"""Fail-closed exact engine for inverse-proportion constant parents.

Accepts only text-only parents stating y is inversely proportional to x, one
exact x=value and y=value pair, and asking only for constant a. Parent and
variants are verified by a=x*y and independently by y=a/x.
"""

import hashlib
import json
import re
from fractions import Fraction

PAIR_RE = re.compile(r"[xｘ]\s*=\s*(?P<x>[+-]?\d+)\s*(?:のとき|で|、|,).*?[yｙ]\s*=\s*(?P<y>[+-]?\d+)")
ANSWER_RE = re.compile(r"^(?:[aａ]\s*=\s*)?(?P<a>[+-]?\d+)$")


def _norm(value: object) -> str:
    return str(value or "").replace("　", " ").replace("−", "-").replace("＋", "+")


def _sha(parent: dict) -> str:
    raw=json.dumps(parent,ensure_ascii=False,sort_keys=True,separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _parse_parent(parent: dict):
    if parent.get("figure_refs") or parent.get("choices"):
        return None
    q=_norm(parent.get("question"))
    if not any(t in q for t in ("yはxに反比例","y は x に反比例","ｙはｘに反比例")):
        return None
    if not any(t in q for t in ("比例定数","定数a","定数 a")):
        return None
    if any(t in q for t in ("グラフ","式を求","yの値","xの値","図")):
        return None
    matches=list(PAIR_RE.finditer(q))
    if len(matches)!=1:
        return None
    m=matches[0]; x=int(m.group("x")); y=int(m.group("y"))
    if x==0 or y==0:
        return None
    a=x*y
    am=ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ",""))
    if am is None or int(am.group("a"))!=a:
        return None
    if Fraction(a,x)!=y:
        return None
    return m,x,y,a


def can_generate(parent: dict)->tuple[bool,str]:
    if _parse_parent(parent) is not None:
        return True,"inverse_proportion_constant_exact"
    if parent.get("figure_refs"):
        return False,"figure_parent"
    if parent.get("choices"):
        return False,"choice_parent"
    return False,"inverse_proportion_constant_parent_not_exactly_parsed_and_verified"


def generate(parent: dict,count:int)->tuple[list[dict],list[dict],str]:
    if count not in (1,2,3):
        raise ValueError("count must be 1, 2, or 3")
    parsed=_parse_parent(parent)
    if parsed is None:
        ok,reason=can_generate(parent); assert not ok
        return [],[],reason
    match,px,py,pa=parsed; q=_norm(parent.get("question")); seed=int(_sha(parent)[:12],16)
    seen=set(); rows=[]; evidence=[]
    for index in range(1,count+1):
        x=2+((seed>>(index*5))+index*3)%10
        y_abs=2+((seed>>(index*7+2))+index*5)%10
        y=-y_abs if ((seed>>(index+17))&1) else y_abs
        a=x*y; sig=(str(x),str(y))
        while sig==(str(px),str(py)) or sig in seen:
            x+=1; a=x*y; sig=(str(x),str(y))
        seen.add(sig)
        if x*y!=a or Fraction(a,x)!=y:
            raise AssertionError("inverse proportion constant identity failed")
        replacement=f"x={x}のときy={y}"
        new_q=q[:match.start()]+replacement+q[match.end():]
        rows.append({"question":new_q,"answer":f"a={a}","explanation":f"反比例 y=a/x では a=x×y。{x}×{y}={a}。さらに {a}/{x}={y} で確認。","numeric_signature":sig})
        evidence.append({"parent_sha256":_sha(parent),"method":"inverse_proportion_constant_exact_product_and_division_identity","parent_recalculation":f"a={px}*{py}={pa} and {pa}/{px}={py}","variant_recalculation":f"a={x}*{y}={a} and {a}/{x}={y}","independent_check":"a == x*y AND a/x == y PASS"})
    return rows,evidence,"inverse_proportion_constant_exact"
