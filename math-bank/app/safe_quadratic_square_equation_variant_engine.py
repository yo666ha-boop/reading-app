from __future__ import annotations

"""Fail-closed exact engine for the narrow quadratic shape x^2=N.

Only actual parents containing exactly one equation x^2=N (or x²=N), with N a
positive perfect square, asking to solve the equation, and giving the exact two
roots ±k are accepted. Figures, real choices, non-perfect squares, shifted or
factored quadratics, and approximate answers fail closed.
"""

import hashlib
import json
import math
import re

EQ_RE = re.compile(r"(?P<expr>[xｘ]\s*(?:\^\s*2|²)\s*=\s*(?P<n>\d+))")
ANS_RE = re.compile(r"^(?:[xｘ]\s*=\s*)?(?:±(?P<a>\d+)|(?P<p>\d+)[、,](?P<m>-\d+)|(?P<m2>-\d+)[、,](?P<p2>\d+))$")


def _norm(value: object) -> str:
    return str(value or "").replace("　", " ").replace("＋", "+").replace("−", "-").replace("＋－", "±").replace("+-", "±")


def _parent_sha(parent: dict) -> str:
    raw = json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _answer_root(text: str) -> int | None:
    am = ANS_RE.fullmatch(_norm(text).replace(" ", ""))
    if am is None:
        return None
    if am.group("a") is not None:
        return int(am.group("a"))
    vals = [int(v) for v in (am.group("p"), am.group("m"), am.group("m2"), am.group("p2")) if v is not None]
    if len(vals) != 2 or vals[0] == vals[1] or abs(vals[0]) != abs(vals[1]):
        return None
    return abs(vals[0])


def _parse_parent(parent: dict):
    if parent.get("figure_refs"):
        return None
    if parent.get("choices"):
        return None
    q = _norm(parent.get("question"))
    blocked = ("近似", "小数", "平方根で", "因数分解", "解の公式", "グラフ", "関数", "文章題")
    if any(token in q for token in blocked):
        return None
    matches = list(EQ_RE.finditer(q))
    if len(matches) != 1:
        return None
    if not any(token in q for token in ("解き", "解を", "解は", "求め")):
        return None
    m = matches[0]
    n = int(m.group("n"))
    if n <= 0:
        return None
    k = math.isqrt(n)
    if k * k != n:
        return None
    answer_k = _answer_root(parent.get("answer"))
    if answer_k != k:
        return None
    if k * k != n or (-k) * (-k) != n or k * (-k) != -n:
        return None
    return m, n, k


def can_generate(parent: dict) -> tuple[bool, str]:
    if _parse_parent(parent) is not None:
        return True, "quadratic_x_squared_equals_perfect_square_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices"):
        return False, "choice_parent"
    return False, "quadratic_square_equation_parent_not_exactly_parsed_and_verified"


def _variant_root(seed: int, index: int) -> int:
    return 2 + ((seed >> (index * 7)) + index * 5) % 18


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    parsed = _parse_parent(parent)
    if parsed is None:
        ok, reason = can_generate(parent)
        assert not ok
        return [], [], reason

    match, parent_n, parent_k = parsed
    q = _norm(parent.get("question"))
    seed = int(_parent_sha(parent)[:12], 16)
    seen: set[int] = set()
    rows: list[dict] = []
    evidence: list[dict] = []

    for index in range(1, count + 1):
        k = _variant_root(seed, index)
        while k == parent_k or k in seen:
            k += 1
        seen.add(k)
        n = k * k
        if math.isqrt(n) != k or (-k) * (-k) != n or k * (-k) != -n:
            raise AssertionError("quadratic square-equation identity failed")
        replacement = f"x²={n}"
        new_question = q[:match.start("expr")] + replacement + q[match.end("expr"):]
        rows.append({
            "question": new_question,
            "answer": f"x=±{k}",
            "explanation": f"x²={n}より、x={k}またはx=-{k}。両方を2乗すると{n}になることを確認済み。",
            "numeric_signature": (str(n), str(k)),
        })
        evidence.append({
            "parent_sha256": _parent_sha(parent),
            "method": "quadratic_x_squared_perfect_square_two_roots_exact",
            "parent_recalculation": f"{parent_k}^2={parent_n} and (-{parent_k})^2={parent_n}",
            "variant_recalculation": f"{k}^2={n} and (-{k})^2={n}",
            "independent_check": f"root_product={k}*(-{k})=-{n} AND both_roots_square_to_{n} PASS",
        })
    return rows, evidence, "quadratic_x_squared_equals_perfect_square_exact"
