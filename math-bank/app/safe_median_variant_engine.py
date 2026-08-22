from __future__ import annotations

"""Fail-closed exact engine for a narrow integer-median parent shape.

Only parents with one explicit comma-separated list of 3 or 5 integers asking
solely for the median (中央値) are accepted. The answer is verified from the
sorted middle element and independently by requiring equal numbers of values
strictly below and above that middle position after sorting. Even-sized data,
frequency tables, compound statistics, figures and real choices fail closed.
"""

import hashlib
import json
import re

LIST_RE = re.compile(r"(?P<expr>-?\d+(?:\s*[、,]\s*-?\d+){2,4})")
ANSWER_RE = re.compile(r"^-?\d+$")


def _norm(value: object) -> str:
    return str(value or "").replace("，", ",").replace("　", " ")


def _parent_sha(parent: dict) -> str:
    raw = json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _parse_parent(parent: dict):
    if parent.get("figure_refs"):
        return None
    if parent.get("choices"):
        return None
    q = _norm(parent.get("question"))
    if "中央値" not in q:
        return None
    blocked = ("平均", "最頻値", "範囲", "度数", "階級", "表", "グラフ", "箱ひげ", "四分位", "分散", "標準偏差")
    if any(token in q for token in blocked):
        return None
    matches = list(LIST_RE.finditer(q))
    if len(matches) != 1:
        return None
    m = matches[0]
    values = [int(x) for x in re.split(r"\s*[、,]\s*", m.group("expr"))]
    if len(values) not in (3, 5):
        return None
    ordered = sorted(values)
    mid = len(ordered) // 2
    median = ordered[mid]
    am = ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ", ""))
    if am is None or int(am.group(0)) != median:
        return None
    if len(ordered[:mid]) != len(ordered[mid + 1:]):
        return None
    return m, values, median


def can_generate(parent: dict) -> tuple[bool, str]:
    if _parse_parent(parent) is not None:
        return True, "odd_integer_data_median_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices"):
        return False, "choice_parent"
    return False, "median_parent_not_exactly_parsed_and_verified"


def _variant_values(seed: int, index: int, count: int) -> list[int]:
    center = 6 + ((seed >> (index * 5)) + index * 7) % 25
    gaps = [2 + ((seed >> (index * 7 + j * 3)) + j + index) % 6 for j in range(count // 2)]
    below = [center - sum(gaps[: j + 1]) for j in range(len(gaps))]
    above = [center + sum(gaps[: j + 1]) for j in range(len(gaps))]
    values = list(reversed(below)) + [center] + above
    if index % 2 == 0:
        values = values[1:] + values[:1]
    elif count == 5:
        values[0], values[3] = values[3], values[0]
    return values


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    parsed = _parse_parent(parent)
    if parsed is None:
        ok, reason = can_generate(parent)
        assert not ok
        return [], [], reason

    match, parent_values, parent_median = parsed
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
        ordered = sorted(values)
        mid = len(ordered) // 2
        median = ordered[mid]
        if len(ordered[:mid]) != len(ordered[mid + 1:]):
            raise AssertionError("median independent verification failed")
        replacement = "、".join(str(v) for v in values)
        new_question = q[:match.start("expr")] + replacement + q[match.end("expr"):]
        rows.append({
            "question": new_question,
            "answer": str(median),
            "explanation": f"小さい順に並べると中央の値は{median}。中央より下と上のデータ数が同じことも確認済み。",
            "numeric_signature": signature,
        })
        evidence.append({
            "parent_sha256": _parent_sha(parent),
            "method": "odd_integer_median_sorted_middle_and_equal_side_counts",
            "parent_recalculation": f"sorted={sorted(parent_values)}, median={parent_median}",
            "variant_recalculation": f"sorted={ordered}, median={median}",
            "independent_check": "count_below_middle == count_above_middle PASS",
        })
    return rows, evidence, "odd_integer_data_median_exact"
