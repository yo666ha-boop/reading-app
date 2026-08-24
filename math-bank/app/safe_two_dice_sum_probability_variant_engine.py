from __future__ import annotations

"""Fail-closed exact engine for narrow two-fair-dice probability families."""
import hashlib
import json
import re
from fractions import Fraction
from safe_two_dice_difference_probability_variant_engine import generate as generate_difference_probability
from safe_two_dice_product_probability_variant_engine import generate as generate_product_probability

DICE_RE = re.compile(r"(?:2|二)\s*(?:個|つ)\s*の?\s*(?:サイコロ|さいころ)")
SUM_RE = re.compile(r"(?:出た目(?:の)?|目(?:の)?)?\s*和(?:が|は)\s*(?P<sum>\d+)\s*(?:に)?なる")
ANSWER_RE = re.compile(r"^(?:P\s*=\s*)?(?P<p>\d+\s*/\s*\d+|0|1)$", re.IGNORECASE)
BLOCKED_RE = re.compile(r"積|差|大きい|小さい|以上|以下|未満|より|少なくとも|高々|同じ目|ぞろ目|偶数|奇数|最大|最小|場合の数|期待値|3\s*(?:個|つ)\s*の?\s*(?:サイコロ|さいころ)")

def _norm(value: object) -> str:
    return str(value or "").replace("　", " ").replace("／", "/").replace("＝", "=")

def _parent_sha(parent: dict) -> str:
    raw = json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()

def _parse_answer(value: object) -> Fraction | None:
    text = _norm(value).replace(" ", "")
    m = ANSWER_RE.fullmatch(text)
    if not m:return None
    try:return Fraction(m.group("p"))
    except (ValueError, ZeroDivisionError):return None

def _favorable_count(target_sum: int) -> int:
    return sum(1 for a in range(1, 7) for b in range(1, 7) if a + b == target_sum)

def _parse_parent(parent: dict):
    if parent.get("figure_refs") or parent.get("choices"):return None
    q = _norm(parent.get("question"))
    if BLOCKED_RE.search(q):return None
    dice_matches = list(DICE_RE.finditer(q));sum_matches = list(SUM_RE.finditer(q))
    if len(dice_matches) != 1 or len(sum_matches) != 1 or "確率" not in q:return None
    target_sum = int(sum_matches[0].group("sum"))
    if not 2 <= target_sum <= 12:return None
    favorable = _favorable_count(target_sum);expected_count = 6 - abs(7 - target_sum)
    if favorable != expected_count or favorable <= 0:return None
    expected = Fraction(favorable, 36);stated = _parse_answer(parent.get("answer"))
    if stated is None or stated != expected:return None
    return {"question": q,"sum_match": sum_matches[0],"target_sum": target_sum,"favorable": favorable,"expected": expected}

def can_generate(parent: dict) -> tuple[bool, str]:
    rows,_,reason=generate_difference_probability(parent,1)
    if rows:return True,reason
    rows,_,reason=generate_product_probability(parent,1)
    if rows:return True,reason
    if _parse_parent(parent) is not None:return True, "two_fair_dice_sum_exact_36_outcomes"
    if parent.get("figure_refs"):return False, "figure_parent"
    if parent.get("choices"):return False, "choice_parent"
    return False, "two_dice_sum_probability_parent_not_exactly_parsed_and_verified"

def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):raise ValueError("count must be 1, 2, or 3")
    rows,evidence,reason=generate_difference_probability(parent,count)
    if rows:return rows,evidence,reason
    rows,evidence,reason=generate_product_probability(parent,count)
    if rows:return rows,evidence,reason
    parsed = _parse_parent(parent)
    if parsed is None:
        ok, reason = can_generate(parent);assert not ok
        return [], [], reason
    q = parsed["question"];seed = int(_parent_sha(parent)[:12], 16);parent_sum = parsed["target_sum"]
    seen=set();rows=[];evidence=[]
    candidates = [2 + ((seed + 3 * i) % 11) for i in range(1, 20)] + list(range(2, 13));targets=[]
    for s in candidates:
        if s == parent_sum or s in seen:continue
        seen.add(s);targets.append(s)
        if len(targets) == count:break
    if len(targets) != count:raise AssertionError("insufficient distinct two-dice sum targets")
    m = parsed["sum_match"]
    for target_sum in targets:
        favorable = _favorable_count(target_sum);triangular_count = 6 - abs(7 - target_sum)
        if favorable != triangular_count:raise AssertionError("two-dice triangular count identity failed")
        probability = Fraction(favorable, 36);new_question = q[:m.start("sum")] + str(target_sum) + q[m.end("sum"):]
        rows.append({"question": new_question,"answer": str(probability),"explanation": f"2個のサイコロの出方36通りを数えると、和が{target_sum}になるのは{favorable}通り。確率は{favorable}/36={probability}。","numeric_signature": (2, target_sum)})
        evidence.append({"parent_sha256": _parent_sha(parent),"method": "two_fair_dice_sum_exhaustive_36_and_triangular_identity","parent_recalculation": f"enumerated favorable={parsed['favorable']}/36 => {parsed['expected']}","variant_recalculation": f"enumerated favorable={favorable}/36 => {probability}","independent_check": f"favorable_count == 6-abs(7-{target_sum}) == {triangular_count} PASS"})
    return rows, evidence, "two_fair_dice_sum_exact_36_outcomes"
