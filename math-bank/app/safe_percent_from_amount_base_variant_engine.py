from __future__ import annotations

"""Fail-closed exact engine for simple percentage-rate questions.

Accept only text-only parents of the form "BASE円のうちAMOUNT円は何%" (or
"BASE円に対してAMOUNT円は何%") with a verified integer-percent answer.
No discounts, tax, change rates, concentration, figures, or choices.
"""

import hashlib
import json
import re
from fractions import Fraction

PAIR_RE = re.compile(r"(?P<base>\d+)\s*円\s*(?:のうち|に対して)\s*(?P<amount>\d+)\s*円")
ANSWER_RE = re.compile(r"^(?P<pct>\d+)\s*%$")


def _norm(value: object) -> str:
    return str(value or "").replace("　", " ").replace("％", "%")


def _sha(parent: dict) -> str:
    raw=json.dumps(parent,ensure_ascii=False,sort_keys=True,separators=(",",":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _parse_parent(parent: dict):
    if parent.get("figure_refs") or parent.get("choices"):
        return None
    q=_norm(parent.get("question"))
    if "何%" not in q and "何パーセント" not in q:
        return None
    blocked=("増え","減り","増加","減少","値引","割引","税込","税","濃度","食塩水","変化率","利益","損失","図","グラフ")
    if any(t in q for t in blocked):
        return None
    matches=list(PAIR_RE.finditer(q))
    if len(matches)!=1:
        return None
    m=matches[0]; base=int(m.group("base")); amount=int(m.group("amount"))
    if base<=0 or amount<0 or amount>base:
        return None
    pct=Fraction(amount*100,base)
    if pct.denominator!=1:
        return None
    am=ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ",""))
    if am is None or int(am.group("pct"))!=pct.numerator:
        return None
    if Fraction(pct.numerator*base,100)!=amount:
        return None
    return m,base,amount,pct.numerator


def can_generate(parent: dict) -> tuple[bool,str]:
    if _parse_parent(parent) is not None:
        return True,"percent_from_amount_base_integer_exact"
    if parent.get("figure_refs"):
        return False,"figure_parent"
    if parent.get("choices"):
        return False,"choice_parent"
    return False,"percent_from_amount_base_parent_not_exactly_parsed_and_verified"


def generate(parent: dict,count: int):
    if count not in (1,2,3):
        raise ValueError("count must be 1, 2, or 3")
    parsed=_parse_parent(parent)
    if parsed is None:
        ok,reason=can_generate(parent); assert not ok
        return [],[],reason
    m,parent_base,parent_amount,parent_pct=parsed
    q=_norm(parent.get("question")); seed=int(_sha(parent)[:12],16)
    pct_options=(10,20,25,40,50,60,75,80)
    seen=set(); rows=[]; evidence=[]
    for index in range(1,count+1):
        pct=pct_options[((seed>>(index*5))+index*3)%len(pct_options)]
        base=100+100*(((seed>>(index*7+3))+index*5)%12)
        amount=base*pct//100
        sig=(base,amount)
        while sig==(parent_base,parent_amount) or sig in seen or base*pct%100:
            base+=100
            amount=base*pct//100
            sig=(base,amount)
        seen.add(sig)
        if Fraction(amount*100,base)!=pct or Fraction(pct*base,100)!=amount:
            raise AssertionError("percent inverse identity failed")
        replacement=f"{base}円のうち{amount}円"
        new_q=q[:m.start()]+replacement+q[m.end():]
        rows.append({"question":new_q,"answer":f"{pct}%","explanation":f"割合={amount}÷{base}×100={pct}%です。{pct}%×{base}円={amount}円でも確認済み。","numeric_signature":(str(base),str(amount))})
        evidence.append({"parent_sha256":_sha(parent),"method":"percent_from_amount_base_exact_fraction_and_inverse","parent_recalculation":f"{parent_amount}/{parent_base}*100={parent_pct}%","variant_recalculation":f"{amount}/{base}*100={pct}%","independent_check":"percent*base/100 == amount PASS"})
    return rows,evidence,"percent_from_amount_base_integer_exact"
