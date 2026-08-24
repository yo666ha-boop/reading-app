from __future__ import annotations

"""Fail-closed exact engine for direct-proportion constant parents.

Accepts only text-only parents stating that y is proportional to x, one exact
x=value and y=value pair, and asking only for the proportionality constant a.
The parent and variants are verified by a=y/x and independently by a*x=y.
"""

import hashlib
import json
import re
from fractions import Fraction

PAIR_RE = re.compile(r"[xｘ]\s*=\s*(?P<x>[+-]?\d+)\s*(?:のとき|で|、|,).*?[yｙ]\s*=\s*(?P<y>[+-]?\d+)")
ANSWER_RE = re.compile(r"^(?:[aａ]\s*=\s*)?(?P<a>[+-]?\d+(?:/\d+)?)$")


def _norm(value: object)->str:
    return str(value or "").replace("　"," ").replace("−","-").replace("＋","+")


def _sha(parent:dict)->str:
    return hashlib.sha256(json.dumps(parent,ensure_ascii=False,sort_keys=True,separators=(",", ":")).encode("utf-8")).hexdigest()


def _fmt(v:Fraction)->str:
    return str(v.numerator) if v.denominator==1 else f"{v.numerator}/{v.denominator}"


def _parse_parent(parent:dict):
    if parent.get("figure_refs") or parent.get("choices"):
        return None
    q=_norm(parent.get("question"))
    if not any(t in q for t in ("yはxに比例","y は x に比例","ｙはｘに比例")):
        return None
    if not any(t in q for t in ("比例定数","定数a","定数 a")):
        return None
    blocked=("反比例","グラフ","傾き","切片","式を求","yの値","xの値","図")
    if any(t in q for t in blocked):
        return None
    matches=list(PAIR_RE.finditer(q))
    if len(matches)!=1:
        return None
    m=matches[0]; x=int(m.group("x")); y=int(m.group("y"))
    if x==0:
        return None
    a=Fraction(y,x)
    am=ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ",""))
    if am is None or Fraction(am.group("a"))!=a:
        return None
    if a*x!=y:
        return None
    return m,x,y,a


def can_generate(parent:dict)->tuple[bool,str]:
    if _parse_parent(parent) is not None:
        return True,"direct_proportion_constant_exact"
    if parent.get("figure_refs"):
        return False,"figure_parent"
    if parent.get("choices"):
        return False,"choice_parent"
    return False,"direct_proportion_constant_parent_not_exactly_parsed_and_verified"


def generate(parent:dict,count:int)->tuple[list[dict],list[dict],str]:
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
        a_num=1+((seed>>(index*7+2))+index*5)%9
        sign=-1 if ((seed>>(index+13))&1) else 1
        a=Fraction(sign*a_num,1); y=a*x
        sig=(str(x),str(y))
        while sig==(str(px),str(py)) or sig in seen:
            x+=1; y=a*x; sig=(str(x),str(y))
        seen.add(sig)
        if a*x!=y or Fraction(y,x)!=a:
            raise AssertionError("direct proportion constant identity failed")
        replacement=f"x={x}のときy={_fmt(y)}"
        new_q=q[:match.start()]+replacement+q[match.end():]
        rows.append({"question":new_q,"answer":f"a={_fmt(a)}","explanation":f"比例 y=ax では a=y/x。{_fmt(y)}/{x}={_fmt(a)}。さらに {_fmt(a)}×{x}={_fmt(y)} で確認。","numeric_signature":sig})
        evidence.append({"parent_sha256":_sha(parent),"method":"direct_proportion_constant_exact_ratio_and_product_identity","parent_recalculation":f"a={py}/{px}={_fmt(pa)} and {_fmt(pa)}*{px}={py}","variant_recalculation":f"a={_fmt(y)}/{x}={_fmt(a)} and {_fmt(a)}*{x}={_fmt(y)}","independent_check":"a == y/x AND a*x == y PASS"})
    return rows,evidence,"direct_proportion_constant_exact"
