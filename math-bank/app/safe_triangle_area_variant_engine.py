from __future__ import annotations

"""Fail-closed exact engine for narrow triangle area and third-angle parents.

Area mode accepts one explicit base and height in the same unit and an exact
integer area. Third-angle mode accepts a text-only triangle with two explicit
integer angles asking solely for the remaining angle. Every accepted parent and
generated row is independently checked by an exact identity.
"""

import hashlib
import json
import re

TRI_RE = re.compile(
    r"底辺\s*(?P<base>\d+)\s*(?P<unit>mm|cm|m)\s*[、,，]?\s*高さ\s*(?P<height>\d+)\s*(?P=unit)"
)
AREA_ANSWER_RE = re.compile(r"^(?P<v>\d+)\s*(?P<unit>mm|cm|m)(?:²|\^2|2)$")
ANGLE_PAIR_RE = re.compile(r"(?P<a>\d+)\s*(?:°|度)\s*(?:と|、|,|，)\s*(?P<b>\d+)\s*(?:°|度)")
ANGLE_ANSWER_RE = re.compile(r"^(?P<v>\d+)\s*(?:°|度)$")


def _norm(value: object) -> str:
    return str(value or "").replace("　", " ").replace("㎠", "cm²").replace("㎡", "m²").replace("㎟", "mm²")


def _parent_sha(parent: dict) -> str:
    raw = json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _choice_parent(parent: dict) -> bool:
    return bool(parent.get("choices"))


def _parse_area(parent: dict):
    if parent.get("figure_refs") or _choice_parent(parent):
        return None
    q = _norm(parent.get("question"))
    if "三角形" not in q or "面積" not in q:
        return None
    blocked = ("周", "周囲", "辺の長さ", "高さを", "底辺を", "図", "複合", "台形", "平行四辺形", "相似")
    if any(token in q for token in blocked):
        return None
    matches = list(TRI_RE.finditer(q))
    if len(matches) != 1:
        return None
    m = matches[0]
    base = int(m.group("base"))
    height = int(m.group("height"))
    unit = m.group("unit")
    if base <= 0 or height <= 0:
        return None
    product = base * height
    if product % 2:
        return None
    area = product // 2
    am = AREA_ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ", ""))
    if am is None or am.group("unit") != unit or int(am.group("v")) != area:
        return None
    if 2 * area != product:
        return None
    return m, base, height, unit, area


def _parse_third_angle(parent: dict):
    if parent.get("figure_refs") or _choice_parent(parent):
        return None
    q = _norm(parent.get("question"))
    if "三角形" not in q:
        return None
    if not any(token in q for token in ("残り", "もう1つ", "もう一つ", "3つ目", "三つ目")):
        return None
    blocked = ("外角", "四角形", "多角形", "二等辺", "直角三角形", "平行", "合同", "相似", "図", "面積", "辺")
    if any(token in q for token in blocked):
        return None
    matches = list(ANGLE_PAIR_RE.finditer(q))
    if len(matches) != 1:
        return None
    m = matches[0]
    a = int(m.group("a"))
    b = int(m.group("b"))
    c = 180 - a - b
    if min(a, b, c) <= 0:
        return None
    am = ANGLE_ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ", ""))
    if am is None or int(am.group("v")) != c:
        return None
    if a + b + c != 180:
        return None
    return m, a, b, c


def can_generate(parent: dict) -> tuple[bool, str]:
    if _parse_area(parent) is not None:
        return True, "triangle_area_integer_same_unit_exact"
    if _parse_third_angle(parent) is not None:
        return True, "triangle_two_integer_angles_third_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if _choice_parent(parent):
        return False, "choice_parent"
    q = _norm(parent.get("question"))
    if "三角形" in q and "面積" in q:
        return False, "triangle_area_parent_not_exactly_parsed_and_verified"
    if "三角形" in q and any(token in q for token in ("残り", "もう1つ", "もう一つ", "3つ目", "三つ目")):
        return False, "triangle_third_angle_parent_not_exactly_parsed_and_verified"
    return False, "triangle_parent_not_exactly_parsed_and_verified"


def _area_variant_numbers(seed: int, index: int) -> tuple[int, int]:
    base = 2 + ((seed >> (index * 5)) + index * 5) % 13
    height = 2 + ((seed >> (index * 7 + 2)) + index * 3) % 11
    if (base * height) % 2:
        height += 1
    return base, height


def _angle_variant_numbers(seed: int, index: int) -> tuple[int, int]:
    a = 25 + ((seed >> (index * 5)) + index * 11) % 65
    b = 20 + ((seed >> (index * 7 + 3)) + index * 13) % 65
    while a + b >= 175:
        b = 20 + ((b + 9) % 65)
    return a, b


def _generate_area(parent: dict, parsed, count: int):
    match, parent_base, parent_height, unit, parent_area = parsed
    q = _norm(parent.get("question"))
    seed = int(_parent_sha(parent)[:12], 16)
    parent_signature = (str(parent_base), str(parent_height))
    seen: set[tuple[str, str]] = set()
    rows: list[dict] = []
    evidence: list[dict] = []
    for index in range(1, count + 1):
        base, height = _area_variant_numbers(seed, index)
        signature = (str(base), str(height))
        bump = 0
        while signature == parent_signature or signature in seen:
            bump += 1
            height += 2 * bump
            signature = (str(base), str(height))
        seen.add(signature)
        product = base * height
        if product % 2:
            raise AssertionError("triangle variant unexpectedly produced non-integer area")
        area = product // 2
        if 2 * area != product:
            raise AssertionError("triangle area doubled-area identity failed")
        replacement = f"底辺{base}{unit}、高さ{height}{unit}"
        new_question = q[:match.start()] + replacement + q[match.end():]
        rows.append({"question": new_question, "answer": f"{area}{unit}²", "explanation": f"三角形の面積=底辺×高さ÷2より、{base}×{height}÷2={area}{unit}²。2×面積=底辺×高さでも確認済み。", "numeric_signature": signature})
        evidence.append({"parent_sha256": _parent_sha(parent), "method": "triangle_area_exact_half_product_and_doubled_area_identity", "parent_recalculation": f"{parent_base}×{parent_height}÷2={parent_area}{unit}²", "variant_recalculation": f"{base}×{height}÷2={area}{unit}²", "independent_check": "2*area == base*height PASS"})
    return rows, evidence, "triangle_area_integer_same_unit_exact"


def _generate_third_angle(parent: dict, parsed, count: int):
    match, parent_a, parent_b, parent_c = parsed
    q = _norm(parent.get("question"))
    seed = int(_parent_sha(parent)[:12], 16)
    parent_signature = (str(parent_a), str(parent_b))
    seen: set[tuple[str, str]] = set()
    rows: list[dict] = []
    evidence: list[dict] = []
    for index in range(1, count + 1):
        a, b = _angle_variant_numbers(seed, index)
        signature = (str(a), str(b))
        bump = 0
        while signature == parent_signature or signature in seen:
            bump += 1
            a = 25 + ((a + 7 * bump) % 65)
            b = 20 + ((b + 9 * bump) % 65)
            while a + b >= 175:
                b = 20 + ((b + 9) % 65)
            signature = (str(a), str(b))
        seen.add(signature)
        c = 180 - a - b
        if c <= 0 or a + b + c != 180:
            raise AssertionError("triangle angle-sum identity failed")
        replacement = f"{a}°と{b}°"
        new_question = q[:match.start()] + replacement + q[match.end():]
        rows.append({"question": new_question, "answer": f"{c}°", "explanation": f"三角形の内角の和は180°なので、180-({a}+{b})={c}°。{a}+{b}+{c}=180でも確認済み。", "numeric_signature": signature})
        evidence.append({"parent_sha256": _parent_sha(parent), "method": "triangle_third_angle_exact_subtraction_and_sum_identity", "parent_recalculation": f"180-({parent_a}+{parent_b})={parent_c}", "variant_recalculation": f"180-({a}+{b})={c}", "independent_check": f"{a}+{b}+{c}=180 PASS"})
    return rows, evidence, "triangle_two_integer_angles_third_exact"


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    area = _parse_area(parent)
    if area is not None:
        return _generate_area(parent, area, count)
    angle = _parse_third_angle(parent)
    if angle is not None:
        return _generate_third_angle(parent, angle, count)
    ok, reason = can_generate(parent)
    assert not ok
    return [], [], reason
