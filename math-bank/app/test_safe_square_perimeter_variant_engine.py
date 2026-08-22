from safe_square_perimeter_variant_engine import can_generate, generate


def parent(**overrides):
    row = {
        "id": "P-SQ-PERIM-001",
        "question": "1辺6cmの正方形があります。この正方形の周の長さを求めなさい。",
        "answer": "24cm",
        "figure_refs": [],
        "choices": None,
    }
    row.update(overrides)
    return row


def main() -> None:
    for choices in (None, []):
        p = parent(choices=choices)
        ok, reason = can_generate(p)
        assert ok and reason == "square_integer_cm_perimeter_exact"
        rows, evidence, reason = generate(p, 3)
        assert reason == "square_integer_cm_perimeter_exact"
        assert len(rows) == len(evidence) == 3
        sigs = {tuple(row["numeric_signature"]) for row in rows}
        assert len(sigs) == 3
        assert ("6",) not in sigs
        for row, ev in zip(rows, evidence):
            assert "正方形" in row["question"] and "周の長さ" in row["question"]
            assert row["answer"].endswith("cm")
            assert ev["method"] == "square_perimeter_exact_quadruple_and_inverse_identity"
            assert "PASS" in ev["independent_check"]

    bad = [
        parent(answer="25cm"),
        parent(figure_refs=["fig.svg"]),
        parent(choices=["20cm", "24cm"]),
        parent(question="1辺6cmの正方形の面積を求めなさい。", answer="36cm²"),
        parent(question="周の長さが24cmの正方形の1辺を求めなさい。", answer="6cm"),
        parent(question="1辺60mmの正方形の周の長さを求めなさい。", answer="24cm"),
        parent(question="1辺6cm、対角線の長さも示された正方形の周の長さを求めなさい。"),
    ]
    for row in bad:
        ok, _ = can_generate(row)
        assert not ok
        generated, evidence, _ = generate(row, 1)
        assert generated == [] and evidence == []

    print("PASS_SAFE_SQUARE_PERIMETER_VARIANT_ENGINE")


if __name__ == "__main__":
    main()
