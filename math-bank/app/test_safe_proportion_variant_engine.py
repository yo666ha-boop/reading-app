from __future__ import annotations

from safe_proportion_variant_engine import can_generate, generate


def parent(question: str, answer: str, *, figure=False, choices=None) -> dict:
    return {
        "id": "P-RATIO-001",
        "grade": 1,
        "taxonomy": {"genre": "数量", "unit": "比例式", "skill": "比を使った方程式"},
        "difficulty": "標準",
        "question": question,
        "answer": answer,
        "explanation": "",
        "choices": choices,
        "figure_refs": ["fig-1"] if figure else [],
        "source": {"book": "Winpass", "document": "dummy", "original_no": 1, "is_generated_variant": False, "parent_id": None},
        "variant_group": None,
        "audit": {"problem_answer_verified": True, "structure_verified": True, "figure_refs_verified": True, "notes": []},
    }


def test_each_x_position_and_three_distinct_siblings():
    cases = [
        ("比例式 x:3=8:4 の x を求めなさい。", "x=6"),
        ("比例式 8:x=4:3 の x を求めなさい。", "x=6"),
        ("比例式 8:4=x:3 の x を求めなさい。", "x=6"),
        ("比例式 4:3=8:x の x を求めなさい。", "x=6"),
    ]
    for q, a in cases:
        p = parent(q, a)
        ok, reason = can_generate(p)
        assert ok and reason == "proportion_exact"
        rows, evidence, method = generate(p, 3)
        assert method == "proportion_exact"
        assert len(rows) == len(evidence) == 3
        assert len({tuple(r["numeric_signature"]) for r in rows}) == 3
        assert all(r["answer"].startswith("x=") for r in rows)
        assert all(e["independent_check"].endswith("PASS") for e in evidence)


def test_wrong_parent_answer_fails_closed():
    p = parent("比例式 4:3=8:x の x を求めなさい。", "x=7")
    assert can_generate(p)[0] is False
    assert generate(p, 2)[0] == []


def test_figure_choice_ambiguous_and_nonratio_fail_closed():
    assert can_generate(parent("比例式 4:3=8:x の x を求めなさい。", "x=6", figure=True))[0] is False
    assert can_generate(parent("比例式 4:3=8:x の x を求めなさい。", "x=6", choices=["5", "6"]))[0] is False
    assert can_generate(parent("4:3=8:x の x を求めなさい。", "x=6"))[0] is False
    assert can_generate(parent("比例式 4:3=8:x と 2:1=4:x を考える。", "x=6"))[0] is False
    assert can_generate(parent("比例式 4:0=8:x の x を求めなさい。", "x=0"))[0] is False


def test_count_contract():
    p = parent("比例式 4:3=8:x の x を求めなさい。", "x=6")
    try:
        generate(p, 4)
    except ValueError:
        pass
    else:
        raise AssertionError("count=4 must fail")


if __name__ == "__main__":
    test_each_x_position_and_three_distinct_siblings()
    test_wrong_parent_answer_fails_closed()
    test_figure_choice_ambiguous_and_nonratio_fail_closed()
    test_count_contract()
    print("PASS safe proportion variant engine")
