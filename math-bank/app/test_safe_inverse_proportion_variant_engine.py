from safe_inverse_proportion_variant_engine import can_generate, generate


def parent(**overrides):
    row = {
        "id": "P-INV-001",
        "question": "反比例 y=12/x について、x=3のときのyの値を求めなさい。",
        "answer": "y=4",
        "figure_refs": [],
        "choices": None,
    }
    row.update(overrides)
    return row


def main() -> None:
    for choices in (None, []):
        p = parent(choices=choices)
        ok, reason = can_generate(p)
        assert ok and reason == "inverse_proportion_exact"
        rows, evidence, reason = generate(p, 3)
        assert reason == "inverse_proportion_exact"
        assert len(rows) == len(evidence) == 3
        sigs = {tuple(row["numeric_signature"]) for row in rows}
        assert len(sigs) == 3
        assert ("12", "3") not in sigs
        for row, ev in zip(rows, evidence):
            assert "y=" in row["question"] and "/x" in row["question"]
            assert row["answer"].startswith("y=")
            assert ev["method"] == "inverse_proportion_exact_division_and_product_identity"
            assert ev["independent_check"].endswith("PASS")

    bad = [
        parent(answer="y=5"),
        parent(question="反比例 y=12/x について、x=0のときのyの値を求めなさい。", answer="0"),
        parent(question="反比例 y=0/x について、x=3のときのyの値を求めなさい。", answer="0"),
        parent(question="反比例 y=12/x と y=18/x について、x=3のときのyの値を求めなさい。", answer="y=4"),
        parent(question="y=12/x のグラフをかきなさい。", answer=""),
        parent(figure_refs=["fig-1.svg"]),
        parent(choices=["3", "4", "5"]),
    ]
    for p in bad:
        ok, _ = can_generate(p)
        assert not ok
        rows, evidence, _ = generate(p, 1)
        assert rows == [] and evidence == []

    print("PASS_SAFE_INVERSE_PROPORTION_VARIANT_ENGINE")


if __name__ == "__main__":
    main()
