from __future__ import annotations

"""Fail-closed exact engine for cube side length from exact integer volume."""

import hashlib
import json
import re

VOLUME_RE = re.compile(r"(?:体積(?:が|は)?\s*)(?P<volume>\d+)\s*(?:cm\^?3|cm³|㎤)")
ANSWER_RE = re.compile(r"^(?P<side>\d+)\s*cm$")


def _norm(value: object) -> str:
    return (
        str(value or "")
        .replace("　", " ")
        .replace("ｃｍ", "cm")
        .replace("ＣＭ", "cm")
        .replace("立方センチメートル", "cm³")
    )


def _parent_sha(parent: dict) -> str:
    raw = json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ",")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _exact_cube_root(value: int) -> int | None:
    if value <= 0:
        return None
    lo, hi = 1, value
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
    if parent.get("choices"):
        return None
    q = _norm(parent.get("question"))
    if "立方体" not in q or "体積" not in q:
        return None
    if not any(token in q for token in ("1辺を求", "一辺を求", "辺の長さを求", "1辺は何", "一辺は何")):
        return None
    blocked = ("表面積", "図", "mm", "メートル", "直方体", "辺の合計")
    if any(token in q for token in blocked):
        return None
    matches = list(VOLUME_RE.finditer(q))
    if len(matches) != 1:
        return None
    match = matches[0]
    volume = int(match.group("volume"))
    side = _exact_cube_root(volume)
    if side is None:
        return None
    answer = _norm(parent.get("answer")).replace(" ", "")
    am = ANSWER_RE.fullmatch(answer)
    if am is None or int(am.group("side")) != side:
        return None
    if side * side * side != volume:
        return None
    return match, volume, side


def can_generate(parent: dict) -> tuple[bool, str]:
    if _parse_parent(parent) is not None:
        return True, "cube_volume_to_integer_side_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices"):
        return False, "choice_parent"
    return False, "cube_side_from_volume_parent_not_exactly_parsed_and_verified"


def _variant_side(seed: int, index: int) -> int:
    return 2 + ((seed >> (index * 5)) + index * 17) % 18


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    parsed = _parse_parent(parent)
    if parsed is None:
        ok, reason = can_generate(parent)
        assert not ok
        return [], [], reason

    match, parent_volume, parent_side = parsed
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
        if _exact_cube_root(volume) != side or side ** 3 != volume:
            raise AssertionError("cube side-from-volume identity failed")
        replacement = f"体積が{volume}cm³"
        new_question = q[:match.start()] + replacement + q[match.end():]
        rows.append({
            "question": new_question,
            "answer": f"{side}cm",
            "explanation": f"立方体の体積=1辺³より、{volume}の整数の立方根は{side}。したがって1辺は{side}cm。{side}×{side}×{side}={volume}cm³でも確認済み。",
            "numeric_signature": (str(volume),),
        })
        evidence.append({
            "parent_sha256": _parent_sha(parent),
            "method": "cube_side_from_volume_exact_cube_root_and_recomposition",
            "parent_recalculation": f"cube_root({parent_volume})={parent_side}cm",
            "variant_recalculation": f"cube_root({volume})={side}cm",
            "independent_check": f"{side}×{side}×{side}={volume}cm³ PASS",
        })
    return rows, evidence, "cube_volume_to_integer_side_exact"
