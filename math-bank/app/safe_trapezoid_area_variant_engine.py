from __future__ import annotations

"""Fail-closed exact engine for trapezoid area and height-from-area parents."""

import hashlib
import json
import re

from safe_trapezoid_height_from_area_variant_engine import generate as generate_height_from_area

TRAPEZOID_RE = re.compile(r"上底\s*(?P<upper>\d+)\s*(?P<unit>mm|cm|m)\s*[、,，]?\s*下底\s*(?P<lower>\d+)\s*(?P=unit)\s*[、,，]?\s*高さ\s*(?P<height>\d+)\s*(?P=unit)")
AREA_ANSWER_RE = re.compile(r"^(?P<v>\d+)\s*(?P<unit>mm|cm|m)(?:²|\^2|2)$")


def _norm(value: object) -> str:
    return str(value or "").replace("　", " ").replace("㎠", "cm²").replace("㎡", "m²").replace("㎟", "mm²")


def _parent_sha(parent: dict) -> str:
    raw = json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _parse_parent(parent: dict):
    if parent.get("figure_refs") or parent.get("choices") is not None:
        return None
    q = _norm(parent.get("question"))
    if "台形" not in q or "面積" not in q:
        return None
    blocked = ("周", "周囲", "辺の長さ", "上底を", "下底を", "高さを", "図", "複合", "平行四辺形", "三角形", "相似")
    if any(token in q for token in blocked):
        return None
    matches = list(TRAPEZOID_RE.finditer(q))
    if len(matches) != 1:
        return None
    m = matches[0]
    upper = int(m.group("upper")); lower = int(m.group("lower")); height = int(m.group("height")); unit = m.group("unit")
    if upper <= 0 or lower <= 0 or height <= 0:
        return None
    doubled = (upper + lower) * height
    if doubled % 2:
        return None
    area = doubled // 2
    am = AREA_ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ", ""))
    if am is None or am.group("unit") != unit or int(am.group("v")) != area:
        return None
    if 2 * area != doubled:
        return None
    return m, upper, lower, height, unit, area


def can_generate(parent: dict) -> tuple[bool, str]:
    rows, _, reason = generate_height_from_area(parent, 1)
    if rows:
        return True, reason
    if _parse_parent(parent) is not None:
        return True, "trapezoid_area_integer_same_unit_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices") is not None:
        return False, "choice_parent"
    return False, "trapezoid_area_parent_not_exactly_parsed_and_verified"


def _variant_numbers(seed: int, index: int) -> tuple[int, int, int]:
    upper = 2 + ((seed >> (index * 4)) + index * 5) % 10
    lower = upper + 2 + ((seed >> (index * 6 + 1)) + index * 3) % 9
    height = 2 + ((seed >> (index * 7 + 2)) + index * 4) % 10
    if ((upper + lower) * height) % 2:
        lower += 1
    return upper, lower, height


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    inverse_rows, inverse_evidence, inverse_reason = generate_height_from_area(parent, count)
    if inverse_rows:
        return inverse_rows, inverse_evidence, inverse_reason
    parsed = _parse_parent(parent)
    if parsed is None:
        if parent.get("figure_refs"):
            return [], [], "figure_parent"
        if parent.get("choices") is not None:
            return [], [], "choice_parent"
        return [], [], "trapezoid_area_parent_not_exactly_parsed_and_verified"

    match, parent_upper, parent_lower, parent_height, unit, parent_area = parsed
    q = _norm(parent.get("question")); seed = int(_parent_sha(parent)[:12], 16)
    parent_signature = (str(parent_upper), str(parent_lower), str(parent_height)); seen=set(); rows=[]; evidence=[]
    for index in range(1, count + 1):
        upper, lower, height = _variant_numbers(seed, index); signature=(str(upper),str(lower),str(height)); bump=0
        while signature == parent_signature or signature in seen:
            bump += 1; lower += 2 * bump; signature=(str(upper),str(lower),str(height))
        seen.add(signature); doubled=(upper+lower)*height
        if doubled % 2: raise AssertionError("trapezoid generated area must remain integer")
        area=doubled//2
        if 2*area != doubled: raise AssertionError("trapezoid doubled-area identity failed")
        replacement=f"上底{upper}{unit}、下底{lower}{unit}、高さ{height}{unit}"; new_question=q[:match.start()]+replacement+q[match.end():]
        rows.append({"question":new_question,"answer":f"{area}{unit}²","explanation":f"台形の面積=(上底+下底)×高さ÷2より、({upper}+{lower})×{height}÷2={area}{unit}²。2×面積=(上底+下底)×高さでも確認済み。","numeric_signature":signature})
        evidence.append({"parent_sha256":_parent_sha(parent),"method":"trapezoid_area_exact_half_sum_product_and_doubled_area_identity","parent_recalculation":f"({parent_upper}+{parent_lower})×{parent_height}÷2={parent_area}{unit}²","variant_recalculation":f"({upper}+{lower})×{height}÷2={area}{unit}²","independent_check":"2*area == (upper+lower)*height PASS"})
    return rows,evidence,"trapezoid_area_integer_same_unit_exact"
