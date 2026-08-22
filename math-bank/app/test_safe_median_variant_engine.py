from safe_median_variant_engine import can_generate, generate


def parent(**overrides):
    row = {
        "id": "P-MEDIAN-001",
        "question": "次のデータ 3、8、5、11、7 の中央値を求めなさい。",
        "answer": "7",
        "figure_refs": [],
        "choices": None,
    }
    row.update(overrides)
    return row


def main() -> None:
    ok, reason = can_generate(parent())
    assert ok and reason == "odd_integer_data_median_exact"
    empty = parent(choices=[])
    ok, _ = can_generate(empty)
    assert ok
    rows, evidence, reason = generate(parent(), 3)
    assert reason == "odd_integer_data_median_exact"
    assert len(rows) == len(evidence) == 3
    assert len({tuple(row["numeric_signature"]) for row in rows}) == 3
    assert tuple(str(v) for v in (3, 8, 5, 11, 7)) not in {tuple(row["numeric_signature"]) for row in rows}
    for row, ev in zip(rows, evidence):
        assert row["answer"].lstrip("-").isdigit()
        assert "中央値" in row["question"]
        assert ev["method"] == "odd_integer_median_sorted_middle_and_equal_side_counts"
        assert "PASS" in ev["independent_check"]

    bad = [
        parent(answer="8"),
        parent(figure_refs=["fig-1.svg"]),
        parent(choices=["5", "7", "8"]),
        parent(question="次のデータ 3、8、5、11 の中央値を求めなさい。", answer="6.5"),
        parent(question="次のデータ 3、8、5、11、7 の平均と中央値を求めなさい。", answer="7"),
        parent(question="次の度数分布表の中央値を求めなさい。", answer="7"),
    ]
    for row in bad:
        ok, _ = can_generate(row)
        assert not ok
        generated, ev, _ = generate(row, 1)
        assert generated == [] and ev == []

    print("PASS_SAFE_MEDIAN_VARIANT_ENGINE")


if __name__ == "__main__":
    main()
