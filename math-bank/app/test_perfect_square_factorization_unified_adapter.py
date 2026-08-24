from __future__ import annotations

import copy

from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256

NOW = "2026-08-24T06:31:00Z"


def main() -> None:
    p = copy.deepcopy(make_base()[0])
    p["id"] = "U-PERFECT-SQUARE-FACTOR"
    p["question"] = "x²+6x+9を因数分解しなさい。"
    p["answer"] = "(x+3)²"
    p["choices"] = []
    p["figure_refs"] = []
    p["source"]["is_generated_variant"] = False
    p["source"]["parent_id"] = None
    p["variant_group"] = None

    rows, prov, reason = generate_parent(p, 3, NOW)
    assert reason.startswith("specialized:monic_quadratic_factorization:perfect_square_factorization_exact"), reason
    assert len(rows) == len(prov) == 3
    assert len({tuple(r["numeric_signature"]) for r in rows}) == 3
    expected = parent_record_sha256(p)
    for row, ev in zip(rows, prov):
        assert row["source"]["parent_id"] == p["id"]
        assert row.get("taxonomy") == p.get("taxonomy")
        assert row.get("difficulty") == p.get("difficulty")
        assert row.get("format") == p.get("format")
        assert row.get("question_format") == p.get("question_format")
        assert row.get("choices") == p.get("choices")
        assert row.get("figure_refs") == p.get("figure_refs")
        audit = row.get("audit") or {}
        assert all(audit.get(k) is True for k in ("problem_answer_verified", "structure_verified", "figure_refs_verified"))
        assert ev["parent_record_sha256"] == expected
        assert ev["independent_recalculation"] is True
        assert "engine=monic_quadratic_factorization" in ev["verification_evidence"]
        assert "perfect_square_double_and_square_identity" in ev["verification_evidence"]
    print("PASS_PERFECT_SQUARE_FACTORIZATION_UNIFIED_CONTRACT")


if __name__ == "__main__":
    main()
