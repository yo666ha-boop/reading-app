from safe_cone_height_from_volume_variant_engine import can_generate, generate


def parent(**overrides):
    row = {
        "id": "P-CONE-H-001",
        "question": "半径3cm、体積94.2cm³の円すいがあります。円周率を3.14として、高さを求めなさい。",
        "answer": "10cm",
        "figure_refs": [],
        "choices": None,
    }
    row.update(overrides)
    return row


def main() -> None:
    ok, reason = can_generate(parent())
    assert ok and reason == "cone_height_from_volume_pi_3_14_exact"
    empty_choices = parent(choices=[])
    ok, _ = can_generate(empty_choices)
    assert ok
    rows, evidence, _ = generate(parent(), 3)
    assert len(rows) == len(evidence) == 3
    assert len({tuple(row["numeric_signature"]) for row in rows}) == 3
    for row, ev in zip(rows, evidence):
        assert row["answer"].endswith("cm")
        assert "高さ" in row["question"]
        assert ev["method"] == "cone_height_exact_triple_volume_division_and_volume_recomposition"
        assert "PASS" in ev["independent_check"]

    bad = [
        parent(answer="9cm"),
        parent(figure_refs=["cone.svg"]),
        parent(choices=["8cm", "10cm"]),
        parent(question="半径3cm、高さ10cmの円すいの体積を、円周率3.14として求めなさい。", answer="94.2cm³"),
        parent(question="直径6cm、体積94.2cm³の円すいがあります。円周率を3.14として、高さを求めなさい。"),
        parent(question="半径3cm、体積95cm³の円すいがあります。円周率を3.14として、高さを求めなさい。", answer="10cm"),
        parent(question="半径3cm、体積94.2m³の円すいがあります。円周率を3.14として、高さを求めなさい。"),
    ]
    for row in bad:
        ok, _ = can_generate(row)
        assert not ok
        generated, ev, _ = generate(row, 1)
        assert generated == [] and ev == []

    print("PASS_SAFE_CONE_HEIGHT_FROM_VOLUME_VARIANT_ENGINE")


if __name__ == "__main__":
    main()
