from __future__ import annotations

import copy

from generate_all_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import parent_record_sha256

NOW = "2026-08-22T01:54:00+09:00"


def main() -> None:
    parent = copy.deepcopy(make_base()[0])
    parent["id"] = "U-SPEED"
    parent["question"] = "時速60kmで2時間進むとき、進む道のりは何kmですか。"
    parent["answer"] = "120km"
    parent["choices"] = None
    parent["figure_refs"] = []
    parent["source"]["is_generated_variant"] = False
    parent["source"]["parent_id"] = None
    parent["variant_group"] = None

    rows, provenance, reason = generate_parent(parent, 3, NOW)
    assert len(rows) == len(provenance) == 3
    assert reason.startswith("specialized:speed_distance:")
    assert len({tuple(r["question"] for r in rows)}) == 1
    assert len({r["question"] for r in rows}) == 3
    expected_sha = parent_record_sha256(parent)
    assert all(p["parent_record_sha256"] == expected_sha for p in provenance)
    assert all(p["independent_recalculation"] is True for p in provenance)
    assert all("speed_distance" in p["verification_evidence"] for p in provenance)
    assert all(r["source"]["parent_id"] == parent["id"] for r in rows)
    assert all(r["audit"]["problem_answer_verified"] is True for r in rows)

    print("PASS_SPEED_DISTANCE_UNIFIED_ADAPTER_PARENT_SHA_INDEPENDENT_RECALCULATION")


if __name__ == "__main__":
    main()
