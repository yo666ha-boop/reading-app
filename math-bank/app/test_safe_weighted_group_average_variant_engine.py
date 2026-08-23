from safe_weighted_group_average_variant_engine import can_generate, generate


def parent(**overrides):
    row = {
        "id": "P-WAVG-001",
        "question": "A組は20人で平均70点、B組は30人で平均80点です。全体の平均点を求めなさい。",
        "answer": "76",
        "figure_refs": [],
        "choices": None,
    }
    row.update(overrides)
    return row


def main() -> None:
    ok, reason = can_generate(parent())
    assert ok and reason == "two_group_weighted_average_exact"
    empty = parent(choices=[])
    ok, _ = can_generate(empty)
    assert ok
    rows, evidence, _ = generate(parent(), 3)
    assert len(rows) == len(evidence) == 3
    assert len({tuple(r["numeric_signature"]) for r in rows}) == 3
    assert all(r["answer"] for r in rows)
    assert all("PASS" in e["independent_check"] for e in evidence)

    bad = [
        parent(answer="75"),
        parent(figure_refs=["fig.svg"]),
        parent(choices=["75", "76"]),
        parent(question="A組は20人で平均70点、B組は30人で平均80点です。人数の平均を求めなさい。"),
        parent(question="A組は20人で平均70点、B組は30人で平均80点です。全体の中央値を求めなさい。"),
    ]
    for row in bad:
        ok, _ = can_generate(row)
        assert not ok
        generated, ev, _ = generate(row, 1)
        assert generated == [] and ev == []

    print("PASS_SAFE_WEIGHTED_GROUP_AVERAGE_VARIANT_ENGINE")


if __name__ == "__main__":
    main()
