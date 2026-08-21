from __future__ import annotations

"""Fail-closed exact engine for a narrow arithmetic-mean parent shape.

Accept only an actual parent that contains exactly one explicit list of 2-5
positive integer values followed by an unambiguous request for their average.
The parent's stated answer is recomputed with exact Fraction arithmetic and an
independent sum == average * count identity before deterministic variants are
made. Figure/choice parents, weighted averages, missing-value problems, tables,
frequency distributions, and ambiguous prose fail closed.
"""

import hashlib
import json
import re
from fractions import Fraction

LIST_RE = re.compile(r"(?P<expr>\d+(?:\s*[、,，]\s*\d+){1,4})")
ANSWER_RE = re.compile(r"^(?P<v>[+-]?\d+(?:/\d+)?(?:\.\d+)?)$")


def _norm(value: object) -> str:
    return str(value or "").replace("−", "-").replace("，", ",")


def _parent_sha(parent: dict) -> str:
    raw = json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _fraction_text(v: Fraction) -> str:
    return str(v.numerator) if v.denominator == 1 else f"{v.numerator}/{v.denominator}"


def _parse_answer(text: str) -> Fraction | None:
    s = text.strip().replace(" ", "")
    m = ANSWER_RE.fullmatch(s)
    if m is None:
        return None
    raw = m.group("v")
    if "." in raw:
        whole, frac = raw.split(".", 1)
        sign = -1 if whole.startswith("-") else 1
        whole_abs = whole.lstrip("+-") or "0"
        return sign * Fraction(int(whole_abs + frac), 10 ** len(frac))
    return Fraction(raw)


def _ambiguous_context(q: str) -> bool:
    blocked = (
        "加重平均", "重み", "度数", "階級", "表", "グラフ", "中央値", "最頻値",
        "平均点になる", "あと何", "何人", "欠け", "不明", "x", "ｘ", "平均との差",
    )
    return any(token in q for token in blocked)


def _parse_parent(parent: dict):
    if parent.get("figure_refs"):
        return None
    if parent.get("choices") is not None:
        return None
    q = _norm(parent.get("question"))
    if "平均" not in q or _ambiguous_context(q):
        return None
    matches = list(LIST_RE.finditer(q))
    if len(matches) != 1:
        return None
    m = matches[0]
    values = [int(x.strip()) for x in re.split(r"[、,]", m.group("expr"))]
    if not 2 <= len(values) <= 5 or any(v <= 0 for v in values):
        return None
    expected = Fraction(sum(values), len(values))
    stated = _parse_answer(_norm(parent.get("answer")))
    if stated is None or stated != expected:
        return None
    if expected * len(values) != sum(values):
        return None
    return m, values, expected


def can_generate(parent: dict) -> tuple[bool, str]:
    parsed = _parse_parent(parent)
    if parsed is not None:
        return True, "simple_arithmetic_mean_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices") is not None:
        return False, "choice_parent"
    return False, "average_parent_not_exactly_parsed_and_verified"


def _variant_values(seed: int, index: int, count: int) -> list[int]:
    base = 4 + ((seed >> (index * 5)) % 13)
    step = 1 + ((seed >> (index * 7 + 3)) % 5)
    vals = [base + step * j for j in range(count)]
    shift = (index * 3 + ((seed >> (index * 3 + 11)) % 7))
    return [v + shift for v in vals]


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    parsed = _parse_parent(parent)
    if parsed is None:
        ok, reason = can_generate(parent)
        assert not ok
        return [], [], reason
    match, parent_values, parent_average = parsed
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
        average = Fraction(sum(values), len(values))
        if average * len(values) != sum(values):
            raise AssertionError("average independent verification failed")
        expr = "、".join(str(v) for v in values)
        new_question = q[:match.start("expr")] + expr + q[match.end("expr"):]
        rows.append({
            "question": new_question,
            "answer": _fraction_text(average),
            "explanation": f"合計{sum(values)}を{len(values)}個で割り、平均は{_fraction_text(average)}。",
            "numeric_signature": signature,
        })
        evidence.append({
            "parent_sha256": _parent_sha(parent),
            "method": "simple_arithmetic_mean_exact_fraction_and_sum_identity",
            "parent_recalculation": f"sum={sum(parent_values)}, n={len(parent_values)}, mean={_fraction_text(parent_average)}",
            "variant_recalculation": f"sum={sum(values)}, n={len(values)}, mean={_fraction_text(average)}",
            "independent_check": "mean*count == sum PASS",
        })
    return rows, evidence, "simple_arithmetic_mean_exact"
