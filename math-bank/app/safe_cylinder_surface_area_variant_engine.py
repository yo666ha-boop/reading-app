from __future__ import annotations

"""Fail-closed exact engine for text-only cylinder surface-area parents using pi=3.14."""

from decimal import Decimal, InvalidOperation
import hashlib
import json
import re

from safe_cylinder_height_from_surface_area_variant_engine import (
    can_generate as can_generate_height_from_surface_area,
    generate as generate_height_from_surface_area,
)

RADIUS_RE = re.compile(r"半径\s*(?P<radius>\d+)\s*cm")
HEIGHT_RE = re.compile(r"高さ\s*(?P<height>\d+)\s*cm")
ANSWER_RE = re.compile(r"^(?P<value>\d+(?:\.\d+)?)\s*(?:cm²|cm\^2|cm2)$")
PI = Decimal("3.14")


def _norm(value: object) -> str:
    return (
        str(value or "")
        .replace("　", " ")
        .replace("ｃｍ", "cm")
        .replace("ＣＭ", "cm")
        .replace("㎠", "cm²")
    )


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
    if "円柱" not in q or "表面積" not in q or "円周率" not in q or "3.14" not in q:
        return None
    blocked = ("直径", "体積", "側面積", "底面積を求", "半径を求", "高さを求", "円すい", "円錐", "球", "図", "グラフ", "mm", "km")
    if any(token in q for token in blocked):
        return None
    if re.search(r"(?<!c)m(?:²|\^2|2)", q, re.IGNORECASE):
        return None
    radius_matches = list(RADIUS_RE.finditer(q))
    height_matches = list(HEIGHT_RE.finditer(q))
    if len(radius_matches) != 1 or len(height_matches) != 1:
        return None
    rm, hm = radius_matches[0], height_matches[0]
    radius, height = int(rm.group("radius")), int(hm.group("height"))
    if radius <= 0 or height <= 0:
        return None
    expected = Decimal(2) * PI * Decimal(radius) * Decimal(radius + height)
    am = ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ", ""))
    if am is None:
        return None
    try:
        actual = Decimal(am.group("value"))
    except InvalidOperation:
        return None
    if actual != expected:
        return None
    denominator = Decimal(2) * PI * Decimal(radius)
    if expected / denominator != Decimal(radius + height):
        return None
    two_bases = Decimal(2) * PI * Decimal(radius * radius)
    lateral = Decimal(2) * PI * Decimal(radius * height)
    if two_bases + lateral != expected:
        return None
    return rm, hm, radius, height, expected


def can_generate(parent: dict) -> tuple[bool, str]:
    inverse_ok, inverse_reason = can_generate_height_from_surface_area(parent)
    if inverse_ok:
        return True, inverse_reason
    if _parse_parent(parent) is not None:
        return True, "cylinder_surface_area_pi_3_14_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices"):
        return False, "choice_parent"
    return False, "cylinder_surface_area_parent_not_exactly_parsed_and_verified"


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    inverse_rows, inverse_evidence, inverse_reason = generate_height_from_surface_area(parent, count)
    if inverse_rows:
        return inverse_rows, inverse_evidence, inverse_reason
    parsed = _parse_parent(parent)
    if parsed is None:
        ok, reason = can_generate(parent)
        assert not ok
        return [], [], reason

    rm, hm, parent_radius, parent_height, parent_value = parsed
    q = _norm(parent.get("question"))
    seed = int(_sha(parent)[:12], 16)
    seen: set[tuple[int, int]] = set()
    rows: list[dict] = []
    evidence: list[dict] = []

    for index in range(1, count + 1):
        radius = 2 + ((seed >> (index * 5)) + index * 5) % 11
        height = 3 + ((seed >> (index * 7 + 2)) + index * 7) % 16
        sig = (radius, height)
        while sig == (parent_radius, parent_height) or sig in seen:
            radius += 1
            if radius > 18:
                radius = 2
                height += 1
            sig = (radius, height)
        seen.add(sig)
        value = Decimal(2) * PI * Decimal(radius) * Decimal(radius + height)
        denominator = Decimal(2) * PI * Decimal(radius)
        two_bases = Decimal(2) * PI * Decimal(radius * radius)
        lateral = Decimal(2) * PI * Decimal(radius * height)
        if value / denominator != Decimal(radius + height):
            raise AssertionError("cylinder surface area inverse identity failed")
        if two_bases + lateral != value:
            raise AssertionError("cylinder surface area decomposition identity failed")

        replacements = [(rm.start(), rm.end(), f"半径{radius}cm"), (hm.start(), hm.end(), f"高さ{height}cm")]
        new_q = q
        for start, end, repl in sorted(replacements, reverse=True):
            new_q = new_q[:start] + repl + new_q[end:]
        rows.append({
            "question": new_q,
            "answer": f"{_fmt(value)}cm²",
            "explanation": f"円柱の表面積=2×円周率×半径×(半径+高さ)より、2×3.14×{radius}×({radius}+{height})={_fmt(value)}cm²。底面2枚と側面の和でも確認済み。",
            "numeric_signature": (str(radius), str(height), "3.14"),
        })
        evidence.append({
            "parent_sha256": _sha(parent),
            "method": "cylinder_surface_area_exact_2_pi_r_r_plus_h_and_face_decomposition",
            "parent_recalculation": f"2×3.14×{parent_radius}×({parent_radius}+{parent_height})={_fmt(parent_value)}cm²",
            "variant_recalculation": f"2×3.14×{radius}×({radius}+{height})={_fmt(value)}cm²",
            "independent_check": "S/(2*pi*r) == r+h AND 2*pi*r^2 + 2*pi*r*h == S PASS",
        })
    return rows, evidence, "cylinder_surface_area_pi_3_14_exact"
