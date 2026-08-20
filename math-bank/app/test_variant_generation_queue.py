from __future__ import annotations

import copy

from build_variant_generation_queue import (
    classify_parent,
    parent_record_sha256,
    validated_covered_parent_ids,
)
from test_expanded_variant_layer import make_base, provenance, rec as expanded_rec


def parent(**overrides):
    base = {
        "id": "P-001",
        "grade": 1,
        "unit": {"major": "数と式", "minor": "正負の数", "tags": []},
        "title": "正負の数",
        "figure_refs": [],
        "choices": None,
        "question_format": "短答",
        "skill": "計算",
        "difficulty": "basic",
        "question": "3+5を計算しなさい。",
        "answer": "8",
        "explanation": "3+5=8",
        "source": {
            "book": "Winpass",
            "document": "fixture",
            "original_no": "1",
            "is_generated_variant": False,
        },
        "variant_group": None,
        "audit": {
            "problem_answer_verified": True,
            "structure_verified": True,
            "figure_refs_verified": True,
            "notes": [],
        },
    }
    base.update(overrides)
    return base


def assert_bucket(row, expected_bucket: str, expected_reason: str) -> None:
    bucket, reason = classify_parent(row)
    assert bucket == expected_bucket, (bucket, reason)
    assert reason == expected_reason, (bucket, reason)


def expect_fail(fn, needle: str) -> None:
    try:
        fn()
    except Exception as e:
        assert needle in str(e), (needle, repr(e))
        return
    raise AssertionError(f"expected failure containing {needle!r}")


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

    # Parent fingerprints must be deterministic for the same exact record and
    # must change whenever material parent content changes. This gives later
    # generation/provenance stages a hard proof of which parent was actually read.
    p1 = parent()
    p2 = parent()
    assert parent_record_sha256(p1) == parent_record_sha256(p2)
    p2["question"] = "4+5を計算しなさい。"
    assert parent_record_sha256(p1) != parent_record_sha256(p2)
    p3 = parent()
    p3["answer"] = "9"
    assert parent_record_sha256(p1) != parent_record_sha256(p3)

    # A parent may be removed from the generation queue only after the existing
    # expanded record passes the full strict layer validator. A malformed or
    # unverified record must fail closed instead of silently creating fake coverage.
    base = make_base()
    exact_parent = base[0]
    good = expanded_rec(
        "Q0001",
        "generated",
        generated=True,
        parent=exact_parent["id"],
        question="(-7)+15 を計算しなさい。",
    )
    good["answer"] = "8"
    covered, report = validated_covered_parent_ids(base, [good], [provenance(good["id"], exact_parent)])
    assert covered == {exact_parent["id"]}
    assert report["expanded_verified_variants"] == 1
    assert report["expanded_parent_coverage"] == 1

    bad = copy.deepcopy(good)
    bad["id"] = "Q0002"
    bad["audit"]["problem_answer_verified"] = False
    expect_fail(
        lambda: validated_covered_parent_ids(base, [bad], [provenance(bad["id"], exact_parent)]),
        "unverified audit gate",
    )

    print("PASS_VARIANT_GENERATION_QUEUE_CONSERVATIVE_CLASSIFICATION_AND_PARENT_FINGERPRINT")
    print("PASS_VARIANT_GENERATION_QUEUE_COUNTS_ONLY_STRICTLY_VALIDATED_EXPANDED_COVERAGE")


if __name__ == "__main__":
    main()
