from __future__ import annotations

"""Fail-closed exact engine for cylinder height from surface area with pi=3.14."""

from decimal import Decimal, InvalidOperation
import hashlib
import json
import re

RADIUS_RE = re.compile(r"半径\s*(?P<radius>\d+)\s*cm")
SURFACE_RE = re.compile(r"表面積\s*(?:が|は)?\s*(?P<surface>\d+(?:\.\d+)?)\s*(?:cm²|cm\^2|cm2)")
ANSWER_RE = re.compile(r"^(?P<height>\d+)\s*cm$")
PI = Decimal("3.14")


def _norm(value: object) -> str:
    return str(value or "").replace("　", " ").replace("ｃｍ", "cm").replace("ＣＭ", "cm").replace("㎠", "cm²")


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
    if "円柱" not in q or "表面積" not in q or "高さ" not in q or "求" not in q or "円周率" not in q or "3.14" not in q:
        return None
    blocked = ("直径", "体積", "側面積", "底面積", "半径を求", "円すい", "円錐", "球", "図", "グラフ", "mm", "km")
    if any(token in q for token in blocked):
        return None
    if re.search(r"(?<!c)m(?:²|\^2|2)", q, re.IGNORECASE):
        return None
    rms = list(RADIUS_RE.finditer(q))
    sms = list(SURFACE_RE.finditer(q))
    if len(rms) != 1 or len(sms) != 1:
        return None
    rm, sm = rms[0], sms[0]
    radius = int(rm.group("radius"))
    if radius <= 0:
        return None
    try:
        surface = Decimal(sm.group("surface"))
    except InvalidOperation:
        return None
    denominator = Decimal(2) * PI * Decimal(radius)
    if denominator == 0:
        return None
    height = surface / denominator - Decimal(radius)
    if height <= 0 or height != height.to_integral_value():
        return None
    height_i = int(height)
    am = ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ", ""))
    if am is None or int(am.group("height")) != height_i:
        return None
    recomposed = Decimal(2) * PI * Decimal(radius) * Decimal(radius + height_i)
    if recomposed != surface:
        return None
    two_bases = Decimal(2) * PI * Decimal(radius * radius)
    lateral = Decimal(2) * PI * Decimal(radius * height_i)
    if two_bases + lateral != surface:
        return None
    return rm, sm, radius, surface, height_i


def can_generate(parent: dict) -> tuple[bool, str]:
    if _parse_parent(parent) is not None:
        return True, "cylinder_height_from_surface_area_pi_3_14_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices"):
        return False, "choice_parent"
    return False, "cylinder_height_from_surface_area_parent_not_exactly_parsed_and_verified"


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    parsed = _parse_parent(parent)
    if parsed is None:
        ok, reason = can_generate(parent)
        assert not ok
        return [], [], reason
    rm, sm, parent_radius, parent_surface, parent_height = parsed
    q = _norm(parent.get("question"))
    seed = int(_sha(parent)[:12], 16)
    seen: set[tuple[int, int]] = set()
    rows: list[dict] = []
    evidence: list[dict] = []
    for index in range(1, count + 1):
        radius = 2 + ((seed >> (index * 5)) + index * 3) % 9
        height = 3 + ((seed >> (index * 7 + 1)) + index * 5) % 14
        sig = (radius, height)
        while sig == (parent_radius, parent_height) or sig in seen:
            height += 1
            if height > 22:
                height = 3
                radius += 1
            sig = (radius, height)
        seen.add(sig)
        surface = Decimal(2) * PI * Decimal(radius) * Decimal(radius + height)
        recovered = surface / (Decimal(2) * PI * Decimal(radius)) - Decimal(radius)
        two_bases = Decimal(2) * PI * Decimal(radius * radius)
        lateral = Decimal(2) * PI * Decimal(radius * height)
        if recovered != Decimal(height):
            raise AssertionError("cylinder surface-area height inverse failed")
        if two_bases + lateral != surface:
            raise AssertionError("cylinder surface-area decomposition failed")
        new_q = q
        replacements = [(rm.start(), rm.end(), f"半径{radius}cm"), (sm.start(), sm.end(), f"表面積{_fmt(surface)}cm²")]
        for start, end, repl in sorted(replacements, reverse=True):
            new_q = new_q[:start] + repl + new_q[end:]
        rows.append({
            "question": new_q,
            "answer": f"{height}cm",
            "explanation": f"表面積=2×3.14×半径×(半径+高さ)より、高さ={_fmt(surface)}÷(2×3.14×{radius})-{radius}={height}cm。再構成でも確認済み。",
            "numeric_signature": (str(radius), _fmt(surface), "3.14"),
        })
        evidence.append({
            "parent_sha256": _sha(parent),
            "method": "cylinder_height_from_surface_area_exact_inverse_and_recomposition",
            "parent_recalculation": f"{_fmt(parent_surface)}÷(2×3.14×{parent_radius})-{parent_radius}={parent_height}cm",
            "variant_recalculation": f"{_fmt(surface)}÷(2×3.14×{radius})-{radius}={height}cm",
            "independent_check": "2*pi*r*(r+h) == S AND 2*pi*r^2 + 2*pi*r*h == S PASS",
        })
    return rows, evidence, "cylinder_height_from_surface_area_pi_3_14_exact"
