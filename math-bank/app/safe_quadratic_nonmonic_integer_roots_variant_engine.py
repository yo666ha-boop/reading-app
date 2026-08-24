from __future__ import annotations

"""Fail-closed exact engine for non-monic quadratic equations with two integer roots."""

import hashlib
import json
import math
import re

EQ_RE = re.compile(
    r"(?P<eq>(?P<a>\d+)\s*[xｘ]\s*(?:\^\s*2|²)\s*(?P<bs>[+＋\-−])\s*(?P<b>\d*)\s*[xｘ]\s*(?P<cs>[+＋\-−])\s*(?P<c>\d+)\s*=\s*0)"
)
ANS_RE = re.compile(r"^(?:[xｘ]\s*=\s*)?(?P<r1>[+-]?\d+)\s*[,、]\s*(?:[xｘ]\s*=\s*)?(?P<r2>[+-]?\d+)$")


def _norm(value: object) -> str:
    return str(value or "").replace("−", "-").replace("＋", "+").replace("　", " ")


def _sha(parent: dict) -> str:
    raw = json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _signed(sign: str, digits: str, *, implicit_one: bool = False) -> int:
    n = 1 if implicit_one and digits == "" else int(digits)
    return -n if _norm(sign) == "-" else n


def _parse(parent: dict):
    if parent.get("figure_refs") or parent.get("choices"):
        return None
    q = _norm(parent.get("question"))
    if any(t in q for t in ("因数分解", "解の公式を使わず", "グラフ", "関数", "文章題", "近似", "小数")):
        return None
    if "方程式" not in q and not any(t in q for t in ("解き", "解を", "解は", "求め")):
        return None
    matches = list(EQ_RE.finditer(q))
    if len(matches) != 1 or q.count("=") != 1:
        return None
    m = matches[0]
    a = int(m.group("a")); b = _signed(m.group("bs"), m.group("b"), implicit_one=True); c = _signed(m.group("cs"), m.group("c"))
    if a <= 1:
        return None
    disc = b * b - 4 * a * c
    if disc <= 0:
        return None
    s = math.isqrt(disc)
    den = 2 * a
    if s * s != disc or (-b + s) % den or (-b - s) % den:
        return None
    roots = tuple(sorted(((-b + s) // den, (-b - s) // den)))
    if roots[0] == roots[1]:
        return None
    am = ANS_RE.fullmatch(_norm(parent.get("answer")).replace(" ", ""))
    if am is None or tuple(sorted((int(am.group("r1")), int(am.group("r2"))))) != roots:
        return None
    r1, r2 = roots
    if a * (r1 + r2) != -b or a * r1 * r2 != c:
        return None
    if a * r1 * r1 + b * r1 + c != 0 or a * r2 * r2 + b * r2 + c != 0:
        return None
    return m, a, b, c, disc, s, roots


def can_generate(parent: dict) -> tuple[bool, str]:
    if _parse(parent) is not None:
        return True, "quadratic_nonmonic_two_integer_roots_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices"):
        return False, "choice_parent"
    return False, "quadratic_nonmonic_parent_not_exactly_parsed_and_verified"


def _equation(a: int, b: int, c: int) -> str:
    out = f"{a}x²"
    if b > 0:
        out += "+x" if b == 1 else f"+{b}x"
    else:
        out += "-x" if b == -1 else f"{b}x"
    if c > 0:
        out += f"+{c}"
    else:
        out += str(c)
    return out + "=0"


def generate(parent: dict, count: int):
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    parsed = _parse(parent)
    if parsed is None:
        ok, reason = can_generate(parent); assert not ok
        return [], [], reason
    match, pa, pb, pc, pdisc, ps, proots = parsed
    q = _norm(parent.get("question")); seed = int(_sha(parent)[:12], 16)
    parent_sig = (str(pa), str(pb), str(pc)); seen = set(); rows = []; evidence = []
    for i in range(1, count + 1):
        a = 2 + ((seed >> (i * 4)) % 4)
        r1 = -5 + ((seed >> (i * 6 + 3)) % 11)
        r2 = -5 + ((seed >> (i * 8 + 5)) % 11)
        if r1 == r2:
            r2 += 2
        if r1 > r2:
            r1, r2 = r2, r1
        b = -a * (r1 + r2); c = a * r1 * r2; sig = (str(a), str(b), str(c))
        bump = 0
        while sig == parent_sig or sig in seen or r1 == r2 or c == 0:
            bump += 1; r2 += 1
            if r1 == r2:
                r2 += 1
            if r1 > r2:
                r1, r2 = r2, r1
            b = -a * (r1 + r2); c = a * r1 * r2; sig = (str(a), str(b), str(c))
        seen.add(sig)
        disc = b * b - 4 * a * c; s = math.isqrt(disc); den = 2 * a
        if s * s != disc or (-b + s) % den or (-b - s) % den:
            raise AssertionError("quadratic discriminant did not produce integer roots")
        if a * (r1 + r2) != -b or a * r1 * r2 != c:
            raise AssertionError("quadratic Vieta identity failed")
        if a * r1 * r1 + b * r1 + c or a * r2 * r2 + b * r2 + c:
            raise AssertionError("quadratic root substitution failed")
        eq = _equation(a, b, c); nq = q[:match.start("eq")] + eq + q[match.end("eq"):]
        rows.append({"question": nq, "answer": f"x={r1}, x={r2}", "explanation": f"判別式D={disc}={s}²。解の公式よりx={r1},{r2}。Vietaと代入でも確認済み。", "numeric_signature": sig})
        evidence.append({"parent_sha256": _sha(parent), "method": "quadratic_nonmonic_integer_roots_discriminant_vieta_substitution", "parent_recalculation": f"D={pdisc}={ps}^2 roots={proots[0]},{proots[1]}", "variant_recalculation": f"D={disc}={s}^2 roots={r1},{r2}", "independent_check": f"a*(sum)={a*(r1+r2)}=-b={-b}; a*product={a*r1*r2}=c={c}; both_substitute_to_0 PASS"})
    return rows, evidence, "quadratic_nonmonic_two_integer_roots_exact"
