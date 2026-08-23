from safe_cylinder_radius_from_volume_variant_engine import can_generate, generate


def parent(**overrides):
    row = {
        "id": "P-CYL-RADIUS-001",
        "question": "円周率を3.14とします。高さ5cm、体積141.3cm³の円柱の半径を求めなさい。",
        "answer": "3cm",
        "figure_refs": [],
        "choices": None,
    }
    row.update(overrides)
    return row


def main() -> None:
    ok, reason = can_generate(parent())
    assert ok and reason == "cylinder_radius_from_volume_pi_3_14_exact"
    empty_choices = parent(choices=[])
    ok, reason = can_generate(empty_choices)
    assert ok and reason == "cylinder_radius_from_volume_pi_3_14_exact"

    rows, evidence, reason = generate(parent(), 3)
    assert reason == "cylinder_radius_from_volume_pi_3_14_exact"
    assert len(rows) == len(evidence) == 3
    assert len({tuple(row["numeric_signature"]) for row in rows}) == 3
    assert all(row["answer"].endswith("cm") for row in rows)
    assert all("半径" in row["question"] for row in rows)
    assert all(ev["method"] == "cylinder_radius_exact_division_square_root_and_volume_recomposition" for ev in evidence)
    assert all("PASS" in ev["independent_check"] for ev in evidence)

    bad = [
        parent(answer="4cm"),
        parent(figure_refs=["fig.svg"]),
        parent(choices=["2cm", "3cm"]),
        parent(question="円周率を3.14とします。高さ5cm、体積157cm³の円柱の半径を求めなさい。", answer="3cm"),
        parent(question="円周率を3.14とします。高さ5cm、体積141.3cm³の円柱の高さを求めなさい。", answer="5cm"),
        parent(question="円周率を3.14とします。高さ5cm、体積141.3cm³の円柱の直径を求めなさい。", answer="6cm"),
        parent(question="円周率を3.14とします。高さ5cm、体積141.3m³の円柱の半径を求めなさい。", answer="3cm"),
    ]
    for row in bad:
        ok, _ = can_generate(row)
        assert not ok
        generated, ev, _ = generate(row, 1)
        assert generated == [] and ev == []

    print("PASS_SAFE_CYLINDER_RADIUS_FROM_VOLUME_VARIANT_ENGINE")


if __name__ == "__main__":
    main()
