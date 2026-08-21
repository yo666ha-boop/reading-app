from __future__ import annotations

"""Fail-closed exact engine for a narrow parallelogram-area parent shape.

Only actual parents that explicitly state one base and one height in the same
unit, ask only for the area of one parallelogram, and have an exactly verified
integer area are accepted. The parent answer is recalculated by base*height
and independently checked by both inverse identities area/base == height and
area/height == base. Figure/choice parents and perimeter/unknown-height/
composite/mixed-unit questions fail closed.
"""

import hashlib
import json
import re

PARALLELOGRAM_RE = re.compile(
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
    if "平行四辺形" not in q or "面積" not in q:
        return None
    blocked = ("周", "周囲", "辺の長さ", "高さを", "底辺を", "図", "複合", "台形", "三角形", "相似")
    if any(token in q for token in blocked):
        return None
    matches = list(PARALLELOGRAM_RE.finditer(q))
    if len(matches) != 1:
        return None
    m = matches[0]
    base = int(m.group("base"))
    height = int(m.group("height"))
    unit = m.group("unit")
    if base <= 0 or height <= 0:
        return None
    area = base * height
    am = AREA_ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ", ""))
    if am is None or am.group("unit") != unit or int(am.group("v")) != area:
        return None
    if area // base != height or area // height != base:
        return None
    return m, base, height, unit, area


def can_generate(parent: dict) -> tuple[bool, str]:
    parsed = _parse_parent(parent)
    if parsed is not None:
        return True, "parallelogram_area_integer_same_unit_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices") is not None:
        return False, "choice_parent"
    return False, "parallelogram_area_parent_not_exactly_parsed_and_verified"


def _variant_numbers(seed: int, index: int) -> tuple[int, int]:
    base = 3 + ((seed >> (index * 5)) + index * 7) % 14
    height = 2 + ((seed >> (index * 7 + 1)) + index * 5) % 12
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
            height += bump
            signature = (str(base), str(height))
        seen.add(signature)
        area = base * height
        if area // base != height or area // height != base:
            raise AssertionError("parallelogram inverse-area identity failed")
        replacement = f"底辺{base}{unit}、高さ{height}{unit}"
        new_question = q[:match.start()] + replacement + q[match.end():]
        rows.append({
            "question": new_question,
            "answer": f"{area}{unit}²",
            "explanation": f"平行四辺形の面積=底辺×高さより、{base}×{height}={area}{unit}²。面積÷底辺=高さ、面積÷高さ=底辺でも確認済み。",
            "numeric_signature": signature,
        })
        evidence.append({
            "parent_sha256": _parent_sha(parent),
            "method": "parallelogram_area_exact_product_and_inverse_identity",
            "parent_recalculation": f"{parent_base}×{parent_height}={parent_area}{unit}²",
            "variant_recalculation": f"{base}×{height}={area}{unit}²",
            "independent_check": "area/base == height and area/height == base PASS",
        })
    return rows, evidence, "parallelogram_area_integer_same_unit_exact"
