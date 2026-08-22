from __future__ import annotations

"""Fail-closed exact engine for a narrow single-integer absolute-value shape.

Only parents containing exactly one explicit integer and asking solely for its
absolute value are accepted. The parent answer must equal abs(n). Generated
answers are independently checked by non-negativity plus equality of squares.
Compound arithmetic, comparisons, number-line/figure tasks, and real choices
fail closed.
"""

import hashlib
import json
import re

INT_RE = re.compile(r"(?<![\d.])[+-]?\d+(?![\d.])")
ANSWER_RE = re.compile(r"^\+?\d+$")


def _norm(value: object) -> str:
    return str(value or "").replace("　", " ").replace("−", "-").replace("－", "-").replace("＋", "+").replace("｜", "|")


def _parent_sha(parent: dict) -> str:
    raw = json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _parse_parent(parent: dict):
    if parent.get("figure_refs"):
        return None
    if parent.get("choices"):
        return None
    q = _norm(parent.get("question"))
    if "絶対値" not in q:
        return None
    blocked = (
        "数直線", "不等号", "比較", "大きい", "小さい", "以上", "以下", "未満", "より大き", "より小さ",
        "和", "差", "積", "商", "合計", "何個", "範囲", "距離", "方程式", "不等式", "文字",
    )
    if any(token in q for token in blocked):
        return None
    matches = list(INT_RE.finditer(q))
    if len(matches) != 1:
        return None
    m = matches[0]
    value = int(m.group(0))
    answer = abs(value)
    am = ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ", ""))
    if am is None or int(am.group(0)) != answer:
        return None
    if answer < 0 or answer * answer != value * value:
        return None
    return m, value, answer


def can_generate(parent: dict) -> tuple[bool, str]:
    if _parse_parent(parent) is not None:
        return True, "single_integer_absolute_value_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices"):
        return False, "choice_parent"
    return False, "absolute_value_parent_not_exactly_parsed_and_verified"


def _variant_value(seed: int, index: int) -> int:
    magnitude = 2 + ((seed >> (index * 7)) + index * 11) % 47
    return -magnitude if index % 2 else magnitude


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    parsed = _parse_parent(parent)
    if parsed is None:
        ok, reason = can_generate(parent)
        assert not ok
        return [], [], reason

    match, parent_value, parent_answer = parsed
    q = _norm(parent.get("question"))
    seed = int(_parent_sha(parent)[:12], 16)
    seen: set[int] = set()
    rows: list[dict] = []
    evidence: list[dict] = []

    for index in range(1, count + 1):
        value = _variant_value(seed, index)
        while value == parent_value or value in seen:
            value = -(abs(value) + index + 1) if value <= 0 else value + index + 1
        seen.add(value)
        answer = abs(value)
        if answer < 0 or answer * answer != value * value:
            raise AssertionError("absolute-value square identity failed")
        new_question = q[:match.start()] + str(value) + q[match.end():]
        rows.append({
            "question": new_question,
            "answer": str(answer),
            "explanation": f"{value}の絶対値は0からの距離なので{answer}。0以上で、{answer}²={value}²も確認済み。",
            "numeric_signature": (str(value),),
        })
        evidence.append({
            "parent_sha256": _parent_sha(parent),
            "method": "single_integer_absolute_value_nonnegative_and_square_identity",
            "parent_recalculation": f"abs({parent_value})={parent_answer}",
            "variant_recalculation": f"abs({value})={answer}",
            "independent_check": f"answer>=0 AND answer^2 == input^2: {answer}>=0 and {answer * answer}={value * value} PASS",
        })
    return rows, evidence, "single_integer_absolute_value_exact"
