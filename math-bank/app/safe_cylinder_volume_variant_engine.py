from __future__ import annotations

"""Fail-closed exact engine for text-only cylinder-volume parents using pi=3.14."""

from decimal import Decimal, InvalidOperation
import hashlib
import json
import re

RADIUS_RE = re.compile(r"半径\s*(?P<radius>\d+)\s*cm")
HEIGHT_RE = re.compile(r"高さ\s*(?P<height>\d+)\s*cm")
ANSWER_RE = re.compile(r"^(?P<value>\d+(?:\.\d+)?)\s*(?:cm³|cm\^3|cm3)$")
PI = Decimal("3.14")


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
    if "円柱" not in q or "体積" not in q or "円周率" not in q or "3.14" not in q:
        return None
    blocked = (
        "直径", "表面積", "側面積", "底面積を求", "半径を求", "高さを求",
        "円すい", "円錐", "球", "図", "グラフ", "mm", "km", "m³",
    )
    if any(token in q for token in blocked):
        return None
    radius_matches = list(RADIUS_RE.finditer(q))
    height_matches = list(HEIGHT_RE.finditer(q))
    if len(radius_matches) != 1 or len(height_matches) != 1:
        return None
    rm, hm = radius_matches[0], height_matches[0]
    radius, height = int(rm.group("radius")), int(hm.group("height"))
    if radius <= 0 or height <= 0:
        return None
    expected = PI * Decimal(radius * radius * height)
    am = ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ", ""))
    if am is None:
        return None
    try:
        actual = Decimal(am.group("value"))
    except InvalidOperation:
        return None
    if actual != expected:
        return None
    base_factor = Decimal(radius * radius * height)
    if expected / PI != base_factor or expected / base_factor != PI:
        return None
    if expected / (PI * Decimal(height)) != Decimal(radius * radius):
        return None
    return rm, hm, radius, height, expected


def can_generate(parent: dict) -> tuple[bool, str]:
    if _parse_parent(parent) is not None:
        return True, "cylinder_integer_cm_volume_pi_3_14_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices"):
        return False, "choice_parent"
    return False, "cylinder_volume_parent_not_exactly_parsed_and_verified"


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
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
        radius = 2 + ((seed >> (index * 5)) + index * 5) % 12
        height = 3 + ((seed >> (index * 7 + 2)) + index * 7) % 17
        sig = (radius, height)
        while sig == (parent_radius, parent_height) or sig in seen:
            radius += 1
            if radius > 20:
                radius = 2
                height += 1
            sig = (radius, height)
        seen.add(sig)
        value = PI * Decimal(radius * radius * height)
        base_factor = Decimal(radius * radius * height)
        if value / PI != base_factor or value / base_factor != PI:
            raise AssertionError("cylinder volume pi identity failed")
        if value / (PI * Decimal(height)) != Decimal(radius * radius):
            raise AssertionError("cylinder volume radius-square identity failed")
        replacements = [(rm.start(), rm.end(), f"半径{radius}cm"), (hm.start(), hm.end(), f"高さ{height}cm")]
        new_q = q
        for start, end, repl in sorted(replacements, reverse=True):
            new_q = new_q[:start] + repl + new_q[end:]
        rows.append({
            "question": new_q,
            "answer": f"{_fmt(value)}cm³",
            "explanation": f"円柱の体積=円周率×半径×半径×高さより、3.14×{radius}×{radius}×{height}={_fmt(value)}cm³。逆算でも半径²・高さ・円周率3.14を確認済み。",
            "numeric_signature": (str(radius), str(height), "3.14"),
        })
        evidence.append({
            "parent_sha256": _sha(parent),
            "method": "cylinder_volume_exact_pi_3_14_product_and_inverse_identities",
            "parent_recalculation": f"3.14×{parent_radius}×{parent_radius}×{parent_height}={_fmt(parent_value)}cm³",
            "variant_recalculation": f"3.14×{radius}×{radius}×{height}={_fmt(value)}cm³",
            "independent_check": "V/3.14 == r^2*h AND V/(r^2*h) == 3.14 AND V/(3.14*h) == r^2 PASS",
        })
    return rows, evidence, "cylinder_integer_cm_volume_pi_3_14_exact"
