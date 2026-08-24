from __future__ import annotations

"""Fail-closed exact engine for narrow percentage-discount parent shapes.

Supported shapes are intentionally narrow:
1. list price + integer discount percent -> final price;
2. final price + integer discount percent -> original/list price;
3. list price + integer discount percent -> discount amount.

Parent and variants are verified with exact Fraction arithmetic and independent
cross-product identities. Figures, real choices, tax/points/profit, successive
discounts, unknown rates, rounding, or ambiguous contexts fail closed.
"""

import hashlib
import json
import re
from fractions import Fraction

FORWARD_RE = re.compile(r"(?P<expr>(?:定価|価格)\s*(?P<base>\d+)\s*円.*?(?P<pct>\d+)\s*[%％]\s*(?:引き|値引き))")
REVERSE_RE = re.compile(r"(?P<expr>(?P<pct>\d+)\s*[%％]\s*(?:引き|値引き)(?:で|して|にして)?\s*(?P<final>\d+)\s*円)")
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
    blocked=("税込","消費税","税","ポイント","利益","原価","何%","何パーセント","さらに","続けて","2回","二回","増し","値上げ","割合を","四捨五入","切り捨て","切り上げ")
    if any(token in q for token in blocked):
        return None

    reverse_requested=any(token in q for token in ("定価は","定価を求","元の価格","もとの価格","元値"))
    if reverse_requested:
        matches=list(REVERSE_RE.finditer(q))
        if len(matches)!=1: return None
        m=matches[0]; pct=int(m.group("pct")); final=int(m.group("final"))
        if final<=0 or pct<=0 or pct>=100: return None
        base=Fraction(final*100,100-pct)
        if base.denominator!=1 or answer!=base.numerator: return None
        if Fraction(final*100,1)!=base*(100-pct): return None
        return "reverse",m,int(base),pct,final

    amount_requested=any(token in q for token in ("値引き額","割引額","値引額","いくら安く","何円値引"))
    if amount_requested:
        matches=list(FORWARD_RE.finditer(q))
        if len(matches)!=1: return None
        m=matches[0]; base=int(m.group("base")); pct=int(m.group("pct"))
        if base<=0 or pct<=0 or pct>=100: return None
        amount=Fraction(base*pct,100)
        if amount.denominator!=1 or answer!=amount.numerator: return None
        final=Fraction(base,1)-amount
        if amount*100!=base*pct or final*100!=base*(100-pct): return None
        return "amount",m,base,pct,final.numerator

    if not any(token in q for token in ("代金","支払","売値","何円")):
        return None
    matches=list(FORWARD_RE.finditer(q))
    if len(matches)!=1: return None
    m=matches[0]; base=int(m.group("base")); pct=int(m.group("pct"))
    if base<=0 or pct<=0 or pct>=100: return None
    final=Fraction(base*(100-pct),100)
    if final.denominator!=1 or answer!=final.numerator: return None
    if final*100!=base*(100-pct): return None
    return "forward",m,base,pct,final.numerator


def can_generate(parent: dict) -> tuple[bool,str]:
    parsed=_parse_parent(parent)
    if parsed is not None:
        if parsed[0]=="reverse": return True,"discount_original_price_integer_yen_exact"
        if parsed[0]=="amount": return True,"discount_amount_integer_yen_exact"
        return True,"discount_final_price_integer_yen_exact"
    if parent.get("figure_refs"): return False,"figure_parent"
    if parent.get("choices"): return False,"choice_parent"
    return False,"discount_parent_not_exactly_parsed_and_verified"


def _variant_numbers(seed:int,index:int)->tuple[int,int]:
    pct_options=(10,20,25,40,50,60,75)
    pct=pct_options[((seed>>(index*5))+index*3)%len(pct_options)]
    base=500+100*(((seed>>(index*7+2))+index*11)%46)
    return base,pct


def generate(parent:dict,count:int)->tuple[list[dict],list[dict],str]:
    if count not in (1,2,3): raise ValueError("count must be 1, 2, or 3")
    parsed=_parse_parent(parent)
    if parsed is None:
        ok,reason=can_generate(parent); assert not ok
        return [],[],reason
    mode,match,parent_base,parent_pct,parent_final=parsed
    q=_norm(parent.get("question")); seed=int(_parent_sha(parent)[:12],16)
    parent_signature=(str(parent_pct),str(parent_final)) if mode=="reverse" else (str(parent_base),str(parent_pct))
    seen=set(); rows=[]; evidence=[]
    for index in range(1,count+1):
        base,pct=_variant_numbers(seed,index); bump=0
        while True:
            final=Fraction(base*(100-pct),100); amount=Fraction(base*pct,100)
            if final.denominator!=1 or amount.denominator!=1: raise AssertionError("discount variant must resolve to integer yen")
            signature=(str(pct),str(final.numerator)) if mode=="reverse" else (str(base),str(pct))
            if signature!=parent_signature and signature not in seen: break
            bump+=1
            if bump>32: raise AssertionError("discount bounded distinctness search exhausted")
            base+=100*bump
        seen.add(signature)
        if final*100!=base*(100-pct) or amount*100!=base*pct: raise AssertionError("discount independent verification failed")

        if mode=="reverse":
            replacement=f"{pct}%引きで{final.numerator}円"; new_question=q[:match.start("expr")]+replacement+q[match.end("expr"):]
            answer=f"{base}円"; explanation=f"{pct}%引き後は元の価格の{100-pct}%です。{final.numerator}×100/{100-pct}={base}円。割引後価格の再計算でも確認済み。"
            method="discount_original_price_exact_fraction_and_cross_multiply"; parent_recalc=f"{parent_final}×100/{100-parent_pct}={parent_base}円"; variant_recalc=f"{final.numerator}×100/{100-pct}={base}円"; independent="list_price*(100-discount_percent) == final*100 PASS"; reason="discount_original_price_integer_yen_exact"
        elif mode=="amount":
            replacement=f"定価{base}円の商品を{pct}%引き"; new_question=q[:match.start("expr")]+replacement+q[match.end("expr"):]
            answer=f"{amount.numerator}円"; explanation=f"値引き額は定価の{pct}%なので、{base}×{pct}/100={amount.numerator}円。割引後価格との差でも確認済み。"
            parent_amount=parent_base-parent_final; method="discount_amount_exact_fraction_and_final_price_cross_check"; parent_recalc=f"{parent_base}×{parent_pct}/100={parent_amount}円"; variant_recalc=f"{base}×{pct}/100={amount.numerator}円"; independent="discount_amount*100 == list_price*discount_percent PASS"; reason="discount_amount_integer_yen_exact"
        else:
            replacement=f"定価{base}円の商品を{pct}%引き"; new_question=q[:match.start("expr")]+replacement+q[match.end("expr"):]
            answer=f"{final.numerator}円"; explanation=f"{pct}%引きなので支払う割合は{100-pct}%です。{base}×{100-pct}/100={final.numerator}円。逆算でも確認済み。"
            method="discount_final_price_exact_fraction_and_cross_multiply"; parent_recalc=f"{parent_base}×{100-parent_pct}/100={parent_final}円"; variant_recalc=f"{base}×{100-pct}/100={final.numerator}円"; independent="final*100 == list_price*(100-discount_percent) PASS"; reason="discount_final_price_integer_yen_exact"
        rows.append({"question":new_question,"answer":answer,"explanation":explanation,"numeric_signature":signature})
        evidence.append({"parent_sha256":_parent_sha(parent),"method":method,"parent_recalculation":parent_recalc,"variant_recalculation":variant_recalc,"independent_check":independent})
    return rows,evidence,reason
