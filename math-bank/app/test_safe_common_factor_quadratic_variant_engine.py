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
    assert all("PASS" in e["independent_check"] for e in ev)

    pneg = parent("-6x²+9xを因数分解しなさい。", "-3x(2x-3)")
    rows, _, reason = generate(pneg, 1)
    assert len(rows) == 1 and reason == "common_factor_quadratic_exact"

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
