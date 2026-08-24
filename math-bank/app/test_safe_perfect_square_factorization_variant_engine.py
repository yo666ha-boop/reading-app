from __future__ import annotations

import copy

from safe_perfect_square_factorization_variant_engine import generate
from test_expanded_variant_layer import make_base


def parent(question: str, answer: str) -> dict:
    p = copy.deepcopy(make_base()[0])
    p["question"] = question
    p["answer"] = answer
    p["choices"] = []
    p["figure_refs"] = []
    return p


def main() -> None:
    p = parent("x²+6x+9を因数分解しなさい。", "(x+3)²")
    rows, ev, reason = generate(p, 3)
    assert reason == "perfect_square_factorization_exact"
    assert len(rows) == len(ev) == 3
    assert len({tuple(r["numeric_signature"]) for r in rows}) == 3
    assert all(r["question"] != p["question"] for r in rows)
    assert all("PASS" in e["independent_check"] for e in ev)

    neg = parent("x²-10x+25を因数分解しなさい。", "(x-5)²")
    assert len(generate(neg, 1)[0]) == 1

    wrong = parent("x²+6x+9を因数分解しなさい。", "(x+4)²")
    assert generate(wrong, 1)[0] == []

    fig = parent("x²+6x+9を因数分解しなさい。", "(x+3)²")
    fig["figure_refs"] = ["figure.png"]
    assert generate(fig, 1)[0] == []

    choice = parent("x²+6x+9を因数分解しなさい。", "(x+3)²")
    choice["choices"] = ["A", "B"]
    assert generate(choice, 1)[0] == []
    print("PASS_SAFE_PERFECT_SQUARE_FACTORIZATION_VARIANT_ENGINE")


if __name__ == "__main__":
    main()
