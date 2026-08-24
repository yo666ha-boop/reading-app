from __future__ import annotations

"""Fail-closed exact engine for hypotenuse+one-leg -> other-leg right-triangle parents."""

import hashlib
import json
import math
import re

DATA_RE = re.compile(r"斜辺(?:の長さ)?(?:が|は)?\s*(?P<c>\d+)\s*cm.*?直角をはさむ(?:1辺|一辺)(?:の長さ)?(?:が|は)?\s*(?P<a>\d+)\s*cm")
ANSWER_RE = re.compile(r"^(?P<b>\d+)\s*cm$")


def _norm(value: object)->str:
    return str(value or "").replace("　"," ").replace("ｃｍ","cm").replace("ＣＭ","cm")


def _sha(parent:dict)->str:
    return hashlib.sha256(json.dumps(parent,ensure_ascii=False,sort_keys=True,separators=(",", ":")).encode("utf-8")).hexdigest()


def _parse_parent(parent:dict):
    if parent.get("figure_refs") or parent.get("choices"):
        return None
    q=_norm(parent.get("question"))
    if "直角三角形" not in q or "斜辺" not in q or not any(t in q for t in ("残りの辺","もう1辺","もう一辺")):
        return None
    blocked=("面積","周","高さ","角度","相似","証明","図")
    if any(t in q for t in blocked):
        return None
    matches=list(DATA_RE.finditer(q))
    if len(matches)!=1:
        return None
    m=matches[0]; c=int(m.group("c")); a=int(m.group("a"))
    if c<=0 or a<=0 or c<=a:
        return None
    b2=c*c-a*a; b=math.isqrt(b2)
    if b<=0 or b*b!=b2:
        return None
    am=ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ",""))
    if am is None or int(am.group("b"))!=b:
        return None
    if a*a+b*b!=c*c:
        return None
    return m,c,a,b


def can_generate(parent:dict)->tuple[bool,str]:
    if _parse_parent(parent) is not None:
        return True,"pythagorean_leg_integer_exact"
    if parent.get("figure_refs"):
        return False,"figure_parent"
    if parent.get("choices"):
        return False,"choice_parent"
    return False,"pythagorean_leg_parent_not_exactly_parsed_and_verified"


def generate(parent:dict,count:int)->tuple[list[dict],list[dict],str]:
    if count not in (1,2,3):
        raise ValueError("count must be 1, 2, or 3")
    parsed=_parse_parent(parent)
    if parsed is None:
        ok,reason=can_generate(parent); assert not ok
        return [],[],reason
    match,pc,pa,pb=parsed
    q=_norm(parent.get("question")); seed=int(_sha(parent)[:12],16)
    triples=((3,4,5),(5,12,13),(8,15,17),(7,24,25)); seen=set(); rows=[]; evidence=[]
    for index in range(count):
        base_a,base_b,base_c=triples[(seed+index)%len(triples)]
        scale=1+((seed>>(index*4+3))%3)
        swap=bool((seed>>index)&1)
        while True:
            a=base_a*scale; b=base_b*scale; c=base_c*scale
            if swap:
                a,b=b,a
            sig=(str(c),str(a))
            if sig!=(str(pc),str(pa)) and sig not in seen:
                break
            scale+=1
        seen.add(sig)
        if c*c-a*a!=b*b or a*a+b*b!=c*c:
            raise AssertionError("pythagorean leg inverse identity failed")
        replacement=f"斜辺が{c}cm、直角をはさむ1辺が{a}cm"
        new_q=q[:match.start()]+replacement+q[match.end():]
        rows.append({"question":new_q,"answer":f"{b}cm","explanation":f"三平方の定理より、残りの辺²={c}²-{a}²={b*b}。したがって{b}cm。{a}²+{b}²={c}²でも確認済み。","numeric_signature":sig})
        evidence.append({"parent_sha256":_sha(parent),"method":"pythagorean_leg_exact_square_difference_and_recomposition","parent_recalculation":f"{pc}^2-{pa}^2={pb}^2 and {pa}^2+{pb}^2={pc}^2","variant_recalculation":f"{c}^2-{a}^2={b}^2 and {a}^2+{b}^2={c}^2","independent_check":"c^2-a^2 == b^2 AND a^2+b^2 == c^2 PASS"})
    return rows,evidence,"pythagorean_leg_integer_exact"
