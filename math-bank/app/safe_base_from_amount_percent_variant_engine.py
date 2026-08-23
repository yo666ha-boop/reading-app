from __future__ import annotations

"""Fail-closed exact engine for finding an original amount from percentage and part."""

import hashlib
import json
import re
from fractions import Fraction

PAIR_RE = re.compile(r"(?P<pct>\d+)\s*[%％]\s*(?:にあたる|分(?:にあたる)?)\s*(?P<amount>\d+)\s*円")
ANSWER_RE = re.compile(r"^(?P<base>\d+)\s*円$")


def _norm(value: object) -> str:
    return str(value or "").replace("　", " ").replace("％", "%")


def _sha(parent: dict) -> str:
    raw=json.dumps(parent,ensure_ascii=False,sort_keys=True,separators=(",",":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _parse_parent(parent: dict):
    if parent.get("figure_refs") or parent.get("choices"):
        return None
    q=_norm(parent.get("question"))
    if not any(t in q for t in ("もとの金額","元の金額","全体の金額","全体はいくら","全部で何円")):
        return None
    blocked=("増え","減り","増加","減少","値引","割引","税込","税","濃度","食塩水","利益","損失","図","グラフ")
    if any(t in q for t in blocked):
        return None
    matches=list(PAIR_RE.finditer(q))
    if len(matches)!=1:
        return None
    m=matches[0]; pct=int(m.group("pct")); amount=int(m.group("amount"))
    if pct<=0 or pct>=100 or amount<=0:
        return None
    base=Fraction(amount*100,pct)
    if base.denominator!=1:
        return None
    am=ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ",""))
    if am is None or int(am.group("base"))!=base.numerator:
        return None
    if Fraction(base.numerator*pct,100)!=amount:
        return None
    return m,pct,amount,base.numerator


def can_generate(parent: dict) -> tuple[bool,str]:
    if _parse_parent(parent) is not None:
        return True,"base_from_amount_percent_integer_exact"
    if parent.get("figure_refs"):
        return False,"figure_parent"
    if parent.get("choices"):
        return False,"choice_parent"
    return False,"base_from_amount_percent_parent_not_exactly_parsed_and_verified"


def generate(parent: dict,count: int):
    if count not in (1,2,3):
        raise ValueError("count must be 1, 2, or 3")
    parsed=_parse_parent(parent)
    if parsed is None:
        ok,reason=can_generate(parent); assert not ok
        return [],[],reason
    m,parent_pct,parent_amount,parent_base=parsed
    q=_norm(parent.get("question")); seed=int(_sha(parent)[:12],16)
    pct_options=(10,20,25,40,50,60,75,80)
    seen=set(); rows=[]; evidence=[]
    for index in range(1,count+1):
        pct=pct_options[((seed>>(index*5))+index*3)%len(pct_options)]
        base=200+100*(((seed>>(index*7+2))+index*5)%15)
        amount=base*pct//100
        sig=(pct,amount)
        while sig==(parent_pct,parent_amount) or sig in seen or base*pct%100:
            base+=100
            amount=base*pct//100
            sig=(pct,amount)
        seen.add(sig)
        derived=Fraction(amount*100,pct)
        if derived.denominator!=1 or derived.numerator!=base or Fraction(base*pct,100)!=amount:
            raise AssertionError("base from percent inverse identity failed")
        replacement=f"{pct}%にあたる{amount}円"
        new_q=q[:m.start()]+replacement+q[m.end():]
        rows.append({"question":new_q,"answer":f"{base}円","explanation":f"{pct}%にあたる金額が{amount}円なので、全体={amount}×100÷{pct}={base}円です。{base}×{pct}/100={amount}でも確認済み。","numeric_signature":(str(pct),str(amount))})
        evidence.append({"parent_sha256":_sha(parent),"method":"base_from_amount_percent_exact_inverse_and_recomposition","parent_recalculation":f"{parent_amount}*100/{parent_pct}={parent_base}円","variant_recalculation":f"{amount}*100/{pct}={base}円","independent_check":"base*percent/100 == amount PASS"})
    return rows,evidence,"base_from_amount_percent_integer_exact"
