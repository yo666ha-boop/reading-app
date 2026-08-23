from __future__ import annotations

"""Fail-closed exact engine for cone height from volume using pi=3.14.

Only text-only parents that explicitly give an integer-centimetre radius and an
exact decimal cm^3 volume, ask solely for the height, and state pi=3.14 are
accepted. Parent and generated variants are verified by
h = 3V / (3.14*r^2) and independently recomposed by 3.14*r^2*h/3 = V.
"""

from decimal import Decimal, InvalidOperation
import hashlib
import json
import re

PI = Decimal("3.14")
RADIUS_RE = re.compile(r"半径\s*(?P<radius>\d+)\s*cm")
VOLUME_RE = re.compile(r"体積\s*(?P<volume>\d+(?:\.\d+)?)\s*(?:cm³|cm\^3|cm3)")
ANSWER_RE = re.compile(r"^(?P<height>\d+)\s*cm$")
METER_CUBED_RE = re.compile(r"(?<!c)m(?:³|\^3|3)")


def _norm(value: object) -> str:
    return (
        str(value or "")
        .replace("　", " ")
        .replace("ｃｍ", "cm")
        .replace("ＣＭ", "cm")
        .replace("㎤", "cm³")
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
    if not any(token in q for token in ("円すい", "円錐")) or "高さ" not in q or "体積" not in q or "円周率" not in q or "3.14" not in q:
        return None
    blocked = ("直径", "表面積", "側面積", "底面積", "半径を求", "体積を求", "円柱", "球", "図", "グラフ", "mm", "km")
    if any(token in q for token in blocked) or METER_CUBED_RE.search(q):
        return None
    rms = list(RADIUS_RE.finditer(q))
    vms = list(VOLUME_RE.finditer(q))
    if len(rms) != 1 or len(vms) != 1:
        return None
    rm, vm = rms[0], vms[0]
    radius = int(rm.group("radius"))
    if radius <= 0:
        return None
    try:
        volume = Decimal(vm.group("volume"))
    except InvalidOperation:
        return None
    if volume <= 0:
        return None
    numerator = Decimal(3) * volume
    denom = PI * Decimal(radius * radius)
    height = numerator / denom
    if height != height.to_integral_value() or height <= 0:
        return None
    am = ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ", ""))
    if am is None or Decimal(int(am.group("height"))) != height:
        return None
    if PI * Decimal(radius * radius) * height / Decimal(3) != volume:
        return None
    return rm, vm, radius, volume, int(height)


def can_generate(parent: dict) -> tuple[bool, str]:
    if _parse_parent(parent) is not None:
        return True, "cone_height_from_volume_pi_3_14_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices"):
        return False, "choice_parent"
    return False, "cone_height_parent_not_exactly_parsed_and_verified"


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    parsed = _parse_parent(parent)
    if parsed is None:
        ok, reason = can_generate(parent)
        assert not ok
        return [], [], reason
    rm, vm, parent_radius, parent_volume, parent_height = parsed
    q = _norm(parent.get("question"))
    seed = int(_sha(parent)[:12], 16)
    seen: set[tuple[int, int]] = set()
    rows: list[dict] = []
    evidence: list[dict] = []
    for index in range(1, count + 1):
        radius = 2 + ((seed >> (index * 5)) + index * 7) % 11
        height = 3 + ((seed >> (index * 7 + 3)) + index * 5) % 18
        while (radius * radius * height) % 3 != 0:
            height += 1
        sig = (radius, height)
        while sig == (parent_radius, parent_height) or sig in seen:
            height += 3
            sig = (radius, height)
        seen.add(sig)
        product = radius * radius * height
        if product % 3 != 0:
            raise AssertionError("cone height divisibility invariant failed")
        volume = PI * Decimal(product // 3)
        recomposed = PI * Decimal(radius * radius) * Decimal(height) / Decimal(3)
        recovered = Decimal(3) * volume / (PI * Decimal(radius * radius))
        if recomposed != volume or recovered != Decimal(height):
            raise AssertionError("cone height inverse identity failed")
        replacements = [
            (rm.start(), rm.end(), f"半径{radius}cm"),
            (vm.start(), vm.end(), f"体積{_fmt(volume)}cm³"),
        ]
        new_q = q
        for start, end, repl in sorted(replacements, reverse=True):
            new_q = new_q[:start] + repl + new_q[end:]
        rows.append({
            "question": new_q,
            "answer": f"{height}cm",
            "explanation": f"高さ=3×体積÷(円周率×半径²)より、3×{_fmt(volume)}÷(3.14×{radius}×{radius})={height}cm。3.14×{radius}×{radius}×{height}÷3={_fmt(volume)}cm³でも確認済み。",
            "numeric_signature": (str(radius), _fmt(volume), "3.14"),
        })
        evidence.append({
            "parent_sha256": _sha(parent),
            "method": "cone_height_exact_triple_volume_division_and_volume_recomposition",
            "parent_recalculation": f"3×{_fmt(parent_volume)}÷(3.14×{parent_radius}²)={parent_height}cm",
            "variant_recalculation": f"3×{_fmt(volume)}÷(3.14×{radius}²)={height}cm",
            "independent_check": f"3.14×{radius}²×{height}÷3={_fmt(volume)}cm³ PASS",
        })
    return rows, evidence, "cone_height_from_volume_pi_3_14_exact"
