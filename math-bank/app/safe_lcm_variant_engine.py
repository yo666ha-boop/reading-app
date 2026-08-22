from __future__ import annotations

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


def _formula_lcm(a: int, b: int) -> int:
    return a // math.gcd(a, b) * b


def _enumerated_lcm(a: int, b: int) -> int:
    limit = _formula_lcm(a, b)
    multiples = [m for m in range(max(a, b), limit + 1) if m % a == 0 and m % b == 0]
    return min(multiples)


def _parse_parent(parent: dict):
    if parent.get("figure_refs"):
        return None
    if parent.get("choices"):
        return None
    q = _norm(parent.get("question"))
    if "最小公倍数" not in q:
        return None
    blocked = ("最大公約数", "素因数分解", "個数", "すべて", "公倍数をすべて")
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
    l = _formula_lcm(a, b)
    if _enumerated_lcm(a, b) != l:
        return None
    am = ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ", ""))
    if am is None or int(am.group(0)) != l:
        return None
    return m, a, b, l


def can_generate(parent: dict) -> tuple[bool, str]:
    if _parse_parent(parent) is not None:
        return True, "two_positive_integer_lcm_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices"):
        return False, "choice_parent"
    return False, "lcm_parent_not_exactly_parsed_and_verified"


def _variant_pair(seed: int, index: int) -> tuple[int, int]:
    g = 2 + ((seed >> (index * 4)) + index * 3) % 6
    x = 2 + ((seed >> (index * 6 + 2)) + index * 5) % 9
    y = 2 + ((seed >> (index * 8 + 3)) + index * 7) % 11
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

    match, parent_a, parent_b, parent_l = parsed
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
            a += b + bump
            signature = (str(a), str(b))
        seen.add(signature)
        l = _formula_lcm(a, b)
        enumerated = _enumerated_lcm(a, b)
        if enumerated != l:
            raise AssertionError("lcm independent verification failed")
        new_question = q[:match.start()] + f"{a}と{b}" + q[match.end():]
        rows.append({"question": new_question, "answer": str(l), "explanation": f"lcm=a×b/gcd(a,b)で{l}。両方の倍数を小さい順に確認して最初の共通倍数も{l}。", "numeric_signature": signature})
        evidence.append({"parent_sha256": _parent_sha(parent), "method": "two_integer_lcm_product_over_gcd_and_enumerated_common_multiples", "parent_recalculation": f"lcm({parent_a},{parent_b})={parent_l}", "variant_recalculation": f"lcm({a},{b})={l}", "independent_check": f"first_enumerated_common_multiple={enumerated} == formula_lcm={l} PASS"})
    return rows, evidence, "two_positive_integer_lcm_exact"
