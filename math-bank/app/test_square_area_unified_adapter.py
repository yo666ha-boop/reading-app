from __future__ import annotations

import copy

from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256

NOW = "2026-08-22T00:00:00Z"


def main() -> None:
    parent = copy.deepcopy(make_base()[0])
    parent["id"] = "U-SQUARE"
    parent["question"] = "一辺7cmの正方形の面積を求めなさい。"
    parent["answer"] = "49cm²"
    parent["choices"] = None
    parent["figure_refs"] = []
    parent["source"]["is_generated_variant"] = False
    parent["source"]["parent_id"] = None
    parent["variant_group"] = None

    rows, prov, reason = generate_parent(parent, 3, NOW)
    assert reason.startswith("specialized:square_area:")
    assert len(rows) == len(prov) == 3
    assert len({row["question"] for row in rows}) == 3
    expected_sha = parent_record_sha256(parent)
    for row, evidence in zip(rows, prov):
        assert row["source"]["parent_id"] == parent["id"]
        assert evidence["parent_record_sha256"] == expected_sha
        assert evidence["independent_recalculation"] is True
        assert "engine=square_area" in evidence["verification_evidence"]

    print("PASS_SQUARE_AREA_UNIFIED_ADAPTER_PARENT_SHA_AND_INDEPENDENT_RECALCULATION")


if __name__ == "__main__":
    main()
