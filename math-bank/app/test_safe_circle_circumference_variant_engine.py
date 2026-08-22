from safe_circle_circumference_variant_engine import can_generate, generate


def parent(**overrides):
    row = {
        "id": "P-CIRCLE-CIRC-001",
        "question": "半径3cmの円の円周の長さを、円周率を3.14として求めなさい。",
        "answer": "18.84cm",
        "figure_refs": [],
        "choices": None,
    }
    row.update(overrides)
    return row


def main() -> None:
    ok, reason = can_generate(parent())
    assert ok and reason == "circle_integer_cm_circumference_pi_3_14_exact"
    ok, _ = can_generate(parent(choices=[]))
    assert ok

    rows, evidence, reason = generate(parent(), 3)
    assert reason == "circle_integer_cm_circumference_pi_3_14_exact"
    assert len(rows) == len(evidence) == 3
    assert len({tuple(row["numeric_signature"]) for row in rows}) == 3
    assert all(tuple(row["numeric_signature"]) != ("3", "3.14") for row in rows)
    for row, ev in zip(rows, evidence):
        assert row["answer"].endswith("cm")
        assert "円周率" in row["question"] and "3.14" in row["question"]
        assert "PASS" in ev["independent_check"]

    bad = [
        parent(answer="18.83cm"),
        parent(figure_refs=["circle.svg"]),
        parent(choices=["18.84cm", "28.26cm"]),
        parent(question="半径3cmの円の面積を、円周率を3.14として求めなさい。", answer="28.26cm²"),
        parent(question="直径6cmの円周の長さを、円周率を3.14として求めなさい。", answer="18.84cm"),
        parent(question="半径3cmの円周の長さを求めなさい。", answer="6πcm"),
        parent(question="半径3cmの半円の周の長さを、円周率を3.14として求めなさい。", answer="15.42cm"),
        parent(question="半径3mの円の円周の長さを、円周率を3.14として求めなさい。", answer="18.84m"),
        parent(question="円周18.84cmの円の半径を、円周率を3.14として求めなさい。", answer="3cm"),
    ]
    for row in bad:
        ok, _ = can_generate(row)
        assert not ok
        generated, ev, _ = generate(row, 1)
        assert generated == [] and ev == []

    print("PASS_SAFE_CIRCLE_CIRCUMFERENCE_PI_3_14_VARIANT_ENGINE")


if __name__ == "__main__":
    main()
