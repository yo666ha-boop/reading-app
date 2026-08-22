from __future__ import annotations

import copy

from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256

NOW = "2026-08-22T00:00:00Z"


def main() -> None:
    parent = copy.deepcopy(make_base()[0])
    parent["id"] = "U-DISCOUNT"
    parent["question"] = "定価1200円の商品を25%引きで買います。代金は何円ですか。"
    parent["answer"] = "900円"
    parent["choices"] = []
    parent["figure_refs"] = []
    parent["source"]["is_generated_variant"] = False
    parent["source"]["parent_id"] = None
    parent["variant_group"] = None

    rows, prov, reason = generate_parent(parent, 3, NOW)
    assert reason.startswith("specialized:discount_price:")
    assert len(rows) == len(prov) == 3
    assert len({row["question"] for row in rows}) == 3

    expected_sha = parent_record_sha256(parent)
    for row, evidence in zip(rows, prov):
        assert row["source"]["parent_id"] == parent["id"]
        assert row.get("taxonomy") == parent.get("taxonomy")
        assert row.get("difficulty") == parent.get("difficulty")
        assert row.get("format") == parent.get("format")
        assert row.get("question_format") == parent.get("question_format")
        assert row.get("choices") == parent.get("choices")
        assert row.get("figure_refs") == parent.get("figure_refs")
        assert evidence["parent_record_sha256"] == expected_sha
        assert evidence["independent_recalculation"] is True
        assert "engine=discount_price" in evidence["verification_evidence"]
        audit = row.get("audit") or {}
        assert audit.get("problem_answer_verified") is True
        assert audit.get("structure_verified") is True
        assert audit.get("figure_refs_verified") is True

    assert all("定価1200円" not in row["question"] for row in rows)
    print("PASS_DISCOUNT_PRICE_UNIFIED_ADAPTER_PARENT_SHA_METADATA_AUDIT_AND_RECALCULATION")


if __name__ == "__main__":
    main()
