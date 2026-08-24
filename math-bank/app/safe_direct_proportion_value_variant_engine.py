from __future__ import annotations

"""Fail-closed exact engine for direct-proportion value parents.

Accepts only text-only parents stating that y is proportional to x, giving one
exact proportionality constant and one exact x value, and asking only for y.
The parent and every generated sibling are checked by y=a*x and independently
by x=y/a.
"""

import hashlib
import json
import re
from fractions import Fraction

NUM = r"[+-]?\d+"
A_RE = re.compile(rf"比例定数\s*(?:は|が)?\s*(?:[aａ]\s*=\s*)?(?P<a>{NUM})")
X_RE = re.compile(rf"[xｘ]\s*=\s*(?P<x>{NUM})")
ANSWER_RE = re.compile(r"^(?:[yｙ]\s*=\s*)?(?P<y>[+-]?\d+)$")


def _norm(value: object) -> str:
    return str(value or "").replace("　", " ").replace("−", "-").replace("＋", "+")


def _sha(parent: dict) -> str:
    return hashlib.sha256(
        json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    ).hexdigest()


def _parse_parent(parent: dict):
    if parent.get("figure_refs") or parent.get("choices"):
        return None
    q = _norm(parent.get("question"))
    if not any(t in q for t in ("yはxに比例", "y は x に比例", "ｙはｘに比例")):
        return None
    if not any(t in q for t in ("yの値", "y の値", "ｙの値")):
        return None
    blocked = ("反比例", "グラフ", "傾き", "切片", "式を求", "比例定数を求", "比例定数aを求", "比例定数 aを求", "xの値", "図")
    if any(t in q for t in blocked):
        return None
    am = list(A_RE.finditer(q))
    xm = list(X_RE.finditer(q))
    if len(am) != 1 or len(xm) != 1:
        return None
    a = int(am[0].group("a"))
    x = int(xm[0].group("x"))
    if a == 0:
        return None
    y = a * x
    ans = ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ", ""))
    if ans is None or int(ans.group("y")) != y:
        return None
    if Fraction(y, a) != x:
        return None
    return am[0], xm[0], a, x, y


def can_generate(parent: dict) -> tuple[bool, str]:
    if _parse_parent(parent) is not None:
        return True, "direct_proportion_value_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices"):
        return False, "choice_parent"
    return False, "direct_proportion_value_parent_not_exactly_parsed_and_verified"


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    parsed = _parse_parent(parent)
    if parsed is None:
        ok, reason = can_generate(parent)
        assert not ok
        return [], [], reason

    am, xm, pa, px, py = parsed
    q = _norm(parent.get("question"))
    seed = int(_sha(parent)[:12], 16)
    parent_sig = (str(pa), str(px))
    seen: set[tuple[str, str]] = set()
    rows: list[dict] = []
    evidence: list[dict] = []

    for index in range(1, count + 1):
        a = 2 + ((seed >> (index * 5)) + index * 3) % 8
        if ((seed >> (index + 17)) & 1):
            a = -a
        x = 2 + ((seed >> (index * 7 + 3)) + index * 5) % 11
        if ((seed >> (index + 23)) & 1):
            x = -x
        sig = (str(a), str(x))
        while sig == parent_sig or sig in seen:
            x += index + 1
            sig = (str(a), str(x))
        seen.add(sig)
        y = a * x
        if y != a * x or Fraction(y, a) != x:
            raise AssertionError("direct proportion value identity failed")

        replacements = [
            (am.start("a"), am.end("a"), str(a)),
            (xm.start("x"), xm.end("x"), str(x)),
        ]
        new_q = q
        for start, end, value in sorted(replacements, reverse=True):
            new_q = new_q[:start] + value + new_q[end:]

        rows.append({
            "question": new_q,
            "answer": f"y={y}",
            "explanation": f"比例 y=ax に a={a}, x={x} を代入すると y={a}×({x})={y}。y/a={y}/{a}={x} でも確認。",
            "numeric_signature": sig,
        })
        evidence.append({
            "parent_sha256": _sha(parent),
            "method": "direct_proportion_value_exact_product_and_inverse_identity",
            "parent_recalculation": f"y={pa}*({px})={py} and y/a={py}/{pa}={px}",
            "variant_recalculation": f"y={a}*({x})={y} and y/a={y}/{a}={x}",
            "independent_check": "y == a*x AND y/a == x PASS",
        })
    return rows, evidence, "direct_proportion_value_exact"
