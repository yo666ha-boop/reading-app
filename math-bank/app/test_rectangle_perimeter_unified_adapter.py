from __future__ import annotations

import copy

from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256

NOW = "2026-08-22T00:00:00Z"


def main() -> None:
    parent = copy.deepcopy(make_base()[0])
    parent["id"] = "U-RECT-PERIM"
    parent["question"] = "たて8cm、横5cmの長方形の周の長さは何cmですか。"
    parent["answer"] = "26cm"
    parent["choices"] = None
    parent["figure_refs"] = []
    parent["source"]["is_generated_variant"] = False
    parent["source"]["parent_id"] = None
    parent["variant_group"] = None

    rows, prov, reason = generate_parent(parent, 3, NOW)
    assert reason.startswith("specialized:rectangle_perimeter:")
    assert len(rows) == len(prov) == 3
    assert len({row["question"] for row in rows}) == 3
    assert len({tuple(row.get("numeric_signature") or ()) for row in rows}) == 1  # adapted rows intentionally do not expose engine-only signature

    expected_sha = parent_record_sha256(parent)
    parent_taxonomy = copy.deepcopy(parent.get("taxonomy"))
    parent_difficulty = parent.get("difficulty")
    parent_format = parent.get("format")
    for row, evidence in zip(rows, prov):
        assert row["source"]["parent_id"] == parent["id"]
        assert row.get("taxonomy") == parent_taxonomy
        assert row.get("difficulty") == parent_difficulty
        assert row.get("format") == parent_format
        assert row.get("choices") == parent.get("choices")
        assert row.get("figure_refs") == parent.get("figure_refs")
        assert evidence["parent_record_sha256"] == expected_sha
        assert evidence["independent_recalculation"] is True
        assert "engine=rectangle_perimeter" in evidence["verification_evidence"]

    questions = [row["question"] for row in rows]
    assert all("たて8cm、横5cm" not in q for q in questions)

    print("PASS_RECTANGLE_PERIMETER_UNIFIED_ADAPTER_PARENT_SHA_METADATA_AND_INDEPENDENT_RECALCULATION")


if __name__ == "__main__":
    main()
