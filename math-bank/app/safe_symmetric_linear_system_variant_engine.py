from __future__ import annotations

"""Fail-closed exact engine for verified two-equation linear systems.

The historical symmetric shape x+y=A / x-y=B keeps priority. Other explicit
ax+by=c / dx+ey=f parents delegate to the general exact system engine. Figures,
real choices, ambiguous or singular systems fail closed.
"""

import hashlib
import json
import re
from fractions import Fraction

from safe_general_linear_system_variant_engine import generate as generate_general_linear_system

EQ1_RE = re.compile(r"[xｘ]\s*\+\s*[yｙ]\s*=\s*(?P<a>[+-]?\d+)")
EQ2_RE = re.compile(r"[xｘ]\s*[-−]\s*[yｙ]\s*=\s*(?P<b>[+-]?\d+)")
ANSWER_RE = re.compile(r"^(?:[xｘ]\s*=\s*)?(?P<x>[+-]?\d+(?:/\d+)?)\s*[,、]\s*(?:[yｙ]\s*=\s*)?(?P<y>[+-]?\d+(?:/\d+)?)$")


def _norm(value: object) -> str:
    return str(value or "").replace("−", "-").replace("　", " ")


def _parent_sha(parent: dict) -> str:
    raw = json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _fmt(v: Fraction) -> str:
    return str(v.numerator) if v.denominator == 1 else f"{v.numerator}/{v.denominator}"


def _parse_parent(parent: dict):
    if parent.get("figure_refs") or parent.get("choices"):
        return None
    q = _norm(parent.get("question"))
    if any(token in q for token in ("グラフ", "文章", "割合", "速さ", "個数", "代金")):
        return None
    m1 = list(EQ1_RE.finditer(q)); m2 = list(EQ2_RE.finditer(q))
    if len(m1) != 1 or len(m2) != 1:
        return None
    a = Fraction(int(m1[0].group("a"))); b = Fraction(int(m2[0].group("b")))
    x = (a + b) / 2; y = (a - b) / 2
    am = ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ", ""))
    if am is None:
        return None
    ax = Fraction(am.group("x")); ay = Fraction(am.group("y"))
    if ax != x or ay != y or x + y != a or x - y != b:
        return None
    return m1[0], m2[0], a, b, x, y


def can_generate(parent: dict) -> tuple[bool, str]:
    if _parse_parent(parent) is not None:
        return True, "symmetric_linear_system_exact"
    rows, _, reason = generate_general_linear_system(parent, 1)
    if rows:
        return True, reason
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices"):
        return False, "choice_parent"
    return False, "linear_system_parent_not_exactly_parsed_and_verified"


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    parsed = _parse_parent(parent)
    if parsed is None:
        rows, evidence, reason = generate_general_linear_system(parent, count)
        if rows:
            return rows, evidence, reason
        ok, reason = can_generate(parent); assert not ok
        return [], [], reason
    m1, m2, a, b, px, py = parsed
    q = _norm(parent.get("question")); seed = int(_parent_sha(parent)[:12], 16)
    parent_sig = (str(int(a)), str(int(b))); seen: set[tuple[str, str]] = set(); rows: list[dict] = []; evidence: list[dict] = []
    for index in range(1, count + 1):
        nx = Fraction(2 + ((seed >> (index * 4)) + index * 3) % 17)
        ny = Fraction(-6 + ((seed >> (index * 6 + 2)) + index * 5) % 19)
        if nx == ny:
            ny += index + 1
        na = nx + ny; nb = nx - ny; signature = (str(int(na)), str(int(nb)))
        bump = 0
        while signature == parent_sig or signature in seen:
            bump += 1; nx += bump; na = nx + ny; nb = nx - ny; signature = (str(int(na)), str(int(nb)))
        seen.add(signature)
        if (na + nb) / 2 != nx or (na - nb) / 2 != ny:
            raise AssertionError("linear system closed-form identity failed")
        if nx + ny != na or nx - ny != nb:
            raise AssertionError("linear system substitution identity failed")
        newq = q
        replacements = [(m1.start("a"), m1.end("a"), str(int(na))), (m2.start("b"), m2.end("b"), str(int(nb)))]
        for start, end, text in sorted(replacements, reverse=True):
            newq = newq[:start] + text + newq[end:]
        rows.append({"question": newq,"answer": f"x={_fmt(nx)}, y={_fmt(ny)}","explanation": f"2式を加えると2x={_fmt(2*nx)}、引くと2y={_fmt(2*ny)}。よってx={_fmt(nx)}, y={_fmt(ny)}。両式への代入でも確認済み。","numeric_signature": signature})
        evidence.append({"parent_sha256": _parent_sha(parent),"method": "symmetric_linear_system_closed_form_and_double_substitution","parent_recalculation": f"x=({int(a)}+{int(b)})/2={_fmt(px)}, y=({int(a)}-{int(b)})/2={_fmt(py)}","variant_recalculation": f"x=({int(na)}+{int(nb)})/2={_fmt(nx)}, y=({int(na)}-{int(nb)})/2={_fmt(ny)}","independent_check": f"x+y={int(na)} AND x-y={int(nb)} PASS"})
    return rows, evidence, "symmetric_linear_system_exact"
