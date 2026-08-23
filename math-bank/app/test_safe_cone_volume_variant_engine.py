from safe_cone_volume_variant_engine import can_generate, generate


def parent(**overrides):
    row = {
        "id": "P-CONE-VOL-001",
        "question": "半径3cm、高さ6cmの円すいの体積を、円周率を3.14として求めなさい。",
        "answer": "56.52cm³",
        "figure_refs": [],
        "choices": None,
    }
    row.update(overrides)
    return row


def main() -> None:
    ok, reason = can_generate(parent())
    assert ok and reason == "cone_integer_cm_volume_pi_3_14_exact"
    empty_choices = parent(choices=[])
    ok, _ = can_generate(empty_choices)
    assert ok

    rows, evidence, reason = generate(parent(), 3)
    assert reason == "cone_integer_cm_volume_pi_3_14_exact"
    assert len(rows) == len(evidence) == 3
    assert len({tuple(row["numeric_signature"]) for row in rows}) == 3
    assert ("3", "6", "3.14") not in {tuple(row["numeric_signature"]) for row in rows}
    for row, ev in zip(rows, evidence):
        assert row["answer"].endswith("cm³")
        assert "円すい" in row["question"]
        assert ev["method"] == "cone_volume_exact_pi_3_14_one_third_product_and_inverse_identities"
        assert "PASS" in ev["independent_check"]

    surface = parent(
        question="半径3cm、母線5cmの円すいの表面積を、円周率を3.14として求めなさい。",
        answer="75.36cm²",
    )
    ok, reason = can_generate(surface)
    assert ok and reason == "cone_surface_area_pi_3_14_exact"
    surface_rows, surface_evidence, surface_reason = generate(surface, 3)
    assert surface_reason == "cone_surface_area_pi_3_14_exact"
    assert len(surface_rows) == len(surface_evidence) == 3
    assert all(row["answer"].endswith("cm²") for row in surface_rows)
    assert all(ev["method"] == "cone_surface_area_exact_pi_r2_plus_pi_r_l_and_factored_identity" for ev in surface_evidence)

    bad = [
        parent(answer="56.5cm³"),
        parent(figure_refs=["cone.svg"]),
        parent(choices=["56.52cm³", "169.56cm³"]),
        parent(question="半径3cm、高さ6cmの円柱の体積を、円周率を3.14として求めなさい。", answer="169.56cm³"),
        # r^2*h=20 is not divisible by 3, so this would require a repeating decimal and must fail closed.
        parent(question="半径2cm、高さ5cmの円すいの体積を、円周率を3.14として求めなさい。", answer="20.933333cm³"),
        parent(question="直径6cm、高さ6cmの円すいの体積を、円周率を3.14として求めなさい。", answer="56.52cm³"),
    ]
    for row in bad:
        ok, _ = can_generate(row)
        assert not ok
        generated, ev, _ = generate(row, 1)
        assert generated == [] and ev == []

    print("PASS_SAFE_CONE_VOLUME_HEIGHT_RADIUS_AND_SURFACE_AREA_ROUTES")


if __name__ == "__main__":
    main()
