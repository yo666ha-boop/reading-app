from __future__ import annotations

import argparse
import copy
import hashlib
import json
import re
from collections import Counter, defaultdict
from datetime import datetime, timezone
from fractions import Fraction
from pathlib import Path

from validate_app_records import load_records
from validate_expanded_variant_layer import (
    BASE_CANONICAL_SHA256,
    base_gate,
    load_layer,
    numeric_tokens,
    parent_record_sha256,
    validate_layer,
)

# This generator is intentionally narrow. It generates only structures that can
# be parsed exactly and independently recalculated. Everything else fails closed
# into the manual queue rather than being guessed.

INT = r"[+-]?\d+"
BINARY_RE = re.compile(
    rf"(?P<expr>\(?(?P<a>{INT})\)?\s*(?P<op>[+＋\-−×*÷/])\s*\(?(?P<b>{INT})\)?)"
)
LINEAR_RE = re.compile(
    rf"(?P<eq>(?P<a>[+-]?\d*)\s*[xｘ]\s*(?:(?P<sign>[+＋\-−])\s*(?P<b>\d+))?\s*=\s*(?P<c>{INT}))"
)
PLAIN_NUMBER_RE = re.compile(r"^[+-]?\d+(?:/\d+)?$")
X_ANSWER_RE = re.compile(r"^[xｘ]\s*=\s*([+-]?\d+(?:/\d+)?)$")


def norm_minus(s: str) -> str:
    return s.replace("−", "-").replace("＋", "+").strip()


def frac_text(v: Fraction) -> str:
    if v.denominator == 1:
        return str(v.numerator)
    return f"{v.numerator}/{v.denominator}"


def parse_plain_answer(answer: object) -> Fraction | None:
    if not isinstance(answer, str):
        return None
    s = norm_minus(answer).replace(" ", "")
    if not PLAIN_NUMBER_RE.fullmatch(s):
        return None
    try:
        return Fraction(s)
    except Exception:
        return None


def parse_x_answer(answer: object) -> Fraction | None:
    if not isinstance(answer, str):
        return None
    s = norm_minus(answer).replace(" ", "")
    m = X_ANSWER_RE.fullmatch(s)
    if not m:
        return None
    try:
        return Fraction(m.group(1))
    except Exception:
        return None


def eval_binary(a: int, op: str, b: int) -> Fraction:
    op = norm_minus(op)
    if op == "+":
        return Fraction(a + b)
    if op == "-":
        return Fraction(a - b)
    if op in ("×", "*"):
        return Fraction(a * b)
    if op in ("÷", "/"):
        if b == 0:
            raise ZeroDivisionError("division by zero")
        return Fraction(a, b)
    raise ValueError(f"unsupported operator {op}")


def inverse_binary_check(a: int, op: str, b: int, result: Fraction) -> bool:
    """Independent algebraic identity, separate from the forward evaluator."""
    op = norm_minus(op)
    if op == "+":
        return result - b == a
    if op == "-":
        return result + b == a
    if op in ("×", "*"):
        if b == 0:
            return result == 0
        return result / b == a
    if op in ("÷", "/"):
        return b != 0 and result * b == a
    return False


def coefficient(text: str) -> int | None:
    s = norm_minus(text).replace(" ", "")
    if s in ("", "+"):
        return 1
    if s == "-":
        return -1
    try:
        return int(s)
    except ValueError:
        return None


def solve_linear(a: int, signed_b: int, c: int) -> Fraction:
    if a == 0:
        raise ZeroDivisionError("zero x coefficient")
    return Fraction(c - signed_b, a)


def substitute_linear_check(a: int, signed_b: int, c: int, x: Fraction) -> bool:
    return a * x + signed_b == c


def stable_seed(parent: dict) -> int:
    return int(parent_record_sha256(parent)[:12], 16)


def render_operand(n: int) -> str:
    return f"({n})" if n < 0 else str(n)


def candidate_binary_values(a: int, op: str, b: int, seed: int, index: int) -> tuple[int, int]:
    # Deterministic but parent-specific. Values are deliberately modest for
    # middle-school worksheets and never reuse the parent numeric pair.
    step1 = 2 + ((seed >> (index * 3)) & 3) + index * 2
    step2 = 3 + ((seed >> (index * 5 + 7)) & 3) + index * 3
    sign1 = -1 if ((seed >> (index + 2)) & 1) else 1
    sign2 = -1 if ((seed >> (index + 11)) & 1) else 1
    opn = norm_minus(op)
    if opn in ("÷", "/"):
        divisor = max(2, abs(b) + step2)
        if sign2 < 0:
            divisor = -divisor
        quotient = max(2, abs(a // b) if b else 2) + step1
        if sign1 < 0:
            quotient = -quotient
        return quotient * divisor, divisor
    na = a + sign1 * step1
    nb = b + sign2 * step2
    if (na, nb) == (a, b):
        nb += index + 1
    return na, nb


def candidate_linear_values(a: int, signed_b: int, seed: int, index: int) -> tuple[int, int, int, int]:
    # Keep an integral solution to avoid inventing fraction-format conventions.
    mag_a = max(1, abs(a)) + 1 + ((seed >> (index * 2)) & 1)
    na = -mag_a if ((seed >> (index + 4)) & 1) else mag_a
    if na == 0:
        na = 1
    target_x = 2 + ((seed >> (index * 4 + 9)) & 7) + index
    if ((seed >> (index + 17)) & 1):
        target_x = -target_x
    bmag = abs(signed_b) + 2 + ((seed >> (index * 3 + 21)) & 3) + index
    nsigned_b = -bmag if signed_b < 0 else bmag
    if signed_b == 0:
        nsigned_b = 0
    nc = na * target_x + nsigned_b
    return na, nsigned_b, nc, target_x


def make_variant_base(parent: dict, vid: str) -> dict:
    r = copy.deepcopy(parent)
    r["id"] = vid
    r["source"] = {
        "book": "generated",
        "document": str(parent["source"].get("document") or ""),
        "original_no": None,
        "is_generated_variant": True,
        "parent_id": parent["id"],
    }
    r["variant_group"] = parent["id"]
    r["audit"] = {
        "problem_answer_verified": True,
        "structure_verified": True,
        "figure_refs_verified": True,
        "notes": ["deterministic parent-bound generation; independently recalculated"],
    }
    return r


def variant_id(parent: dict, method: str, index: int) -> str:
    raw = f"{parent['id']}|{parent_record_sha256(parent)}|{method}|{index}".encode()
    return f"XV-{hashlib.sha256(raw).hexdigest()[:16].upper()}"


def provenance(parent: dict, vid: str, method: str, evidence: str, now: str) -> dict:
    return {
        "variant_id": vid,
        "parent_id": parent["id"],
        "parent_record_sha256": parent_record_sha256(parent),
        "generator": "generate_safe_verified_variants.py",
        "generation_method": method,
        "verification_method": "exact rational forward evaluation plus independent algebraic identity/substitution check",
        "verified_at": now,
        "independent_recalculation": True,
        "verification_evidence": evidence,
    }


def generate_binary(parent: dict, count: int, now: str) -> tuple[list[dict], list[dict], str | None]:
    if parent.get("figure_refs"):
        return [], [], "figure_parent"
    if parent.get("choices"):
        return [], [], "choice_parent"
    q = str(parent.get("question") or "")
    matches = list(BINARY_RE.finditer(norm_minus(q)))
    if len(matches) != 1:
        return [], [], "binary_expression_not_unique"
    m = matches[0]
    try:
        a = int(m.group("a")); b = int(m.group("b")); op = m.group("op")
        expected = eval_binary(a, op, b)
    except Exception:
        return [], [], "binary_parent_parse_or_eval_fail"
    parent_answer = parse_plain_answer(parent.get("answer"))
    if parent_answer is None or parent_answer != expected:
        return [], [], "binary_parent_answer_not_exactly_recalculated"

    seed = stable_seed(parent)
    variants=[]; prov=[]; used=set()
    for i in range(1, count + 1):
        na, nb = candidate_binary_values(a, op, b, seed, i)
        result = eval_binary(na, op, nb)
        if not inverse_binary_check(na, op, nb, result):
            return [], [], "binary_independent_identity_fail"
        expr = f"{render_operand(na)}{op}{render_operand(nb)}"
        nq = norm_minus(q)[:m.start("expr")] + expr + norm_minus(q)[m.end("expr"):]
        sig = tuple(numeric_tokens(nq))
        if sig in used or sig == tuple(numeric_tokens(q)):
            return [], [], "binary_generated_numeric_signature_collision"
        used.add(sig)
        vid = variant_id(parent, "binary-exact", i)
        r = make_variant_base(parent, vid)
        r["question"] = nq
        r["answer"] = frac_text(result)
        r["explanation"] = f"{expr} = {frac_text(result)}。逆算でも一致することを確認済み。"
        variants.append(r)
        prov.append(provenance(
            parent, vid, "exact binary-expression numeric substitution preserving parent operator and surrounding text",
            f"forward={expr}={frac_text(result)}; inverse_identity=PASS; parent_answer_recalc={frac_text(expected)}",
            now,
        ))
    return variants, prov, None


def format_linear(a: int, signed_b: int, c: int, had_b_term: bool) -> str:
    if a == 1:
        lhs = "x"
    elif a == -1:
        lhs = "-x"
    else:
        lhs = f"{a}x"
    if had_b_term:
        lhs += f"+{signed_b}" if signed_b >= 0 else str(signed_b)
    return f"{lhs}={c}"


def generate_linear(parent: dict, count: int, now: str) -> tuple[list[dict], list[dict], str | None]:
    if parent.get("figure_refs"):
        return [], [], "figure_parent"
    if parent.get("choices"):
        return [], [], "choice_parent"
    q = norm_minus(str(parent.get("question") or ""))
    matches = list(LINEAR_RE.finditer(q))
    if len(matches) != 1:
        return [], [], "linear_equation_not_unique"
    m = matches[0]
    a = coefficient(m.group("a") or "")
    if a in (None, 0):
        return [], [], "linear_coefficient_invalid"
    had_b = m.group("sign") is not None
    b = int(m.group("b")) if m.group("b") else 0
    sign = norm_minus(m.group("sign") or "+")
    signed_b = -b if sign == "-" else b
    c = int(m.group("c"))
    try:
        expected = solve_linear(a, signed_b, c)
    except Exception:
        return [], [], "linear_parent_solve_fail"
    parent_answer = parse_x_answer(parent.get("answer"))
    if parent_answer is None or parent_answer != expected or not substitute_linear_check(a, signed_b, c, expected):
        return [], [], "linear_parent_answer_not_exactly_recalculated"

    seed=stable_seed(parent)
    variants=[]; prov=[]; used=set()
    for i in range(1, count + 1):
        na, nb, nc, target_x = candidate_linear_values(a, signed_b, seed, i)
        solved = solve_linear(na, nb, nc)
        if solved != target_x or not substitute_linear_check(na, nb, nc, solved):
            return [], [], "linear_independent_substitution_fail"
        eq = format_linear(na, nb, nc, had_b)
        nq = q[:m.start("eq")] + eq + q[m.end("eq"):]
        sig=tuple(numeric_tokens(nq))
        if sig in used or sig == tuple(numeric_tokens(q)):
            return [], [], "linear_generated_numeric_signature_collision"
        used.add(sig)
        vid=variant_id(parent,"linear-exact",i)
        r=make_variant_base(parent,vid)
        r["question"]=nq
        r["answer"]=f"x={frac_text(solved)}"
        r["explanation"]=f"{eq} を解くと x={frac_text(solved)}。代入して左右一致を確認済み。"
        variants.append(r)
        prov.append(provenance(
            parent,vid,"exact first-degree-equation coefficient substitution with an integral target solution",
            f"solve={eq}->x={frac_text(solved)}; substitution={na}*({frac_text(solved)})+({nb})={nc}=PASS; parent_solution={frac_text(expected)}",
            now,
        ))
    return variants,prov,None


def generate_parent(parent: dict, count: int, now: str) -> tuple[list[dict], list[dict], str]:
    # Equation first so an equation containing '+' is not mistaken for a bare
    # arithmetic expression.
    variants, prov, reason = generate_linear(parent, count, now)
    if variants:
        return variants, prov, "linear_equation_exact"
    linear_reason = reason
    variants, prov, reason = generate_binary(parent, count, now)
    if variants:
        return variants, prov, "binary_arithmetic_exact"
    return [], [], f"unsupported_safe_generation:{linear_reason}|{reason}"


def main() -> int:
    ap=argparse.ArgumentParser()
    ap.add_argument("base")
    ap.add_argument("expanded")
    ap.add_argument("output")
    ap.add_argument("--target-per-parent",type=int,default=1,choices=(1,2,3))
    ap.add_argument("--report")
    ns=ap.parse_args()

    base=load_records(Path(ns.base))
    by_id, originals, _ = base_gate(base)
    variants, provenance_rows, _ = load_layer(Path(ns.expanded))
    validate_layer(base, variants, provenance_rows, require_full_parent_coverage=False)

    counts=defaultdict(int)
    for r in variants:
        counts[r["source"]["parent_id"]]+=1
    now=datetime.now(timezone.utc).isoformat()
    generated=[]; generated_prov=[]; reasons=Counter()
    for parent in originals:
        need=max(0,ns.target_per_parent-counts[parent["id"]])
        if need==0:
            reasons["already_at_target"]+=1
            continue
        new, prov, reason=generate_parent(parent, need, now)
        if not new:
            reasons[reason]+=1
            continue
        generated.extend(new); generated_prov.extend(prov); reasons[reason]+=1

    out_layer={
        "schema_version":"1.0",
        "base_canonical_sha256":BASE_CANONICAL_SHA256,
        "variants":variants+generated,
        "provenance":provenance_rows+generated_prov,
    }
    # The final strict validator is the promotion gate. A generator bug cannot
    # silently write a publishable layer.
    final_report=validate_layer(base,out_layer["variants"],out_layer["provenance"],require_full_parent_coverage=False)
    Path(ns.output).write_text(json.dumps(out_layer,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    report={
        "status":"PASS",
        "recorded_at_utc":now,
        "policy":"Only exact, parser-proven arithmetic/linear-equation parents with independently verified parent answers are generated. Unsupported parents remain manual; no guessing.",
        "base_originals":len(originals),
        "existing_expanded_variants":len(variants),
        "newly_generated_verified_variants":len(generated),
        "expanded_total":len(out_layer["variants"]),
        "expanded_parent_coverage":final_report["expanded_parent_coverage"],
        "target_per_parent":ns.target_per_parent,
        "generation_reason_counts":dict(sorted(reasons.items())),
    }
    if ns.report:
        Path(ns.report).write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(json.dumps(report,ensure_ascii=False,indent=2))
    return 0


if __name__=="__main__":
    try:
        raise SystemExit(main())
    except Exception as e:
        print(f"FAIL: {e}")
        raise SystemExit(1)
