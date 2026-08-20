from __future__ import annotations

from build_variant_generation_queue import classify_parent


def parent(**overrides):
    base = {
        "figure_refs": [],
        "choices": None,
        "question_format": "短答",
        "skill": "計算",
        "question": "3+5を計算しなさい。",
    }
    base.update(overrides)
    return base


def assert_bucket(row, expected_bucket: str, expected_reason: str) -> None:
    bucket, reason = classify_parent(row)
    assert bucket == expected_bucket, (bucket, reason)
    assert reason == expected_reason, (bucket, reason)


def main() -> None:
    assert_bucket(
        parent(),
        "deterministic_candidate_review",
        "numeric_or_symbolic_parent_candidate_requires_parser_and_independent_recalculation",
    )
    assert_bucket(
        parent(skill="方程式", question="x+3=7を解きなさい。"),
        "deterministic_candidate_review",
        "numeric_or_symbolic_parent_candidate_requires_parser_and_independent_recalculation",
    )
    assert_bucket(
        parent(skill="関数", question="y=2x+1について答えなさい。"),
        "deterministic_candidate_review",
        "numeric_or_symbolic_parent_candidate_requires_parser_and_independent_recalculation",
    )
    assert_bucket(
        parent(skill="確率", question="さいころを1回投げる。"),
        "deterministic_candidate_review",
        "numeric_or_symbolic_parent_candidate_requires_parser_and_independent_recalculation",
    )
    assert_bucket(
        parent(figure_refs=["figures/f001.png"]),
        "manual_generation_queue",
        "figure_parent_requires_individual_figure_and_solution_review",
    )
    assert_bucket(
        parent(choices=["1", "2", "3", "4"]),
        "manual_generation_queue",
        "choice_parent_requires_choice_and_distractor_recalculation",
    )
    assert_bucket(
        parent(skill="証明", question="次のことを証明しなさい。"),
        "manual_generation_queue",
        "structure_not_proven_safe_for_automatic_generation",
    )

    # Safety precedence: a figure or choice parent must never be auto-classified
    # merely because its text contains a deterministic keyword.
    assert classify_parent(parent(figure_refs=["f.png"], skill="計算"))[0] == "manual_generation_queue"
    assert classify_parent(parent(choices=["A", "B"], skill="方程式"))[0] == "manual_generation_queue"

    print("PASS_VARIANT_GENERATION_QUEUE_CONSERVATIVE_CLASSIFICATION")


if __name__ == "__main__":
    main()
