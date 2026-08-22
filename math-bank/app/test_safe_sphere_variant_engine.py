from safe_sphere_variant_engine import can_generate, generate


def parent(**overrides):
    row = {
        "id": "P-SPHERE-001",
        "question": "半径3cmの球の体積を求めなさい。円周率は3.14とする。",
        "answer": "113.04cm³",
        "figure_refs": [],
        "choices": None,
    }
    row.update(overrides)
    return row


def main() -> None:
    ok, reason = can_generate(parent())
    assert ok and reason == "sphere_integer_cm_volume_pi_3_14_exact"
    rows, evidence, _ = generate(parent(), 3)
    assert len(rows) == len(evidence) == 3
    assert len({tuple(r["numeric_signature"]) for r in rows}) == 3
    assert all("3V == 4*3.14*r^3 PASS" in e["independent_check"] for e in evidence)

    area = parent(
        question="半径5cmの球の表面積を求めなさい。円周率は3.14とする。",
        answer="314cm²",
    )
    ok, reason = can_generate(area)
    assert ok and reason == "sphere_integer_cm_area_pi_3_14_exact"
    rows, evidence, _ = generate(area, 3)
    assert len(rows) == len(evidence) == 3
    assert all("A/(4*r^2) == 3.14 PASS" in e["independent_check"] for e in evidence)

    empty_choices = parent(choices=[])
    assert can_generate(empty_choices)[0]

    bad = [
        parent(answer="113cm³"),
        parent(question="半径2cmの球の体積を求めなさい。円周率は3.14とする。", answer="33.49cm³"),
        parent(figure_refs=["sphere.svg"]),
        parent(choices=["113.04cm³", "226.08cm³"]),
        parent(question="直径6cmの球の体積を求めなさい。円周率は3.14とする。", answer="113.04cm³"),
        parent(question="半径3cmの半球の体積を求めなさい。円周率は3.14とする。", answer="56.52cm³"),
        parent(question="半径3cmの球の体積と表面積を求めなさい。円周率は3.14とする。", answer="113.04cm³"),
        area | {"answer": "313.9cm²"},
    ]
    for row in bad:
        assert not can_generate(row)[0]
        generated, ev, _ = generate(row, 1)
        assert generated == [] and ev == []

    print("PASS_SAFE_SPHERE_AREA_VOLUME_VARIANT_ENGINE")


if __name__ == "__main__":
    main()
