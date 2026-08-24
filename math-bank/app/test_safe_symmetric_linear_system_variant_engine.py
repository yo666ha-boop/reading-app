from safe_symmetric_linear_system_variant_engine import can_generate, generate


def parent(**overrides):
    row = {
        "id":"SYS-001",
        "question":"次の連立方程式を解きなさい。 x+y=11, x-y=3",
        "answer":"x=7, y=4",
        "figure_refs":[],
        "choices":None,
    }
    row.update(overrides)
    return row


def main():
    ok, reason = can_generate(parent())
    assert ok and reason == "symmetric_linear_system_exact"
    empty = parent(choices=[])
    ok, _ = can_generate(empty)
    assert ok
    rows, ev, _ = generate(parent(), 3)
    assert len(rows) == len(ev) == 3
    assert len({tuple(r["numeric_signature"]) for r in rows}) == 3
    assert all("x=" in r["answer"] and "y=" in r["answer"] for r in rows)
    assert all("PASS" in e["independent_check"] for e in ev)

    general = parent(question="x+y=11, 2x-y=10 を解きなさい。")
    ok, reason = can_generate(general)
    assert ok and reason == "general_linear_system_exact"
    rows, ev, reason = generate(general, 3)
    assert len(rows) == len(ev) == 3 and reason == "general_linear_system_exact"
    assert all("PASS" in e["independent_check"] for e in ev)

    bad = [
        parent(answer="x=6, y=5"),
        parent(figure_refs=["fig.svg"]),
        parent(choices=["x=7,y=4"]),
        parent(question="x+y=11, 2x+2y=22 を解きなさい。"),
        parent(question="x+y=11, x-y=3 のグラフをかきなさい。"),
    ]
    for row in bad:
        ok, _ = can_generate(row)
        assert not ok
        out, evidence, _ = generate(row, 1)
        assert out == [] and evidence == []
    print("PASS_SAFE_SYMMETRIC_AND_GENERAL_LINEAR_SYSTEM_VARIANT_ENGINE")

if __name__ == "__main__":
    main()
