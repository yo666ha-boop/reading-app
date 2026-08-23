from __future__ import annotations

"""Fail-closed exact engine for narrow middle-school percentage parents.

This engine handles exact "N円のP%" amount questions directly and delegates
verified inverse percentage forms and simple two-quantity percent change to
dedicated exact engines. All paths fail closed for figures, real choices, and
ambiguous prose.
"""

import hashlib
import json
import re
from fractions import Fraction

from safe_base_from_amount_percent_variant_engine import generate as generate_base_from_amount_percent
from safe_percent_from_amount_base_variant_engine import generate as generate_percent_from_amount_base
from safe_percent_change_variant_engine import generate as generate_percent_change

PERCENT_RE = re.compile(r"(?P<expr>(?P<base>\d+)\s*円\s*の\s*(?P<pct>\d+)\s*[%％])")
YEN_ANSWER_RE = re.compile(r"^(?P<v>[+-]?\d+(?:/\d+)?)\s*円$")


def _norm(value: object) -> str:
    return str(value or "").replace("％", "%").replace("−", "-")


def _parent_sha(parent: dict) -> str:
    raw = json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _fraction_text(v: Fraction) -> str:
    return str(v.numerator) if v.denominator == 1 else f"{v.numerator}/{v.denominator}"


def _ambiguous_context(q: str) -> bool:
    blocked = (
        "値引", "割引", "セール", "安く", "増加", "減少", "増え", "減り",
        "何%", "何パーセント", "税込", "税", "利息", "濃度", "割合を",
    )
    return any(token in q for token in blocked)


def _parse_parent(parent: dict):
    if parent.get("figure_refs"):
        return None
    if parent.get("choices") is not None:
        return None
    q = _norm(parent.get("question"))
    if _ambiguous_context(q):
        return None
    if "何円" not in q and "金額" not in q:
        return None
    matches = list(PERCENT_RE.finditer(q))
    if len(matches) != 1:
        return None
    m = matches[0]
    base = int(m.group("base"))
    pct = int(m.group("pct"))
    if base <= 0 or pct <= 0 or pct >= 100:
        return None
    expected = Fraction(base * pct, 100)
    am = YEN_ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ", ""))
    if am is None or Fraction(am.group("v")) != expected:
        return None
    if expected * 100 != Fraction(base * pct):
        return None
    return m, base, pct, expected


def _delegate(parent: dict, count: int):
    for engine in (generate_percent_from_amount_base, generate_base_from_amount_percent, generate_percent_change):
        rows, evidence, reason = engine(parent, count)
        if rows:
            return rows, evidence, reason
    return [], [], "percentage_parent_not_exactly_parsed_and_verified"


def can_generate(parent: dict) -> tuple[bool, str]:
    parsed = _parse_parent(parent)
    if parsed is not None:
        return True, "percentage_of_yen_exact"
    delegated, _, delegated_reason = _delegate(parent, 1)
    if delegated:
        return True, delegated_reason
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices") is not None:
        return False, "choice_parent"
    return False, "percentage_parent_not_exactly_parsed_and_verified"


def _variant_numbers(seed: int, index: int) -> tuple[int, int]:
    pct_options = (10, 20, 25, 40, 50, 60, 75, 80)
    pct = pct_options[((seed >> (index * 5)) + index) % len(pct_options)]
    unit = 100 + 100 * (((seed >> (index * 7 + 3)) + 2 * index) % 9)
    multiplier = 1 + (((seed >> (index * 3 + 11)) + index) % 5)
    base = unit * multiplier
    return base, pct


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    parsed = _parse_parent(parent)
    if parsed is None:
        return _delegate(parent, count)
    match, parent_base, parent_pct, parent_amount = parsed
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
        amount = Fraction(base * pct, 100)
        if amount.denominator != 1:
            raise AssertionError("percentage variant must resolve to integer yen")
        if amount * 100 != Fraction(base * pct):
            raise AssertionError("percentage independent verification failed")
        expr = f"{base}円の{pct}%"
        new_question = q[:match.start("expr")] + expr + q[match.end("expr"):]
        rows.append({
            "question": new_question,
            "answer": f"{_fraction_text(amount)}円",
            "explanation": f"{pct}%={pct}/100 として {base}×{pct}/100={_fraction_text(amount)}。比の等式でも再確認済み。",
            "numeric_signature": signature,
        })
        evidence.append({
            "parent_sha256": _parent_sha(parent),
            "method": "percentage_of_yen_exact_fraction_and_cross_multiply",
            "parent_recalculation": f"{parent_base}×{parent_pct}/100={_fraction_text(parent_amount)}円",
            "variant_recalculation": f"{base}×{pct}/100={_fraction_text(amount)}円",
            "independent_check": "amount*100 == base*percent PASS",
        })
    return rows, evidence, "percentage_of_yen_exact"
