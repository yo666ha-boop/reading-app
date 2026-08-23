from safe_cube_side_from_surface_area_variant_engine import can_generate, generate


def parent(**overrides):
    row = {
        "id": "P-CUBE-SIDE-SURFACE-001",
        "question": "表面積が150cm²の立方体があります。この立方体の1辺を求めなさい。",
        "answer": "5cm",
        "figure_refs": [],
        "choices": None,
    }
    row.update(overrides)
    return row


def main() -> None:
    ok, reason = can_generate(parent())
    assert ok and reason == "cube_surface_area_to_integer_side_exact"
    ok, _ = can_generate(parent(choices=[]))
    assert ok
    rows, evidence, _ = generate(parent(), 3)
    assert len(rows) == len(evidence) == 3
    assert len({row["question"] for row in rows}) == 3
    assert all("PASS" in ev["independent_check"] for ev in evidence)

    bad = [
        parent(answer="6cm"),
        parent(question="表面積が151cm²の立方体があります。この立方体の1辺を求めなさい。"),
        parent(figure_refs=["cube.svg"]),
        parent(choices=["4cm", "5cm"]),
        parent(question="1辺5cmの立方体の表面積を求めなさい。", answer="150cm²"),
        parent(question="体積が125cm³の立方体の1辺を求めなさい。", answer="5cm"),
    ]
    for row in bad:
        ok, _ = can_generate(row)
        assert not ok
        generated, ev, _ = generate(row, 1)
        assert generated == [] and ev == []
    print("PASS_SAFE_CUBE_SIDE_FROM_SURFACE_AREA_VARIANT_ENGINE")


if __name__ == "__main__":
    main()
