from safe_circle_area_variant_engine import can_generate, generate


def parent(**overrides):
    row = {
        "id": "P-CIRCLE-AREA-001",
        "question": "半径3cmの円の面積を、円周率を3.14として求めなさい。",
        "answer": "28.26cm²",
        "figure_refs": [],
        "choices": None,
    }
    row.update(overrides)
    return row


def main() -> None:
    ok, reason = can_generate(parent())
    assert ok and reason == "circle_integer_cm_area_pi_3_14_exact"

    empty_choices = parent(choices=[])
    ok, reason = can_generate(empty_choices)
    assert ok and reason == "circle_integer_cm_area_pi_3_14_exact"

    rows, evidence, reason = generate(parent(), 3)
    assert reason == "circle_integer_cm_area_pi_3_14_exact"
    assert len(rows) == len(evidence) == 3
    assert len({tuple(row["numeric_signature"]) for row in rows}) == 3
    assert all(tuple(row["numeric_signature"]) != ("3", "3.14") for row in rows)
    for row, ev in zip(rows, evidence):
        assert row["answer"].endswith("cm²")
        assert "円周率" in row["question"] and "3.14" in row["question"]
        assert ev["method"] == "circle_area_exact_pi_3_14_product_and_two_inverse_identities"
        assert "PASS" in ev["independent_check"]

    bad = [
        parent(answer="28.25cm²"),
        parent(figure_refs=["circle.svg"]),
        parent(choices=["28.26cm²", "31.4cm²"]),
        parent(question="直径6cmの円の面積を、円周率を3.14として求めなさい。", answer="28.26cm²"),
        parent(question="半径3cmの円周を、円周率を3.14として求めなさい。", answer="18.84cm"),
        parent(question="半径3cmの円の面積を求めなさい。", answer="9πcm²"),
        parent(question="半径3cmの半円の面積を、円周率を3.14として求めなさい。", answer="14.13cm²"),
        parent(question="半径3mの円の面積を、円周率を3.14として求めなさい。", answer="28.26m²"),
        parent(question="面積28.26cm²の円の半径を、円周率を3.14として求めなさい。", answer="3cm"),
    ]
    for row in bad:
        ok, _ = can_generate(row)
        assert not ok
        generated, ev, _ = generate(row, 1)
        assert generated == [] and ev == []

    print("PASS_SAFE_CIRCLE_AREA_PI_3_14_VARIANT_ENGINE")


if __name__ == "__main__":
    main()
