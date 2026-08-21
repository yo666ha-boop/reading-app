from __future__ import annotations

from safe_percentage_variant_engine import can_generate, generate


def parent(question: str, answer: str, *, figure=False, choices=None) -> dict:
    return {
        "id": "P-PCT-001",
        "grade": 1,
        "taxonomy": {"genre": "数量", "unit": "割合", "skill": "百分率"},
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
    p = parent("1200円の25%は何円ですか。", "300円")
    ok, reason = can_generate(p)
    assert ok and reason == "percentage_of_yen_exact"
    rows, evidence, method = generate(p, 3)
    assert method == "percentage_of_yen_exact"
    assert len(rows) == len(evidence) == 3
    assert len({tuple(r["numeric_signature"]) for r in rows}) == 3
    assert all(r["answer"].endswith("円") for r in rows)
    assert all(e["independent_check"].endswith("PASS") for e in evidence)
    assert all(tuple(r["numeric_signature"]) != ("1200", "25") for r in rows)


def test_fullwidth_percent_and_fraction_parent_answer_recalculation():
    p = parent("250円の10％は何円ですか。", "25円")
    assert can_generate(p)[0] is True
    rows, evidence, _ = generate(p, 1)
    assert len(rows) == len(evidence) == 1


def test_wrong_parent_answer_fails_closed():
    p = parent("1200円の25%は何円ですか。", "301円")
    assert can_generate(p)[0] is False
    assert generate(p, 2)[0] == []


def test_figure_choice_and_ambiguous_contexts_fail_closed():
    assert can_generate(parent("1200円の25%は何円ですか。", "300円", figure=True))[0] is False
    assert can_generate(parent("1200円の25%は何円ですか。", "300円", choices=["300円", "400円"]))[0] is False
    assert can_generate(parent("1200円の25%引きは何円ですか。", "900円"))[0] is False
    assert can_generate(parent("1200円の25%増加後は何円ですか。", "1500円"))[0] is False
    assert can_generate(parent("1000円の20%と500円の10%は何円ですか。", "250円"))[0] is False
    assert can_generate(parent("1200円の100%は何円ですか。", "1200円"))[0] is False
    assert can_generate(parent("1200円の0%は何円ですか。", "0円"))[0] is False
    assert can_generate(parent("1200円の25%を求めなさい。", "300円"))[0] is False


def test_count_contract():
    p = parent("1200円の25%は何円ですか。", "300円")
    try:
        generate(p, 4)
    except ValueError:
        pass
    else:
        raise AssertionError("count=4 must fail")


if __name__ == "__main__":
    test_exact_parent_and_three_distinct_siblings()
    test_fullwidth_percent_and_fraction_parent_answer_recalculation()
    test_wrong_parent_answer_fails_closed()
    test_figure_choice_and_ambiguous_contexts_fail_closed()
    test_count_contract()
    print("PASS safe percentage variant engine")
