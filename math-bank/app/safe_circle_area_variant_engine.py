from __future__ import annotations

"""Fail-closed exact circle/sector area route with safe delegated subtypes."""

from decimal import Decimal, InvalidOperation
import hashlib
import json
import re

from safe_circle_radius_from_area_variant_engine import (
    can_generate as can_generate_radius_from_area,
    generate as generate_radius_from_area,
)
from safe_sector_angle_from_area_variant_engine import generate as generate_sector_angle_from_area
from safe_sector_area_variant_engine import generate as generate_sector_area
from safe_sector_arc_length_variant_engine import generate as generate_sector_arc_length

RADIUS_RE = re.compile(r"半径\s*(?P<radius>\d+)\s*cm")
ANSWER_RE = re.compile(r"^(?P<area>\d+(?:\.\d+)?)\s*(?:cm²|cm\^2|cm2)$")
PI = Decimal("3.14")


def _norm(value: object) -> str:
    return str(value or "").replace("　", " ").replace("ｃｍ", "cm").replace("ＣＭ", "cm").replace("㎠", "cm²")


def _parent_sha(parent: dict) -> str:
    raw = json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _fmt_decimal(value: Decimal) -> str:
    text = format(value, "f")
    return text.rstrip("0").rstrip(".") if "." in text else text


def _parse_parent(parent: dict):
    if parent.get("figure_refs") or parent.get("choices"):
        return None
    q = _norm(parent.get("question"))
    if "円" not in q or "面積" not in q or "円周率" not in q or "3.14" not in q:
        return None
    blocked = ("直径", "円周の長さ", "円の周の長さ", "周の長さ", "弧", "扇形", "おうぎ形", "中心角", "半円", "四分円", "半径を求", "半径は何", "半径はなん", "直径を求", "図", "グラフ", "m²", "mm", "km")
    if any(token in q for token in blocked):
        return None
    matches = list(RADIUS_RE.finditer(q))
    if len(matches) != 1:
        return None
    match = matches[0]; radius = int(match.group("radius"))
    if radius <= 0:
        return None
    expected = PI * Decimal(radius * radius)
    answer_match = ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ", ""))
    if answer_match is None:
        return None
    try:
        actual = Decimal(answer_match.group("area"))
    except InvalidOperation:
        return None
    if actual != expected or expected / PI != Decimal(radius * radius) or expected / Decimal(radius * radius) != PI:
        return None
    return match, radius, expected


def can_generate(parent: dict) -> tuple[bool, str]:
    inverse_ok, inverse_reason = can_generate_radius_from_area(parent)
    if inverse_ok:
        return True, inverse_reason
    for fn in (generate_sector_angle_from_area, generate_sector_area, generate_sector_arc_length):
        rows, _, reason = fn(parent, 1)
        if rows:
            return True, reason
    if _parse_parent(parent) is not None:
        return True, "circle_integer_cm_area_pi_3_14_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices"):
        return False, "choice_parent"
    return False, "circle_area_parent_not_exactly_parsed_and_verified"


def _variant_radius(seed: int, index: int) -> int:
    return 2 + ((seed >> (index * 6)) + index * 5) % 18


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    inverse_rows, inverse_evidence, inverse_reason = generate_radius_from_area(parent, count)
    if inverse_rows:
        return inverse_rows, inverse_evidence, inverse_reason
    for fn in (generate_sector_angle_from_area, generate_sector_area, generate_sector_arc_length):
        rows, evidence, reason = fn(parent, count)
        if rows:
            return rows, evidence, reason
    parsed = _parse_parent(parent)
    if parsed is None:
        ok, reason = can_generate(parent); assert not ok
        return [], [], reason
    match, parent_radius, parent_area = parsed
    question = _norm(parent.get("question")); seed = int(_parent_sha(parent)[:12], 16)
    seen: set[int] = set(); rows: list[dict] = []; evidence: list[dict] = []
    for index in range(1, count + 1):
        radius = _variant_radius(seed, index)
        while radius == parent_radius or radius in seen:
            radius += 1
            if radius > 30: radius = 2
        seen.add(radius); area = PI * Decimal(radius * radius)
        if area / PI != Decimal(radius * radius) or area / Decimal(radius * radius) != PI:
            raise AssertionError("circle area inverse identity failed")
        replacement = f"半径{radius}cm"; new_question = question[:match.start()] + replacement + question[match.end():]
        rows.append({"question":new_question,"answer":f"{_fmt_decimal(area)}cm²","explanation":f"円の面積=3.14×{radius}×{radius}={_fmt_decimal(area)}cm²。逆算でも確認済み。","numeric_signature":(str(radius),"3.14")})
        evidence.append({"parent_sha256":_parent_sha(parent),"method":"circle_area_exact_pi_3_14_product_and_two_inverse_identities","parent_recalculation":f"3.14×{parent_radius}×{parent_radius}={_fmt_decimal(parent_area)}cm²","variant_recalculation":f"3.14×{radius}×{radius}={_fmt_decimal(area)}cm²","independent_check":"area/3.14 == radius^2 AND area/radius^2 == 3.14 PASS"})
    return rows, evidence, "circle_integer_cm_area_pi_3_14_exact"
