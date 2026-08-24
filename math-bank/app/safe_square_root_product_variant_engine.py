from __future__ import annotations

"""Fail-closed exact engine for products sqrt(a) * sqrt(b) with integer result."""

import hashlib
import json
import math
import re

PRODUCT_RE = re.compile(r"(?P<expr>√\s*(?P<a>\d+)\s*[×*]\s*√\s*(?P<b>\d+))")
ANSWER_RE = re.compile(r"^(?P<v>\d+)$")


def _norm(v: object) -> str:
    return str(v or "").replace("　", " ").replace("＊", "*")


def _sha(parent: dict) -> str:
    raw = json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _parse(parent: dict):
    if parent.get("figure_refs") or parent.get("choices"):
        return None
    q = _norm(parent.get("question"))
    if not any(t in q for t in ("計算", "求め", "値")):
        return None
    if any(t in q for t in ("÷", "/", "+", "−", "-", "方程式", "近似", "有理化")):
        return None
    matches = list(PRODUCT_RE.finditer(q))
    if len(matches) != 1 or len(re.findall(r"√", q)) != 2:
        return None
    m = matches[0]; a = int(m.group("a")); b = int(m.group("b"))
    if a <= 0 or b <= 0:
        return None
    product = a * b; root = math.isqrt(product)
    if root * root != product:
        return None
    am = ANSWER_RE.fullmatch(str(parent.get("answer") or "").replace(" ", ""))
    if am is None or int(am.group("v")) != root:
        return None
    if root * root != a * b:
        return None
    return m, a, b, root


def can_generate(parent: dict) -> tuple[bool, str]:
    if _parse(parent) is not None:
        return True, "square_root_product_integer_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices"):
        return False, "choice_parent"
    return False, "square_root_product_parent_not_exactly_parsed_and_verified"


def generate(parent: dict, count: int):
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    parsed = _parse(parent)
    if parsed is None:
        ok, reason = can_generate(parent); assert not ok
        return [], [], reason
    match, pa, pb, proot = parsed
    q = _norm(parent.get("question")); seed = int(_sha(parent)[:12], 16)
    pool = (2, 3, 5, 6, 7, 10, 11, 13)
    parent_sig = (pa, pb, proot); seen = set(); rows = []; evidence = []
    for i in range(1, count + 1):
        d = pool[((seed >> (i * 5)) + i * 3) % len(pool)]
        k = 2 + ((seed >> (i * 7 + 2)) + i * 5) % 7
        a = d; b = d * k * k; root = d * k
        sig = (a, b, root)
        bump = 0
        while sig == parent_sig or sig in seen:
            bump += 1; k += 1; b = d * k * k; root = d * k; sig = (a, b, root)
        seen.add(sig)
        if a * b != root * root or math.isqrt(a * b) != root:
            raise AssertionError("square root product perfect-square identity failed")
        nq = q[:match.start("expr")] + f"√{a}×√{b}" + q[match.end("expr"):]
        rows.append({
            "question": nq,
            "answer": str(root),
            "explanation": f"√{a}×√{b}=√({a}×{b})=√{a*b}={root}。{root}²={a*b}でも確認。",
            "numeric_signature": tuple(map(str, sig)),
        })
        evidence.append({
            "parent_sha256": _sha(parent),
            "method": "square_root_product_exact_perfect_square_and_square_identity",
            "parent_recalculation": f"{pa}*{pb}={proot}^2={pa*pb}",
            "variant_recalculation": f"{a}*{b}={root}^2={a*b}",
            "independent_check": f"isqrt({a*b})={root} AND {root}^2={a*b} PASS",
        })
    return rows, evidence, "square_root_product_integer_exact"
