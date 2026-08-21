from __future__ import annotations

"""Fail-closed exact engine for a narrow rectangle-area parent shape.

Only actual parents that explicitly state one rectangle with one vertical and
one horizontal integer length in the same unit, and ask only for its area, are
accepted. The parent answer is recalculated exactly and independently checked
by the inverse identity area/one_side == other_side before variants are made.
Figure/choice parents, perimeter/unknown-side/composite/diagram-dependent or
mixed-unit questions fail closed.
"""

import hashlib
import json
import re

RECT_RE = re.compile(
    r"たて\s*(?P<h>\d+)\s*(?P<unit>mm|cm|m)\s*[、,，]?\s*横\s*(?P<w>\d+)\s*(?P=unit)"
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
    if "長方形" not in q or "面積" not in q:
        return None
    blocked = ("周", "周囲", "辺の長さ", "横の長さ", "たての長さ", "図", "複合", "正方形")
    if any(token in q for token in blocked):
        return None
    matches = list(RECT_RE.finditer(q))
    if len(matches) != 1:
        return None
    m = matches[0]
    h = int(m.group("h"))
    w = int(m.group("w"))
    unit = m.group("unit")
    if h <= 0 or w <= 0:
        return None
    am = AREA_ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ", ""))
    if am is None or am.group("unit") != unit:
        return None
    area = h * w
    if int(am.group("v")) != area:
        return None
    # Independent identity checks in both directions.
    if area // h != w or area // w != h or area % h or area % w:
        return None
    return m, h, w, unit, area


def can_generate(parent: dict) -> tuple[bool, str]:
    parsed = _parse_parent(parent)
    if parsed is not None:
        return True, "rectangle_area_integer_same_unit_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices") is not None:
        return False, "choice_parent"
    return False, "rectangle_area_parent_not_exactly_parsed_and_verified"


def _variant_numbers(seed: int, index: int) -> tuple[int, int]:
    h = 2 + ((seed >> (index * 5)) + index * 3) % 11
    w = 3 + ((seed >> (index * 7 + 3)) + index * 5) % 13
    return h, w


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    parsed = _parse_parent(parent)
    if parsed is None:
        ok, reason = can_generate(parent)
        assert not ok
        return [], [], reason

    match, parent_h, parent_w, unit, parent_area = parsed
    q = _norm(parent.get("question"))
    seed = int(_parent_sha(parent)[:12], 16)
    parent_signature = (str(parent_h), str(parent_w))
    seen: set[tuple[str, str]] = set()
    rows: list[dict] = []
    evidence: list[dict] = []

    for index in range(1, count + 1):
        h, w = _variant_numbers(seed, index)
        signature = (str(h), str(w))
        bump = 0
        while signature == parent_signature or signature in seen:
            bump += 1
            w += bump
            signature = (str(h), str(w))
        seen.add(signature)
        area = h * w
        if area // h != w or area // w != h or area % h or area % w:
            raise AssertionError("rectangle area independent verification failed")
        replacement = f"たて{h}{unit}、横{w}{unit}"
        new_question = q[:match.start()] + replacement + q[match.end():]
        rows.append({
            "question": new_question,
            "answer": f"{area}{unit}²",
            "explanation": f"長方形の面積=たて×横より、{h}×{w}={area}{unit}²。面積÷各辺でも逆算確認済み。",
            "numeric_signature": signature,
        })
        evidence.append({
            "parent_sha256": _parent_sha(parent),
            "method": "rectangle_area_exact_product_and_inverse_identity",
            "parent_recalculation": f"{parent_h}×{parent_w}={parent_area}{unit}²",
            "variant_recalculation": f"{h}×{w}={area}{unit}²",
            "independent_check": "area/height == width and area/width == height PASS",
        })
    return rows, evidence, "rectangle_area_integer_same_unit_exact"
