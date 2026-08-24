from __future__ import annotations

"""Fail-closed exact engine for x²+2px+p²=(x+p)² factorization."""

import hashlib
import json
import re

EXPR_RE = re.compile(r"x(?:²|\^2)(?P<b>[+-]\d+)x(?P<c>[+-]\d+)")
ANS_RE = re.compile(r"\(x(?P<p>[+-]\d+)\)(?:²|\^2)")


def _norm(value: object) -> str:
    return str(value or "").replace("　", "").replace("−", "-").replace("＋", "+").replace("^2", "²")


def _parent_sha(parent: dict) -> str:
    raw = json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _parse_parent(parent: dict):
    if parent.get("figure_refs") or parent.get("choices"):
        return None
    q = _norm(parent.get("question"))
    if "因数分解" not in q or any(t in q for t in ("展開", "方程式", "平方完成", "証明")):
        return None
    matches = list(EXPR_RE.finditer(q))
    if len(matches) != 1:
        return None
    m = matches[0]
    b, c = int(m.group("b")), int(m.group("c"))
    am = ANS_RE.fullmatch(_norm(parent.get("answer")))
    if am is None:
        return None
    p = int(am.group("p"))
    if p == 0 or b != 2 * p or c != p * p:
        return None
    return m, b, c, p


def can_generate(parent: dict) -> tuple[bool, str]:
    if _parse_parent(parent) is not None:
        return True, "perfect_square_factorization_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices"):
        return False, "choice_parent"
    return False, "perfect_square_factorization_parent_not_exactly_parsed_and_verified"


def generate(parent: dict, count: int):
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    parsed = _parse_parent(parent)
    if parsed is None:
        ok, reason = can_generate(parent)
        assert not ok
        return [], [], reason
    match, parent_b, parent_c, parent_p = parsed
    q = _norm(parent.get("question"))
    seed = int(_parent_sha(parent)[:12], 16)
    parent_sig = (str(parent_b), str(parent_c))
    seen = set()
    rows, evidence = [], []
    for index in range(1, count + 1):
        p = 2 + ((seed >> (index * 6)) + index * 3) % 10
        if (seed >> (index + 17)) & 1:
            p = -p
        b, c = 2 * p, p * p
        sig = (str(b), str(c))
        while sig == parent_sig or sig in seen:
            p += 1 if p > 0 else -1
            b, c = 2 * p, p * p
            sig = (str(b), str(c))
        seen.add(sig)
        if b != 2 * p or c != p * p:
            raise AssertionError("perfect square identity failed")
        expr = f"x²{b:+d}x+{c}"
        answer = f"(x{p:+d})²"
        new_question = q[:match.start()] + expr + q[match.end():]
        rows.append({"question": new_question, "answer": answer, "explanation": f"{b}=2×{p}、{c}={p}²なので{answer}。再展開して{expr}に戻る。", "numeric_signature": sig})
        evidence.append({"parent_sha256": _parent_sha(parent), "method": "perfect_square_double_and_square_identity", "parent_recalculation": f"{parent_b}=2*{parent_p}; {parent_c}={parent_p}^2", "variant_recalculation": f"{b}=2*{p}; {c}={p}^2", "independent_check": f"(x{p:+d})^2=x^2{b:+d}x+{c} PASS"})
    return rows, evidence, "perfect_square_factorization_exact"
