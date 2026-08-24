from __future__ import annotations

import copy

from safe_common_factor_quadratic_variant_engine import generate
from test_expanded_variant_layer import make_base


def parent(question: str, answer: str) -> dict:
    p = copy.deepcopy(make_base()[0])
    p["question"] = question
    p["answer"] = answer
    p["choices"] = []
    p["figure_refs"] = []
    return p


def main() -> None:
    p = parent("6x²+9xを因数分解しなさい。", "3x(2x+3)")
    rows, ev, reason = generate(p, 3)
    assert reason == "common_factor_quadratic_exact"
    assert len(rows) == len(ev) == 3
    assert len({tuple(r["numeric_signature"]) for r in rows}) == 3
    assert all(r["question"] != p["question"] for r in rows)
    assert all("primitive inner pair PASS" in e["independent_check"] for e in ev)

    pneg = parent("-6x²+9xを因数分解しなさい。", "-3x(2x-3)")
    rows, _, reason = generate(pneg, 1)
    assert len(rows) == 1 and reason == "common_factor_quadratic_exact"

    # Exercise several distinct parent fingerprints so deterministic sibling
    # search cannot hide a non-primitive or non-terminating seed pattern.
    stress = (
        ("8x²+12xを因数分解しなさい。", "4x(2x+3)"),
        ("10x²-15xを因数分解しなさい。", "5x(2x-3)"),
        ("-14x²-21xを因数分解しなさい。", "-7x(2x+3)"),
        ("18x²+30xを因数分解しなさい。", "6x(3x+5)"),
    )
    for question, answer in stress:
        siblings, evidence, why = generate(parent(question, answer), 3)
        assert why == "common_factor_quadratic_exact"
        assert len(siblings) == len(evidence) == 3
        assert len({tuple(r["numeric_signature"]) for r in siblings}) == 3
        assert all("primitive inner pair PASS" in e["independent_check"] for e in evidence)

    wrong = parent("6x²+9xを因数分解しなさい。", "x(6x+9)")
    rows, _, _ = generate(wrong, 1)
    assert rows == []

    fig = parent("6x²+9xを因数分解しなさい。", "3x(2x+3)")
    fig["figure_refs"] = ["figure.png"]
    assert generate(fig, 1)[0] == []

    choice = parent("6x²+9xを因数分解しなさい。", "3x(2x+3)")
    choice["choices"] = ["A", "B"]
    assert generate(choice, 1)[0] == []
    print("PASS_SAFE_COMMON_FACTOR_QUADRATIC_VARIANT_ENGINE")


if __name__ == "__main__":
    main()
