from __future__ import annotations

"""Fail-closed exact engine for a narrow tax-inclusive price parent shape.

Only actual parents with one positive integer pre-tax yen amount, one explicit
integer tax rate, and a request for the tax-inclusive total are accepted. The
stated answer is verified exactly by base*(100+rate)/100 and independently by
(total-base)*100 == base*rate. Figure/choice parents, discounts, reverse-tax,
multiple rates, rounding, points, fees, or ambiguous prose fail closed.
"""

import hashlib
import json
import re
from fractions import Fraction

PAIR_RE = re.compile(r"(?P<expr>(?P<base>\d+)\s*円.*?(?:消費税|税率)\s*(?P<rate>\d+)\s*[%％])")
ANSWER_RE = re.compile(r"^(?P<v>\d+)\s*円$")


def _norm(value: object) -> str:
    return str(value or "").replace("％", "%").replace("　", " ")


def _parent_sha(parent: dict) -> str:
    raw = json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _parse_parent(parent: dict):
    if parent.get("figure_refs"):
        return None
    if parent.get("choices"):
        return None
    q = _norm(parent.get("question"))
    required = ("税込", "税込み", "税を加え", "税金を加え", "消費税を加え")
    if not any(token in q for token in required):
        return None
    blocked = ("値引", "割引", "セール", "ポイント", "手数料", "送料", "税抜", "税抜き", "税率を求", "何%", "四捨五入", "切り捨て", "切り上げ")
    if any(token in q for token in blocked):
        return None
    matches = list(PAIR_RE.finditer(q))
    if len(matches) != 1:
        return None
    m = matches[0]
    base = int(m.group("base")); rate = int(m.group("rate"))
    if base <= 0 or rate <= 0 or rate >= 100:
        return None
    total = Fraction(base * (100 + rate), 100)
    if total.denominator != 1:
        return None
    am = ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ", ""))
    if am is None or int(am.group("v")) != total.numerator:
        return None
    tax = total - base
    if tax * 100 != base * rate:
        return None
    return m, base, rate, total


def can_generate(parent: dict) -> tuple[bool, str]:
    if _parse_parent(parent) is not None:
        return True, "tax_inclusive_yen_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices"):
        return False, "choice_parent"
    return False, "tax_inclusive_parent_not_exactly_parsed_and_verified"


def _variant_numbers(seed: int, index: int) -> tuple[int, int]:
    rates = (5, 8, 10)
    rate = rates[((seed >> (index * 5)) + index) % len(rates)]
    # Multiples of 100 guarantee an integer-yen total for all supported rates.
    base = 500 + 100 * (((seed >> (index * 7 + 3)) + index * 11) % 46)
    return base, rate


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    parsed = _parse_parent(parent)
    if parsed is None:
        ok, reason = can_generate(parent); assert not ok
        return [], [], reason
    match, parent_base, parent_rate, parent_total = parsed
    q = _norm(parent.get("question")); seed = int(_parent_sha(parent)[:12], 16)
    parent_signature = (str(parent_base), str(parent_rate)); seen = set(); rows=[]; evidence=[]
    for index in range(1, count + 1):
        base, rate = _variant_numbers(seed, index); signature=(str(base), str(rate)); bump=0
        while signature == parent_signature or signature in seen:
            bump += 1; base += 100 * bump; signature=(str(base), str(rate))
        seen.add(signature)
        total = Fraction(base * (100 + rate), 100)
        if total.denominator != 1 or (total-base)*100 != base*rate:
            raise AssertionError("tax-inclusive independent verification failed")
        replacement = f"{base}円の商品に消費税{rate}%"
        new_question = q[:match.start("expr")] + replacement + q[match.end("expr"):]
        rows.append({"question":new_question,"answer":f"{total.numerator}円","explanation":f"税率{rate}%なので、税込価格は{base}×(100+{rate})/100={total.numerator}円。税額の逆算でも確認済み。","numeric_signature":signature})
        evidence.append({"parent_sha256":_parent_sha(parent),"method":"tax_inclusive_exact_fraction_and_tax_cross_product","parent_recalculation":f"{parent_base}×(100+{parent_rate})/100={parent_total.numerator}円","variant_recalculation":f"{base}×(100+{rate})/100={total.numerator}円","independent_check":"(total-base)*100 == base*rate PASS"})
    return rows, evidence, "tax_inclusive_yen_exact"
