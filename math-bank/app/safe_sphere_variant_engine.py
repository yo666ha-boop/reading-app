from __future__ import annotations

"""Fail-closed exact engine for text-only sphere area/volume parents using pi=3.14."""

from decimal import Decimal, InvalidOperation
import hashlib
import json
import re

from safe_sphere_radius_from_surface_area_variant_engine import generate as generate_radius_from_surface_area

RADIUS_RE = re.compile(r"半径\s*(?P<radius>\d+)\s*cm")
ANSWER_RE = re.compile(r"^(?P<value>\d+(?:\.\d+)?)\s*(?P<unit>cm²|cm\^2|cm2|cm³|cm\^3|cm3)$")
PI = Decimal("3.14")


def _norm(value: object) -> str:
    return str(value or "").replace("　", " ").replace("ｃｍ", "cm").replace("ＣＭ", "cm").replace("㎠", "cm²").replace("㎤", "cm³")


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
    if "球" not in q or "半径" not in q or "円周率" not in q or "3.14" not in q:
        return None
    asks_area = "表面積" in q
    asks_volume = "体積" in q
    if asks_area == asks_volume:
        return None
    blocked = ("直径", "半径を求", "図", "グラフ", "mm", "km", "m²", "m³", "半球", "円柱", "円すい", "円錐")
    if any(token in q for token in blocked):
        return None
    matches = list(RADIUS_RE.finditer(q))
    if len(matches) != 1:
        return None
    m = matches[0]
    radius = int(m.group("radius"))
    if radius <= 0:
        return None
    mode = "area" if asks_area else "volume"
    if mode == "area":
        expected = Decimal(4) * PI * Decimal(radius * radius)
        expected_unit = {"cm²", "cm^2", "cm2"}
    else:
        if radius % 3 != 0:
            return None
        expected = Decimal(4) * PI * Decimal(radius * radius * radius // 3)
        expected_unit = {"cm³", "cm^3", "cm3"}
    am = ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ", ""))
    if am is None or am.group("unit") not in expected_unit:
        return None
    try:
        actual = Decimal(am.group("value"))
    except InvalidOperation:
        return None
    if actual != expected:
        return None
    if mode == "area":
        if expected / (Decimal(4) * Decimal(radius * radius)) != PI:
            return None
    else:
        if expected * Decimal(3) != Decimal(4) * PI * Decimal(radius ** 3):
            return None
    return m, radius, mode, expected


def can_generate(parent: dict) -> tuple[bool, str]:
    inverse_rows, _, inverse_reason = generate_radius_from_surface_area(parent, 1)
    if inverse_rows:
        return True, inverse_reason
    parsed = _parse_parent(parent)
    if parsed is not None:
        return True, f"sphere_integer_cm_{parsed[2]}_pi_3_14_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices"):
        return False, "choice_parent"
    return False, "sphere_parent_not_exactly_parsed_and_verified"


def _variant_radius(seed: int, index: int, mode: str) -> int:
    radius = 2 + ((seed >> (index * 5)) + index * 5) % 15
    if mode == "volume":
        radius += (-radius) % 3
        if radius == 0:
            radius = 3
    return radius


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    inverse_rows, inverse_evidence, inverse_reason = generate_radius_from_surface_area(parent, count)
    if inverse_rows:
        return inverse_rows, inverse_evidence, inverse_reason
    parsed = _parse_parent(parent)
    if parsed is None:
        if parent.get("figure_refs"):
            return [], [], "figure_parent"
        if parent.get("choices"):
            return [], [], "choice_parent"
        return [], [], "sphere_parent_not_exactly_parsed_and_verified"
    match, parent_radius, mode, parent_value = parsed
    q = _norm(parent.get("question"))
    seed = int(_sha(parent)[:12], 16)
    seen: set[int] = set()
    rows, evidence = [], []
    for index in range(1, count + 1):
        radius = _variant_radius(seed, index, mode)
        while radius == parent_radius or radius in seen:
            radius += 3 if mode == "volume" else 1
        seen.add(radius)
        if mode == "area":
            value = Decimal(4) * PI * Decimal(radius * radius)
            unit = "cm²"
            method = "sphere_surface_area_exact_4_pi_r2_and_inverse_identity"
            independent = "A/(4*r^2) == 3.14 PASS"
            explanation = f"球の表面積=4×円周率×半径²より、4×3.14×{radius}×{radius}={_fmt(value)}cm²。"
            if value / (Decimal(4) * Decimal(radius * radius)) != PI:
                raise AssertionError("sphere area inverse identity failed")
        else:
            if radius % 3:
                raise AssertionError("sphere volume divisibility invariant failed")
            value = Decimal(4) * PI * Decimal(radius ** 3 // 3)
            unit = "cm³"
            method = "sphere_volume_exact_4_over_3_pi_r3_and_inverse_identity"
            independent = "3V == 4*3.14*r^3 PASS"
            explanation = f"球の体積=4/3×円周率×半径³より、4×3.14×{radius}×{radius}×{radius}÷3={_fmt(value)}cm³。"
            if value * Decimal(3) != Decimal(4) * PI * Decimal(radius ** 3):
                raise AssertionError("sphere volume inverse identity failed")
        new_q = q[:match.start()] + f"半径{radius}cm" + q[match.end():]
        rows.append({"question": new_q, "answer": f"{_fmt(value)}{unit}", "explanation": explanation, "numeric_signature": (str(radius), "3.14")})
        evidence.append({"parent_sha256": _sha(parent), "method": method, "parent_recalculation": f"r={parent_radius} -> {_fmt(parent_value)}", "variant_recalculation": f"r={radius} -> {_fmt(value)}", "independent_check": independent})
    return rows, evidence, f"sphere_integer_cm_{mode}_pi_3_14_exact"
