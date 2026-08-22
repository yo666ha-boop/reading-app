from __future__ import annotations

"""Fail-closed exact engine for a narrow greatest-common-divisor parent shape.

Only parents that explicitly present exactly two positive integers with Japanese
"と" and ask solely for their 最大公約数 are accepted. Parent answers are
verified by Euclid's algorithm and independently by exhaustive common-divisor
checking. Figures, real choices, LCM/prime-factorization compound tasks,
three-or-more integer tasks, and ambiguous wording fail closed.
"""

import hashlib
import json
import math
import re

PAIR_RE = re.compile(r"(?<!\d)(?P<a>\d+)\s*と\s*(?P<b>\d+)(?!\d)")
ANSWER_RE = re.compile(r"^\d+$")


def _norm(value: object) -> str:
    return str(value or "").replace("　", " ")


def _parent_sha(parent: dict) -> str:
    raw = json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _divisor_gcd(a: int, b: int) -> int:
    common = [d for d in range(1, min(a, b) + 1) if a % d == 0 and b % d == 0]
    return max(common)


def _parse_parent(parent: dict):
    if parent.get("figure_refs"):
        return None
    if parent.get("choices"):
        return None
    q = _norm(parent.get("question"))
    if "最大公約数" not in q:
        return None
    blocked = ("最小公倍数", "素因数分解", "個数", "すべて", "約数をすべて", "公約数をすべて")
    if any(token in q for token in blocked):
        return None
    if len(re.findall(r"\d+", q)) != 2:
        return None
    matches = list(PAIR_RE.finditer(q))
    if len(matches) != 1:
        return None
    m = matches[0]
    a, b = int(m.group("a")), int(m.group("b"))
    if a <= 1 or b <= 1 or a == b:
        return None
    g = math.gcd(a, b)
    if g <= 1 or _divisor_gcd(a, b) != g:
        return None
    am = ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ", ""))
    if am is None or int(am.group(0)) != g:
        return None
    return m, a, b, g


def can_generate(parent: dict) -> tuple[bool, str]:
    if _parse_parent(parent) is not None:
        return True, "two_positive_integer_gcd_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices"):
        return False, "choice_parent"
    return False, "gcd_parent_not_exactly_parsed_and_verified"


def _variant_pair(seed: int, index: int) -> tuple[int, int]:
    g = 2 + ((seed >> (index * 5)) + index * 3) % 9
    x = 2 + ((seed >> (index * 7 + 2)) + index * 5) % 11
    y = 2 + ((seed >> (index * 9 + 4)) + index * 7) % 13
    while math.gcd(x, y) != 1 or x == y:
        y += 1
    return g * x, g * y


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    parsed = _parse_parent(parent)
    if parsed is None:
        ok, reason = can_generate(parent)
        assert not ok
        return [], [], reason

    match, parent_a, parent_b, parent_g = parsed
    q = _norm(parent.get("question"))
    seed = int(_parent_sha(parent)[:12], 16)
    parent_signature = (str(parent_a), str(parent_b))
    seen: set[tuple[str, str]] = set()
    rows: list[dict] = []
    evidence: list[dict] = []

    for index in range(1, count + 1):
        a, b = _variant_pair(seed, index)
        signature = (str(a), str(b))
        bump = 0
        while signature == parent_signature or signature in seen:
            bump += 1
            a += bump
            g = math.gcd(a, b)
            if g <= 1:
                a += b
            signature = (str(a), str(b))
        seen.add(signature)
        g = math.gcd(a, b)
        exhaustive = _divisor_gcd(a, b)
        if g <= 1 or exhaustive != g:
            raise AssertionError("gcd independent verification failed")
        replacement = f"{a}と{b}"
        new_question = q[:match.start()] + replacement + q[match.end():]
        rows.append({
            "question": new_question,
            "answer": str(g),
            "explanation": f"ユークリッドの互除法で最大公約数は{g}。1から{min(a,b)}までの共通の約数を全確認しても最大は{g}。",
            "numeric_signature": signature,
        })
        evidence.append({
            "parent_sha256": _parent_sha(parent),
            "method": "two_integer_gcd_euclid_and_exhaustive_common_divisors",
            "parent_recalculation": f"gcd({parent_a},{parent_b})={parent_g}",
            "variant_recalculation": f"gcd({a},{b})={g}",
            "independent_check": f"max_common_divisor_exhaustive={exhaustive} == euclid_gcd={g} PASS",
        })
    return rows, evidence, "two_positive_integer_gcd_exact"
