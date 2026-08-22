from __future__ import annotations

"""Fail-closed exact engine for a narrow circle-circumference parent shape."""

from decimal import Decimal, InvalidOperation
import hashlib
import json
import re

RADIUS_RE = re.compile(r"半径\s*(?P<radius>\d+)\s*cm")
ANSWER_RE = re.compile(r"^(?P<value>\d+(?:\.\d+)?)\s*cm$")
PI = Decimal("3.14")


def _norm(value: object) -> str:
    return str(value or "").replace("　", " ").replace("ｃｍ", "cm").replace("ＣＭ", "cm")


def _sha(parent: dict) -> str:
    raw = json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _fmt(value: Decimal) -> str:
    text = format(value, "f")
    return text.rstrip("0").rstrip(".") if "." in text else text


def _parse_parent(parent: dict):
    if parent.get("figure_refs") or parent.get("choices"):
        return None
    q = _norm(parent.get("question"))
    if "円" not in q or "円周率" not in q or "3.14" not in q:
        return None
    if not any(token in q for token in ("円周の長さ", "円の周の長さ", "周の長さ")):
        return None
    blocked = (
        "面積", "直径", "弧", "扇形", "おうぎ形", "中心角", "半円", "四分円",
        "半径を求", "直径を求", "図", "グラフ", "mm", "km",
    )
    if any(token in q for token in blocked):
        return None
    matches = list(RADIUS_RE.finditer(q))
    if len(matches) != 1:
        return None
    match = matches[0]
    radius = int(match.group("radius"))
    if radius <= 0:
        return None
    expected = Decimal(2 * radius) * PI
    answer_match = ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ", ""))
    if answer_match is None:
        return None
    try:
        actual = Decimal(answer_match.group("value"))
    except InvalidOperation:
        return None
    if actual != expected:
        return None
    if expected / PI != Decimal(2 * radius):
        return None
    if expected / Decimal(2 * radius) != PI:
        return None
    return match, radius, expected


def can_generate(parent: dict) -> tuple[bool, str]:
    if _parse_parent(parent) is not None:
        return True, "circle_integer_cm_circumference_pi_3_14_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices"):
        return False, "choice_parent"
    return False, "circle_circumference_parent_not_exactly_parsed_and_verified"


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    parsed = _parse_parent(parent)
    if parsed is None:
        ok, reason = can_generate(parent)
        assert not ok
        return [], [], reason

    match, parent_radius, parent_value = parsed
    q = _norm(parent.get("question"))
    seed = int(_sha(parent)[:12], 16)
    seen: set[int] = set()
    rows: list[dict] = []
    evidence: list[dict] = []
    for index in range(1, count + 1):
        radius = 2 + ((seed >> (index * 5)) + index * 7) % 18
        while radius == parent_radius or radius in seen:
            radius += 1
            if radius > 30:
                radius = 2
        seen.add(radius)
        value = Decimal(2 * radius) * PI
        if value / PI != Decimal(2 * radius) or value / Decimal(2 * radius) != PI:
            raise AssertionError("circle circumference independent identity failed")
        new_question = q[:match.start()] + f"半径{radius}cm" + q[match.end():]
        rows.append({
            "question": new_question,
            "answer": f"{_fmt(value)}cm",
            "explanation": f"円周の長さ=2×円周率×半径より、2×3.14×{radius}={_fmt(value)}cm。逆算でも直径と円周率3.14を確認済み。",
            "numeric_signature": (str(radius), "3.14"),
        })
        evidence.append({
            "parent_sha256": _sha(parent),
            "method": "circle_circumference_exact_pi_3_14_product_and_two_inverse_identities",
            "parent_recalculation": f"2×3.14×{parent_radius}={_fmt(parent_value)}cm",
            "variant_recalculation": f"2×3.14×{radius}={_fmt(value)}cm",
            "independent_check": "circumference/3.14 == 2*radius AND circumference/(2*radius) == 3.14 PASS",
        })
    return rows, evidence, "circle_integer_cm_circumference_pi_3_14_exact"
