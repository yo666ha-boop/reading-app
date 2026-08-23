from safe_cube_side_from_volume_variant_engine import can_generate, generate


def parent(**overrides):
    row = {
        "id": "P-CUBE-SIDE-001",
        "question": "体積が125cm³の立方体があります。この立方体の1辺を求めなさい。",
        "answer": "5cm",
        "figure_refs": [],
        "choices": None,
    }
    row.update(overrides)
    return row


def main() -> None:
    ok, reason = can_generate(parent())
    assert ok and reason == "cube_volume_to_integer_side_exact"
    empty_choices = parent(choices=[])
    ok, _ = can_generate(empty_choices)
    assert ok
    rows, evidence, _ = generate(parent(), 3)
    assert len(rows) == len(evidence) == 3
    assert len({row["question"] for row in rows}) == 3
    assert all(row["answer"].endswith("cm") for row in rows)
    assert all("PASS" in ev["independent_check"] for ev in evidence)

    bad = [
        parent(answer="6cm"),
        parent(question="体積が126cm³の立方体があります。この立方体の1辺を求めなさい。"),
        parent(figure_refs=["cube.svg"]),
        parent(choices=["4cm", "5cm"]),
        parent(question="1辺5cmの立方体の体積を求めなさい。", answer="125cm³"),
        parent(question="表面積が150cm²の立方体の1辺を求めなさい。", answer="5cm"),
    ]
    for row in bad:
        ok, _ = can_generate(row)
        assert not ok
        generated, ev, _ = generate(row, 1)
        assert generated == [] and ev == []
    print("PASS_SAFE_CUBE_SIDE_FROM_VOLUME_VARIANT_ENGINE")


if __name__ == "__main__":
    main()
