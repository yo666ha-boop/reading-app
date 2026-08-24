from __future__ import annotations

from safe_linear_inequality_variant_engine import generate


def parent(question, answer, *, choices=None, figure_refs=None):
    return {
        "id": "P-LINEAR-INEQ",
        "grade": 2,
        "unit": "一次不等式",
        "skill": "一次不等式を解く",
        "difficulty": "standard",
        "format": "short_answer",
        "question_format": "text",
        "taxonomy": {"domain": "algebra", "topic": "linear_inequality"},
        "question": question,
        "answer": answer,
        "choices": choices,
        "figure_refs": figure_refs or [],
        "source": {"name": "test", "parent_id": None, "is_generated_variant": False},
        "audit": {"problem_answer_verified": True, "structure_verified": True, "figure_refs_verified": True},
    }


def main():
    p = parent("不等式 3x+2<20 を解きなさい。", "x<6")
    rows, evidence, reason = generate(p, 3)
    assert reason == "linear_inequality_ax_plus_b_rel_c_exact"
    assert len(rows) == len(evidence) == 3
    assert len({tuple(r["numeric_signature"]) for r in rows}) == 3
    for r, ev in zip(rows, evidence):
        assert r["question"] != p["question"]
        assert r["answer"].startswith("x")
        assert "PASS" in ev["independent_check"]

    # Negative coefficient must flip the solved relation.
    rows2, _, reason2 = generate(parent("不等式 -2x+4>=10 を解きなさい。", "x<=-3"), 1)
    assert rows2 and reason2 == "linear_inequality_ax_plus_b_rel_c_exact"

    # Wrong relation, wrong boundary, figures, and real choices all fail closed.
    for bad in (
        parent("不等式 3x+2<20 を解きなさい。", "x>6"),
        parent("不等式 3x+2<20 を解きなさい。", "x<5"),
        parent("不等式 3x+2<20 を解きなさい。", "x<6", figure_refs=["fig1"]),
        parent("不等式 3x+2<20 を解きなさい。", "x<6", choices=["x<6", "x>6"]),
    ):
        rows3, ev3, _ = generate(bad, 1)
        assert rows3 == [] and ev3 == []

    print("PASS_SAFE_LINEAR_INEQUALITY_VARIANT_ENGINE")


if __name__ == "__main__":
    main()
