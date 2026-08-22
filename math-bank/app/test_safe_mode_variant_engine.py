from safe_mode_variant_engine import can_generate, generate


def parent(**overrides):
    row = {
        "id": "P-MODE-001",
        "question": "データ 2、5、5、7、9 の最頻値を求めなさい。",
        "answer": "5",
        "figure_refs": [],
        "choices": None,
    }
    row.update(overrides)
    return row


def main() -> None:
    for choices in (None, []):
        p = parent(choices=choices)
        ok, reason = can_generate(p)
        assert ok and reason == "unique_integer_data_mode_exact"
        rows, evidence, _ = generate(p, 3)
        assert len(rows) == len(evidence) == 3
        assert len({tuple(row["numeric_signature"]) for row in rows}) == 3
        assert tuple(str(v) for v in (2, 5, 5, 7, 9)) not in {tuple(row["numeric_signature"]) for row in rows}
        for row, ev in zip(rows, evidence):
            assert "最頻値" in row["question"]
            assert ev["method"] == "unique_integer_mode_frequency_and_strict_max_count"
            assert "PASS" in ev["independent_check"]

    bad = [
        parent(answer="7"),
        parent(question="データ 2、5、5、7、7 の最頻値を求めなさい。", answer="5"),
        parent(question="データ 2、5、7、9 の最頻値を求めなさい。", answer="5"),
        parent(question="データ 2、5、5、7、9 の平均と最頻値を求めなさい。"),
        parent(question="次の度数分布表から最頻値を求めなさい。", answer="5"),
        parent(figure_refs=["fig-1.svg"]),
        parent(choices=["2", "5", "7", "9"]),
    ]
    for p in bad:
        ok, _ = can_generate(p)
        assert not ok
        rows, evidence, _ = generate(p, 1)
        assert rows == [] and evidence == []

    print("PASS_SAFE_MODE_VARIANT_ENGINE")


if __name__ == "__main__":
    main()
