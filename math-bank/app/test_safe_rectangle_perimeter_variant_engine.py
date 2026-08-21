from safe_rectangle_perimeter_variant_engine import can_generate, generate


def parent(**overrides):
    row = {
        "id": "P-RECT-PERIM-001",
        "question": "たて8cm、横5cmの長方形があります。この長方形の周の長さを求めなさい。",
        "answer": "26cm",
        "figure_refs": [],
        "choices": None,
    }
    row.update(overrides)
    return row


def main() -> None:
    ok, reason = can_generate(parent())
    assert ok and reason == "rectangle_integer_cm_perimeter_exact"
    rows, evidence, _ = generate(parent(), 3)
    assert len(rows) == 3 and len(evidence) == 3
    sigs = {tuple(row["numeric_signature"]) for row in rows}
    assert len(sigs) == 3
    assert ("8", "5") not in sigs
    for row, ev in zip(rows, evidence):
        assert row["answer"].endswith("cm")
        assert "周の長さ" in row["question"]
        assert ev["method"] == "rectangle_perimeter_exact_double_sum_and_two_inverse_identities"
        assert "PASS" in ev["independent_check"]

    bad = [
        parent(answer="25cm"),
        parent(figure_refs=["fig-1.svg"]),
        parent(choices=["20cm", "26cm"]),
        parent(question="たて8cm、横5cmの長方形の面積を求めなさい。", answer="40cm2"),
        parent(question="たて8cm、横5cmの長方形で、横の長さを求めなさい。", answer="5cm"),
        parent(question="たて8cm、横50mmの長方形の周の長さを求めなさい。", answer="26cm"),
        parent(question="たて8cm、横5cmの正方形の周の長さを求めなさい。", answer="26cm"),
    ]
    for row in bad:
        ok, _ = can_generate(row)
        assert not ok
        generated, ev, _ = generate(row, 1)
        assert generated == [] and ev == []

    print("PASS_SAFE_RECTANGLE_PERIMETER_VARIANT_ENGINE")


if __name__ == "__main__":
    main()
