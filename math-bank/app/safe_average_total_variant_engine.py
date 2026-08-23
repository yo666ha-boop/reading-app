from __future__ import annotations

"""Fail-closed exact engine for total = average * count word problems.

Accept only text-only, non-choice parents that explicitly state a positive
integer number of people/items and an integer or finite-decimal average, then ask
only for the total/sum. Parent and variants are verified with exact Fraction
arithmetic and the inverse identity total/count == average.
"""
import hashlib, json, re
from fractions import Fraction

COUNT_RE = re.compile(r"(?P<count>\d+)\s*(?:人|個|回|科目|冊|台|本)")
AVG_RE = re.compile(r"平均(?:点|値|は|が|を)?\s*(?P<avg>\d+(?:\.\d+)?)")
ANS_RE = re.compile(r"^(?P<v>\d+(?:\.\d+)?)\s*(?:点|円|個|回|冊|台|本)?$")


def _norm(v: object) -> str:
    return str(v or "").replace("　", " ").replace("，", ",").replace("．", ".")


def _sha(parent: dict) -> str:
    return hashlib.sha256(json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")).hexdigest()


def _frac(s: str) -> Fraction:
    if "." not in s:
        return Fraction(int(s), 1)
    whole, dec = s.split(".", 1)
    return Fraction(int(whole + dec), 10 ** len(dec))


def _fmt(v: Fraction) -> str:
    if v.denominator == 1:
        return str(v.numerator)
    # only terminating decimals are generated/accepted
    d = v.denominator
    while d % 2 == 0: d //= 2
    while d % 5 == 0: d //= 5
    if d != 1:
        raise ValueError("non-terminating decimal")
    n = v.numerator / v.denominator
    return (f"{n:.8f}").rstrip("0").rstrip(".")


def _answer(v: object):
    m = ANS_RE.fullmatch(_norm(v).replace(" ", ""))
    return _frac(m.group("v")) if m else None


def _parse(parent: dict):
    if parent.get("figure_refs") or parent.get("choices"):
        return None
    q = _norm(parent.get("question"))
    if "平均" not in q or not any(t in q for t in ("合計", "総和", "全部で")):
        return None
    if any(t in q for t in ("中央値", "最頻値", "範囲", "度数", "表", "グラフ", "加重平均", "あと", "何人", "不明", "平均との差")):
        return None
    cm = list(COUNT_RE.finditer(q)); am = list(AVG_RE.finditer(q))
    if len(cm) != 1 or len(am) != 1:
        return None
    count = int(cm[0].group("count")); avg = _frac(am[0].group("avg"))
    if not (2 <= count <= 50) or avg <= 0:
        return None
    total = avg * count
    # require a terminating, exactly stated answer
    try: _fmt(total)
    except ValueError: return None
    if _answer(parent.get("answer")) != total:
        return None
    if total / count != avg:
        return None
    return cm[0], am[0], count, avg, total


def can_generate(parent: dict):
    if _parse(parent) is not None: return True, "average_times_count_total_exact"
    if parent.get("figure_refs"): return False, "figure_parent"
    if parent.get("choices"): return False, "choice_parent"
    return False, "average_total_parent_not_exactly_parsed_and_verified"


def generate(parent: dict, count: int):
    if count not in (1, 2, 3): raise ValueError("count must be 1, 2, or 3")
    parsed = _parse(parent)
    if parsed is None: return [], [], can_generate(parent)[1]
    cm, am, pcount, pavg, ptotal = parsed
    q = _norm(parent.get("question")); seed = int(_sha(parent)[:12], 16)
    parent_sig = (str(pcount), _fmt(pavg)); seen = set(); rows = []; evidence = []
    for idx in range(1, count + 1):
        n = 3 + ((seed >> (idx * 4)) + idx * 3) % 12
        avg = Fraction(4 + ((seed >> (idx * 6 + 2)) + idx * 5) % 27, 1)
        sig = (str(n), _fmt(avg)); bump = 0
        while sig == parent_sig or sig in seen:
            bump += 1; avg += bump; sig = (str(n), _fmt(avg))
        seen.add(sig); total = avg * n
        if total / n != avg: raise AssertionError("average-total inverse identity failed")
        nq = q
        replacements = [(cm.start("count"), cm.end("count"), str(n)), (am.start("avg"), am.end("avg"), _fmt(avg))]
        for s, e, t in sorted(replacements, reverse=True): nq = nq[:s] + t + nq[e:]
        rows.append({"question": nq, "answer": _fmt(total), "explanation": f"合計=平均×個数より、{_fmt(avg)}×{n}={_fmt(total)}。", "numeric_signature": sig})
        evidence.append({"parent_sha256": _sha(parent), "method": "average_times_count_exact_total_and_inverse_identity", "parent_recalculation": f"{_fmt(pavg)}*{pcount}={_fmt(ptotal)}", "variant_recalculation": f"{_fmt(avg)}*{n}={_fmt(total)}", "independent_check": f"total/count={_fmt(total)}/{n}={_fmt(avg)} PASS"})
    return rows, evidence, "average_times_count_total_exact"
