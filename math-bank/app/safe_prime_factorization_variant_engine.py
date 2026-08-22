from __future__ import annotations

"""Fail-closed exact engine for a narrow integer prime-factorization parent shape.

Only a single positive integer explicitly asked to be prime-factorized is accepted.
The parent answer must exactly represent the full prime factorization. Generated
variants are independently checked by primality of every factor and exact product
recomposition. Composite-factor, GCD/LCM, divisor, figure and real-choice problems
fail closed.
"""

import hashlib
import json
import re

QUESTION_RE = re.compile(r"(?P<n>\d+)\s*を\s*素因数分解")
TERM_RE = re.compile(r"(?P<p>\d+)(?:\^(?P<e>\d+))?")


def _norm(value: object) -> str:
    return (str(value or "").replace("　", " ").replace("＊", "×").replace("*", "×").replace("x", "×").replace("X", "×").replace(" ", ""))


def _parent_sha(parent: dict) -> str:
    raw = json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _is_prime(n: int) -> bool:
    if n < 2:
        return False
    d = 2
    while d * d <= n:
        if n % d == 0:
            return False
        d += 1
    return True


def _factorize(n: int) -> list[tuple[int, int]]:
    out: list[tuple[int, int]] = []
    d = 2
    while d * d <= n:
        e = 0
        while n % d == 0:
            n //= d
            e += 1
        if e:
            out.append((d, e))
        d += 1
    if n > 1:
        out.append((n, 1))
    return out


def _format(factors: list[tuple[int, int]]) -> str:
    return "×".join(str(p) if e == 1 else f"{p}^{e}" for p, e in factors)


def _parse_answer(value: object) -> list[tuple[int, int]] | None:
    s = _norm(value)
    if not s:
        return None
    parts = s.split("×")
    merged: dict[int, int] = {}
    for part in parts:
        m = TERM_RE.fullmatch(part)
        if m is None:
            return None
        p = int(m.group("p")); e = int(m.group("e") or "1")
        if not _is_prime(p) or e <= 0:
            return None
        merged[p] = merged.get(p, 0) + e
    return sorted(merged.items())


def _parse_parent(parent: dict):
    if parent.get("figure_refs"):
        return None
    if parent.get("choices"):
        return None
    q = _norm(parent.get("question"))
    if "素因数分解" not in q:
        return None
    blocked = ("最大公約数", "最小公倍数", "約数", "公約数", "公倍数", "個数", "証明")
    if any(token in q for token in blocked):
        return None
    matches = list(QUESTION_RE.finditer(q))
    if len(matches) != 1:
        return None
    nums = re.findall(r"\d+", q)
    if len(nums) != 1:
        return None
    m = matches[0]
    n = int(m.group("n"))
    if n < 4 or _is_prime(n):
        return None
    expected = _factorize(n)
    parsed_answer = _parse_answer(parent.get("answer"))
    if parsed_answer != expected:
        return None
    product = 1
    for p, e in expected:
        if not _is_prime(p):
            return None
        product *= p ** e
    if product != n:
        return None
    return m, n, expected


def can_generate(parent: dict) -> tuple[bool, str]:
    if _parse_parent(parent) is not None:
        return True, "single_composite_integer_prime_factorization_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices"):
        return False, "choice_parent"
    return False, "prime_factorization_parent_not_exactly_parsed_and_verified"


def _variant_number(seed: int, index: int) -> int:
    primes = (2, 3, 5, 7, 11)
    p = primes[(seed + index) % len(primes)]
    q = primes[((seed >> 5) + index * 2) % len(primes)]
    r = primes[((seed >> 9) + index * 3) % len(primes)]
    n = p * q * r
    if index == 2:
        n *= p
    elif index == 3:
        n *= q
    return n


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    parsed = _parse_parent(parent)
    if parsed is None:
        ok, reason = can_generate(parent)
        assert not ok
        return [], [], reason

    match, parent_n, parent_factors = parsed
    q = _norm(parent.get("question"))
    seed = int(_parent_sha(parent)[:12], 16)
    seen: set[int] = set()
    rows: list[dict] = []
    evidence: list[dict] = []

    for index in range(1, count + 1):
        n = _variant_number(seed, index)
        bump = 0
        while n == parent_n or n in seen or _is_prime(n):
            bump += 1
            n *= 2 + bump
        seen.add(n)
        factors = _factorize(n)
        product = 1
        for p, e in factors:
            if not _is_prime(p):
                raise AssertionError("non-prime factor emitted")
            product *= p ** e
        if product != n:
            raise AssertionError("prime factorization recomposition failed")
        answer = _format(factors)
        replacement = str(n)
        new_question = q[:match.start("n")] + replacement + q[match.end("n"):]
        rows.append({
            "question": new_question,
            "answer": answer,
            "explanation": f"{n}を素数だけの積に分けると{answer}。各因子が素数で、積を戻すと{n}になることも確認済み。",
            "numeric_signature": (str(n),),
        })
        evidence.append({
            "parent_sha256": _parent_sha(parent),
            "method": "prime_factors_all_prime_plus_exact_product_recomposition",
            "parent_recalculation": f"{parent_n}={_format(parent_factors)}",
            "variant_recalculation": f"{n}={answer}",
            "independent_check": "every factor prime AND recomposed product == original integer PASS",
        })
    return rows, evidence, "single_composite_integer_prime_factorization_exact"
