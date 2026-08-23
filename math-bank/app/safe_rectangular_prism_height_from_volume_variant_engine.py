from __future__ import annotations

"""Fail-closed exact engine for rectangular-prism height from volume.

Accepted parents must be text-only, non-choice problems that explicitly give
one positive integer length, one positive integer width and one positive integer
volume in cm^3, then ask only for the height in cm. The supplied volume must be
exactly divisible by length*width and the verified answer must equal that
integer quotient. Generated variants are independently checked by recomposition
length*width*height == volume.
"""

import hashlib
import json
import re

DATA_RE = re.compile(
    r"たて\s*(?P<length>\d+)\s*cm\s*[、, ]*よこ\s*(?P<width>\d+)\s*cm.*?体積(?:が|は)?\s*(?P<volume>\d+)\s*(?:cm\^?3|cm³|㎤)"
)
ANSWER_RE = re.compile(r"^(?P<height>\d+)\s*cm$")


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
    if parent.get("choices"):
        return None
    q = _norm(parent.get("question"))
    if "直方体" not in q or "体積" not in q or "高さ" not in q:
        return None
    if not any(token in q for token in ("高さを求", "高さは何", "高さはなん")):
        return None
    blocked = ("表面積", "立方体", "展開図", "図", "容積", "L", "mL", "mm", "メートル", "たてを求", "よこを求")
    if any(token in q for token in blocked):
        return None
    matches = list(DATA_RE.finditer(q))
    if len(matches) != 1:
        return None
    m = matches[0]
    length = int(m.group("length"))
    width = int(m.group("width"))
    volume = int(m.group("volume"))
    if min(length, width, volume) <= 0:
        return None
    base = length * width
    if volume % base:
        return None
    height = volume // base
    if height <= 0:
        return None
    am = ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ", ""))
    if am is None or int(am.group("height")) != height:
        return None
    if length * width * height != volume:
        return None
    return m, length, width, volume, height


def can_generate(parent: dict) -> tuple[bool, str]:
    if _parse_parent(parent) is not None:
        return True, "rectangular_prism_integer_height_from_volume_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices"):
        return False, "choice_parent"
    return False, "rectangular_prism_height_from_volume_parent_not_exactly_parsed_and_verified"


def _variant_dimensions(seed: int, index: int) -> tuple[int, int, int]:
    length = 2 + ((seed >> (index * 3)) + index * 5) % 14
    width = 2 + ((seed >> (index * 5 + 1)) + index * 7) % 12
    height = 2 + ((seed >> (index * 7 + 2)) + index * 3) % 11
    return length, width, height


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    parsed = _parse_parent(parent)
    if parsed is None:
        ok, reason = can_generate(parent)
        assert not ok
        return [], [], reason

    match, parent_length, parent_width, parent_volume, parent_height = parsed
    question = _norm(parent.get("question"))
    seed = int(_parent_sha(parent)[:12], 16)
    parent_signature = (str(parent_length), str(parent_width), str(parent_volume))
    seen: set[tuple[str, str, str]] = set()
    rows: list[dict] = []
    evidence: list[dict] = []

    for index in range(1, count + 1):
        length, width, height = _variant_dimensions(seed, index)
        volume = length * width * height
        signature = (str(length), str(width), str(volume))
        while signature == parent_signature or signature in seen:
            height += 1
            volume = length * width * height
            signature = (str(length), str(width), str(volume))
        seen.add(signature)
        if volume % (length * width) or volume // (length * width) != height:
            raise AssertionError("rectangular prism height inverse identity failed")
        replacement = f"たて{length}cm、よこ{width}cm、体積が{volume}cm³"
        new_question = question[:match.start()] + replacement + question[match.end():]
        rows.append({
            "question": new_question,
            "answer": f"{height}cm",
            "explanation": f"高さ=体積÷(たて×よこ)より、{volume}÷({length}×{width})={height}cm。{length}×{width}×{height}={volume}cm³でも再確認済み。",
            "numeric_signature": signature,
        })
        evidence.append({
            "parent_sha256": _parent_sha(parent),
            "method": "rectangular_prism_height_from_volume_exact_division_and_recomposition",
            "parent_recalculation": f"{parent_volume}÷({parent_length}×{parent_width})={parent_height}cm",
            "variant_recalculation": f"{volume}÷({length}×{width})={height}cm",
            "independent_check": f"{length}×{width}×{height}={volume}cm³ PASS",
        })
    return rows, evidence, "rectangular_prism_integer_height_from_volume_exact"
