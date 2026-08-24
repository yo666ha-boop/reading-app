from __future__ import annotations

"""Fail-closed exact engine for narrow consumption-tax price parent shapes.

Supported shapes are intentionally narrow:
1. pre-tax integer-yen price + explicit integer tax rate -> tax-inclusive total;
2. tax-inclusive integer-yen total + explicit integer tax rate -> pre-tax price;
3. pre-tax integer-yen price + explicit integer tax rate -> tax amount.

The stated parent answer is verified exactly with Fraction arithmetic and a
second independent cross-product identity. Figure/choice parents, discounts,
multiple rates, rounding, points, fees, shipping, or ambiguous prose fail
closed. Variants are generated only when all yen values are exact integers.
"""

import hashlib
import json
import re
from fractions import Fraction

FORWARD_RE = re.compile(r"(?P<expr>(?P<base>\d+)\s*円.*?(?:消費税|税率)\s*(?P<rate>\d+)\s*[%％])")
REVERSE_RE = re.compile(r"(?P<expr>(?:税込み?|税込価格)\s*(?P<total>\d+)\s*円.*?(?:消費税|税率)\s*(?P<rate>\d+)\s*[%％])")
ANSWER_RE = re.compile(r"^(?P<v>\d+)\s*円$")


def _norm(value: object) -> str:
    return str(value or "").replace("％", "%").replace("　", " ")


def _parent_sha(parent: dict) -> str:
    raw=json.dumps(parent,ensure_ascii=False,sort_keys=True,separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _answer_yen(parent: dict) -> int | None:
    am=ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ", ""))
    return int(am.group("v")) if am is not None else None


def _parse_parent(parent: dict):
    if parent.get("figure_refs") or parent.get("choices"):
        return None
    q=_norm(parent.get("question")); answer=_answer_yen(parent)
    if answer is None:
        return None
    common_blocked=("値引","割引","引き","セール","ポイント","手数料","送料","何%","四捨五入","切り捨て","切り上げ")
    if any(token in q for token in common_blocked):
        return None

    reverse_requested=any(token in q for token in ("税抜価格","税抜き価格","税抜の価格","税抜きの価格","税抜価格を求","税抜き価格を求"))
    if reverse_requested:
        matches=list(REVERSE_RE.finditer(q))
        if len(matches)!=1: return None
        m=matches[0]; total=int(m.group("total")); rate=int(m.group("rate"))
        if total<=0 or rate<=0 or rate>=100: return None
        base=Fraction(total*100,100+rate)
        if base.denominator!=1 or answer!=base.numerator: return None
        if Fraction(total-base,1)*100!=base*rate: return None
        return "reverse",m,int(base),rate,Fraction(total,1)

    tax_amount_requested=any(token in q for token in ("消費税額","税額を求","税金はいくら","消費税はいくら"))
    if tax_amount_requested:
        matches=list(FORWARD_RE.finditer(q))
        if len(matches)!=1: return None
        m=matches[0]; base=int(m.group("base")); rate=int(m.group("rate"))
        if base<=0 or rate<=0 or rate>=100: return None
        tax=Fraction(base*rate,100)
        if tax.denominator!=1 or answer!=tax.numerator: return None
        total=Fraction(base,1)+tax
        if (total-base)*100!=base*rate: return None
        return "tax_amount",m,base,rate,total

    forward_requested=any(token in q for token in ("税込","税込み","税を加え","税金を加え","消費税を加え"))
    if not forward_requested or "税抜" in q: return None
    matches=list(FORWARD_RE.finditer(q))
    if len(matches)!=1: return None
    m=matches[0]; base=int(m.group("base")); rate=int(m.group("rate"))
    if base<=0 or rate<=0 or rate>=100: return None
    total=Fraction(base*(100+rate),100)
    if total.denominator!=1 or answer!=total.numerator: return None
    if (total-base)*100!=base*rate: return None
    return "forward",m,base,rate,total


def can_generate(parent: dict) -> tuple[bool,str]:
    parsed=_parse_parent(parent)
    if parsed is not None:
        if parsed[0]=="reverse": return True,"tax_exclusive_from_inclusive_yen_exact"
        if parsed[0]=="tax_amount": return True,"tax_amount_yen_exact"
        return True,"tax_inclusive_yen_exact"
    if parent.get("figure_refs"): return False,"figure_parent"
    if parent.get("choices"): return False,"choice_parent"
    return False,"tax_price_parent_not_exactly_parsed_and_verified"


def _variant_numbers(seed:int,index:int)->tuple[int,int]:
    rates=(5,8,10); rate=rates[((seed>>(index*5))+index)%len(rates)]
    base=500+100*(((seed>>(index*7+3))+index*11)%46)
    return base,rate


def generate(parent:dict,count:int)->tuple[list[dict],list[dict],str]:
    if count not in (1,2,3): raise ValueError("count must be 1, 2, or 3")
    parsed=_parse_parent(parent)
    if parsed is None:
        ok,reason=can_generate(parent); assert not ok
        return [],[],reason
    mode,match,parent_base,parent_rate,parent_total=parsed
    q=_norm(parent.get("question")); seed=int(_parent_sha(parent)[:12],16)
    if mode=="reverse": parent_signature=(str(parent_total.numerator),str(parent_rate))
    else: parent_signature=(str(parent_base),str(parent_rate))
    seen=set(); rows=[]; evidence=[]
    for index in range(1,count+1):
        base,rate=_variant_numbers(seed,index); bump=0
        while True:
            total=Fraction(base*(100+rate),100)
            if total.denominator!=1: raise AssertionError("tax price variant must have integer-yen total")
            signature=(str(total.numerator),str(rate)) if mode=="reverse" else (str(base),str(rate))
            if signature!=parent_signature and signature not in seen: break
            bump+=1
            if bump>32: raise AssertionError("tax price bounded distinctness search exhausted")
            base+=100*bump
        seen.add(signature); tax=total-base
        if tax*100!=base*rate: raise AssertionError("tax price independent verification failed")

        if mode=="reverse":
            replacement=f"税込み{total.numerator}円、消費税{rate}%"; new_question=q[:match.start("expr")]+replacement+q[match.end("expr"):]
            answer=f"{base}円"; explanation=f"税込価格は税抜価格の(100+{rate})%なので、{total.numerator}×100/(100+{rate})={base}円。税込価格の再計算でも確認済み。"
            method="tax_exclusive_exact_fraction_and_forward_cross_product"; parent_recalc=f"{parent_total.numerator}×100/(100+{parent_rate})={parent_base}円"; variant_recalc=f"{total.numerator}×100/(100+{rate})={base}円"; independent="base*(100+rate) == total*100 PASS"; reason="tax_exclusive_from_inclusive_yen_exact"
        elif mode=="tax_amount":
            replacement=f"{base}円の商品に消費税{rate}%"; new_question=q[:match.start("expr")]+replacement+q[match.end("expr"):]
            answer=f"{tax.numerator}円"; explanation=f"消費税額は{base}×{rate}/100={tax.numerator}円。税込価格との差でも確認済み。"
            parent_tax=parent_total-parent_base; method="tax_amount_exact_fraction_and_total_difference_cross_check"; parent_recalc=f"{parent_base}×{parent_rate}/100={parent_tax.numerator}円"; variant_recalc=f"{base}×{rate}/100={tax.numerator}円"; independent="(total-base)*100 == base*rate PASS"; reason="tax_amount_yen_exact"
        else:
            replacement=f"{base}円の商品に消費税{rate}%"; new_question=q[:match.start("expr")]+replacement+q[match.end("expr"):]
            answer=f"{total.numerator}円"; explanation=f"税率{rate}%なので、税込価格は{base}×(100+{rate})/100={total.numerator}円。税額の逆算でも確認済み。"
            method="tax_inclusive_exact_fraction_and_tax_cross_product"; parent_recalc=f"{parent_base}×(100+{parent_rate})/100={parent_total.numerator}円"; variant_recalc=f"{base}×(100+{rate})/100={total.numerator}円"; independent="(total-base)*100 == base*rate PASS"; reason="tax_inclusive_yen_exact"
        rows.append({"question":new_question,"answer":answer,"explanation":explanation,"numeric_signature":signature})
        evidence.append({"parent_sha256":_parent_sha(parent),"method":method,"parent_recalculation":parent_recalc,"variant_recalculation":variant_recalc,"independent_check":independent})
    return rows,evidence,reason
