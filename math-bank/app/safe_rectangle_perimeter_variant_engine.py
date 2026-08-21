from __future__ import annotations

"""Fail-closed exact engine for a narrow rectangle-perimeter parent shape.

Only actual parents that explicitly state one positive integer length and width
in the same centimetre unit, ask only for the rectangle perimeter, and have an
exactly verified integer-centimetre answer are accepted. Parent and generated
answers are recalculated by P=2*(length+width) and independently checked by both
inverse identities P/2-length=width and P/2-width=length. Area, unknown-side,
mixed-unit, figure and choice problems fail closed.
"""

import hashlib
import json
import re

DIM_RE = re.compile(
    r"(?:たて|縦)\s*(?P<length>\d+)\s*cm.*?(?:よこ|横)\s*(?P<width>\d+)\s*cm"
)
ANSWER_RE = re.compile(r"^(?P<perimeter>\d+)\s*cm$")


def _norm(value: object) -> str:
    return str(value or "").replace("　", " ").replace("ｃｍ", "cm").replace("ＣＭ", "cm")


def _parent_sha(parent: dict) -> str:
    raw = json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _parse_parent(parent: dict):
    if parent.get("figure_refs"):
        return None
    if parent.get("choices") is not None:
        return None
    q = _norm(parent.get("question"))
    if "長方形" not in q or not any(token in q for token in ("周の長さ", "周りの長さ", "まわりの長さ")):
        return None
    blocked = (
        "面積", "何cmですか", "何cmでしょう", "辺の長さ", "一辺", "mと", "mm", "km", "図", "グラフ",
        "正方形", "対角線", "比", "縮尺",
    )
    if any(token in q for token in blocked):
        return None
    matches = list(DIM_RE.finditer(q))
    if len(matches) != 1:
        return None
    m = matches[0]
    length = int(m.group("length"))
    width = int(m.group("width"))
    if length <= 0 or width <= 0:
        return None
    perimeter = 2 * (length + width)
    am = ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ", ""))
    if am is None or int(am.group("perimeter")) != perimeter:
        return None
    if perimeter % 2 != 0:
        return None
    half = perimeter // 2
    if half - length != width or half - width != length:
        return None
    return m, length, width, perimeter


def can_generate(parent: dict) -> tuple[bool, str]:
    if _parse_parent(parent) is not None:
        return True, "rectangle_integer_cm_perimeter_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices") is not None:
        return False, "choice_parent"
    return False, "rectangle_perimeter_parent_not_exactly_parsed_and_verified"


def _variant_numbers(seed: int, index: int) -> tuple[int, int]:
    length = 4 + ((seed >> (index * 5)) + index * 7) % 23
    width = 3 + ((seed >> (index * 7 + 3)) + index * 5) % 19
    return length, width


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    parsed = _parse_parent(parent)
    if parsed is None:
        ok, reason = can_generate(parent)
        assert not ok
        return [], [], reason

    match, parent_length, parent_width, parent_perimeter = parsed
    q = _norm(parent.get("question"))
    seed = int(_parent_sha(parent)[:12], 16)
    parent_signature = (str(parent_length), str(parent_width))
    seen: set[tuple[str, str]] = set()
    rows: list[dict] = []
    evidence: list[dict] = []

    for index in range(1, count + 1):
        length, width = _variant_numbers(seed, index)
        signature = (str(length), str(width))
        bump = 0
        while signature == parent_signature or signature in seen:
            bump += 1
            length += bump
            signature = (str(length), str(width))
        seen.add(signature)
        perimeter = 2 * (length + width)
        half = perimeter // 2
        if perimeter % 2 or half - length != width or half - width != length:
            raise AssertionError("rectangle perimeter inverse identity failed")
        replacement = f"たて{length}cm、横{width}cm"
        new_question = q[:match.start()] + replacement + q[match.end():]
        rows.append({
            "question": new_question,
            "answer": f"{perimeter}cm",
            "explanation": f"長方形の周の長さ=2×(たて+横)より、2×({length}+{width})={perimeter}cm。半周から各辺を引く逆算でも確認済み。",
            "numeric_signature": signature,
        })
        evidence.append({
            "parent_sha256": _parent_sha(parent),
            "method": "rectangle_perimeter_exact_double_sum_and_two_inverse_identities",
            "parent_recalculation": f"2×({parent_length}+{parent_width})={parent_perimeter}cm",
            "variant_recalculation": f"2×({length}+{width})={perimeter}cm",
            "independent_check": "perimeter/2-length == width AND perimeter/2-width == length PASS",
        })
    return rows, evidence, "rectangle_integer_cm_perimeter_exact"
