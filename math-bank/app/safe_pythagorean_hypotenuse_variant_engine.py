from __future__ import annotations

"""Fail-closed exact engine for a narrow Pythagorean-hypotenuse parent shape.

Only text-only parents that explicitly give the two perpendicular integer-cm
legs of a right triangle and ask only for the hypotenuse are accepted.  The
parent answer must be an exact integer and satisfy a^2+b^2=c^2 plus both inverse
identities before deterministic Pythagorean-triple variants are emitted.
"""

import hashlib
import json
import math
import re

LEGS_RE = re.compile(r"直角をはさむ2辺(?:の長さ)?(?:が|は)\s*(?P<a>\d+)\s*cm\s*(?:と|、)\s*(?P<b>\d+)\s*cm")
ANSWER_RE = re.compile(r"^(?P<c>\d+)\s*cm$")


def _norm(value: object) -> str:
    return str(value or "").replace("　", " ").replace("ｃｍ", "cm").replace("ＣＭ", "cm")


def _parent_sha(parent: dict) -> str:
    raw = json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _parse_parent(parent: dict):
    if parent.get("figure_refs"):
        return None
    if parent.get("choices"):
        return None
    q = _norm(parent.get("question"))
    if "直角三角形" not in q or "斜辺" not in q:
        return None
    blocked = ("面積", "周", "高さ", "角度", "相似", "証明", "図")
    if any(token in q for token in blocked):
        return None
    matches = list(LEGS_RE.finditer(q))
    if len(matches) != 1:
        return None
    m = matches[0]
    a = int(m.group("a"))
    b = int(m.group("b"))
    if a <= 0 or b <= 0:
        return None
    c2 = a * a + b * b
    c = math.isqrt(c2)
    if c * c != c2:
        return None
    am = ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ", ""))
    if am is None or int(am.group("c")) != c:
        return None
    if c * c - a * a != b * b or c * c - b * b != a * a:
        return None
    return m, a, b, c


def can_generate(parent: dict) -> tuple[bool, str]:
    if _parse_parent(parent) is not None:
        return True, "pythagorean_hypotenuse_integer_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices"):
        return False, "choice_parent"
    return False, "pythagorean_hypotenuse_parent_not_exactly_parsed_and_verified"


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    parsed = _parse_parent(parent)
    if parsed is None:
        ok, reason = can_generate(parent)
        assert not ok
        return [], [], reason

    match, pa, pb, pc = parsed
    q = _norm(parent.get("question"))
    seed = int(_parent_sha(parent)[:12], 16)
    primitive = ((3, 4, 5), (5, 12, 13), (8, 15, 17), (7, 24, 25))
    parent_signature = (str(pa), str(pb))
    seen: set[tuple[str, str]] = set()
    rows: list[dict] = []
    evidence: list[dict] = []

    for index in range(count):
        base = primitive[(seed + index) % len(primitive)]
        scale = 1 + ((seed >> (index * 4 + 3)) % 3)
        a, b, c = (base[0] * scale, base[1] * scale, base[2] * scale)
        signature = (str(a), str(b))
        while signature == parent_signature or signature in seen:
            scale += 1
            a, b, c = (base[0] * scale, base[1] * scale, base[2] * scale)
            signature = (str(a), str(b))
        seen.add(signature)
        if a * a + b * b != c * c:
            raise AssertionError("pythagorean forward identity failed")
        if c * c - a * a != b * b or c * c - b * b != a * a:
            raise AssertionError("pythagorean inverse identities failed")

        replacement = f"直角をはさむ2辺が{a}cmと{b}cm"
        new_question = q[:match.start()] + replacement + q[match.end():]
        rows.append({
            "question": new_question,
            "answer": f"{c}cm",
            "explanation": f"三平方の定理より、斜辺²={a}²+{b}²={c*c}。したがって斜辺は{c}cm。逆算でも2辺を確認済み。",
            "numeric_signature": signature,
        })
        evidence.append({
            "parent_sha256": _parent_sha(parent),
            "method": "pythagorean_hypotenuse_exact_square_sum_and_two_inverse_identities",
            "parent_recalculation": f"{pa}^2+{pb}^2={pc}^2",
            "variant_recalculation": f"{a}^2+{b}^2={c}^2",
            "independent_check": f"{c}^2-{a}^2={b}^2 AND {c}^2-{b}^2={a}^2 PASS",
        })

    return rows, evidence, "pythagorean_hypotenuse_integer_exact"
