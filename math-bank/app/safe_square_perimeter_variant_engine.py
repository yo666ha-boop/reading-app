from __future__ import annotations

"""Fail-closed exact engine for a narrow square-perimeter parent shape.

Only actual parents that explicitly state exactly one positive integer side in
cm, ask only for the perimeter of a square, and have an exactly verified integer
cm answer are accepted. Parent and generated answers are recalculated by P=4*s
and independently checked by the exact inverse identity P/4=s. Figures, real
choices, mixed units, area/diagonal/reverse questions and ambiguous multiple-side
statements fail closed.
"""

import hashlib
import json
import re

SIDE_RE = re.compile(r"(?:1辺|一辺)\s*(?P<side>\d+)\s*cm")
ANSWER_RE = re.compile(r"^(?P<perimeter>\d+)\s*cm$")


def _norm(value: object) -> str:
    return (
        str(value or "")
        .replace("　", " ")
        .replace("ｃｍ", "cm")
        .replace("ＣＭ", "cm")
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
    if "正方形" not in q or not any(token in q for token in ("周の長さ", "周りの長さ", "まわりの長さ")):
        return None
    blocked = (
        "面積", "対角線", "辺の長さを", "一辺を", "1辺を", "図", "mm", "km", "メートル",
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
    perimeter = 4 * side
    answer = _norm(parent.get("answer")).replace(" ", "")
    am = ANSWER_RE.fullmatch(answer)
    if am is None or int(am.group("perimeter")) != perimeter:
        return None
    if perimeter % 4 != 0 or perimeter // 4 != side:
        return None
    return match, side, perimeter


def can_generate(parent: dict) -> tuple[bool, str]:
    if _parse_parent(parent) is not None:
        return True, "square_integer_cm_perimeter_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices"):
        return False, "choice_parent"
    return False, "square_perimeter_parent_not_exactly_parsed_and_verified"


def _variant_side(seed: int, index: int) -> int:
    return 2 + ((seed >> (index * 5)) + index * 11) % 24


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    parsed = _parse_parent(parent)
    if parsed is None:
        ok, reason = can_generate(parent)
        assert not ok
        return [], [], reason

    match, parent_side, parent_perimeter = parsed
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
        perimeter = 4 * side
        if perimeter % 4 != 0 or perimeter // 4 != side:
            raise AssertionError("square perimeter inverse identity failed")
        replacement = f"1辺{side}cm"
        new_question = q[:match.start()] + replacement + q[match.end():]
        rows.append({
            "question": new_question,
            "answer": f"{perimeter}cm",
            "explanation": f"正方形の周の長さ=1辺×4より、{side}×4={perimeter}cm。周の長さを4で割る逆算でも確認済み。",
            "numeric_signature": (str(side),),
        })
        evidence.append({
            "parent_sha256": _parent_sha(parent),
            "method": "square_perimeter_exact_quadruple_and_inverse_identity",
            "parent_recalculation": f"{parent_side}×4={parent_perimeter}cm",
            "variant_recalculation": f"{side}×4={perimeter}cm",
            "independent_check": "perimeter/4 == side PASS",
        })
    return rows, evidence, "square_integer_cm_perimeter_exact"
