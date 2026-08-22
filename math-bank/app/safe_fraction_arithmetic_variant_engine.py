from __future__ import annotations

"""Fail-closed exact engine for one binary fraction-arithmetic expression.

Only a single explicit positive rational a/b OP c/d expression is accepted,
with OP in +, -, ×, *, ÷, /. The parent answer is recalculated with Fraction
and independently checked through the inverse operation. Mixed numbers,
decimals, equations, extra numeric surfaces, figures and real choices fail
closed. Generated answers are always reduced exact rationals.
"""

import hashlib
import json
import re
from fractions import Fraction

FRAC = r"(?P<{name}n>\d+)\s*/\s*(?P<{name}d>\d+)"
EXPR_RE = re.compile(
    rf"(?P<expr>{FRAC.format(name='a')}\s*(?P<op>[+＋\-−×*÷])\s*{FRAC.format(name='b')})"
)
ANSWER_RE = re.compile(r"^(?P<n>-?\d+)(?:/(?P<d>\d+))?$")


def _norm(value: object) -> str:
    return str(value or "").replace("　", " ").replace("＋", "+").replace("−", "-")


def _parent_sha(parent: dict) -> str:
    raw = json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _parse_answer(value: object) -> Fraction | None:
    s = _norm(value).replace(" ", "")
    m = ANSWER_RE.fullmatch(s)
    if not m:
        return None
    d = int(m.group("d") or "1")
    if d == 0:
        return None
    return Fraction(int(m.group("n")), d)


def _eval(a: Fraction, op: str, b: Fraction) -> Fraction:
    if op == "+":
        return a + b
    if op == "-":
        return a - b
    if op in ("×", "*"):
        return a * b
    if op == "÷":
        if b == 0:
            raise ZeroDivisionError("division by zero")
        return a / b
    raise ValueError(op)


def _inverse_check(a: Fraction, op: str, b: Fraction, result: Fraction) -> bool:
    if op == "+":
        return result - b == a
    if op == "-":
        return result + b == a
    if op in ("×", "*"):
        return b != 0 and result / b == a
    if op == "÷":
        return result * b == a
    return False


def _text(v: Fraction) -> str:
    return str(v.numerator) if v.denominator == 1 else f"{v.numerator}/{v.denominator}"


def _parse_parent(parent: dict):
    if parent.get("figure_refs"):
        return None
    if parent.get("choices"):
        return None
    q = _norm(parent.get("question"))
    blocked = ("小数", "帯分数", "方程式", "文字式", "比", "割合", "確率", "関数")
    if any(token in q for token in blocked):
        return None
    matches = list(EXPR_RE.finditer(q))
    if len(matches) != 1:
        return None
    m = matches[0]
    outside = q[:m.start("expr")] + q[m.end("expr"):]
    if re.search(r"\d|[/×÷*+\-]", outside):
        return None
    an, ad, bn, bd = (int(m.group(k)) for k in ("an", "ad", "bn", "bd"))
    if min(an, ad, bn, bd) <= 0:
        return None
    # Keep this engine intentionally narrow: explicit non-integer fractions only.
    a = Fraction(an, ad)
    b = Fraction(bn, bd)
    if a.denominator == 1 or b.denominator == 1:
        return None
    op = m.group("op")
    if op == "*":
        display_op = "×"
    else:
        display_op = op
    try:
        result = _eval(a, display_op, b)
    except Exception:
        return None
    answer = _parse_answer(parent.get("answer"))
    if answer is None or answer != result:
        return None
    if not _inverse_check(a, display_op, b, result):
        return None
    return m, a, b, display_op, result


def can_generate(parent: dict) -> tuple[bool, str]:
    if _parse_parent(parent) is not None:
        return True, "binary_fraction_arithmetic_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices"):
        return False, "choice_parent"
    return False, "fraction_arithmetic_parent_not_exactly_parsed_and_verified"


def _candidate(seed: int, index: int, op: str) -> tuple[Fraction, Fraction]:
    d1 = 3 + ((seed >> (index * 4)) % 7)
    d2 = 4 + ((seed >> (index * 6 + 5)) % 7)
    n1 = 1 + ((seed >> (index * 5 + 11)) % (d1 - 1))
    n2 = 1 + ((seed >> (index * 7 + 17)) % (d2 - 1))
    a = Fraction(n1, d1)
    b = Fraction(n2, d2)
    if op == "-" and a <= b:
        a, b = b, a
    if a.denominator == 1:
        a = Fraction(1, d1)
    if b.denominator == 1:
        b = Fraction(1, d2)
    return a, b


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    parsed = _parse_parent(parent)
    if parsed is None:
        ok, reason = can_generate(parent)
        assert not ok
        return [], [], reason

    match, pa, pb, op, presult = parsed
    q = _norm(parent.get("question"))
    seed = int(_parent_sha(parent)[:12], 16)
    parent_sig = (pa.numerator, pa.denominator, pb.numerator, pb.denominator)
    seen: set[tuple[int, int, int, int]] = set()
    rows: list[dict] = []
    evidence: list[dict] = []

    for index in range(1, count + 1):
        a, b = _candidate(seed, index, op)
        bump = 0
        sig = (a.numerator, a.denominator, b.numerator, b.denominator)
        while sig == parent_sig or sig in seen or a.denominator == 1 or b.denominator == 1:
            bump += 1
            a = Fraction(a.numerator + bump, a.denominator + bump + 1)
            b = Fraction(b.numerator + 1, b.denominator + bump + 2)
            if op == "-" and a <= b:
                a, b = b, a
            sig = (a.numerator, a.denominator, b.numerator, b.denominator)
        seen.add(sig)
        result = _eval(a, op, b)
        if not _inverse_check(a, op, b, result):
            raise AssertionError("fraction arithmetic inverse identity failed")
        expr = f"{_text(a)}{op}{_text(b)}"
        new_question = q[:match.start("expr")] + expr + q[match.end("expr"):]
        rows.append({
            "question": new_question,
            "answer": _text(result),
            "explanation": f"分数を正確に計算すると{expr}={_text(result)}。逆算でも一致することを確認済み。",
            "numeric_signature": tuple(str(x) for x in sig),
        })
        evidence.append({
            "parent_sha256": _parent_sha(parent),
            "method": "fraction_exact_forward_and_inverse_operation_identity",
            "parent_recalculation": f"{_text(pa)}{op}{_text(pb)}={_text(presult)}",
            "variant_recalculation": f"{expr}={_text(result)}",
            "independent_check": "inverse operation reconstructs left operand PASS",
        })
    return rows, evidence, "binary_fraction_arithmetic_exact"
