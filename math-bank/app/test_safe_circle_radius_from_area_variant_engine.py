from safe_circle_radius_from_area_variant_engine import can_generate, generate


def parent(**overrides):
    row = {
        "id": "P-CIRCLE-RADIUS-AREA-001",
        "question": "円周率を3.14とします。面積が78.5cm²の円の半径を求めなさい。",
        "answer": "5cm",
        "figure_refs": [],
        "choices": None,
    }
    row.update(overrides)
    return row


def main() -> None:
    ok, reason = can_generate(parent())
    assert ok and reason == "circle_area_to_integer_radius_pi_3_14_exact"
    empty_choices = parent(choices=[])
    ok, _ = can_generate(empty_choices)
    assert ok

    rows, evidence, reason = generate(parent(), 3)
    assert reason == "circle_area_to_integer_radius_pi_3_14_exact"
    assert len(rows) == len(evidence) == 3
    assert len({row["question"] for row in rows}) == 3
    assert all(row["answer"].endswith("cm") for row in rows)
    assert all("PASS" in ev["independent_check"] for ev in evidence)

    bad = [
        parent(answer="4cm"),
        parent(question="円周率を3.14とします。面積が50cm²の円の半径を求めなさい。", answer="4cm"),
        parent(question="円周率を3.14とします。面積が78.5cm²の円の直径を求めなさい。", answer="10cm"),
        parent(question="円周率を3.14とします。半径5cmの円の面積を求めなさい。", answer="78.5cm²"),
        parent(figure_refs=["circle.svg"]),
        parent(choices=["4cm", "5cm", "6cm"]),
    ]
    for row in bad:
        ok, _ = can_generate(row)
        assert not ok
        generated, ev, _ = generate(row, 1)
        assert generated == [] and ev == []

    print("PASS_SAFE_CIRCLE_RADIUS_FROM_AREA_VARIANT_ENGINE")


if __name__ == "__main__":
    main()
