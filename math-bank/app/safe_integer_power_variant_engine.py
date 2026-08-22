from __future__ import annotations

"""Fail-closed exact engine for a narrow integer-power evaluation parent shape.

Only one explicit integer power with exponent 2..5 asking solely for its value is
accepted. Negative bases must be parenthesized. Parent and generated answers are
verified by Python integer exponentiation and independently by repeated integer
multiplication. Variables, products/sums of powers, zero exponents, figures and
real choices fail closed.
"""

import hashlib
import json
import re

EXPR_RE = re.compile(r"(?P<expr>\((?P<neg>-\d+)\)\^(?P<neg_exp>[2-5])|(?P<pos>\d+)\^(?P<pos_exp>[2-5]))")
ANSWER_RE = re.compile(r"^-?\d+$")


def _norm(value: object) -> str:
    return (
        str(value or "")
        .replace("　", " ")
        .replace("²", "^2")
        .replace("³", "^3")
        .replace("⁴", "^4")
        .replace("⁵", "^5")
        .replace("＾", "^")
        .replace(" ", "")
    )


def _parent_sha(parent: dict) -> str:
    raw = json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _repeated_product(base: int, exponent: int) -> int:
    out = 1
    for _ in range(exponent):
        out *= base
    return out


def _parse_parent(parent: dict):
    if parent.get("figure_refs"):
        return None
    if parent.get("choices"):
        return None
    q = _norm(parent.get("question"))
    if not any(token in q for token in ("計算", "値")):
        return None
    blocked = ("文字", "式で", "展開", "因数分解", "平方根", "方程式", "関数", "証明", "面積", "体積")
    if any(token in q for token in blocked):
        return None
    matches = list(EXPR_RE.finditer(q))
    if len(matches) != 1:
        return None
    m = matches[0]
    base = int(m.group("neg") if m.group("neg") is not None else m.group("pos"))
    exponent = int(m.group("neg_exp") if m.group("neg_exp") is not None else m.group("pos_exp"))
    if abs(base) > 30 or exponent < 2 or exponent > 5:
        return None
    # Reject any other arithmetic surface; the parent must be one lone power.
    residue = q[:m.start()] + q[m.end():]
    if re.search(r"[+×*/÷]", residue) or re.search(r"-?\d+", residue):
        return None
    expected = base ** exponent
    am = ANSWER_RE.fullmatch(_norm(parent.get("answer")))
    if am is None or int(am.group(0)) != expected:
        return None
    if _repeated_product(base, exponent) != expected:
        return None
    return m, base, exponent, expected


def can_generate(parent: dict) -> tuple[bool, str]:
    if _parse_parent(parent) is not None:
        return True, "single_integer_power_evaluation_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices"):
        return False, "choice_parent"
    return False, "integer_power_parent_not_exactly_parsed_and_verified"


def _variant_pair(seed: int, index: int) -> tuple[int, int]:
    magnitude = 2 + ((seed >> (index * 5)) + index * 3) % 8
    sign = -1 if ((seed >> (index * 3 + 2)) + index) % 2 else 1
    exponent = 2 + ((seed >> (index * 7 + 1)) + index) % 3
    return sign * magnitude, exponent


def _format_expr(base: int, exponent: int) -> str:
    return f"({base})^{exponent}" if base < 0 else f"{base}^{exponent}"


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    parsed = _parse_parent(parent)
    if parsed is None:
        ok, reason = can_generate(parent)
        assert not ok
        return [], [], reason

    match, parent_base, parent_exponent, parent_value = parsed
    q = _norm(parent.get("question"))
    seed = int(_parent_sha(parent)[:12], 16)
    parent_signature = (str(parent_base), str(parent_exponent))
    seen: set[tuple[str, str]] = set()
    rows: list[dict] = []
    evidence: list[dict] = []

    for index in range(1, count + 1):
        base, exponent = _variant_pair(seed, index)
        signature = (str(base), str(exponent))
        bump = 0
        while signature == parent_signature or signature in seen:
            bump += 1
            magnitude = min(12, abs(base) + bump)
            base = -magnitude if base < 0 else magnitude
            exponent = 2 + ((exponent - 2 + bump) % 3)
            signature = (str(base), str(exponent))
        seen.add(signature)
        value = base ** exponent
        repeated = _repeated_product(base, exponent)
        if repeated != value:
            raise AssertionError("integer power repeated-product identity failed")
        expr = _format_expr(base, exponent)
        new_question = q[:match.start("expr")] + expr + q[match.end("expr"):]
        rows.append({
            "question": new_question,
            "answer": str(value),
            "explanation": f"{expr}は{base}を{exponent}回かけるので{value}。反復乗算でも同じ値になることを確認済み。",
            "numeric_signature": signature,
        })
        evidence.append({
            "parent_sha256": _parent_sha(parent),
            "method": "integer_power_exact_exponentiation_plus_repeated_product",
            "parent_recalculation": f"{_format_expr(parent_base, parent_exponent)}={parent_value}",
            "variant_recalculation": f"{expr}={value}",
            "independent_check": f"repeated_product({base}, {exponent}) == {value} PASS",
        })
    return rows, evidence, "single_integer_power_evaluation_exact"
