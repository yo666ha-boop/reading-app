from __future__ import annotations

from safe_average_variant_engine import can_generate, generate


def parent(question: str, answer: str, *, figure=False, choices=None) -> dict:
    return {
        "id": "P-AVG-001",
        "grade": 1,
        "taxonomy": {"genre": "資料", "unit": "代表値", "skill": "平均"},
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


def test_exact_parent_and_three_distinct_siblings():
    p = parent("12、15、18の平均を求めなさい。", "15")
    ok, reason = can_generate(p)
    assert ok and reason == "simple_arithmetic_mean_exact"
    rows, evidence, method = generate(p, 3)
    assert method == "simple_arithmetic_mean_exact"
    assert len(rows) == len(evidence) == 3
    assert len({tuple(r["numeric_signature"]) for r in rows}) == 3
    assert all(tuple(r["numeric_signature"]) != ("12", "15", "18") for r in rows)
    assert all(e["independent_check"].endswith("PASS") for e in evidence)


def test_decimal_parent_answer_recalculation():
    p = parent("10,11の平均を求めなさい。", "10.5")
    assert can_generate(p)[0] is True
    rows, evidence, _ = generate(p, 1)
    assert len(rows) == len(evidence) == 1


def test_wrong_parent_answer_fails_closed():
    p = parent("12、15、18の平均を求めなさい。", "16")
    assert can_generate(p)[0] is False
    assert generate(p, 2)[0] == []


def test_figure_choice_weighted_missing_and_ambiguous_fail_closed():
    assert can_generate(parent("12、15、18の平均を求めなさい。", "15", figure=True))[0] is False
    assert can_generate(parent("12、15、18の平均を求めなさい。", "15", choices=["14", "15"]))[0] is False
    assert can_generate(parent("12、15、18の加重平均を求めなさい。", "15"))[0] is False
    assert can_generate(parent("12、15、18の中央値を求めなさい。", "15"))[0] is False
    assert can_generate(parent("12、15、xの平均が15です。xを求めなさい。", "18"))[0] is False
    assert can_generate(parent("表の12、15、18の平均を求めなさい。", "15"))[0] is False
    assert can_generate(parent("12、15、18と20、22の平均を求めなさい。", "17.4"))[0] is False


def test_count_contract():
    p = parent("12、15、18の平均を求めなさい。", "15")
    try:
        generate(p, 4)
    except ValueError:
        pass
    else:
        raise AssertionError("count=4 must fail")


if __name__ == "__main__":
    test_exact_parent_and_three_distinct_siblings()
    test_decimal_parent_answer_recalculation()
    test_wrong_parent_answer_fails_closed()
    test_figure_choice_weighted_missing_and_ambiguous_fail_closed()
    test_count_contract()
    print("PASS safe average variant engine")
