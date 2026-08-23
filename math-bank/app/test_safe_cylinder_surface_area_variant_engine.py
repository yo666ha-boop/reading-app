from safe_cylinder_surface_area_variant_engine import can_generate, generate


def parent(**overrides):
    row = {
        "id": "P-CYL-SA-001",
        "question": "半径3cm、高さ5cmの円柱の表面積を、円周率を3.14として求めなさい。",
        "answer": "150.72cm²",
        "figure_refs": [],
        "choices": None,
    }
    row.update(overrides)
    return row


def main() -> None:
    ok, reason = can_generate(parent())
    assert ok and reason == "cylinder_surface_area_pi_3_14_exact"
    empty_choices = parent(choices=[])
    ok, _ = can_generate(empty_choices)
    assert ok

    rows, evidence, _ = generate(parent(), 3)
    assert len(rows) == len(evidence) == 3
    assert len({tuple(row["numeric_signature"]) for row in rows}) == 3
    for row, ev in zip(rows, evidence):
        assert row["answer"].endswith("cm²")
        assert "表面積" in row["question"]
        assert ev["method"] == "cylinder_surface_area_exact_2_pi_r_r_plus_h_and_face_decomposition"
        assert "PASS" in ev["independent_check"]

    bad = [
        parent(answer="150cm²"),
        parent(figure_refs=["fig.svg"]),
        parent(choices=["150.72cm²", "94.2cm²"]),
        parent(question="半径3cm、高さ5cmの円柱の体積を、円周率を3.14として求めなさい。", answer="141.3cm³"),
        parent(question="直径6cm、高さ5cmの円柱の表面積を、円周率を3.14として求めなさい。"),
        parent(question="半径3cm、高さ5cmの円柱の側面積を、円周率を3.14として求めなさい。", answer="94.2cm²"),
        parent(question="半径3m、高さ5mの円柱の表面積を、円周率を3.14として求めなさい。", answer="150.72m²"),
    ]
    for row in bad:
        ok, _ = can_generate(row)
        assert not ok
        generated, ev, _ = generate(row, 1)
        assert generated == [] and ev == []

    print("PASS_SAFE_CYLINDER_SURFACE_AREA_VARIANT_ENGINE")


if __name__ == "__main__":
    main()
