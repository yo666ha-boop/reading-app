from __future__ import annotations

"""Fail-closed exact engine for cube side length from exact surface area."""

import hashlib
import json
import math
import re

AREA_RE = re.compile(r"(?:表面積(?:が|は)?\s*)(?P<area>\d+)\s*(?:cm\^?2|cm²|㎠)")
ANSWER_RE = re.compile(r"^(?P<side>\d+)\s*cm$")


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
    if parent.get("choices"):
        return None
    q = _norm(parent.get("question"))
    if "立方体" not in q or "表面積" not in q:
        return None
    if not any(token in q for token in ("1辺を求", "一辺を求", "辺の長さを求", "1辺は何", "一辺は何")):
        return None
    blocked = ("体積", "図", "mm", "メートル", "直方体", "辺の合計")
    if any(token in q for token in blocked):
        return None
    matches = list(AREA_RE.finditer(q))
    if len(matches) != 1:
        return None
    match = matches[0]
    area = int(match.group("area"))
    if area <= 0 or area % 6 != 0:
        return None
    square = area // 6
    side = math.isqrt(square)
    if side <= 0 or side * side != square:
        return None
    answer = _norm(parent.get("answer")).replace(" ", "")
    am = ANSWER_RE.fullmatch(answer)
    if am is None or int(am.group("side")) != side:
        return None
    if 6 * side * side != area:
        return None
    return match, area, side


def can_generate(parent: dict) -> tuple[bool, str]:
    if _parse_parent(parent) is not None:
        return True, "cube_surface_area_to_integer_side_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices"):
        return False, "choice_parent"
    return False, "cube_side_from_surface_area_parent_not_exactly_parsed_and_verified"


def _variant_side(seed: int, index: int) -> int:
    return 2 + ((seed >> (index * 6)) + index * 19) % 18


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    parsed = _parse_parent(parent)
    if parsed is None:
        ok, reason = can_generate(parent)
        assert not ok
        return [], [], reason

    match, parent_area, parent_side = parsed
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
        area = 6 * side * side
        if area // 6 != side * side or math.isqrt(area // 6) != side:
            raise AssertionError("cube side-from-surface-area identity failed")
        replacement = f"表面積が{area}cm²"
        new_question = q[:match.start()] + replacement + q[match.end():]
        rows.append({
            "question": new_question,
            "answer": f"{side}cm",
            "explanation": f"立方体の表面積=6×1辺²より、{area}÷6={side * side}。その正の平方根は{side}なので、1辺は{side}cm。6×{side}²={area}cm²でも確認済み。",
            "numeric_signature": (str(area),),
        })
        evidence.append({
            "parent_sha256": _parent_sha(parent),
            "method": "cube_side_from_surface_area_exact_division_square_root_and_recomposition",
            "parent_recalculation": f"{parent_area}÷6={parent_side * parent_side}; sqrt={parent_side}cm",
            "variant_recalculation": f"{area}÷6={side * side}; sqrt={side}cm",
            "independent_check": f"6×{side}²={area}cm² PASS",
        })
    return rows, evidence, "cube_surface_area_to_integer_side_exact"
