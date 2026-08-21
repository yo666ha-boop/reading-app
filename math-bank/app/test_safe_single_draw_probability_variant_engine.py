from __future__ import annotations

import copy

from safe_single_draw_probability_variant_engine import can_generate, generate


def parent_record() -> dict:
    return {
        "id": "TEST-PROB-001",
        "grade": 2,
        "genre": "確率",
        "unit": "確率",
        "skill": "1回の試行",
        "difficulty": "標準",
        "question": "赤玉が3個、白玉が2個入っている袋から、玉を1個取り出すとき、赤玉が出る確率を求めなさい。",
        "answer": "3/5",
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
    assert ok and reason == "single_draw_probability_exact"

    rows, evidence, kind = generate(parent, 3)
    assert kind == "single_draw_probability_exact"
    assert len(rows) == 3 and len(evidence) == 3
    assert len({tuple(row["numeric_signature"]) for row in rows}) == 3
    assert all(tuple(row["numeric_signature"]) != (3, 2) for row in rows)
    assert all(row["question"] != parent["question"] for row in rows)
    assert all("PASS" in ev["independent_check"] for ev in evidence)
    assert len({ev["parent_sha256"] for ev in evidence}) == 1

    # White-target form is also exact and independently checked.
    white = copy.deepcopy(parent)
    white["question"] = "赤玉が3個、白玉が2個入っている袋から、玉を1個取り出すとき、白玉が出る確率を求めなさい。"
    white["answer"] = "2/5"
    assert can_generate(white) == (True, "single_draw_probability_exact")
    wrows, wevidence, _ = generate(white, 2)
    assert len(wrows) == 2 and all("PASS" in ev["independent_check"] for ev in wevidence)

    # Wrong parent answer can never seed variants.
    wrong = copy.deepcopy(parent)
    wrong["answer"] = "2/5"
    ok, reason = can_generate(wrong)
    assert not ok and "not_exactly_parsed_and_verified" in reason
    rows, evidence, _ = generate(wrong, 1)
    assert rows == [] and evidence == []

    # Unsupported or ambiguous structures fail closed.
    figure = copy.deepcopy(parent)
    figure["figure_refs"] = ["figures/prob.png"]
    assert can_generate(figure) == (False, "figure_parent")

    choice = copy.deepcopy(parent)
    choice["choices"] = ["1/5", "2/5", "3/5", "4/5"]
    assert can_generate(choice) == (False, "choice_parent")

    two_draws = copy.deepcopy(parent)
    two_draws["question"] = "赤玉が3個、白玉が2個入っている袋から、玉を2個取り出すとき、赤玉が出る確率を求めなさい。"
    two_draws["answer"] = ""
    assert can_generate(two_draws)[0] is False

    replacement = copy.deepcopy(parent)
    replacement["question"] = "赤玉が3個、白玉が2個入っている袋から、玉を1個取り出してもどし、続けて取り出すとき、赤玉が出る確率を求めなさい。"
    replacement["answer"] = ""
    assert can_generate(replacement)[0] is False

    print("PASS_SAFE_SINGLE_DRAW_PROBABILITY_PARENT_RECALC")
    print("PASS_SAFE_SINGLE_DRAW_PROBABILITY_THREE_SIBLING_NUMERIC_CHANGE")
    print("PASS_SAFE_SINGLE_DRAW_PROBABILITY_WRONG_ANSWER_UNSUPPORTED_FAIL_CLOSED")


if __name__ == "__main__":
    main()
