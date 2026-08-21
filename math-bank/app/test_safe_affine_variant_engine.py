from __future__ import annotations

import copy

from safe_affine_variant_engine import can_generate, generate


def parent_record() -> dict:
    return {
        "id": "TEST-FUNC-001",
        "grade": 2,
        "genre": "関数",
        "unit": "一次関数",
        "skill": "値を求める",
        "difficulty": "標準",
        "question": "一次関数 y=2x+3 で、x=4 のときの y の値を求めなさい。",
        "answer": "y=11",
        "explanation": "",
        "choices": None,
        "figure_refs": [],
        "source": {"book": "synthetic-test", "document": "test", "original_no": 1, "is_generated_variant": False, "parent_id": None},
        "variant_group": None,
        "audit": {"problem_answer_verified": True, "structure_verified": True, "figure_refs_verified": True, "notes": []},
    }


def main() -> None:
    parent = parent_record()
    ok, reason = can_generate(parent)
    assert ok and reason == "affine_function_exact"

    rows, evidence, kind = generate(parent, 3)
    assert kind == "affine_function_exact"
    assert len(rows) == 3 and len(evidence) == 3
    assert len({tuple(row["numeric_signature"]) for row in rows}) == 3
    assert all(row["question"] != parent["question"] for row in rows)
    assert all("PASS" in ev["independent_check"] for ev in evidence)
    assert len({ev["parent_sha256"] for ev in evidence}) == 1

    # Wrong parent answer: fail closed.  No unverified parent may seed variants.
    wrong = copy.deepcopy(parent)
    wrong["answer"] = "y=12"
    ok, reason = can_generate(wrong)
    assert not ok and "not_exactly_parsed_and_verified" in reason
    rows, evidence, _ = generate(wrong, 1)
    assert rows == [] and evidence == []

    # Figures and choices remain manual until complete shape/distractors can be
    # independently verified.
    figure = copy.deepcopy(parent)
    figure["figure_refs"] = ["figures/f1.png"]
    assert can_generate(figure) == (False, "figure_parent")

    choice = copy.deepcopy(parent)
    choice["choices"] = ["9", "10", "11", "12"]
    assert can_generate(choice) == (False, "choice_parent")

    # Ambiguous/multi-formula prose is rejected rather than guessed.
    ambiguous = copy.deepcopy(parent)
    ambiguous["question"] = "y=2x+3 と y=3x+2 を比べ、x=4 のときについて説明しなさい。"
    ambiguous["answer"] = "説明"
    ok, reason = can_generate(ambiguous)
    assert not ok and "not_exactly_parsed_and_verified" in reason

    print("PASS_SAFE_AFFINE_PARENT_RECALC")
    print("PASS_SAFE_AFFINE_THREE_SIBLING_NUMERIC_CHANGE")
    print("PASS_SAFE_AFFINE_WRONG_ANSWER_FIGURE_CHOICE_AMBIGUOUS_FAIL_CLOSED")


if __name__ == "__main__":
    main()
