from safe_sphere_radius_from_volume_variant_engine import can_generate, generate


def parent(**overrides):
    row = {
        "id": "P-SPHERE-R-V-001",
        "question": "円周率を3.14とします。体積が113.04cm³の球の半径を求めなさい。",
        "answer": "3cm",
        "figure_refs": [],
        "choices": None,
    }
    row.update(overrides)
    return row


def main() -> None:
    ok, reason = can_generate(parent())
    assert ok and reason == "sphere_volume_to_integer_radius_pi_3_14_exact"
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
        parent(figure_refs=["sphere.svg"]),
        parent(choices=["3cm", "6cm"]),
        parent(question="円周率を3.14とします。表面積が113.04cm²の球の半径を求めなさい。", answer="3cm"),
        parent(question="円周率を3.14とします。体積が33.493333cm³の球の半径を求めなさい。", answer="2cm"),
        parent(question="円周率を3.14とします。体積が113.04cm³の球の直径を求めなさい。", answer="6cm"),
    ]
    for row in bad:
        ok, _ = can_generate(row)
        assert not ok
        generated, ev, _ = generate(row, 1)
        assert generated == [] and ev == []
    print("PASS_SAFE_SPHERE_RADIUS_FROM_VOLUME_VARIANT_ENGINE")


if __name__ == "__main__":
    main()
