from __future__ import annotations

"""Fail-closed exact engine for a narrow cube-volume parent shape.

Only actual parents that explicitly state exactly one positive integer side in
cm, ask only for the volume of a cube, and have an exactly verified integer
cm^3 answer are accepted. Parent and generated answers are recalculated by
V=s^3 and independently checked by exact integer cube-root identity.
Figures, choices, surface-area/edge-sum/reverse questions, mixed units and
ambiguous multiple-side statements fail closed.
"""

import hashlib
import json
import re

SIDE_RE = re.compile(r"(?:1辺|一辺)\s*(?P<side>\d+)\s*cm")
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


def _exact_cube_root(value: int) -> int | None:
    if value < 0:
        return None
    lo, hi = 0, max(1, value)
    while lo <= hi:
        mid = (lo + hi) // 2
        cube = mid * mid * mid
        if cube == value:
            return mid
        if cube < value:
            lo = mid + 1
        else:
            hi = mid - 1
    return None


def _parse_parent(parent: dict):
    if parent.get("figure_refs"):
        return None
    if parent.get("choices") is not None:
        return None
    q = _norm(parent.get("question"))
    if "立方体" not in q or "体積" not in q:
        return None
    blocked = (
        "表面積", "辺の長さを", "一辺を", "1辺を", "辺の合計", "図", "mm", "m³", "m3", "メートル",
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
    volume = side * side * side
    answer = _norm(parent.get("answer")).replace(" ", "")
    am = ANSWER_RE.fullmatch(answer)
    if am is None or int(am.group("volume")) != volume:
        return None
    if _exact_cube_root(volume) != side:
        return None
    return match, side, volume


def can_generate(parent: dict) -> tuple[bool, str]:
    if _parse_parent(parent) is not None:
        return True, "cube_integer_cm_volume_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices") is not None:
        return False, "choice_parent"
    return False, "cube_volume_parent_not_exactly_parsed_and_verified"


def _variant_side(seed: int, index: int) -> int:
    return 2 + ((seed >> (index * 5)) + index * 11) % 18


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    parsed = _parse_parent(parent)
    if parsed is None:
        ok, reason = can_generate(parent)
        assert not ok
        return [], [], reason

    match, parent_side, parent_volume = parsed
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
        volume = side * side * side
        if _exact_cube_root(volume) != side:
            raise AssertionError("cube-root inverse identity failed")
        replacement = f"1辺{side}cm"
        new_question = q[:match.start()] + replacement + q[match.end():]
        rows.append({
            "question": new_question,
            "answer": f"{volume}cm³",
            "explanation": f"立方体の体積=1辺×1辺×1辺より、{side}×{side}×{side}={volume}cm³。整数の立方根でも逆算確認済み。",
            "numeric_signature": (str(side),),
        })
        evidence.append({
            "parent_sha256": _parent_sha(parent),
            "method": "cube_exact_product_and_integer_cube_root_identity",
            "parent_recalculation": f"{parent_side}×{parent_side}×{parent_side}={parent_volume}cm³",
            "variant_recalculation": f"{side}×{side}×{side}={volume}cm³",
            "independent_check": "exact_integer_cube_root(V) == side PASS",
        })
    return rows, evidence, "cube_integer_cm_volume_exact"
