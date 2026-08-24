from __future__ import annotations

"""Fail-closed exact engine for adding/subtracting like square-root terms."""

import hashlib
import json
import math
import re

EXPR_RE = re.compile(r"(?P<expr>(?P<a>\d*)\s*√\s*(?P<r>\d+)\s*(?P<op>[+＋\-−])\s*(?P<b>\d*)\s*√\s*(?P<r2>\d+))")
ANS_RE = re.compile(r"^(?P<c>[+-]?\d*)√(?P<r>\d+)$")


def _norm(v: object) -> str:
    return str(v or "").replace("　", " ").replace("＋", "+").replace("−", "-").replace(" ", "")


def _sha(parent: dict) -> str:
    raw = json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _square_free(n: int) -> bool:
    if n <= 1:
        return False
    p = 2
    while p * p <= n:
        if n % (p * p) == 0:
            return False
        p += 1
    return True


def _coef(t: str | None) -> int:
    if t in (None, "", "+"):
        return 1
    if t == "-":
        return -1
    return int(t)


def _format(c: int, r: int) -> str:
    if c == 1:
        return f"√{r}"
    if c == -1:
        return f"-√{r}"
    return f"{c}√{r}"


def _parse(parent: dict):
    if parent.get("figure_refs") or parent.get("choices"):
        return None
    q = _norm(parent.get("question"))
    if not any(t in q for t in ("計算", "簡単", "求め")):
        return None
    if any(t in q for t in ("×", "*", "÷", "/", "方程式", "近似", "有理化")):
        return None
    ms = list(EXPR_RE.finditer(q))
    if len(ms) != 1 or q.count("√") != 2:
        return None
    m = ms[0]; a = _coef(m.group("a")); b = _coef(m.group("b")); r = int(m.group("r")); r2 = int(m.group("r2"))
    if r != r2 or not _square_free(r) or a <= 0 or b <= 0:
        return None
    op = _norm(m.group("op")); result = a + b if op == "+" else a - b
    if result == 0:
        return None
    am = ANS_RE.fullmatch(_norm(parent.get("answer")))
    if am is None or int(am.group("r")) != r or _coef(am.group("c")) != result:
        return None
    if (a + (b if op == "+" else -b)) != result:
        return None
    return m, a, b, r, op, result


def can_generate(parent: dict) -> tuple[bool, str]:
    if _parse(parent) is not None:
        return True, "square_root_like_terms_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices"):
        return False, "choice_parent"
    return False, "square_root_like_terms_parent_not_exactly_parsed_and_verified"


def generate(parent: dict, count: int):
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    parsed = _parse(parent)
    if parsed is None:
        ok, reason = can_generate(parent); assert not ok
        return [], [], reason
    match, pa, pb, pr, pop, presult = parsed
    q = _norm(parent.get("question")); seed = int(_sha(parent)[:12], 16)
    roots = (2, 3, 5, 6, 7, 10, 11, 13, 14, 15)
    parent_sig = (pa, pb, pr, pop); seen = set(); rows = []; evidence = []
    for i in range(1, count + 1):
        r = roots[((seed >> (i * 5)) + i * 3) % len(roots)]
        a = 2 + ((seed >> (i * 7 + 1)) + i * 5) % 8
        op = "+" if ((seed >> (i + 19)) & 1) == 0 else "-"
        b = 1 + ((seed >> (i * 9 + 2)) + i * 7) % 7
        if op == "-" and a == b:
            a += 2
        result = a + b if op == "+" else a - b
        sig = (a, b, r, op)
        bump = 0
        while sig == parent_sig or sig in seen or result == 0:
            bump += 1; a += 1; b += 2; result = a + b if op == "+" else a - b; sig = (a, b, r, op)
        seen.add(sig)
        if a + (b if op == "+" else -b) != result:
            raise AssertionError("like radical coefficient identity failed")
        expr = f"{a}√{r}{op}{b}√{r}"
        nq = q[:match.start("expr")] + expr + q[match.end("expr"):]
        rows.append({"question": nq, "answer": _format(result, r), "explanation": f"√{r}が共通なので係数だけ計算し、{a}{op}{b}={result}。したがって{_format(result,r)}。", "numeric_signature": (str(a), str(r), str(b), str(result))})
        evidence.append({"parent_sha256": _sha(parent), "method": "square_root_like_terms_exact_coefficient_arithmetic", "parent_recalculation": f"{pa}{pop}{pb}={presult}", "variant_recalculation": f"{a}{op}{b}={result}", "independent_check": f"coefficient_result={result} AND radicand={r} squarefree PASS"})
    return rows, evidence, "square_root_like_terms_exact"
