from __future__ import annotations

"""Fail-closed exact engine for a narrow affine-function parent shape.

This module never invents a variant from an unseen parent.  It accepts an actual
parent record, proves the parent's stated answer by exact rational arithmetic,
and only then returns deterministic numeric substitutions.  Figure and choice
parents are rejected.  The caller is still responsible for the repository's
strict expanded-layer validator/provenance promotion gates.
"""

import hashlib
import json
import re
from fractions import Fraction


NUM = r"[+-]?\d+(?:/\d+)?"
AFFINE_RE = re.compile(
    rf"(?P<formula>[yｙ]\s*=\s*(?P<a>{NUM})?\s*[xｘ]\s*(?:(?P<sign>[+＋\-−])\s*(?P<b>\d+(?:/\d+)?))?)"
)
X_VALUE_RE = re.compile(rf"[xｘ]\s*=\s*(?P<x>{NUM})")
Y_ANSWER_RE = re.compile(rf"^(?:[yｙ]\s*=\s*)?(?P<y>{NUM})$")


def _norm(text: object) -> str:
    return str(text or "").replace("−", "-").replace("＋", "+")


def _fraction(text: str) -> Fraction:
    return Fraction(_norm(text).replace(" ", ""))


def _fraction_text(value: Fraction) -> str:
    return str(value.numerator) if value.denominator == 1 else f"{value.numerator}/{value.denominator}"


def _parent_sha(parent: dict) -> str:
    raw = json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _parse_parent(parent: dict) -> tuple[re.Match[str], re.Match[str], Fraction, Fraction, Fraction, Fraction] | tuple[None, None, None, None, None, None]:
    if parent.get("figure_refs"):
        return (None, None, None, None, None, None)
    if parent.get("choices") is not None:
        return (None, None, None, None, None, None)

    q = _norm(parent.get("question"))
    fm = list(AFFINE_RE.finditer(q))
    xm = list(X_VALUE_RE.finditer(q))
    if len(fm) != 1 or len(xm) != 1:
        return (None, None, None, None, None, None)

    formula = fm[0]
    xmatch = xm[0]
    a_text = formula.group("a")
    a = Fraction(1) if a_text in (None, "", "+") else _fraction(a_text)
    b = Fraction(0)
    if formula.group("b"):
        b = _fraction(formula.group("b"))
        if _norm(formula.group("sign")) == "-":
            b = -b
    x = _fraction(xmatch.group("x"))
    y = a * x + b

    answer = _norm(parent.get("answer")).replace(" ", "")
    am = Y_ANSWER_RE.fullmatch(answer)
    if am is None or _fraction(am.group("y")) != y:
        return (None, None, None, None, None, None)
    # Independent identity check separate from the direct forward expression.
    if a == 0 or (y - b) / a != x:
        return (None, None, None, None, None, None)
    return formula, xmatch, a, b, x, y


def can_generate(parent: dict) -> tuple[bool, str]:
    parsed = _parse_parent(parent)
    if parsed[0] is None:
        if parent.get("figure_refs"):
            return False, "figure_parent"
        if parent.get("choices") is not None:
            return False, "choice_parent"
        return False, "affine_parent_not_exactly_parsed_and_verified"
    return True, "affine_function_exact"


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    parsed = _parse_parent(parent)
    formula, xmatch, a, b, x, parent_y = parsed
    if formula is None or xmatch is None:
        ok, reason = can_generate(parent)
        assert not ok
        return [], [], reason

    q = _norm(parent.get("question"))
    seed = int(_parent_sha(parent)[:12], 16)
    rows: list[dict] = []
    evidence: list[dict] = []
    numeric_signatures: set[tuple[str, str, str]] = set()
    parent_signature = (_fraction_text(a), _fraction_text(b), _fraction_text(x))

    for index in range(1, count + 1):
        # Deterministic, modest coefficients/input values; never reuse the
        # parent's numeric triple or a sibling triple.
        na = Fraction((abs(a.numerator) + 1 + index) * (-1 if ((seed >> index) & 1) else 1), max(1, a.denominator))
        nb = b + Fraction(2 + index + ((seed >> (index + 5)) & 3))
        nx = x + Fraction(1 + index + ((seed >> (index + 11)) & 3))
        if na == 0:
            na = Fraction(index + 1)
        signature = (_fraction_text(na), _fraction_text(nb), _fraction_text(nx))
        if signature == parent_signature or signature in numeric_signatures:
            nx += index + 1
            signature = (_fraction_text(na), _fraction_text(nb), _fraction_text(nx))
        if signature == parent_signature or signature in numeric_signatures:
            raise AssertionError("affine numeric signature collision")
        numeric_signatures.add(signature)

        ny = na * nx + nb
        if (ny - nb) / na != nx:
            raise AssertionError("affine inverse identity failed")

        a_text = _fraction_text(na)
        if na == 1:
            lhs = "y=x"
        elif na == -1:
            lhs = "y=-x"
        else:
            lhs = f"y={a_text}x"
        if nb > 0:
            lhs += f"+{_fraction_text(nb)}"
        elif nb < 0:
            lhs += _fraction_text(nb)

        # Replace from the end so original match offsets remain valid.
        new_question = q
        replacements = [
            (formula.start("formula"), formula.end("formula"), lhs),
            (xmatch.start("x"), xmatch.end("x"), _fraction_text(nx)),
        ]
        for start, end, value in sorted(replacements, reverse=True):
            new_question = new_question[:start] + value + new_question[end:]

        rows.append({
            "question": new_question,
            "answer": f"y={_fraction_text(ny)}",
            "explanation": f"x={_fraction_text(nx)} を {lhs} に代入すると y={_fraction_text(ny)}。逆算でも x={_fraction_text(nx)} を確認。",
            "numeric_signature": signature,
        })
        evidence.append({
            "parent_sha256": _parent_sha(parent),
            "method": "affine_function_exact_rational_substitution",
            "parent_recalculation": f"y={_fraction_text(a)}*{_fraction_text(x)}+({_fraction_text(b)})={_fraction_text(parent_y)}",
            "variant_recalculation": f"y={_fraction_text(na)}*{_fraction_text(nx)}+({_fraction_text(nb)})={_fraction_text(ny)}",
            "independent_check": f"(y-b)/a=({_fraction_text(ny)}-{_fraction_text(nb)})/{_fraction_text(na)}={_fraction_text(nx)} PASS",
        })

    return rows, evidence, "affine_function_exact"
