from safe_cylinder_height_from_surface_area_variant_engine import can_generate, generate


def parent(**overrides):
    row = {
        "id": "P-CYL-SURF-H-001",
        "question": "半径3cm、表面積244.92cm²の円柱があります。円周率を3.14として高さを求めなさい。",
        "answer": "10cm",
        "figure_refs": [],
        "choices": None,
    }
    row.update(overrides)
    return row


def main() -> None:
    ok, reason = can_generate(parent())
    assert ok and reason == "cylinder_height_from_surface_area_pi_3_14_exact"
    empty = parent(choices=[])
    ok, _ = can_generate(empty)
    assert ok
    rows, evidence, reason = generate(parent(), 3)
    assert reason == "cylinder_height_from_surface_area_pi_3_14_exact"
    assert len(rows) == len(evidence) == 3
    assert len({tuple(r["numeric_signature"]) for r in rows}) == 3
    for row, ev in zip(rows, evidence):
        assert row["answer"].endswith("cm")
        assert "高さ" in row["question"]
        assert ev["method"] == "cylinder_height_from_surface_area_exact_inverse_and_recomposition"
        assert "PASS" in ev["independent_check"]

    bad = [
        parent(answer="9cm"),
        parent(figure_refs=["fig.svg"]),
        parent(choices=["8cm", "10cm"]),
        parent(question="半径3cm、高さ10cmの円柱があります。円周率を3.14として表面積を求めなさい。", answer="244.92cm²"),
        parent(question="直径6cm、表面積244.92cm²の円柱があります。円周率を3.14として高さを求めなさい。"),
        parent(question="半径3cm、表面積250cm²の円柱があります。円周率を3.14として高さを求めなさい。"),
    ]
    for row in bad:
        ok, _ = can_generate(row)
        assert not ok
        generated, ev, _ = generate(row, 1)
        assert generated == [] and ev == []
    print("PASS_SAFE_CYLINDER_HEIGHT_FROM_SURFACE_AREA_VARIANT_ENGINE")


if __name__ == "__main__":
    main()
