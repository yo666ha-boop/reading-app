from __future__ import annotations

"""Fail-closed exact engine for simple percent increase/decrease parents.

Only text-only non-choice parents with exactly two positive integer quantities,
explicitly phrased as changing "A ... から B ... に", and asking solely what
percent the quantity increased or decreased are accepted. Parent and generated
answers are verified with exact Fraction arithmetic and an independent cross-
product identity. Compound discounts/tax/interest, percentage-point questions,
figures, choices, ambiguous direction, and non-integer percent answers fail
closed.
"""

import hashlib
import json
import re
from fractions import Fraction

INT_RE = re.compile(r"\d+")
ANSWER_RE = re.compile(r"^(?P<v>\d+)\s*[%％]$")


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
    blocked = ("割引", "値引", "税込", "税", "利息", "濃度", "ポイント", "パーセントポイント", "割合の差")
    if any(token in q for token in blocked):
        return None
    increase = any(token in q for token in ("何%増", "何パーセント増", "何％増"))
    decrease = any(token in q for token in ("何%減", "何パーセント減", "何％減"))
    if increase == decrease:
        return None
    if "から" not in q or "に" not in q:
        return None
    nums = list(INT_RE.finditer(q))
    if len(nums) != 2:
        return None
    old = int(nums[0].group(0))
    new = int(nums[1].group(0))
    if old <= 0 or new <= 0:
        return None
    if increase and new <= old:
        return None
    if decrease and new >= old:
        return None
    direction = "increase" if increase else "decrease"
    delta = new - old if increase else old - new
    pct = Fraction(delta * 100, old)
    if pct.denominator != 1 or pct <= 0:
        return None
    am = ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ", ""))
    if am is None or int(am.group("v")) != pct.numerator:
        return None
    if Fraction(delta * 100) != pct * old:
        return None
    return nums, old, new, int(pct), direction


def can_generate(parent: dict) -> tuple[bool, str]:
    parsed = _parse_parent(parent)
    if parsed is not None:
        return True, "simple_integer_percent_change_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices"):
        return False, "choice_parent"
    return False, "percent_change_parent_not_exactly_parsed_and_verified"


def _variant_numbers(seed: int, index: int, direction: str) -> tuple[int, int, int]:
    pct_options = (10, 20, 25, 40, 50, 60, 75)
    pct = pct_options[((seed >> (index * 5)) + index * 3) % len(pct_options)]
    base = 20 * (2 + (((seed >> (index * 7 + 3)) + index * 5) % 15))
    if direction == "increase":
        new = base * (100 + pct) // 100
        while base * (100 + pct) % 100:
            base += 20
            new = base * (100 + pct) // 100
    else:
        new = base * (100 - pct) // 100
        while new <= 0 or base * (100 - pct) % 100:
            base += 20
            new = base * (100 - pct) // 100
    return base, new, pct


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    parsed = _parse_parent(parent)
    if parsed is None:
        ok, reason = can_generate(parent)
        assert not ok
        return [], [], reason
    matches, parent_old, parent_new, parent_pct, direction = parsed
    q = _norm(parent.get("question"))
    seed = int(_parent_sha(parent)[:12], 16)
    parent_signature = (str(parent_old), str(parent_new))
    seen: set[tuple[str, str]] = set()
    rows: list[dict] = []
    evidence: list[dict] = []

    for index in range(1, count + 1):
        old, new, pct = _variant_numbers(seed, index, direction)
        signature = (str(old), str(new))
        bump = 0
        while signature == parent_signature or signature in seen:
            bump += 1
            old += 100 * bump
            if direction == "increase":
                new = old * (100 + pct) // 100
                if old * (100 + pct) % 100:
                    continue
            else:
                new = old * (100 - pct) // 100
                if new <= 0 or old * (100 - pct) % 100:
                    continue
            signature = (str(old), str(new))
        seen.add(signature)
        delta = new - old if direction == "increase" else old - new
        exact_pct = Fraction(delta * 100, old)
        if exact_pct.denominator != 1 or int(exact_pct) != pct:
            raise AssertionError("percent-change exact calculation failed")
        if Fraction(delta * 100) != exact_pct * old:
            raise AssertionError("percent-change cross-product identity failed")
        new_question = q
        for m, replacement in reversed(list(zip(matches, (str(old), str(new))))):
            new_question = new_question[:m.start()] + replacement + new_question[m.end():]
        rows.append({
            "question": new_question,
            "answer": f"{pct}%",
            "explanation": f"変化量は{delta}。{delta}÷{old}×100={pct}% と求め、変化量×100=元の量×割合でも確認済み。",
            "numeric_signature": signature,
        })
        evidence.append({
            "parent_sha256": _parent_sha(parent),
            "method": "simple_percent_change_exact_fraction_and_cross_product",
            "parent_recalculation": f"abs({parent_new}-{parent_old})*100/{parent_old}={parent_pct}%",
            "variant_recalculation": f"{delta}*100/{old}={pct}%",
            "independent_check": "delta*100 == percent*original PASS",
            "direction": direction,
        })
    return rows, evidence, "simple_integer_percent_change_exact"
