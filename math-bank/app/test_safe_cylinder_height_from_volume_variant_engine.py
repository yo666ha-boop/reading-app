from safe_cylinder_height_from_volume_variant_engine import can_generate, generate


def parent(**overrides):
    row = {
        "id": "P-CYL-H-001",
        "question": "半径3cm、体積141.3cm³の円柱の高さを、円周率を3.14として求めなさい。",
        "answer": "5cm",
        "figure_refs": [],
        "choices": None,
    }
    row.update(overrides)
    return row


def main() -> None:
    ok, reason = can_generate(parent())
    assert ok and reason == "cylinder_height_from_volume_pi_3_14_exact"
    ok, _ = can_generate(parent(choices=[]))
    assert ok
    rows, evidence, reason = generate(parent(), 3)
    assert reason == "cylinder_height_from_volume_pi_3_14_exact"
    assert len(rows) == len(evidence) == 3
    assert len({tuple(row["numeric_signature"]) for row in rows}) == 3
    for row, ev in zip(rows, evidence):
        assert row["answer"].endswith("cm")
        assert "円柱" in row["question"] and "3.14" in row["question"]
        assert "PASS" in ev["independent_check"]

    bad = [
        parent(answer="4cm"),
        parent(figure_refs=["cyl.svg"]),
        parent(choices=["5cm", "6cm"]),
        parent(question="半径3cm、体積140cm³の円柱の高さを、円周率を3.14として求めなさい。", answer="5cm"),
        parent(question="直径6cm、体積141.3cm³の円柱の高さを、円周率を3.14として求めなさい。", answer="5cm"),
        parent(question="半径3cm、高さ5cmの円柱の体積を、円周率を3.14として求めなさい。", answer="141.3cm³"),
        parent(question="半径3cm、体積141.3cm³の円すいの高さを、円周率を3.14として求めなさい。", answer="15cm"),
    ]
    for row in bad:
        ok, _ = can_generate(row)
        assert not ok
        generated, ev, _ = generate(row, 1)
        assert generated == [] and ev == []

    print("PASS_SAFE_CYLINDER_HEIGHT_FROM_VOLUME_PI_3_14_VARIANT_ENGINE")


if __name__ == "__main__":
    main()
