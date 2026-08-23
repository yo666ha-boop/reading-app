from safe_cube_surface_area_variant_engine import can_generate, generate


def parent(**overrides):
    row = {
        "id": "P-CUBE-SA-001",
        "question": "1辺4cmの立方体の表面積を求めなさい。",
        "answer": "96cm²",
        "figure_refs": [],
        "choices": None,
    }
    row.update(overrides)
    return row


def main() -> None:
    ok, reason = can_generate(parent())
    assert ok and reason == "cube_integer_cm_surface_area_exact"
    ok, _ = can_generate(parent(choices=[]))
    assert ok
    rows, evidence, reason = generate(parent(), 3)
    assert reason == "cube_integer_cm_surface_area_exact"
    assert len(rows) == len(evidence) == 3
    assert len({tuple(row["numeric_signature"]) for row in rows}) == 3
    assert all(row["answer"].endswith("cm²") for row in rows)
    assert all("surface_area/6 == side^2 PASS" in ev["independent_check"] for ev in evidence)

    bad = [
        parent(answer="95cm²"),
        parent(figure_refs=["cube.svg"]),
        parent(choices=["90cm²", "96cm²"]),
        parent(question="1辺4cmの立方体の体積を求めなさい。", answer="64cm³"),
        parent(question="1辺4cmの立方体の1辺を求めなさい。", answer="4cm"),
        parent(question="1辺40mmの立方体の表面積を求めなさい。", answer="96cm²"),
    ]
    for row in bad:
        ok, _ = can_generate(row)
        assert not ok
        generated, ev, _ = generate(row, 1)
        assert generated == [] and ev == []
    print("PASS_SAFE_CUBE_SURFACE_AREA_VARIANT_ENGINE")


if __name__ == "__main__":
    main()
