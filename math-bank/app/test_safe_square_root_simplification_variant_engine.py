from safe_square_root_simplification_variant_engine import can_generate, generate


def parent(**overrides):
    row = {
        "id": "P-SQRT-001",
        "question": "√72を簡単にしなさい。",
        "answer": "6√2",
        "figure_refs": [],
        "choices": None,
    }
    row.update(overrides)
    return row


def main() -> None:
    for choices in (None, []):
        p = parent(choices=choices)
        ok, reason = can_generate(p)
        assert ok and reason == "single_integer_square_root_exact_simplification"
        rows, evidence, _ = generate(p, 3)
        assert len(rows) == len(evidence) == 3
        assert len({row["question"] for row in rows}) == 3
        assert all(row["answer"] != "6√2" for row in rows)
        assert all("PASS" in ev["independent_check"] for ev in evidence)

    bad = [
        parent(answer="3√8"),
        parent(question="√13を簡単にしなさい。", answer="√13"),
        parent(question="√72+√8を計算しなさい。", answer="8√2"),
        parent(question="√72の近似値を求めなさい。", answer="8.49"),
        parent(figure_refs=["fig.svg"]),
        parent(choices=["3√8", "6√2"]),
    ]
    for p in bad:
        ok, _ = can_generate(p)
        assert not ok
        rows, evidence, _ = generate(p, 1)
        assert rows == [] and evidence == []

    print("PASS_SAFE_SQUARE_ROOT_SIMPLIFICATION_VARIANT_ENGINE")


if __name__ == "__main__":
    main()
