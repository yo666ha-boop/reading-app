from __future__ import annotations

import copy

from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256

NOW = "2026-08-24T06:12:00Z"


def parent(pid: str, question: str, answer: str) -> dict:
    p = copy.deepcopy(make_base()[0])
    p["id"] = pid
    p["question"] = question
    p["answer"] = answer
    p["choices"] = []
    p["figure_refs"] = []
    p["source"]["is_generated_variant"] = False
    p["source"]["parent_id"] = None
    p["variant_group"] = None
    return p


def check(p: dict, expected_engine: str, expected_reason: str) -> None:
    rows, prov, reason = generate_parent(p, 3, NOW)
    assert reason.startswith(f"specialized:{expected_engine}:{expected_reason}"), reason
    assert len(rows) == len(prov) == 3
    assert len({tuple(r["numeric_signature"]) for r in rows}) == 3
    expected_sha = parent_record_sha256(p)
    for row, evidence in zip(rows, prov):
        assert row["source"]["parent_id"] == p["id"]
        assert row.get("taxonomy") == p.get("taxonomy")
        assert row.get("difficulty") == p.get("difficulty")
        assert row.get("format") == p.get("format")
        assert row.get("question_format") == p.get("question_format")
        assert row.get("choices") == p.get("choices")
        assert row.get("figure_refs") == p.get("figure_refs")
        audit = row.get("audit") or {}
        assert all(audit.get(k) is True for k in ("problem_answer_verified", "structure_verified", "figure_refs_verified"))
        assert evidence["parent_record_sha256"] == expected_sha
        assert evidence["independent_recalculation"] is True
        assert f"engine={expected_engine}" in evidence["verification_evidence"]


def main() -> None:
    check(
        parent("BATCH-Q", "二次方程式 2x²-10x+12=0 を解きなさい。", "x=2, x=3"),
        "quadratic_square_equation",
        "quadratic_nonmonic_two_integer_roots_exact",
    )
    check(
        parent("BATCH-F", "6x²+11x+3を因数分解しなさい。", "(3x+1)(2x+3)"),
        "monic_quadratic_factorization",
        "nonmonic_quadratic_integer_factorization_exact",
    )
    check(
        parent("BATCH-E", "(2x+3)(3x-4)を展開しなさい。", "6x²+x-12"),
        "binomial_expansion",
        "nonmonic_binomial_integer_expansion_exact",
    )
    check(
        parent("BATCH-E-MINUS", "(2x-3)(3x+4)を展開しなさい。", "6x²-x-12"),
        "binomial_expansion",
        "nonmonic_binomial_integer_expansion_exact",
    )
    print("PASS_NONMONIC_ALGEBRA_BATCH_UNIFIED_RUNTIME_CONTRACT")


if __name__ == "__main__":
    main()
