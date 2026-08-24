from __future__ import annotations

"""Fail-closed exact engine for simplifying square-root parents."""

import hashlib
import json
import math
import re

from safe_square_root_like_terms_variant_engine import generate as generate_root_like_terms
from safe_square_root_product_variant_engine import generate as generate_root_product
from safe_square_root_quotient_variant_engine import generate as generate_root_quotient

ROOT_RE = re.compile(r"√\s*(?P<n>\d+)")
ANSWER_ROOT_RE = re.compile(r"^(?:(?P<a>\d+))?√(?P<b>\d+)$")
ANSWER_INT_RE = re.compile(r"^\d+$")


def _norm(v: object) -> str:
    return str(v or "").replace("　", " ").replace(" ", "")


def _parent_sha(parent: dict) -> str:
    raw = json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode()
    return hashlib.sha256(raw).hexdigest()


def _square_free(n: int) -> bool:
    if n < 1:
        return False
    p = 2
    while p * p <= n:
        if n % (p * p) == 0:
            return False
        p += 1
    return True


def _simplify(n: int) -> tuple[int, int]:
    if n <= 0:
        raise ValueError("positive radicand required")
    a = 1; b = n; f = 2
    while f * f <= b:
        sq = f * f
        while b % sq == 0:
            a *= f; b //= sq
        f += 1
    if a * a * b != n or not _square_free(b):
        raise AssertionError("square-root factorization identity failed")
    return a, b


def _format(a: int, b: int) -> str:
    if b == 1:
        return str(a)
    return f"{'' if a == 1 else a}√{b}"


def _parse(parent: dict):
    if parent.get("figure_refs") or parent.get("choices"):
        return None
    q = _norm(parent.get("question"))
    if not any(t in q for t in ("簡単", "簡単に", "簡単な形")):
        return None
    if any(t in q for t in ("方程式", "近似", "小数", "有理化", "大小", "計算し", "+", "−", "-", "×", "÷", "/")):
        return None
    matches = list(ROOT_RE.finditer(q))
    if len(matches) != 1:
        return None
    n = int(matches[0].group("n"))
    if n <= 1:
        return None
    a, b = _simplify(n)
    ans = _norm(parent.get("answer")); expected = _format(a, b)
    if ans != expected or a == 1:
        return None
    return matches[0], n, a, b


def can_generate(parent: dict) -> tuple[bool, str]:
    for fn in (generate_root_like_terms, generate_root_product, generate_root_quotient):
        rows, _, reason = fn(parent, 1)
        if rows:
            return True, reason
    if _parse(parent) is not None:
        return True, "single_integer_square_root_exact_simplification"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices"):
        return False, "choice_parent"
    return False, "square_root_parent_not_exactly_parsed_and_verified"


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    for fn in (generate_root_like_terms, generate_root_product, generate_root_quotient):
        rows, evidence, reason = fn(parent, count)
        if rows:
            return rows, evidence, reason
    parsed = _parse(parent)
    if parsed is None:
        ok, reason = can_generate(parent); assert not ok
        return [], [], reason
    match, parent_n, parent_a, parent_b = parsed
    q = _norm(parent.get("question")); seed = int(_parent_sha(parent)[:12], 16)
    square_free_pool = (2, 3, 5, 6, 7, 10, 11, 13, 14, 15)
    seen = {parent_n}; rows = []; evidence = []; i = 0
    while len(rows) < count:
        a = 2 + ((seed >> (i * 3)) + i * 5) % 8
        b = square_free_pool[((seed >> (i * 4 + 2)) + i * 3) % len(square_free_pool)]
        n = a * a * b; i += 1
        if n in seen:
            continue
        seen.add(n); aa, bb = _simplify(n)
        if aa != a or bb != b:
            raise AssertionError("generated simplification mismatch")
        new_q = q[:match.start()] + f"√{n}" + q[match.end():]
        rows.append({"question":new_q,"answer":_format(a,b),"explanation":f"{n}={a}²×{b} なので、√{n}={a}√{b}。","numeric_signature":(str(n),)})
        evidence.append({"parent_sha256":_parent_sha(parent),"method":"square_root_exact_factorization_and_squarefree_identity","parent_recalculation":f"{parent_n}={parent_a}^2*{parent_b}","variant_recalculation":f"{n}={a}^2*{b}","independent_check":"coefficient^2 * squarefree_radicand == original AND radicand square-free PASS"})
    return rows, evidence, "single_integer_square_root_exact_simplification"
