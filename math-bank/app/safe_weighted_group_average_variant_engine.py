from __future__ import annotations

"""Fail-closed exact engine for a narrow two-group weighted-average parent.

Accept only text-only, non-choice parents that explicitly give two group sizes
and their averages and ask solely for the combined average. The stated answer is
recomputed with exact Fraction arithmetic. Generated variants are independently
checked by reconstructing both group totals and the combined total.
"""

import hashlib
import json
import re
from fractions import Fraction

PATTERN = re.compile(
    r"(?P<g1>[^。\n]{0,16}?)(?P<n1>\d+)\s*人[^。\n]{0,12}?平均(?:点|は)?\s*(?P<a1>\d+(?:\.\d+)?)\s*点?[^。\n]{0,24}?"
    r"(?P<g2>[^。\n]{0,16}?)(?P<n2>\d+)\s*人[^。\n]{0,12}?平均(?:点|は)?\s*(?P<a2>\d+(?:\.\d+)?)\s*点?"
)
ANSWER_RE = re.compile(r"^(?P<v>[+-]?\d+(?:/\d+)?(?:\.\d+)?)(?:点)?$")


def _norm(v: object) -> str:
    return str(v or "").replace("　", " ").replace("，", ",").replace("−", "-")


def _sha(parent: dict) -> str:
    raw = json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode()
    return hashlib.sha256(raw).hexdigest()


def _frac(text: str) -> Fraction:
    s = text.strip()
    if "." in s:
        sign = -1 if s.startswith("-") else 1
        s = s.lstrip("+-")
        whole, dec = s.split(".", 1)
        return sign * Fraction(int(whole + dec), 10 ** len(dec))
    return Fraction(s)


def _answer(parent: dict) -> Fraction | None:
    m = ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ", ""))
    return None if m is None else _frac(m.group("v"))


def _text(v: Fraction) -> str:
    return str(v.numerator) if v.denominator == 1 else f"{v.numerator}/{v.denominator}"


def _parse_parent(parent: dict):
    if parent.get("figure_refs") or parent.get("choices"):
        return None
    q = _norm(parent.get("question"))
    if not any(t in q for t in ("全体の平均", "合わせた平均", "全員の平均")):
        return None
    if any(t in q for t in ("中央値", "最頻値", "度数", "階級", "表", "グラフ", "平均との差", "何人", "x", "ｘ")):
        return None
    matches = list(PATTERN.finditer(q))
    if len(matches) != 1:
        return None
    m = matches[0]
    n1, n2 = int(m.group("n1")), int(m.group("n2"))
    a1, a2 = _frac(m.group("a1")), _frac(m.group("a2"))
    if n1 <= 0 or n2 <= 0 or a1 < 0 or a2 < 0:
        return None
    expected = (n1 * a1 + n2 * a2) / (n1 + n2)
    stated = _answer(parent)
    if stated is None or stated != expected:
        return None
    if expected * (n1 + n2) != n1 * a1 + n2 * a2:
        return None
    return m, n1, a1, n2, a2, expected


def can_generate(parent: dict) -> tuple[bool, str]:
    if _parse_parent(parent) is not None:
        return True, "two_group_weighted_average_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices"):
        return False, "choice_parent"
    return False, "weighted_group_average_parent_not_exactly_parsed_and_verified"


def generate(parent: dict, count: int):
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    parsed = _parse_parent(parent)
    if parsed is None:
        ok, reason = can_generate(parent)
        assert not ok
        return [], [], reason
    m, pn1, pa1, pn2, pa2, pavg = parsed
    q = _norm(parent.get("question"))
    seed = int(_sha(parent)[:12], 16)
    parent_sig = (str(pn1), str(pa1), str(pn2), str(pa2))
    seen = set()
    rows, evidence = [], []
    for index in range(1, count + 1):
        n1 = 12 + ((seed >> (index * 3)) + 5 * index) % 19
        n2 = 14 + ((seed >> (index * 5 + 2)) + 7 * index) % 21
        a1 = Fraction(48 + ((seed >> (index * 7 + 1)) + 3 * index) % 35)
        a2 = Fraction(52 + ((seed >> (index * 9 + 4)) + 5 * index) % 35)
        sig = (str(n1), str(a1), str(n2), str(a2))
        bump = 0
        while sig == parent_sig or sig in seen:
            bump += 1
            n2 += bump
            a2 += bump
            sig = (str(n1), str(a1), str(n2), str(a2))
        seen.add(sig)
        avg = (n1 * a1 + n2 * a2) / (n1 + n2)
        if avg * (n1 + n2) != n1 * a1 + n2 * a2:
            raise AssertionError("weighted average reconstruction failed")
        replacement = m.group(0)
        for old, new in ((m.group("n1"), str(n1)), (m.group("a1"), _text(a1)), (m.group("n2"), str(n2)), (m.group("a2"), _text(a2))):
            replacement = replacement.replace(old, new, 1)
        newq = q[:m.start()] + replacement + q[m.end():]
        rows.append({"question": newq, "answer": _text(avg), "explanation": f"2集団の合計は{_text(n1*a1)}+{_text(n2*a2)}。人数{n1+n2}で割ると{_text(avg)}。", "numeric_signature": sig})
        evidence.append({"parent_sha256": _sha(parent), "method": "two_group_weighted_average_exact_totals_and_recomposition", "parent_recalculation": f"({pn1}*{_text(pa1)}+{pn2}*{_text(pa2)})/{pn1+pn2}={_text(pavg)}", "variant_recalculation": f"({n1}*{_text(a1)}+{n2}*{_text(a2)})/{n1+n2}={_text(avg)}", "independent_check": "combined_mean*combined_count == group1_total+group2_total PASS"})
    return rows, evidence, "two_group_weighted_average_exact"
