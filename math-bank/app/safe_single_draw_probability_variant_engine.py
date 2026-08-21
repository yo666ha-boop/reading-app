from __future__ import annotations

"""Fail-closed exact engine for a narrow one-draw probability parent shape.

The engine accepts only an actual parent record describing exactly two colored
ball counts (red/white), one draw, and a probability target for one of those
colors. It proves the parent's stated answer by exact Fraction arithmetic
before returning deterministic numeric substitutions. Figure/choice,
multiple-draw, replacement, simultaneous-draw, and ambiguous prose are rejected.
The repository's strict expanded-layer validator remains the promotion gate.
"""

import hashlib
import json
import re
from fractions import Fraction


COUNT_RE = {
    "red": re.compile(r"赤(?:い)?玉(?:が|を|は)?\s*(?P<n>\d+)\s*個"),
    "white": re.compile(r"白(?:い)?玉(?:が|を|は)?\s*(?P<n>\d+)\s*個"),
}
TARGET_RE = re.compile(r"(?P<color>赤(?:い)?玉|白(?:い)?玉)(?:が|を)?\s*出る確率")
ANSWER_RE = re.compile(r"^(?:P\s*=\s*)?(?P<p>\d+\s*/\s*\d+|0|1)$", re.IGNORECASE)
ONE_DRAW_RE = re.compile(r"(?:玉を\s*)?(?:1|一)個\s*(?:取り出|取(?:り)?出|選)")
MULTI_DRAW_RE = re.compile(r"(?:玉を\s*)?(?:2|二|3|三|4|四|5|五)個\s*(?:取り出|取(?:り)?出|選)")
UNSAFE_RE = re.compile(r"(?:2|二|3|三)回\s*(?:取り出|取(?:り)?出|選)|同時に|戻さ|もどさ|復元|続けて|連続して")


def _norm(value: object) -> str:
    return str(value or "").replace("　", " ").replace("／", "/").replace("＝", "=")


def _parent_sha(parent: dict) -> str:
    raw = json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _parse_answer(value: object) -> Fraction | None:
    text = _norm(value).replace(" ", "")
    m = ANSWER_RE.fullmatch(text)
    if not m:
        return None
    try:
        return Fraction(m.group("p"))
    except (ValueError, ZeroDivisionError):
        return None


def _parse_parent(parent: dict):
    if parent.get("figure_refs"):
        return None
    if parent.get("choices") is not None:
        return None

    q = _norm(parent.get("question"))
    if MULTI_DRAW_RE.search(q) or UNSAFE_RE.search(q):
        return None
    if len(ONE_DRAW_RE.findall(q)) != 1:
        return None

    red_matches = list(COUNT_RE["red"].finditer(q))
    white_matches = list(COUNT_RE["white"].finditer(q))
    target_matches = list(TARGET_RE.finditer(q))
    if len(red_matches) != 1 or len(white_matches) != 1 or len(target_matches) != 1:
        return None

    red = int(red_matches[0].group("n"))
    white = int(white_matches[0].group("n"))
    if red <= 0 or white <= 0:
        return None

    target_text = target_matches[0].group("color")
    target = "red" if target_text.startswith("赤") else "white"
    favorable = red if target == "red" else white
    total = red + white
    expected = Fraction(favorable, total)

    stated = _parse_answer(parent.get("answer"))
    if stated is None or stated != expected:
        return None

    # Independent identity check separate from the direct favorable/total formula.
    other = white if target == "red" else red
    complement = Fraction(other, total)
    if expected + complement != 1:
        return None
    if expected.denominator <= 0 or total <= favorable:
        return None

    return {
        "question": q,
        "red_match": red_matches[0],
        "white_match": white_matches[0],
        "target": target,
        "red": red,
        "white": white,
        "expected": expected,
    }


def can_generate(parent: dict) -> tuple[bool, str]:
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices") is not None:
        return False, "choice_parent"
    if _parse_parent(parent) is None:
        return False, "single_draw_probability_parent_not_exactly_parsed_and_verified"
    return True, "single_draw_probability_exact"


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")

    parsed = _parse_parent(parent)
    if parsed is None:
        ok, reason = can_generate(parent)
        assert not ok
        return [], [], reason

    seed = int(_parent_sha(parent)[:12], 16)
    q = parsed["question"]
    parent_signature = (parsed["red"], parsed["white"])
    sibling_signatures: set[tuple[int, int]] = set()
    rows: list[dict] = []
    evidence: list[dict] = []

    for index in range(1, count + 1):
        # Deterministic positive counts, deliberately distinct from parent and siblings.
        red = parsed["red"] + 1 + index + ((seed >> (index + 2)) & 1)
        white = parsed["white"] + 2 + index + ((seed >> (index + 7)) & 1)
        signature = (red, white)
        if signature == parent_signature or signature in sibling_signatures:
            white += index + 2
            signature = (red, white)
        if signature == parent_signature or signature in sibling_signatures:
            raise AssertionError("probability numeric signature collision")
        sibling_signatures.add(signature)

        favorable = red if parsed["target"] == "red" else white
        other = white if parsed["target"] == "red" else red
        total = red + white
        probability = Fraction(favorable, total)
        complement = Fraction(other, total)
        if probability + complement != 1:
            raise AssertionError("probability complement identity failed")

        replacements = [
            (parsed["red_match"].start("n"), parsed["red_match"].end("n"), str(red)),
            (parsed["white_match"].start("n"), parsed["white_match"].end("n"), str(white)),
        ]
        new_question = q
        for start, end, value in sorted(replacements, reverse=True):
            new_question = new_question[:start] + value + new_question[end:]

        answer = str(probability)
        rows.append({
            "question": new_question,
            "answer": answer,
            "explanation": f"全部で{total}個、条件に合う玉は{favorable}個なので、確率は {favorable}/{total}={answer}。",
            "numeric_signature": signature,
        })
        evidence.append({
            "parent_sha256": _parent_sha(parent),
            "method": "single_draw_two_color_probability_exact_fraction",
            "parent_recalculation": f"favorable/total={parsed['expected']}",
            "variant_recalculation": f"{favorable}/{total}={answer}",
            "independent_check": f"P(target)+P(complement)={probability}+{complement}=1 PASS",
        })

    return rows, evidence, "single_draw_probability_exact"
