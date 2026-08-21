from __future__ import annotations

"""Fail-closed exact engine for a narrow square-area parent shape.

Only actual parents that explicitly state exactly one positive integer side in
cm, ask only for the area of a square, and have an exactly verified integer
cm^2 answer are accepted. Parent and generated answers are recalculated by
A=s^2 and independently checked by exact integer square-root identity.
Figures, choices, mixed units, perimeter/diagonal/reverse questions and
ambiguous multiple-side statements fail closed.
"""

import hashlib
import json
import math
import re

SIDE_RE = re.compile(r"(?:1辺|一辺)\s*(?P<side>\d+)\s*cm")
ANSWER_RE = re.compile(r"^(?P<area>\d+)\s*(?:cm\^?2|cm²|㎠)$")


def _norm(value: object) -> str:
    return (
        str(value or "")
        .replace("　", " ")
        .replace("ｃｍ", "cm")
        .replace("ＣＭ", "cm")
        .replace("平方センチメートル", "cm²")
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
    if "正方形" not in q or "面積" not in q:
        return None
    blocked = (
        "周", "周の長さ", "対角線", "辺の長さを", "一辺を", "1辺を", "図", "mm", "m²", "m2", "メートル",
    )
    if any(token in q for token in blocked):
        return None
    matches = list(SIDE_RE.finditer(q))
    if len(matches) != 1:
        return None
    match = matches[0]
    side = int(match.group("side"))
    if side <= 0:
        return None
    area = side * side
    answer = _norm(parent.get("answer")).replace(" ", "")
    am = ANSWER_RE.fullmatch(answer)
    if am is None or int(am.group("area")) != area:
        return None
    root = math.isqrt(area)
    if root * root != area or root != side:
        return None
    return match, side, area


def can_generate(parent: dict) -> tuple[bool, str]:
    if _parse_parent(parent) is not None:
        return True, "square_integer_cm_area_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices") is not None:
        return False, "choice_parent"
    return False, "square_area_parent_not_exactly_parsed_and_verified"


def _variant_side(seed: int, index: int) -> int:
    return 2 + ((seed >> (index * 5)) + index * 7) % 24


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    parsed = _parse_parent(parent)
    if parsed is None:
        ok, reason = can_generate(parent)
        assert not ok
        return [], [], reason

    match, parent_side, parent_area = parsed
    q = _norm(parent.get("question"))
    seed = int(_parent_sha(parent)[:12], 16)
    seen: set[int] = set()
    rows: list[dict] = []
    evidence: list[dict] = []

    for index in range(1, count + 1):
        side = _variant_side(seed, index)
        while side == parent_side or side in seen:
            side += 1
        seen.add(side)
        area = side * side
        root = math.isqrt(area)
        if root * root != area or root != side:
            raise AssertionError("square-root inverse identity failed")
        replacement = f"1辺{side}cm"
        new_question = q[:match.start()] + replacement + q[match.end():]
        rows.append({
            "question": new_question,
            "answer": f"{area}cm²",
            "explanation": f"正方形の面積=1辺×1辺より、{side}×{side}={area}cm²。平方根の逆算でも確認済み。",
            "numeric_signature": (str(side),),
        })
        evidence.append({
            "parent_sha256": _parent_sha(parent),
            "method": "square_exact_product_and_integer_square_root_identity",
            "parent_recalculation": f"{parent_side}×{parent_side}={parent_area}cm²",
            "variant_recalculation": f"{side}×{side}={area}cm²",
            "independent_check": "isqrt(A)^2 == A AND isqrt(A) == side PASS",
        })
    return rows, evidence, "square_integer_cm_area_exact"
