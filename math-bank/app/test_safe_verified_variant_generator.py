from __future__ import annotations

import copy

from generate_safe_verified_variants import generate_parent
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import validate_layer


def main() -> None:
    base = make_base()

    # Exact signed-integer arithmetic parent. Three siblings must all change
    # their numeric signature and independently validate.
    arithmetic = base[0]
    av, ap, kind = generate_parent(arithmetic, 3, "2026-08-21T00:00:00Z")
    assert kind == "binary_arithmetic_exact"
    assert len(av) == 3 and len(ap) == 3
    assert len({tuple(__import__('validate_expanded_variant_layer').numeric_tokens(v['question'])) for v in av}) == 3
    ar = validate_layer(base, av, ap)
    assert ar["expanded_verified_variants"] == 3
    assert ar["expanded_parent_coverage"] == 1
    for v, p in zip(av, ap):
        assert v["audit"]["problem_answer_verified"] is True
        assert p["independent_recalculation"] is True
        assert "inverse_identity=PASS" in p["verification_evidence"]

    # Exact first-degree equation parent. The generator must first prove the
    # parent's own answer by solving/substitution, then generate integral-answer
    # equations and prove each by substitution.
    equation = base[1]
    equation["skill"] = "方程式"
    equation["question"] = "方程式 2x+3=11 を解きなさい。"
    equation["answer"] = "x=4"
    ev, ep, kind = generate_parent(equation, 3, "2026-08-21T00:00:00Z")
    assert kind == "linear_equation_exact"
    assert len(ev) == 3 and len(ep) == 3
    er = validate_layer(base, ev, ep)
    assert er["expanded_verified_variants"] == 3
    assert er["expanded_parent_coverage"] == 1
    for v, p in zip(ev, ep):
        assert v["answer"].startswith("x=")
        assert "substitution=" in p["verification_evidence"]

    # Wrong parent answer must fail closed: no variant may be generated from an
    # unproven parent even when the question itself parses.
    bad_answer = copy.deepcopy(arithmetic)
    bad_answer["answer"] = "999"
    v, p, reason = generate_parent(bad_answer, 1, "2026-08-21T00:00:00Z")
    assert v == [] and p == []
    assert "parent_answer_not_exactly_recalculated" in reason

    # Figure and multiple-choice parents remain manual until their complete
    # structure/distractors are individually recalculated.
    figure = copy.deepcopy(arithmetic)
    figure["figure_refs"] = ["figures/test.png"]
    v, p, reason = generate_parent(figure, 1, "2026-08-21T00:00:00Z")
    assert v == [] and p == [] and "figure_parent" in reason

    choice = copy.deepcopy(arithmetic)
    choice["choices"] = ["1", "2", "3", "4"]
    v, p, reason = generate_parent(choice, 1, "2026-08-21T00:00:00Z")
    assert v == [] and p == [] and "choice_parent" in reason

    # Unrecognized prose/manual structure must not be guessed.
    prose = copy.deepcopy(arithmetic)
    prose["question"] = "太郎さんの考え方を説明しなさい。"
    prose["answer"] = "説明例"
    v, p, reason = generate_parent(prose, 1, "2026-08-21T00:00:00Z")
    assert v == [] and p == [] and reason.startswith("unsupported_safe_generation:")

    print("PASS_SAFE_VARIANT_GENERATOR_ARITHMETIC_EXACT_RECALC")
    print("PASS_SAFE_VARIANT_GENERATOR_LINEAR_EQUATION_EXACT_RECALC")
    print("PASS_SAFE_VARIANT_GENERATOR_WRONG_PARENT_FIGURE_CHOICE_PROSE_FAIL_CLOSED")


if __name__ == "__main__":
    main()
