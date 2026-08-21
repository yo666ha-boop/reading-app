from __future__ import annotations

"""Fail-closed exact engine for a narrow triangle-area parent shape.

Only actual parents that explicitly state one base and one height in the same
unit, ask only for the area of one triangle, and have an exactly verified
integer area are accepted. The parent answer is recalculated by base*height/2
and independently checked by the doubled-area identity 2*area == base*height.
Figure/choice parents and perimeter/unknown-height/composite/mixed-unit or
non-integer-area questions fail closed.
"""

import hashlib
import json
import re

TRI_RE = re.compile(
    r"底辺\s*(?P<base>\d+)\s*(?P<unit>mm|cm|m)\s*[、,，]?\s*高さ\s*(?P<height>\d+)\s*(?P=unit)"
)
AREA_ANSWER_RE = re.compile(r"^(?P<v>\d+)\s*(?P<unit>mm|cm|m)(?:²|\^2|2)$")


def _norm(value: object) -> str:
    return str(value or "").replace("　", " ").replace("㎠", "cm²").replace("㎡", "m²").replace("㎟", "mm²")


def _parent_sha(parent: dict) -> str:
    raw = json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _parse_parent(parent: dict):
    if parent.get("figure_refs"):
        return None
    if parent.get("choices") is not None:
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


def can_generate(parent: dict) -> tuple[bool, str]:
    parsed = _parse_parent(parent)
    if parsed is not None:
        return True, "triangle_area_integer_same_unit_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices") is not None:
        return False, "choice_parent"
    return False, "triangle_area_parent_not_exactly_parsed_and_verified"


def _variant_numbers(seed: int, index: int) -> tuple[int, int]:
    base = 2 + ((seed >> (index * 5)) + index * 5) % 13
    height = 2 + ((seed >> (index * 7 + 2)) + index * 3) % 11
    if (base * height) % 2:
        height += 1
    return base, height


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    parsed = _parse_parent(parent)
    if parsed is None:
        ok, reason = can_generate(parent)
        assert not ok
        return [], [], reason

    match, parent_base, parent_height, unit, parent_area = parsed
    q = _norm(parent.get("question"))
    seed = int(_parent_sha(parent)[:12], 16)
    parent_signature = (str(parent_base), str(parent_height))
    seen: set[tuple[str, str]] = set()
    rows: list[dict] = []
    evidence: list[dict] = []

    for index in range(1, count + 1):
        base, height = _variant_numbers(seed, index)
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
        rows.append({
            "question": new_question,
            "answer": f"{area}{unit}²",
            "explanation": f"三角形の面積=底辺×高さ÷2より、{base}×{height}÷2={area}{unit}²。2×面積=底辺×高さでも確認済み。",
            "numeric_signature": signature,
        })
        evidence.append({
            "parent_sha256": _parent_sha(parent),
            "method": "triangle_area_exact_half_product_and_doubled_area_identity",
            "parent_recalculation": f"{parent_base}×{parent_height}÷2={parent_area}{unit}²",
            "variant_recalculation": f"{base}×{height}÷2={area}{unit}²",
            "independent_check": "2*area == base*height PASS",
        })
    return rows, evidence, "triangle_area_integer_same_unit_exact"
