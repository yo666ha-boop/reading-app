from __future__ import annotations

import copy

from safe_trapezoid_area_variant_engine import generate
from test_expanded_variant_layer import make_base


def parent(question: str, answer: str) -> dict:
    p = copy.deepcopy(make_base()[0])
    p["id"] = "TRAP-PARENT"
    p["question"] = question
    p["answer"] = answer
    p["choices"] = None
    p["figure_refs"] = []
    p["source"]["is_generated_variant"] = False
    p["source"]["parent_id"] = None
    p["variant_group"] = None
    return p


def main() -> None:
    good = parent("上底6cm、下底10cm、高さ5cmの台形の面積を求めなさい。", "40cm²")
    rows, evidence, reason = generate(good, 3)
    assert reason == "trapezoid_area_integer_same_unit_exact"
    assert len(rows) == len(evidence) == 3
    assert len({tuple(r["numeric_signature"]) for r in rows}) == 3
    assert all(r["question"] != good["question"] for r in rows)
    assert all("2*area == (upper+lower)*height PASS" == e["independent_check"] for e in evidence)

    wrong = parent("上底6cm、下底10cm、高さ5cmの台形の面積を求めなさい。", "41cm²")
    assert generate(wrong, 1)[0] == []

    half = parent("上底4cm、下底7cm、高さ3cmの台形の面積を求めなさい。", "16.5cm²")
    assert generate(half, 1)[0] == []

    mixed = parent("上底6cm、下底10m、高さ5cmの台形の面積を求めなさい。", "25030cm²")
    assert generate(mixed, 1)[0] == []

    perimeter = parent("上底6cm、下底10cm、高さ5cmの台形の周の長さを求めなさい。", "30cm")
    assert generate(perimeter, 1)[0] == []

    figure = copy.deepcopy(good)
    figure["figure_refs"] = ["figures/trapezoid.png"]
    assert generate(figure, 1)[0] == []

    choice = copy.deepcopy(good)
    choice["choices"] = ["30cm²", "35cm²", "40cm²", "45cm²"]
    assert generate(choice, 1)[0] == []

    print("PASS_SAFE_TRAPEZOID_AREA_EXACT_RECALCULATION_AND_DOUBLED_AREA_IDENTITY")
    print("PASS_SAFE_TRAPEZOID_AREA_WRONG_HALF_MIXED_PERIMETER_FIGURE_CHOICE_FAIL_CLOSED")


if __name__ == "__main__":
    main()
