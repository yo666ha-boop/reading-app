from __future__ import annotations

"""Fail-closed exact engine for cylinder radius from volume using pi=3.14.

Only text-only parents that explicitly give an integer-centimetre height and an
exact decimal cm^3 volume, ask solely for the radius, and state pi=3.14 are
accepted. The parent and every generated variant are verified by
r^2 = V/(3.14*h), requiring an exact positive integer square root, and
independently recomposed by 3.14*r^2*h = V.
"""

from decimal import Decimal, InvalidOperation
import hashlib
import json
import math
import re

PI = Decimal("3.14")
HEIGHT_RE = re.compile(r"高さ\s*(?P<height>\d+)\s*cm")
VOLUME_RE = re.compile(r"体積\s*(?P<volume>\d+(?:\.\d+)?)\s*(?:cm³|cm\^3|cm3)")
ANSWER_RE = re.compile(r"^(?P<radius>\d+)\s*cm$")
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
    if "円柱" not in q or "半径" not in q or "高さ" not in q or "体積" not in q or "円周率" not in q or "3.14" not in q:
        return None
    blocked = ("直径", "表面積", "側面積", "底面積", "高さを求", "体積を求", "円すい", "円錐", "球", "図", "グラフ", "mm", "km")
    if any(token in q for token in blocked) or METER_CUBED_RE.search(q):
        return None
    hms = list(HEIGHT_RE.finditer(q))
    vms = list(VOLUME_RE.finditer(q))
    if len(hms) != 1 or len(vms) != 1:
        return None
    hm, vm = hms[0], vms[0]
    height = int(hm.group("height"))
    if height <= 0:
        return None
    try:
        volume = Decimal(vm.group("volume"))
    except InvalidOperation:
        return None
    if volume <= 0:
        return None
    radius_sq = volume / (PI * Decimal(height))
    if radius_sq != radius_sq.to_integral_value() or radius_sq <= 0:
        return None
    radius_sq_int = int(radius_sq)
    radius = math.isqrt(radius_sq_int)
    if radius * radius != radius_sq_int:
        return None
    am = ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ", ""))
    if am is None or int(am.group("radius")) != radius:
        return None
    if PI * Decimal(radius * radius * height) != volume:
        return None
    return hm, vm, height, volume, radius


def can_generate(parent: dict) -> tuple[bool, str]:
    if _parse_parent(parent) is not None:
        return True, "cylinder_radius_from_volume_pi_3_14_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices"):
        return False, "choice_parent"
    return False, "cylinder_radius_parent_not_exactly_parsed_and_verified"


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    parsed = _parse_parent(parent)
    if parsed is None:
        ok, reason = can_generate(parent)
        assert not ok
        return [], [], reason
    hm, vm, parent_height, parent_volume, parent_radius = parsed
    q = _norm(parent.get("question"))
    seed = int(_sha(parent)[:12], 16)
    seen: set[tuple[int, int]] = set()
    rows: list[dict] = []
    evidence: list[dict] = []
    for index in range(1, count + 1):
        radius = 2 + ((seed >> (index * 5)) + index * 7) % 11
        height = 2 + ((seed >> (index * 7 + 3)) + index * 5) % 16
        sig = (radius, height)
        while sig == (parent_radius, parent_height) or sig in seen:
            radius += 1
            if radius > 16:
                radius = 2
                height += 1
            sig = (radius, height)
        seen.add(sig)
        volume = PI * Decimal(radius * radius * height)
        radius_sq = volume / (PI * Decimal(height))
        root = math.isqrt(int(radius_sq)) if radius_sq == radius_sq.to_integral_value() else -1
        if root != radius or PI * Decimal(radius * radius * height) != volume:
            raise AssertionError("cylinder radius inverse identity failed")
        replacements = [
            (hm.start(), hm.end(), f"高さ{height}cm"),
            (vm.start(), vm.end(), f"体積{_fmt(volume)}cm³"),
        ]
        new_q = q
        for start, end, repl in sorted(replacements, reverse=True):
            new_q = new_q[:start] + repl + new_q[end:]
        rows.append({
            "question": new_q,
            "answer": f"{radius}cm",
            "explanation": f"半径²=体積÷(円周率×高さ)より、{_fmt(volume)}÷(3.14×{height})={radius * radius}。したがって半径は{radius}cm。3.14×{radius}×{radius}×{height}={_fmt(volume)}cm³でも確認済み。",
            "numeric_signature": (str(height), _fmt(volume), "3.14"),
        })
        evidence.append({
            "parent_sha256": _sha(parent),
            "method": "cylinder_radius_exact_division_square_root_and_volume_recomposition",
            "parent_recalculation": f"{_fmt(parent_volume)}÷(3.14×{parent_height})={parent_radius * parent_radius}; sqrt={parent_radius}cm",
            "variant_recalculation": f"{_fmt(volume)}÷(3.14×{height})={radius * radius}; sqrt={radius}cm",
            "independent_check": f"3.14×{radius}²×{height}={_fmt(volume)}cm³ PASS",
        })
    return rows, evidence, "cylinder_radius_from_volume_pi_3_14_exact"
