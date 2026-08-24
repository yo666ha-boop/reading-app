from __future__ import annotations

"""Fail-closed exact engine for an affine equation determined by two integer points."""

import hashlib
import json
import re
from fractions import Fraction

POINT_RE = re.compile(r"[（(]\s*(?P<x>[+-]?\d+)\s*[,，、]\s*(?P<y>[+-]?\d+)\s*[)）]")
ANSWER_RE = re.compile(r"^[yｙ]\s*=\s*(?P<a>[+-]?\d*)\s*[xｘ]\s*(?:(?P<sign>[+＋\-−])\s*(?P<b>\d+))?$")


def _norm(value: object) -> str:
    return str(value or "").replace("　", " ").replace("−", "-").replace("＋", "+")


def _sha(parent: dict) -> str:
    raw = json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _coef(text: str | None) -> int:
    t = _norm(text).replace(" ", "")
    if t in ("", "+"):
        return 1
    if t == "-":
        return -1
    return int(t)


def _parse_answer(text: object):
    m = ANSWER_RE.fullmatch(_norm(text).replace(" ", ""))
    if m is None:
        return None
    a = _coef(m.group("a")); b = 0
    if m.group("b") is not None:
        b = int(m.group("b"))
        if _norm(m.group("sign")) == "-":
            b = -b
    if a == 0:
        return None
    return a, b


def _format_formula(a: int, b: int) -> str:
    if a == 1:
        out = "y=x"
    elif a == -1:
        out = "y=-x"
    else:
        out = f"y={a}x"
    if b > 0:
        out += f"+{b}"
    elif b < 0:
        out += str(b)
    return out


def _parse_parent(parent: dict):
    if parent.get("figure_refs") or parent.get("choices"):
        return None
    q = _norm(parent.get("question"))
    blocked = ("グラフ", "図", "表", "交点", "平行", "垂直", "変化の割合", "面積")
    if any(token in q for token in blocked):
        return None
    if not any(token in q for token in ("一次関数", "直線")):
        return None
    if not any(token in q for token in ("式を求", "式は", "式を答", "方程式を求")):
        return None
    points = list(POINT_RE.finditer(q))
    if len(points) != 2:
        return None
    x1, y1 = int(points[0].group("x")), int(points[0].group("y"))
    x2, y2 = int(points[1].group("x")), int(points[1].group("y"))
    if x1 == x2:
        return None
    slope = Fraction(y2 - y1, x2 - x1)
    if slope.denominator != 1 or slope == 0:
        return None
    a = int(slope); b = y1 - a * x1
    parsed_answer = _parse_answer(parent.get("answer"))
    if parsed_answer != (a, b):
        return None
    if a * x1 + b != y1 or a * x2 + b != y2:
        return None
    if Fraction(y2 - y1, x2 - x1) != a or y1 - a * x1 != b:
        return None
    return points, x1, y1, x2, y2, a, b


def can_generate(parent: dict) -> tuple[bool, str]:
    if _parse_parent(parent) is not None:
        return True, "affine_equation_from_two_integer_points_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices"):
        return False, "choice_parent"
    return False, "affine_two_points_parent_not_exactly_parsed_and_verified"


def generate(parent: dict, count: int):
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    parsed = _parse_parent(parent)
    if parsed is None:
        ok, reason = can_generate(parent); assert not ok
        return [], [], reason

    points, px1, py1, px2, py2, pa, pb = parsed
    q = _norm(parent.get("question")); seed = int(_sha(parent)[:12], 16)
    parent_sig = (px1, py1, px2, py2, pa, pb); seen = set(); rows = []; evidence = []
    for index in range(1, count + 1):
        amag = 1 + ((seed >> (index * 5)) + index * 3) % 7
        a = -amag if ((seed >> (index + 23)) & 1) else amag
        b = -8 + ((seed >> (index * 7 + 1)) + index * 5) % 17
        x1 = -5 + ((seed >> (index * 9 + 2)) + index * 7) % 11
        dx = 1 + ((seed >> (index * 11 + 4)) + index * 3) % 6
        x2 = x1 + dx
        y1 = a * x1 + b; y2 = a * x2 + b
        signature = (x1, y1, x2, y2, a, b)
        bump = 0
        while signature == parent_sig or signature in seen:
            bump += 1; x1 -= 1; x2 += 1; b += 1; y1 = a * x1 + b; y2 = a * x2 + b
            signature = (x1, y1, x2, y2, a, b)
        seen.add(signature)
        slope = Fraction(y2 - y1, x2 - x1); intercept = y1 - int(slope) * x1 if slope.denominator == 1 else None
        if slope != a or intercept != b or a * x1 + b != y1 or a * x2 + b != y2:
            raise AssertionError("affine two-point identity failed")
        replacements = [
            (points[0].start(), points[0].end(), f"({x1},{y1})"),
            (points[1].start(), points[1].end(), f"({x2},{y2})"),
        ]
        nq = q
        for start, end, value in sorted(replacements, reverse=True):
            nq = nq[:start] + value + nq[end:]
        formula = _format_formula(a, b)
        rows.append({
            "question": nq,
            "answer": formula,
            "explanation": f"傾き=({y2}-({y1}))/({x2}-({x1}))={a}。切片={y1}-{a}×({x1})={b} より {formula}。両点を代入して一致。",
            "numeric_signature": tuple(map(str, signature)),
        })
        evidence.append({
            "parent_sha256": _sha(parent),
            "method": "affine_two_integer_points_exact_slope_intercept_and_forward_substitution",
            "parent_recalculation": f"a=({py2}-({py1}))/({px2}-({px1}))={pa}; b={py1}-{pa}*({px1})={pb}",
            "variant_recalculation": f"a=({y2}-({y1}))/({x2}-({x1}))={a}; b={y1}-{a}*({x1})={b}",
            "independent_check": f"a*x1+b={y1} AND a*x2+b={y2} PASS",
        })
    return rows, evidence, "affine_equation_from_two_integer_points_exact"
