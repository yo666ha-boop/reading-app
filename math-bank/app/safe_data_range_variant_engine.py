from __future__ import annotations

"""Fail-closed exact engine for a narrow data-range parent shape.

Only parents with one explicit comma-separated list of 3-6 nonnegative integer
values asking solely for the range (範囲) are accepted. The answer is verified as
max-min and independently by min+range=max. Tables, frequency distributions,
mean/median/mode combinations, figures and real choices fail closed.
"""

import hashlib
import json
import re

LIST_RE = re.compile(r"(?P<expr>\d+(?:\s*[、,]\s*\d+){2,5})")
ANSWER_RE = re.compile(r"^(?P<v>\d+)$")


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
    if "範囲" not in q:
        return None
    blocked = ("平均", "中央値", "最頻値", "度数", "階級", "表", "グラフ", "箱ひげ", "四分位", "分散", "標準偏差")
    if any(token in q for token in blocked):
        return None
    matches = list(LIST_RE.finditer(q))
    if len(matches) != 1:
        return None
    m = matches[0]
    values = [int(x) for x in re.split(r"\s*[、,]\s*", m.group("expr"))]
    if not 3 <= len(values) <= 6 or len(set(values)) < 2:
        return None
    range_value = max(values) - min(values)
    am = ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ", ""))
    if am is None or int(am.group("v")) != range_value:
        return None
    if min(values) + range_value != max(values):
        return None
    return m, values, range_value


def can_generate(parent: dict) -> tuple[bool, str]:
    if _parse_parent(parent) is not None:
        return True, "integer_data_range_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices"):
        return False, "choice_parent"
    return False, "data_range_parent_not_exactly_parsed_and_verified"


def _variant_values(seed: int, index: int, count: int) -> list[int]:
    start = 3 + ((seed >> (index * 5)) + index * 7) % 18
    step = 2 + ((seed >> (index * 7 + 3)) + index) % 6
    values = [start + step * i for i in range(count)]
    if index % 2 == 0:
        values = list(reversed(values))
    elif count >= 4:
        values[1], values[-1] = values[-1], values[1]
    return values


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    parsed = _parse_parent(parent)
    if parsed is None:
        ok, reason = can_generate(parent)
        assert not ok
        return [], [], reason

    match, parent_values, parent_range = parsed
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
        range_value = max(values) - min(values)
        if min(values) + range_value != max(values):
            raise AssertionError("data range independent verification failed")
        replacement = "、".join(str(v) for v in values)
        new_question = q[:match.start("expr")] + replacement + q[match.end("expr"):]
        rows.append({
            "question": new_question,
            "answer": str(range_value),
            "explanation": f"最大値{max(values)}から最小値{min(values)}を引くと、範囲は{range_value}。最小値+範囲=最大値でも確認済み。",
            "numeric_signature": signature,
        })
        evidence.append({
            "parent_sha256": _parent_sha(parent),
            "method": "integer_data_range_max_minus_min_and_inverse_identity",
            "parent_recalculation": f"max={max(parent_values)}, min={min(parent_values)}, range={parent_range}",
            "variant_recalculation": f"{max(values)}-{min(values)}={range_value}",
            "independent_check": "min+range == max PASS",
        })
    return rows, evidence, "integer_data_range_exact"
