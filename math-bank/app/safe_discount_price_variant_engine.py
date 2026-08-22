from __future__ import annotations

"""Fail-closed exact engine for a narrow percentage-discount parent shape.

Accepted parents explicitly state one positive integer list price in yen and one
integer percent discount, ask only for the final price/payment, and have an
exact integer-yen answer. Parent and variants are verified with exact Fraction
arithmetic and the independent identity final*100 = list_price*(100-discount).
Figures, real choices, tax/points/profit, successive discounts, unknown-rate,
and ambiguous contexts fail closed.
"""

import hashlib
import json
import re
from fractions import Fraction

DISCOUNT_RE = re.compile(
    r"(?P<expr>(?:定価|価格)\s*(?P<base>\d+)\s*円.*?(?P<pct>\d+)\s*[%％]\s*(?:引き|値引き))"
)
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
    if not any(token in q for token in ("代金", "支払", "売値", "何円")):
        return None
    blocked = (
        "税込", "消費税", "税", "ポイント", "利益", "原価", "何%", "何パーセント",
        "さらに", "続けて", "2回", "二回", "増し", "値上げ", "割合を",
    )
    if any(token in q for token in blocked):
        return None
    matches = list(DISCOUNT_RE.finditer(q))
    if len(matches) != 1:
        return None
    m = matches[0]
    base = int(m.group("base"))
    pct = int(m.group("pct"))
    if base <= 0 or pct <= 0 or pct >= 100:
        return None
    expected = Fraction(base * (100 - pct), 100)
    if expected.denominator != 1:
        return None
    am = ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ", ""))
    if am is None or int(am.group("v")) != expected.numerator:
        return None
    if expected * 100 != base * (100 - pct):
        return None
    return m, base, pct, expected.numerator


def can_generate(parent: dict) -> tuple[bool, str]:
    if _parse_parent(parent) is not None:
        return True, "discount_final_price_integer_yen_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices"):
        return False, "choice_parent"
    return False, "discount_parent_not_exactly_parsed_and_verified"


def _variant_numbers(seed: int, index: int) -> tuple[int, int]:
    pct_options = (10, 20, 25, 40, 50, 60, 75)
    pct = pct_options[((seed >> (index * 5)) + index * 3) % len(pct_options)]
    base = 500 + 100 * (((seed >> (index * 7 + 2)) + index * 11) % 46)
    return base, pct


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    parsed = _parse_parent(parent)
    if parsed is None:
        ok, reason = can_generate(parent)
        assert not ok
        return [], [], reason

    match, parent_base, parent_pct, parent_final = parsed
    q = _norm(parent.get("question"))
    seed = int(_parent_sha(parent)[:12], 16)
    parent_signature = (str(parent_base), str(parent_pct))
    seen: set[tuple[str, str]] = set()
    rows: list[dict] = []
    evidence: list[dict] = []

    for index in range(1, count + 1):
        base, pct = _variant_numbers(seed, index)
        signature = (str(base), str(pct))
        bump = 0
        while signature == parent_signature or signature in seen:
            bump += 1
            base += 100 * bump
            signature = (str(base), str(pct))
        seen.add(signature)
        final = Fraction(base * (100 - pct), 100)
        if final.denominator != 1:
            raise AssertionError("discount variant must resolve to integer yen")
        if final * 100 != base * (100 - pct):
            raise AssertionError("discount independent verification failed")
        replacement = f"定価{base}円の商品を{pct}%引き"
        new_question = q[:match.start("expr")] + replacement + q[match.end("expr"):]
        rows.append({
            "question": new_question,
            "answer": f"{final.numerator}円",
            "explanation": f"{pct}%引きなので支払う割合は{100-pct}%です。{base}×{100-pct}/100={final.numerator}円。逆算でも確認済み。",
            "numeric_signature": signature,
        })
        evidence.append({
            "parent_sha256": _parent_sha(parent),
            "method": "discount_final_price_exact_fraction_and_cross_multiply",
            "parent_recalculation": f"{parent_base}×{100-parent_pct}/100={parent_final}円",
            "variant_recalculation": f"{base}×{100-pct}/100={final.numerator}円",
            "independent_check": "final*100 == list_price*(100-discount_percent) PASS",
        })
    return rows, evidence, "discount_final_price_integer_yen_exact"
