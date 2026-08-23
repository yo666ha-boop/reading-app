from safe_cylinder_volume_variant_engine import can_generate, generate


def parent(**overrides):
    row = {
        "id": "P-CYL-VOL-001",
        "question": "半径3cm、高さ5cmの円柱の体積を、円周率を3.14として求めなさい。",
        "answer": "141.3cm³",
        "figure_refs": [],
        "choices": None,
    }
    row.update(overrides)
    return row


def main() -> None:
    ok, reason = can_generate(parent())
    assert ok and reason == "cylinder_integer_cm_volume_pi_3_14_exact"
    ok, _ = can_generate(parent(choices=[]))
    assert ok

    rows, evidence, reason = generate(parent(), 3)
    assert reason == "cylinder_integer_cm_volume_pi_3_14_exact"
    assert len(rows) == len(evidence) == 3
    assert len({tuple(row["numeric_signature"]) for row in rows}) == 3
    assert all(tuple(row["numeric_signature"]) != ("3", "5", "3.14") for row in rows)
    for row, ev in zip(rows, evidence):
        assert row["answer"].endswith("cm³")
        assert "円柱" in row["question"] and "3.14" in row["question"]
        assert "PASS" in ev["independent_check"]

    radius_inverse = parent(
        question="体積141.3cm³、高さ5cmの円柱の半径を、円周率を3.14として求めなさい。",
        answer="3cm",
    )
    ok, reason = can_generate(radius_inverse)
    assert ok and reason == "cylinder_radius_from_volume_pi_3_14_exact"
    inverse_rows, inverse_evidence, inverse_reason = generate(radius_inverse, 3)
    assert inverse_reason == "cylinder_radius_from_volume_pi_3_14_exact"
    assert len(inverse_rows) == len(inverse_evidence) == 3
    assert all(row["answer"].endswith("cm") for row in inverse_rows)
    assert all("cylinder_radius_exact_division_square_root_and_volume_recomposition" == ev["method"] for ev in inverse_evidence)

    bad = [
        parent(answer="141.2cm³"),
        parent(figure_refs=["cylinder.svg"]),
        parent(choices=["141.3cm³", "94.2cm³"]),
        parent(question="直径6cm、高さ5cmの円柱の体積を、円周率を3.14として求めなさい。", answer="141.3cm³"),
        parent(question="半径3cm、高さ5cmの円柱の表面積を、円周率を3.14として求めなさい。", answer="150.72cm²"),
        parent(question="半径3cm、高さ5cmの円柱の体積を求めなさい。", answer="45πcm³"),
        parent(question="半径3cm、高さ5cmの円すいの体積を、円周率を3.14として求めなさい。", answer="47.1cm³"),
        parent(question="半径3m、高さ5mの円柱の体積を、円周率を3.14として求めなさい。", answer="141.3m³"),
    ]
    for row in bad:
        ok, _ = can_generate(row)
        assert not ok
        generated, ev, _ = generate(row, 1)
        assert generated == [] and ev == []

    print("PASS_SAFE_CYLINDER_VOLUME_HEIGHT_AND_RADIUS_INVERSE_ROUTES")


if __name__ == "__main__":
    main()
