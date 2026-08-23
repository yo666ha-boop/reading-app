from __future__ import annotations

"""Fail-closed exact engine for rectangular-prism volume and safe inverse height.

Forward mode accepts exactly one integer length, width and height in cm and asks
only for volume. Reverse-height mode is delegated to a dedicated fail-closed
engine that accepts integer length, width and volume and asks only for height.
All accepted cases require exact parent-answer verification and independent
recomposition. Figures, real choices, mixed units and ambiguous shapes fail
closed.
"""

import hashlib
import json
import re

from safe_rectangular_prism_height_from_volume_variant_engine import (
    can_generate as can_generate_height_from_volume,
    generate as generate_height_from_volume,
)

DIMENSION_RE = re.compile(
    r"たて\s*(?P<length>\d+)\s*cm\s*[、, ]*よこ\s*(?P<width>\d+)\s*cm\s*[、, ]*高さ\s*(?P<height>\d+)\s*cm"
)
ANSWER_RE = re.compile(r"^(?P<volume>\d+)\s*(?:cm\^?3|cm³|㎤)$")


def _norm(value: object) -> str:
    return (
        str(value or "")
        .replace("　", " ")
        .replace("ｃｍ", "cm")
        .replace("ＣＭ", "cm")
        .replace("立方センチメートル", "cm³")
    )


def _parent_sha(parent: dict) -> str:
    raw = json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _parse_parent(parent: dict):
    if parent.get("figure_refs"):
        return None
    if parent.get("choices") is not None:
        return None
    q = _norm(parent.get("question"))
    if "直方体" not in q or "体積" not in q:
        return None
    blocked = (
        "表面積", "辺の長さを", "高さを", "たてを", "よこを", "何cmですか",
        "立方体", "展開図", "図", "容積", "L", "mL", "mm", "メートル",
    )
    if any(token in q for token in blocked):
        return None
    matches = list(DIMENSION_RE.finditer(q))
    if len(matches) != 1:
        return None
    m = matches[0]
    length = int(m.group("length"))
    width = int(m.group("width"))
    height = int(m.group("height"))
    if min(length, width, height) <= 0:
        return None
    volume = length * width * height
    answer = _norm(parent.get("answer")).replace(" ", "")
    am = ANSWER_RE.fullmatch(answer)
    if am is None or int(am.group("volume")) != volume:
        return None
    if volume % length or volume // length != width * height:
        return None
    if volume % width or volume // width != length * height:
        return None
    if volume % height or volume // height != length * width:
        return None
    return m, length, width, height, volume


def can_generate(parent: dict) -> tuple[bool, str]:
    inverse_ok, inverse_reason = can_generate_height_from_volume(parent)
    if inverse_ok:
        return True, inverse_reason
    if _parse_parent(parent) is not None:
        return True, "rectangular_prism_integer_cm_volume_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices") is not None:
        return False, "choice_parent"
    return False, "rectangular_prism_parent_not_exactly_parsed_and_verified"


def _variant_numbers(seed: int, index: int) -> tuple[int, int, int]:
    length = 2 + ((seed >> (index * 3)) + index * 5) % 18
    width = 2 + ((seed >> (index * 5 + 1)) + index * 7) % 16
    height = 2 + ((seed >> (index * 7 + 2)) + index * 3) % 14
    return length, width, height


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")

    inverse_rows, inverse_evidence, inverse_reason = generate_height_from_volume(parent, count)
    if inverse_rows:
        return inverse_rows, inverse_evidence, inverse_reason

    parsed = _parse_parent(parent)
    if parsed is None:
        ok, reason = can_generate(parent)
        assert not ok
        return [], [], reason

    match, parent_length, parent_width, parent_height, parent_volume = parsed
    q = _norm(parent.get("question"))
    seed = int(_parent_sha(parent)[:12], 16)
    parent_signature = (str(parent_length), str(parent_width), str(parent_height))
    seen: set[tuple[str, str, str]] = set()
    rows: list[dict] = []
    evidence: list[dict] = []

    for index in range(1, count + 1):
        length, width, height = _variant_numbers(seed, index)
        signature = (str(length), str(width), str(height))
        bump = 0
        while signature == parent_signature or signature in seen:
            bump += 1
            length += bump
            signature = (str(length), str(width), str(height))
        seen.add(signature)
        volume = length * width * height
        if volume // length != width * height or volume % length:
            raise AssertionError("length inverse identity failed")
        if volume // width != length * height or volume % width:
            raise AssertionError("width inverse identity failed")
        if volume // height != length * width or volume % height:
            raise AssertionError("height inverse identity failed")
        replacement = f"たて{length}cm、よこ{width}cm、高さ{height}cm"
        new_question = q[:match.start()] + replacement + q[match.end():]
        rows.append({
            "question": new_question,
            "answer": f"{volume}cm³",
            "explanation": f"直方体の体積=たて×よこ×高さより、{length}×{width}×{height}={volume}cm³。3方向の逆算でも確認済み。",
            "numeric_signature": signature,
        })
        evidence.append({
            "parent_sha256": _parent_sha(parent),
            "method": "rectangular_prism_exact_product_and_three_inverse_identities",
            "parent_recalculation": f"{parent_length}×{parent_width}×{parent_height}={parent_volume}cm³",
            "variant_recalculation": f"{length}×{width}×{height}={volume}cm³",
            "independent_check": "V/l == w*h AND V/w == l*h AND V/h == l*w PASS",
        })
    return rows, evidence, "rectangular_prism_integer_cm_volume_exact"
