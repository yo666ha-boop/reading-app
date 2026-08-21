from __future__ import annotations

import copy

from safe_speed_distance_variant_engine import can_generate, generate


def parent() -> dict:
    return {
        "id": "SPD-1",
        "question": "時速60kmで2時間進むとき、進む道のりは何kmですか。",
        "answer": "120km",
        "choices": None,
        "figure_refs": [],
    }


def main() -> None:
    p = parent()
    ok, reason = can_generate(p)
    assert ok and reason == "speed_kmh_integer_hours_distance_exact"
    rows, evidence, reason = generate(p, 3)
    assert len(rows) == len(evidence) == 3
    assert len({tuple(r["numeric_signature"]) for r in rows}) == 3
    assert all(r["question"] != p["question"] for r in rows)
    assert all(e["independent_check"].endswith("PASS") for e in evidence)

    wrong = copy.deepcopy(p)
    wrong["answer"] = "121km"
    assert generate(wrong, 1)[0] == []

    minutes = copy.deepcopy(p)
    minutes["question"] = "時速60kmで30分進むとき、進む道のりは何kmですか。"
    minutes["answer"] = "30km"
    assert generate(minutes, 1)[0] == []

    average = copy.deepcopy(p)
    average["question"] = "平均時速60kmで2時間進むとき、進む道のりは何kmですか。"
    assert generate(average, 1)[0] == []

    figure = copy.deepcopy(p)
    figure["figure_refs"] = ["figures/speed.png"]
    assert generate(figure, 1)[0] == []

    choice = copy.deepcopy(p)
    choice["choices"] = ["100km", "110km", "120km", "130km"]
    assert generate(choice, 1)[0] == []

    print("PASS_SAFE_SPEED_DISTANCE_EXACT_PRODUCT_TWO_INVERSE_IDENTITIES")
    print("PASS_SAFE_SPEED_DISTANCE_WRONG_MINUTES_AVERAGE_FIGURE_CHOICE_FAIL_CLOSED")


if __name__ == "__main__":
    main()
