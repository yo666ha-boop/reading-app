from __future__ import annotations

"""Fail-closed exact engine for simplifying a two-integer ratio.

Only text-only non-choice parents containing exactly one positive integer ratio
A:B and asking solely to express it as the simplest integer ratio are accepted.
The parent's answer is verified by dividing both terms by gcd(A,B) and
independently by requiring the simplified terms to be coprime while preserving
the cross-product equality A*q == B*p.
"""

import hashlib
import json
import math
import re

RATIO_RE = re.compile(r"(?P<expr>(?P<a>\d+)\s*[:：]\s*(?P<b>\d+))")
ANSWER_RE = re.compile(r"^(?P<p>\d+)\s*[:：]\s*(?P<q>\d+)$")


def _norm(value: object) -> str:
    return str(value or "").replace("：", ":").replace("　", " ")


def _parent_sha(parent: dict) -> str:
    raw=json.dumps(parent,ensure_ascii=False,sort_keys=True,separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _parse_parent(parent: dict):
    if parent.get("figure_refs"):
        return None
    if parent.get("choices"):
        return None
    q=_norm(parent.get("question"))
    if not any(token in q for token in ("最も簡単な整数の比", "もっとも簡単な整数の比", "簡単な整数の比", "最簡整数比")):
        return None
    blocked=("比例式", "割合", "分け", "配分", "相似", "縮尺", "速さ", "濃度", "グラフ")
    if any(token in q for token in blocked):
        return None
    matches=list(RATIO_RE.finditer(q))
    if len(matches)!=1:
        return None
    m=matches[0]
    a=int(m.group("a")); b=int(m.group("b"))
    if a<=0 or b<=0:
        return None
    g=math.gcd(a,b)
    if g<=1:
        return None
    p=a//g; qv=b//g
    am=ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ", ""))
    if am is None or int(am.group("p"))!=p or int(am.group("q"))!=qv:
        return None
    if math.gcd(p,qv)!=1 or a*qv!=b*p:
        return None
    return m,a,b,p,qv,g


def can_generate(parent: dict) -> tuple[bool,str]:
    if _parse_parent(parent) is not None:
        return True,"two_integer_ratio_simplification_exact"
    if parent.get("figure_refs"):
        return False,"figure_parent"
    if parent.get("choices"):
        return False,"choice_parent"
    return False,"ratio_simplification_parent_not_exactly_parsed_and_verified"


def _variant_numbers(seed:int,index:int)->tuple[int,int]:
    coprime_pairs=((2,3),(3,4),(4,5),(5,7),(3,8),(7,9),(5,11),(8,11))
    p,q=coprime_pairs[((seed>>(index*5))+index*3)%len(coprime_pairs)]
    scale=2+(((seed>>(index*7+3))+index*5)%8)
    return p*scale,q*scale


def generate(parent:dict,count:int)->tuple[list[dict],list[dict],str]:
    if count not in (1,2,3):
        raise ValueError("count must be 1, 2, or 3")
    parsed=_parse_parent(parent)
    if parsed is None:
        ok,reason=can_generate(parent)
        assert not ok
        return [],[],reason
    match,parent_a,parent_b,parent_p,parent_q,parent_g=parsed
    qtext=_norm(parent.get("question"))
    seed=int(_parent_sha(parent)[:12],16)
    parent_signature=(str(parent_a),str(parent_b))
    seen:set[tuple[str,str]]=set()
    rows=[]; evidence=[]
    for index in range(1,count+1):
        a,b=_variant_numbers(seed,index)
        signature=(str(a),str(b))
        bump=0
        while signature==parent_signature or signature in seen:
            bump+=1
            a+=2*bump
            b+=3*bump
            g=math.gcd(a,b)
            if g<=1:
                a*=2; b*=2
            signature=(str(a),str(b))
        seen.add(signature)
        g=math.gcd(a,b)
        if g<=1:
            raise AssertionError("ratio variant must be reducible")
        p=a//g; qv=b//g
        if math.gcd(p,qv)!=1 or a*qv!=b*p:
            raise AssertionError("ratio simplification independent identity failed")
        expr=f"{a}:{b}"
        new_question=qtext[:match.start("expr")]+expr+qtext[match.end("expr"):]
        rows.append({
            "question":new_question,
            "answer":f"{p}:{qv}",
            "explanation":f"最大公約数{g}で両方を割ると{p}:{qv}。{p}と{qv}が互いに素で、外項・内項の積でも元の比と等しいことを確認済み。",
            "numeric_signature":signature,
        })
        evidence.append({
            "parent_sha256":_parent_sha(parent),
            "method":"ratio_simplification_gcd_coprime_and_cross_product",
            "parent_recalculation":f"gcd({parent_a},{parent_b})={parent_g}; {parent_a}:{parent_b}={parent_p}:{parent_q}",
            "variant_recalculation":f"gcd({a},{b})={g}; {a}:{b}={p}:{qv}",
            "independent_check":"gcd(simplified)==1 AND original_a*simplified_b == original_b*simplified_a PASS",
        })
    return rows,evidence,"two_integer_ratio_simplification_exact"
