from __future__ import annotations

"""Fail-closed exact engine for circle radius from area with pi=3.14.

Accepted parents must be text-only, non-choice problems that explicitly give a
circle area in cm^2, state pi=3.14, and ask only for the radius. The supplied
area must divide by 3.14 to an exact positive integer square, and the verified
answer must be that integer radius in cm. Generated variants use the same exact
contract and are independently checked by recomposition area=3.14*r^2.
"""

from decimal import Decimal, InvalidOperation
import hashlib
import json
import re

AREA_RE = re.compile(r"(?:面積(?:が|は)?\s*)(?P<area>\d+(?:\.\d+)?)\s*(?:cm²|cm\^2|cm2|㎠)")
ANSWER_RE = re.compile(r"^(?P<radius>\d+)\s*cm$")
PI = Decimal("3.14")


def _norm(value: object) -> str:
    return (
        str(value or "")
        .replace("　", " ")
        .replace("ｃｍ", "cm")
        .replace("ＣＭ", "cm")
        .replace("㎠", "cm²")
    )


def _parent_sha(parent: dict) -> str:
    raw = json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _fmt_decimal(value: Decimal) -> str:
    text = format(value, "f")
    if "." in text:
        text = text.rstrip("0").rstrip(".")
    return text


def _parse_parent(parent: dict):
    if parent.get("figure_refs"):
        return None
    if parent.get("choices"):
        return None
    q = _norm(parent.get("question"))
    if "円" not in q or "面積" not in q or "半径" not in q or "円周率" not in q or "3.14" not in q:
        return None
    if not any(token in q for token in ("半径を求", "半径は何", "半径はなん")):
        return None
    blocked = ("直径", "円周の長さ", "周の長さ", "弧", "扇形", "おうぎ形", "中心角", "半円", "四分円", "図", "グラフ", "m²", "mm", "km")
    if any(token in q for token in blocked):
        return None
    matches = list(AREA_RE.finditer(q))
    if len(matches) != 1:
        return None
    match = matches[0]
    try:
        area = Decimal(match.group("area"))
    except InvalidOperation:
        return None
    if area <= 0:
        return None
    square = area / PI
    if square != square.to_integral_value():
        return None
    square_int = int(square)
    radius = int(square_int ** 0.5)
    if radius <= 0 or radius * radius != square_int:
        return None
    am = ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ", ""))
    if am is None or int(am.group("radius")) != radius:
        return None
    if PI * Decimal(radius * radius) != area:
        return None
    return match, area, radius


def can_generate(parent: dict) -> tuple[bool, str]:
    if _parse_parent(parent) is not None:
        return True, "circle_area_to_integer_radius_pi_3_14_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices"):
        return False, "choice_parent"
    return False, "circle_radius_from_area_parent_not_exactly_parsed_and_verified"


def _variant_radius(seed: int, index: int) -> int:
    return 2 + ((seed >> (index * 6)) + index * 7) % 18


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    parsed = _parse_parent(parent)
    if parsed is None:
        ok, reason = can_generate(parent)
        assert not ok
        return [], [], reason

    match, parent_area, parent_radius = parsed
    question = _norm(parent.get("question"))
    seed = int(_parent_sha(parent)[:12], 16)
    seen: set[int] = set()
    rows: list[dict] = []
    evidence: list[dict] = []
    for index in range(1, count + 1):
        radius = _variant_radius(seed, index)
        while radius == parent_radius or radius in seen:
            radius += 1
            if radius > 30:
                radius = 2
        seen.add(radius)
        area = PI * Decimal(radius * radius)
        if area / PI != Decimal(radius * radius) or PI * Decimal(radius * radius) != area:
            raise AssertionError("circle radius-from-area identity failed")
        replacement = f"面積が{_fmt_decimal(area)}cm²"
        new_question = question[:match.start()] + replacement + question[match.end():]
        rows.append({
            "question": new_question,
            "answer": f"{radius}cm",
            "explanation": f"半径²=面積÷円周率より、{_fmt_decimal(area)}÷3.14={radius * radius}。したがって半径は{radius}cm。3.14×{radius}×{radius}でも面積を再確認済み。",
            "numeric_signature": (_fmt_decimal(area), "3.14"),
        })
        evidence.append({
            "parent_sha256": _parent_sha(parent),
            "method": "circle_radius_from_area_exact_division_square_root_and_recomposition",
            "parent_recalculation": f"{_fmt_decimal(parent_area)}÷3.14={parent_radius * parent_radius}; radius={parent_radius}cm",
            "variant_recalculation": f"{_fmt_decimal(area)}÷3.14={radius * radius}; radius={radius}cm",
            "independent_check": f"3.14×{radius}×{radius}={_fmt_decimal(area)}cm² PASS",
        })
    return rows, evidence, "circle_area_to_integer_radius_pi_3_14_exact"
