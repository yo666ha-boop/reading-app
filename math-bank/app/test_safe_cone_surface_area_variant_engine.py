from safe_cone_surface_area_variant_engine import can_generate, generate


def parent(**overrides):
    row = {
        "id": "P-CONE-SA-001",
        "question": "半径3cm、母線5cmの円すいの表面積を、円周率を3.14として求めなさい。",
        "answer": "75.36cm²",
        "figure_refs": [],
        "choices": None,
    }
    row.update(overrides)
    return row


def main() -> None:
    ok, reason = can_generate(parent())
    assert ok and reason == "cone_surface_area_pi_3_14_exact"
    ok, _ = can_generate(parent(choices=[]))
    assert ok

    rows, evidence, _ = generate(parent(), 3)
    assert len(rows) == len(evidence) == 3
    assert len({tuple(row["numeric_signature"]) for row in rows}) == 3
    for row, ev in zip(rows, evidence):
        assert row["answer"].endswith("cm²")
        assert "表面積" in row["question"]
        assert "母線" in row["question"]
        assert ev["method"] == "cone_surface_area_exact_pi_r2_plus_pi_r_l_and_factored_identity"
        assert "PASS" in ev["independent_check"]

    bad = [
        parent(answer="75cm²"),
        parent(figure_refs=["cone.svg"]),
        parent(choices=["75.36cm²", "47.1cm²"]),
        parent(question="半径3cm、高さ5cmの円すいの体積を、円周率を3.14として求めなさい。", answer="47.1cm³"),
        parent(question="半径3cm、母線5cmの円すいの側面積を、円周率を3.14として求めなさい。", answer="47.1cm²"),
        parent(question="半径3cm、高さ5cmの円すいの表面積を、円周率を3.14として求めなさい。"),
        parent(question="直径6cm、母線5cmの円すいの表面積を、円周率を3.14として求めなさい。"),
        parent(question="半径5cm、母線3cmの円すいの表面積を、円周率を3.14として求めなさい。"),
    ]
    for row in bad:
        ok, _ = can_generate(row)
        assert not ok
        generated, ev, _ = generate(row, 1)
        assert generated == [] and ev == []

    print("PASS_SAFE_CONE_SURFACE_AREA_VARIANT_ENGINE")


if __name__ == "__main__":
    main()
