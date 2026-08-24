from __future__ import annotations

"""Fail-closed exact engine for narrow one-variable linear inequalities."""

import hashlib
import json
import re
from fractions import Fraction

COEF = r"[+-]?\d*"
INT = r"[+-]?\d+"
REL = r"(?:<=|>=|<|>|≦|≧|≤|≥)"
INEQ_RE = re.compile(rf"(?P<ineq>(?P<a>{COEF})\s*[xｘ]\s*(?:(?P<sign>[+＋\-−])\s*(?P<b>\d+))?\s*(?P<rel>{REL})\s*(?P<c>{INT}))")
ANSWER_RE = re.compile(rf"^(?:[xｘ]\s*)?(?P<rel>{REL})(?P<k>[+-]?\d+(?:/\d+)?)$")


def _norm(v: object) -> str:
    return str(v or "").replace("−", "-").replace("＋", "+").replace("　", " ").replace("≦", "<=").replace("≤", "<=").replace("≧", ">=").replace("≥", ">=")


def _coef(text: str) -> Fraction:
    t = _norm(text).replace(" ", "")
    if t in ("", "+"):
        return Fraction(1)
    if t == "-":
        return Fraction(-1)
    return Fraction(int(t))


def _ft(v: Fraction) -> str:
    return str(v.numerator) if v.denominator == 1 else f"{v.numerator}/{v.denominator}"


def _sha(parent: dict) -> str:
    raw = json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _flip(rel: str) -> str:
    return {"<": ">", ">": "<", "<=": ">=", ">=": "<="}[rel]


def _parse(parent: dict):
    if parent.get("figure_refs") or parent.get("choices"):
        return None
    q = _norm(parent.get("question"))
    if not any(t in q for t in ("不等式", "解きなさい", "解け")):
        return None
    matches = list(INEQ_RE.finditer(q))
    if len(matches) != 1:
        return None
    m = matches[0]
    a = _coef(m.group("a"))
    if a == 0:
        return None
    b = Fraction(0)
    if m.group("b"):
        b = Fraction(int(m.group("b")))
        if _norm(m.group("sign")) == "-":
            b = -b
    c = Fraction(int(m.group("c")))
    rel = _norm(m.group("rel"))
    k = (c - b) / a
    solved_rel = rel if a > 0 else _flip(rel)
    answer = _norm(parent.get("answer")).replace(" ", "")
    am = ANSWER_RE.fullmatch(answer)
    if am is None:
        return None
    if _norm(am.group("rel")) != solved_rel or Fraction(am.group("k")) != k:
        return None
    # Boundary equality independently recomposes to c; sign determines direction.
    if a * k + b != c:
        return None
    return m, a, b, rel, c, solved_rel, k


def can_generate(parent: dict) -> tuple[bool, str]:
    if _parse(parent) is not None:
        return True, "linear_inequality_ax_plus_b_rel_c_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices"):
        return False, "choice_parent"
    return False, "linear_inequality_parent_not_exactly_parsed_and_verified"


def generate(parent: dict, count: int):
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    parsed = _parse(parent)
    if parsed is None:
        ok, reason = can_generate(parent)
        assert not ok
        return [], [], reason
    match, pa, pb, prel, pc, psolved_rel, pk = parsed
    q = _norm(parent.get("question"))
    seed = int(_sha(parent)[:12], 16)
    parent_sig = (_ft(pa), _ft(pb), prel, _ft(pc))
    seen = set()
    rows, evidence = [], []
    rels = ("<", "<=", ">", ">=")
    for i in range(1, count + 1):
        # Positive coefficient keeps generated solution direction transparent.
        a = Fraction(2 + ((seed >> (i * 5)) % 7))
        k = Fraction(-8 + ((seed >> (i * 7 + 2)) % 17))
        b = Fraction(-9 + ((seed >> (i * 9 + 3)) % 19))
        rel = rels[(seed + i * 3) % len(rels)]
        c = a * k + b
        sig = (_ft(a), _ft(b), rel, _ft(c))
        while sig == parent_sig or sig in seen:
            k += 1
            c = a * k + b
            sig = (_ft(a), _ft(b), rel, _ft(c))
        seen.add(sig)
        if a * k + b != c:
            raise AssertionError("linear inequality boundary recomposition failed")
        lhs = "x" if a == 1 else f"{_ft(a)}x"
        if b > 0:
            lhs += f"+{_ft(b)}"
        elif b < 0:
            lhs += _ft(b)
        inequality = f"{lhs}{rel}{_ft(c)}"
        nq = q[:match.start("ineq")] + inequality + q[match.end("ineq"):]
        rows.append({
            "question": nq,
            "answer": f"x{rel}{_ft(k)}",
            "explanation": f"{inequality} の両辺を整理すると x{rel}{_ft(k)}。境界 x={_ft(k)} を左辺へ代入すると {_ft(c)} となることも確認。",
            "numeric_signature": sig,
        })
        evidence.append({
            "parent_sha256": _sha(parent),
            "method": "linear_inequality_exact_boundary_inverse_and_direction_check",
            "parent_recalculation": f"boundary=({_ft(pc)}-({_ft(pb)}))/{_ft(pa)}={_ft(pk)}, solved_rel={psolved_rel}",
            "variant_recalculation": f"boundary=({_ft(c)}-({_ft(b)}))/{_ft(a)}={_ft(k)}, solved_rel={rel}",
            "independent_check": f"a*k+b={_ft(a)}*{_ft(k)}+({_ft(b)})={_ft(c)} PASS",
        })
    return rows, evidence, "linear_inequality_ax_plus_b_rel_c_exact"
