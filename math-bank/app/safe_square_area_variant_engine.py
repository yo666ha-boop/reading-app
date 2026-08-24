from __future__ import annotations

"""Fail-closed exact engine for narrow square area/perimeter parent shapes.

Direct side->area/perimeter questions are handled here. Exact area/perimeter ->
side inverse questions are delegated to dedicated fail-closed engines so the
unified runtime reaches all safe square variants through one route.
"""

import hashlib
import json
import math
import re

from safe_square_side_from_area_variant_engine import generate as generate_side_from_area
from safe_square_side_from_perimeter_variant_engine import generate as generate_side_from_perimeter

SIDE_RE = re.compile(r"(?:1辺|一辺)\s*(?P<side>\d+)\s*cm")
AREA_ANSWER_RE = re.compile(r"^(?P<area>\d+)\s*(?:cm\^?2|cm²|㎠)$")
PERIMETER_ANSWER_RE = re.compile(r"^(?P<perimeter>\d+)\s*cm$")


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
    if "正方形" not in q:
        return None
    blocked = (
        "対角線", "辺の長さを", "一辺を", "1辺を", "図", "mm", "m²", "m2", "メートル",
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
    answer = _norm(parent.get("answer")).replace(" ", "")

    asks_area = "面積" in q
    asks_perimeter = any(token in q for token in ("周の長さ", "周りの長さ", "まわりの長さ"))
    if asks_area == asks_perimeter:
        return None

    if asks_area:
        area = side * side
        am = AREA_ANSWER_RE.fullmatch(answer)
        if am is None or int(am.group("area")) != area:
            return None
        root = math.isqrt(area)
        if root * root != area or root != side:
            return None
        return "area", match, side, area

    perimeter = 4 * side
    pm = PERIMETER_ANSWER_RE.fullmatch(answer)
    if pm is None or int(pm.group("perimeter")) != perimeter:
        return None
    if perimeter % 4 != 0 or perimeter // 4 != side:
        return None
    return "perimeter", match, side, perimeter


def can_generate(parent: dict) -> tuple[bool, str]:
    rows, _, reason = generate_side_from_area(parent, 1)
    if rows:
        return True, reason
    rows, _, reason = generate_side_from_perimeter(parent, 1)
    if rows:
        return True, reason
    parsed = _parse_parent(parent)
    if parsed is not None:
        return True, "square_integer_cm_area_exact" if parsed[0] == "area" else "square_integer_cm_perimeter_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices"):
        return False, "choice_parent"
    return False, "square_parent_not_exactly_parsed_and_verified"


def _variant_side(seed: int, index: int) -> int:
    return 2 + ((seed >> (index * 5)) + index * 7) % 24


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    rows, evidence, reason = generate_side_from_area(parent, count)
    if rows:
        return rows, evidence, reason
    rows, evidence, reason = generate_side_from_perimeter(parent, count)
    if rows:
        return rows, evidence, reason
    parsed = _parse_parent(parent)
    if parsed is None:
        ok, reason = can_generate(parent)
        assert not ok
        return [], [], reason

    mode, match, parent_side, parent_value = parsed
    q = _norm(parent.get("question"))
    seed = int(_parent_sha(parent)[:12], 16)
    seen: set[int] = set()
    rows = []
    evidence = []

    for index in range(1, count + 1):
        side = _variant_side(seed, index)
        while side == parent_side or side in seen:
            side += 1
        seen.add(side)
        replacement = f"1辺{side}cm"
        new_question = q[:match.start()] + replacement + q[match.end():]

        if mode == "area":
            value = side * side
            root = math.isqrt(value)
            if root * root != value or root != side:
                raise AssertionError("square-root inverse identity failed")
            rows.append({"question": new_question,"answer": f"{value}cm²","explanation": f"正方形の面積=1辺×1辺より、{side}×{side}={value}cm²。平方根の逆算でも確認済み。","numeric_signature": (str(side),)})
            evidence.append({"parent_sha256": _parent_sha(parent),"method": "square_exact_product_and_integer_square_root_identity","parent_recalculation": f"{parent_side}×{parent_side}={parent_value}cm²","variant_recalculation": f"{side}×{side}={value}cm²","independent_check": "isqrt(A)^2 == A AND isqrt(A) == side PASS"})
        else:
            value = 4 * side
            if value % 4 != 0 or value // 4 != side:
                raise AssertionError("square perimeter inverse identity failed")
            rows.append({"question": new_question,"answer": f"{value}cm","explanation": f"正方形の周の長さ=1辺×4より、{side}×4={value}cm。4で割る逆算でも確認済み。","numeric_signature": (str(side),)})
            evidence.append({"parent_sha256": _parent_sha(parent),"method": "square_perimeter_exact_quadruple_and_inverse_identity","parent_recalculation": f"{parent_side}×4={parent_value}cm","variant_recalculation": f"{side}×4={value}cm","independent_check": "perimeter/4 == side PASS"})

    reason = "square_integer_cm_area_exact" if mode == "area" else "square_integer_cm_perimeter_exact"
    return rows, evidence, reason
