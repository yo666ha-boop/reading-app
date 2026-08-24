from __future__ import annotations

"""Fail-closed engine for ax²+bx common-factor factorization."""

import hashlib
import json
import math
import re

TERM_RE = re.compile(r"(?P<a>[+-]?\d*)x(?:²|\^2)(?P<b>[+-]\d*)x")
ANS_RE = re.compile(r"(?P<k>[+-]?\d*)x\((?P<m>[+-]?\d*)x(?P<n>[+-]\d+)\)")


def _coef(text: str) -> int:
    if text in ("", "+"):
        return 1
    if text == "-":
        return -1
    return int(text)


def _norm(value: object) -> str:
    return str(value or "").replace("　", "").replace("−", "-").replace("＋", "+").replace("^2", "²")


def _parent_sha(parent: dict) -> str:
    raw = json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _parse_parent(parent: dict):
    if parent.get("figure_refs") or parent.get("choices"):
        return None
    q = _norm(parent.get("question"))
    if "因数分解" not in q:
        return None
    matches = list(TERM_RE.finditer(q))
    if len(matches) != 1:
        return None
    tm = matches[0]
    a, b = _coef(tm.group("a")), _coef(tm.group("b"))
    if a == 0 or b == 0:
        return None
    g = math.gcd(abs(a), abs(b))
    k = g if a > 0 else -g
    m, n = a // k, b // k
    answer = _norm(parent.get("answer"))
    am = ANS_RE.fullmatch(answer)
    if am is None:
        return None
    ak, mm, nn = _coef(am.group("k")), _coef(am.group("m")), int(am.group("n"))
    if (ak, mm, nn) != (k, m, n):
        return None
    if ak * mm != a or ak * nn != b or abs(ak) != g:
        return None
    return tm, a, b, k, m, n


def can_generate(parent: dict) -> tuple[bool, str]:
    if _parse_parent(parent) is not None:
        return True, "common_factor_quadratic_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices"):
        return False, "choice_parent"
    return False, "common_factor_quadratic_parent_not_exactly_parsed_and_verified"


def _factor_text(k: int, m: int, n: int) -> str:
    ktext = "x" if k == 1 else "-x" if k == -1 else f"{k}x"
    mtext = "x" if m == 1 else "-x" if m == -1 else f"{m}x"
    return f"{ktext}({mtext}{n:+d})"


def _poly_text(a: int, b: int) -> str:
    atext = "x²" if a == 1 else "-x²" if a == -1 else f"{a}x²"
    btext = "+x" if b == 1 else "-x" if b == -1 else f"{b:+d}x"
    return atext + btext


def generate(parent: dict, count: int):
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    parsed = _parse_parent(parent)
    if parsed is None:
        ok, reason = can_generate(parent)
        assert not ok
        return [], [], reason
    tm, pa, pb, pk, pm, pn = parsed
    q = _norm(parent.get("question"))
    seed = int(_parent_sha(parent)[:12], 16)
    parent_sig = (str(pa), str(pb))
    seen = set()
    rows, evidence = [], []
    for index in range(1, count + 1):
        g = 2 + ((seed >> (index * 5)) + index) % 7
        m = 1 + ((seed >> (index * 7 + 3)) + index * 2) % 6
        n_abs = 1 + ((seed >> (index * 4 + 13)) + index * 3) % 9
        n = -n_abs if ((seed >> (index + 19)) & 1) else n_abs
        k = -g if ((seed >> (index + 23)) & 1) else g
        a, b = k * m, k * n
        sig = (str(a), str(b))
        while sig == parent_sig or sig in seen:
            m += 1
            n += 1 if n > 0 else -1
            a, b = k * m, k * n
            sig = (str(a), str(b))
        seen.add(sig)
        check_g = math.gcd(abs(a), abs(b))
        if check_g != abs(k) or k * m != a or k * n != b:
            raise AssertionError("common factor identity failed")
        poly = _poly_text(a, b)
        answer = _factor_text(k, m, n)
        new_question = q[:tm.start()] + poly + q[tm.end():]
        rows.append({"question": new_question, "answer": answer, "explanation": f"{a}と{b}の最大公約数は{abs(k)}。共通因数{k}xでくくると{answer}。再展開して{poly}に戻る。", "numeric_signature": sig})
        evidence.append({"parent_sha256": _parent_sha(parent), "method": "common_factor_gcd_and_exact_reexpansion", "parent_recalculation": f"gcd(|{pa}|,|{pb}|)={abs(pk)}; {pk}*{pm}={pa}; {pk}*{pn}={pb}", "variant_recalculation": f"gcd(|{a}|,|{b}|)={abs(k)}", "independent_check": f"{k}*{m}={a}; {k}*{n}={b} PASS"})
    return rows, evidence, "common_factor_quadratic_exact"
