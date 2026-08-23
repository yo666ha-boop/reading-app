from __future__ import annotations

"""Fail-closed exact engine for cone slant length from total surface area using pi=3.14."""

from decimal import Decimal, InvalidOperation
import hashlib
import json
import re

RADIUS_RE = re.compile(r"半径\s*(?P<radius>\d+)\s*cm")
SURFACE_RE = re.compile(r"表面積\s*(?:が|は)?\s*(?P<surface>\d+(?:\.\d+)?)\s*(?:cm²|cm\^2|cm2)")
ANSWER_RE = re.compile(r"^(?P<slant>\d+)\s*cm$")
PI = Decimal("3.14")


def _norm(value: object) -> str:
    return str(value or "").replace("　", " ").replace("ｃｍ", "cm").replace("ＣＭ", "cm").replace("㎠", "cm²")


def _sha(parent: dict) -> str:
    return hashlib.sha256(json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")).hexdigest()


def _fmt(value: Decimal) -> str:
    text = format(value, "f")
    return text.rstrip("0").rstrip(".") if "." in text else text


def _parse_parent(parent: dict):
    if parent.get("figure_refs") or parent.get("choices"):
        return None
    q = _norm(parent.get("question"))
    if not any(token in q for token in ("円すい", "円錐")) or "表面積" not in q or "母線" not in q or "求" not in q or "円周率" not in q or "3.14" not in q:
        return None
    blocked = ("直径", "体積", "側面積", "底面積", "半径を求", "高さ", "円柱", "球", "図", "グラフ", "mm", "km")
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
    slant = surface / (PI * Decimal(radius)) - Decimal(radius)
    if slant <= Decimal(radius) or slant != slant.to_integral_value():
        return None
    slant_i = int(slant)
    am = ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ", ""))
    if am is None or int(am.group("slant")) != slant_i:
        return None
    recomposed = PI * Decimal(radius) * Decimal(radius + slant_i)
    if recomposed != surface:
        return None
    base = PI * Decimal(radius * radius)
    lateral = PI * Decimal(radius * slant_i)
    if base + lateral != surface:
        return None
    return rm, sm, radius, surface, slant_i


def can_generate(parent: dict) -> tuple[bool, str]:
    if _parse_parent(parent) is not None:
        return True, "cone_slant_from_surface_area_pi_3_14_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices"):
        return False, "choice_parent"
    return False, "cone_slant_from_surface_area_parent_not_exactly_parsed_and_verified"


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    parsed = _parse_parent(parent)
    if parsed is None:
        ok, reason = can_generate(parent)
        assert not ok
        return [], [], reason
    rm, sm, parent_radius, parent_surface, parent_slant = parsed
    q = _norm(parent.get("question"))
    seed = int(_sha(parent)[:12], 16)
    seen: set[tuple[int, int]] = set()
    rows, evidence = [], []
    for index in range(1, count + 1):
        radius = 2 + ((seed >> (index * 5)) + index * 3) % 8
        slant = radius + 2 + ((seed >> (index * 7 + 2)) + index * 5) % 12
        sig = (radius, slant)
        while sig == (parent_radius, parent_slant) or sig in seen:
            slant += 1
            sig = (radius, slant)
        seen.add(sig)
        surface = PI * Decimal(radius) * Decimal(radius + slant)
        recovered = surface / (PI * Decimal(radius)) - Decimal(radius)
        base = PI * Decimal(radius * radius)
        lateral = PI * Decimal(radius * slant)
        if recovered != Decimal(slant):
            raise AssertionError("cone slant surface-area inverse failed")
        if base + lateral != surface:
            raise AssertionError("cone surface-area decomposition failed")
        new_q = q
        for start, end, repl in sorted([(rm.start(), rm.end(), f"半径{radius}cm"), (sm.start(), sm.end(), f"表面積{_fmt(surface)}cm²")], reverse=True):
            new_q = new_q[:start] + repl + new_q[end:]
        rows.append({"question": new_q, "answer": f"{slant}cm", "explanation": f"表面積=3.14×半径×(半径+母線)より、母線={_fmt(surface)}÷(3.14×{radius})-{radius}={slant}cm。底面積+側面積でも確認済み。", "numeric_signature": (str(radius), _fmt(surface), "3.14")})
        evidence.append({"parent_sha256": _sha(parent), "method": "cone_slant_from_surface_area_exact_inverse_and_recomposition", "parent_recalculation": f"{_fmt(parent_surface)}÷(3.14×{parent_radius})-{parent_radius}={parent_slant}cm", "variant_recalculation": f"{_fmt(surface)}÷(3.14×{radius})-{radius}={slant}cm", "independent_check": "pi*r*(r+l) == S AND pi*r^2 + pi*r*l == S PASS"})
    return rows, evidence, "cone_slant_from_surface_area_pi_3_14_exact"
