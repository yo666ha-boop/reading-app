from __future__ import annotations

"""Fail-closed exact engine for text-only cone-volume parents using pi=3.14."""

from decimal import Decimal, InvalidOperation
import hashlib
import json
import re

from safe_cone_height_from_volume_variant_engine import (
    can_generate as can_generate_height_from_volume,
    generate as generate_height_from_volume,
)
from safe_cone_radius_from_volume_variant_engine import (
    can_generate as can_generate_radius_from_volume,
    generate as generate_radius_from_volume,
)
from safe_cone_surface_area_variant_engine import (
    can_generate as can_generate_surface_area,
    generate as generate_surface_area,
)

RADIUS_RE = re.compile(r"半径\s*(?P<radius>\d+)\s*cm")
HEIGHT_RE = re.compile(r"高さ\s*(?P<height>\d+)\s*cm")
ANSWER_RE = re.compile(r"^(?P<value>\d+(?:\.\d+)?)\s*(?:cm³|cm\^3|cm3)$")
PI = Decimal("3.14")


def _norm(value: object) -> str:
    return str(value or "").replace("　", " ").replace("ｃｍ", "cm").replace("ＣＭ", "cm").replace("㎤", "cm³")


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
    if not any(token in q for token in ("円すい", "円錐")) or "体積" not in q or "円周率" not in q or "3.14" not in q:
        return None
    blocked = ("直径", "表面積", "側面積", "底面積を求", "半径を求", "高さを求", "円柱", "球", "図", "グラフ", "mm", "km", "m³")
    if any(token in q for token in blocked):
        return None
    radius_matches = list(RADIUS_RE.finditer(q)); height_matches = list(HEIGHT_RE.finditer(q))
    if len(radius_matches) != 1 or len(height_matches) != 1:
        return None
    rm, hm = radius_matches[0], height_matches[0]
    radius, height = int(rm.group("radius")), int(hm.group("height"))
    if radius <= 0 or height <= 0:
        return None
    product = radius * radius * height
    if product % 3 != 0:
        return None
    third_product = Decimal(product // 3); expected = PI * third_product
    am = ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ", ""))
    if am is None:
        return None
    try:
        actual = Decimal(am.group("value"))
    except InvalidOperation:
        return None
    if actual != expected or expected / PI != third_product or expected / third_product != PI or expected * Decimal(3) != PI * Decimal(product):
        return None
    return rm, hm, radius, height, expected


def can_generate(parent: dict) -> tuple[bool, str]:
    surface_ok, surface_reason = can_generate_surface_area(parent)
    if surface_ok:
        return True, surface_reason
    radius_ok, radius_reason = can_generate_radius_from_volume(parent)
    if radius_ok:
        return True, radius_reason
    height_ok, height_reason = can_generate_height_from_volume(parent)
    if height_ok:
        return True, height_reason
    if _parse_parent(parent) is not None:
        return True, "cone_integer_cm_volume_pi_3_14_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices"):
        return False, "choice_parent"
    return False, "cone_volume_parent_not_exactly_parsed_and_verified"


def _variant_numbers(seed: int, index: int) -> tuple[int, int]:
    radius = 2 + ((seed >> (index * 5)) + index * 5) % 12
    height = 3 + ((seed >> (index * 7 + 2)) + index * 7) % 18
    while (radius * radius * height) % 3 != 0:
        height += 1
    return radius, height


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    surface_rows, surface_evidence, surface_reason = generate_surface_area(parent, count)
    if surface_rows:
        return surface_rows, surface_evidence, surface_reason
    radius_ok, _ = can_generate_radius_from_volume(parent)
    if radius_ok:
        return generate_radius_from_volume(parent, count)
    height_ok, _ = can_generate_height_from_volume(parent)
    if height_ok:
        return generate_height_from_volume(parent, count)
    parsed = _parse_parent(parent)
    if parsed is None:
        ok, reason = can_generate(parent); assert not ok; return [], [], reason
    rm, hm, parent_radius, parent_height, parent_value = parsed
    q = _norm(parent.get("question")); seed = int(_sha(parent)[:12], 16); seen=set(); rows=[]; evidence=[]
    for index in range(1, count + 1):
        radius, height = _variant_numbers(seed, index); sig=(radius,height)
        while sig == (parent_radius, parent_height) or sig in seen:
            height += 3; sig=(radius,height)
        seen.add(sig); product=radius*radius*height
        if product % 3 != 0: raise AssertionError("cone volume divisibility invariant failed")
        third_product=Decimal(product//3); value=PI*third_product
        if value/PI != third_product or value/third_product != PI or value*Decimal(3) != PI*Decimal(product): raise AssertionError("cone volume identity failed")
        replacements=[(rm.start(),rm.end(),f"半径{radius}cm"),(hm.start(),hm.end(),f"高さ{height}cm")]; new_q=q
        for start,end,repl in sorted(replacements,reverse=True): new_q=new_q[:start]+repl+new_q[end:]
        rows.append({"question":new_q,"answer":f"{_fmt(value)}cm³","explanation":f"円すいの体積=円周率×半径×半径×高さ÷3より、3.14×{radius}×{radius}×{height}÷3={_fmt(value)}cm³。3倍して円周率×半径²×高さに戻ることも確認済み。","numeric_signature":(str(radius),str(height),"3.14")})
        evidence.append({"parent_sha256":_sha(parent),"method":"cone_volume_exact_pi_3_14_one_third_product_and_inverse_identities","parent_recalculation":f"3.14×{parent_radius}×{parent_radius}×{parent_height}÷3={_fmt(parent_value)}cm³","variant_recalculation":f"3.14×{radius}×{radius}×{height}÷3={_fmt(value)}cm³","independent_check":"3V == 3.14*r^2*h AND V/3.14 == r^2*h/3 AND V/(r^2*h/3) == 3.14 PASS"})
    return rows,evidence,"cone_integer_cm_volume_pi_3_14_exact"
