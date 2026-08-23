from __future__ import annotations

import copy

from safe_cube_volume_variant_engine import can_generate, generate


def base_parent() -> dict:
    return {
        "id": "CUBE-BASE",
        "question": "1辺4cmの立方体の体積を求めなさい。",
        "answer": "64cm³",
        "choices": None,
        "figure_refs": [],
    }


def main() -> None:
    parent = base_parent()
    ok, reason = can_generate(parent)
    assert ok is True
    assert reason == "cube_integer_cm_volume_exact"

    rows, evidence, reason = generate(parent, 3)
    assert reason == "cube_integer_cm_volume_exact"
    assert len(rows) == len(evidence) == 3
    assert len({tuple(row["numeric_signature"]) for row in rows}) == 3
    assert all(tuple(row["numeric_signature"]) != ("4",) for row in rows)
    assert all(ev["method"] == "cube_exact_product_and_integer_cube_root_identity" for ev in evidence)
    assert all("exact_integer_cube_root" in ev["independent_check"] for ev in evidence)

    surface = copy.deepcopy(parent)
    surface["question"] = "1辺4cmの立方体の表面積を求めなさい。"
    surface["answer"] = "96cm²"
    ok, reason = can_generate(surface)
    assert ok is True
    assert reason == "cube_integer_cm_surface_area_exact"
    srows, sev, _ = generate(surface, 3)
    assert len(srows) == len(sev) == 3
    assert all("surface_area/6 == side^2 PASS" in ev["independent_check"] for ev in sev)

    bad_cases: list[dict] = []

    wrong = copy.deepcopy(parent)
    wrong["answer"] = "63cm³"
    bad_cases.append(wrong)

    figure = copy.deepcopy(parent)
    figure["figure_refs"] = ["cube.svg"]
    bad_cases.append(figure)

    choice = copy.deepcopy(parent)
    choice["choices"] = ["64cm³", "48cm³"]
    bad_cases.append(choice)

    reverse = copy.deepcopy(parent)
    reverse["question"] = "体積64cm³の立方体の1辺を求めなさい。"
    reverse["answer"] = "4cm"
    bad_cases.append(reverse)

    mixed = copy.deepcopy(parent)
    mixed["question"] = "1辺4mmの立方体の体積を求めなさい。"
    mixed["answer"] = "64mm³"
    bad_cases.append(mixed)

    duplicate_side = copy.deepcopy(parent)
    duplicate_side["question"] = "1辺4cmで、一辺4cmと書かれた立方体の体積を求めなさい。"
    bad_cases.append(duplicate_side)

    for bad in bad_cases:
        ok, _ = can_generate(bad)
        assert ok is False
        rows, ev, _ = generate(bad, 3)
        assert rows == [] and ev == []

    print("PASS_SAFE_CUBE_VOLUME_AND_SURFACE_AREA_ROUTE_POSITIVE_NEGATIVE")


if __name__ == "__main__":
    main()
