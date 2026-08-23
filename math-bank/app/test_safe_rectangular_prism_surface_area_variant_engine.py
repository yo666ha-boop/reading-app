from safe_rectangular_prism_surface_area_variant_engine import can_generate, generate


def parent(**overrides):
    row = {
        "id": "P-RPSA-001",
        "question": "たて4cm、よこ3cm、高さ2cmの直方体の表面積を求めなさい。",
        "answer": "52cm²",
        "figure_refs": [],
        "choices": None,
    }
    row.update(overrides)
    return row


def main() -> None:
    ok, reason = can_generate(parent())
    assert ok and reason == "rectangular_prism_integer_cm_surface_area_exact"
    ok, reason = can_generate(parent(choices=[]))
    assert ok
    rows, evidence, reason = generate(parent(), 3)
    assert reason == "rectangular_prism_integer_cm_surface_area_exact"
    assert len(rows) == len(evidence) == 3
    sigs = {tuple(row["numeric_signature"]) for row in rows}
    assert len(sigs) == 3
    assert ("4", "3", "2") not in sigs
    for row, ev in zip(rows, evidence):
        assert row["answer"].endswith("cm²")
        assert "表面積" in row["question"]
        assert ev["method"] == "rectangular_prism_surface_area_exact_three_face_pairs"
        assert "PASS" in ev["independent_check"]

    bad = [
        parent(answer="50cm²"),
        parent(figure_refs=["fig.svg"]),
        parent(choices=["50cm²", "52cm²"]),
        parent(question="たて4cm、よこ3cm、高さ2cmの直方体の体積を求めなさい。", answer="24cm³"),
        parent(question="たて4cm、よこ3cm、高さ2cmの直方体の表面積と体積を求めなさい。", answer="52cm²"),
        parent(question="たて4mm、よこ3cm、高さ2cmの直方体の表面積を求めなさい。"),
    ]
    for row in bad:
        ok, _ = can_generate(row)
        assert not ok
        generated, ev, _ = generate(row, 1)
        assert generated == [] and ev == []

    print("PASS_SAFE_RECTANGULAR_PRISM_SURFACE_AREA_VARIANT_ENGINE")


if __name__ == "__main__":
    main()
