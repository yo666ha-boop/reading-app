from __future__ import annotations

"""Fail-closed exact engine for a narrow unique-mode integer-data parent shape.

Only parents with one explicit comma-separated list of 4-7 integers asking
solely for the mode (最頻値) are accepted. The parent answer is verified from
frequency counts and independently by requiring one unique value whose count is
strictly greater than every other count. Ties, frequency tables, compound
statistics, figures and real choices fail closed.
"""

from collections import Counter
import hashlib
import json
import re

LIST_RE = re.compile(r"(?P<expr>-?\d+(?:\s*[、,]\s*-?\d+){3,6})")
ANSWER_RE = re.compile(r"^-?\d+$")


def _norm(value: object) -> str:
    return str(value or "").replace("，", ",").replace("　", " ")


def _parent_sha(parent: dict) -> str:
    raw = json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _unique_mode(values: list[int]) -> tuple[int, int] | None:
    counts = Counter(values)
    top = max(counts.values())
    winners = [v for v, n in counts.items() if n == top]
    if top < 2 or len(winners) != 1:
        return None
    winner = winners[0]
    second = max((n for v, n in counts.items() if v != winner), default=0)
    if top <= second:
        return None
    return winner, top


def _parse_parent(parent: dict):
    if parent.get("figure_refs"):
        return None
    if parent.get("choices"):
        return None
    q = _norm(parent.get("question"))
    if "最頻値" not in q:
        return None
    blocked = ("平均", "中央値", "範囲", "度数", "階級", "表", "グラフ", "箱ひげ", "四分位", "分散", "標準偏差")
    if any(token in q for token in blocked):
        return None
    matches = list(LIST_RE.finditer(q))
    if len(matches) != 1:
        return None
    m = matches[0]
    values = [int(x) for x in re.split(r"\s*[、,]\s*", m.group("expr"))]
    if len(values) not in (4, 5, 6, 7):
        return None
    mode_info = _unique_mode(values)
    if mode_info is None:
        return None
    mode, top = mode_info
    am = ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ", ""))
    if am is None or int(am.group(0)) != mode:
        return None
    counts = Counter(values)
    if counts[mode] != top or any(n >= top for v, n in counts.items() if v != mode):
        return None
    return m, values, mode, top


def can_generate(parent: dict) -> tuple[bool, str]:
    if _parse_parent(parent) is not None:
        return True, "unique_integer_data_mode_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices"):
        return False, "choice_parent"
    return False, "mode_parent_not_exactly_parsed_and_verified"


def _variant_values(seed: int, index: int, count: int) -> list[int]:
    mode = 4 + ((seed >> (index * 5)) + index * 7) % 26
    repeat = 2 if count <= 5 else 3
    values = [mode] * repeat
    j = 0
    while len(values) < count:
        candidate = mode + 2 + ((seed >> (index * 7 + j * 4)) + j * 5 + index) % 19
        if candidate != mode and candidate not in values:
            values.append(candidate)
        j += 1
    shift = index % count
    return values[shift:] + values[:shift]


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    parsed = _parse_parent(parent)
    if parsed is None:
        ok, reason = can_generate(parent)
        assert not ok
        return [], [], reason

    match, parent_values, parent_mode, parent_top = parsed
    q = _norm(parent.get("question"))
    seed = int(_parent_sha(parent)[:12], 16)
    parent_signature = tuple(str(v) for v in parent_values)
    seen: set[tuple[str, ...]] = set()
    rows: list[dict] = []
    evidence: list[dict] = []

    for index in range(1, count + 1):
        values = _variant_values(seed, index, len(parent_values))
        signature = tuple(str(v) for v in values)
        bump = 0
        while signature == parent_signature or signature in seen:
            bump += 1
            values = [v + bump for v in values]
            signature = tuple(str(v) for v in values)
        seen.add(signature)
        mode_info = _unique_mode(values)
        if mode_info is None:
            raise AssertionError("mode independent verification failed")
        mode, top = mode_info
        counts = Counter(values)
        if any(n >= top for v, n in counts.items() if v != mode):
            raise AssertionError("mode uniqueness verification failed")
        replacement = "、".join(str(v) for v in values)
        new_question = q[:match.start("expr")] + replacement + q[match.end("expr"):]
        rows.append({
            "question": new_question,
            "answer": str(mode),
            "explanation": f"各値の出現回数を数えると、{mode}が{top}回で最も多く、他の値より多いので最頻値は{mode}。",
            "numeric_signature": signature,
        })
        evidence.append({
            "parent_sha256": _parent_sha(parent),
            "method": "unique_integer_mode_frequency_and_strict_max_count",
            "parent_recalculation": f"counts={dict(sorted(Counter(parent_values).items()))}, mode={parent_mode}, count={parent_top}",
            "variant_recalculation": f"counts={dict(sorted(counts.items()))}, mode={mode}, count={top}",
            "independent_check": "unique argmax frequency AND top_count > every_other_count PASS",
        })
    return rows, evidence, "unique_integer_data_mode_exact"
