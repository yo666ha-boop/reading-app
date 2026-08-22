from safe_data_range_variant_engine import can_generate, generate


def parent(**overrides):
    row = {
        "id": "P-RANGE-001",
        "question": "次のデータ 4、7、9、12、6 の範囲を求めなさい。",
        "answer": "8",
        "figure_refs": [],
        "choices": None,
    }
    row.update(overrides)
    return row


def main() -> None:
    for choices in (None, []):
        p = parent(choices=choices)
        ok, reason = can_generate(p)
        assert ok and reason == "integer_data_range_exact"
        rows, evidence, _ = generate(p, 3)
        assert len(rows) == len(evidence) == 3
        assert len({tuple(row["numeric_signature"]) for row in rows}) == 3
        for row, ev in zip(rows, evidence):
            assert "範囲" in row["question"]
            assert row["answer"].isdigit()
            assert ev["method"] == "integer_data_range_max_minus_min_and_inverse_identity"
            assert "PASS" in ev["independent_check"]

    bad = [
        parent(answer="7"),
        parent(figure_refs=["fig-1.svg"]),
        parent(choices=["7", "8", "9"]),
        parent(question="次のデータ 4、7、9、12、6 の平均と範囲を求めなさい。", answer="8"),
        parent(question="次の度数分布表の範囲を求めなさい。", answer="8"),
        parent(question="次のデータ 5、5、5 の範囲を求めなさい。", answer="0"),
        parent(question="次のデータ 4、7 の範囲を求めなさい。", answer="3"),
    ]
    for row in bad:
        ok, _ = can_generate(row)
        assert not ok
        rows, evidence, _ = generate(row, 1)
        assert rows == [] and evidence == []

    print("PASS_SAFE_DATA_RANGE_VARIANT_ENGINE")


if __name__ == "__main__":
    main()
