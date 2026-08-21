from __future__ import annotations

"""Fail-closed exact engine for a narrow speed-distance parent shape.

Only actual parents that explicitly state one integer speed in km/h and one
integer duration in hours, ask only for the travelled distance in km, and have
an exactly verified integer answer are accepted. Parent and generated answers
are recalculated by distance=speed*time and independently checked by both
inverse identities distance/time=speed and distance/speed=time. Unit conversion,
minutes/seconds, average speed, round trips, figures and choices fail closed.
"""

import hashlib
import json
import re

SPEED_TIME_RE = re.compile(
    r"時速\s*(?P<speed>\d+)\s*km\s*(?:で|の速さで).*?(?P<time>\d+)\s*時間"
)
ANSWER_RE = re.compile(r"^(?P<distance>\d+)\s*km$")


def _norm(value: object) -> str:
    return str(value or "").replace("　", " ").replace("Ｋｍ", "km").replace("ｋｍ", "km")


def _parent_sha(parent: dict) -> str:
    raw = json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _parse_parent(parent: dict):
    if parent.get("figure_refs"):
        return None
    if parent.get("choices") is not None:
        return None
    q = _norm(parent.get("question"))
    if "時速" not in q or "時間" not in q or not any(token in q for token in ("道のり", "距離", "何km", "何 km")):
        return None
    blocked = (
        "分", "秒", "平均", "往復", "行き", "帰り", "途中", "休憩", "速さを", "時間を",
        "何時間", "何分", "秒速", "分速", "m/", "図", "グラフ", "列車の長さ", "追いつ", "出会",
    )
    if any(token in q for token in blocked):
        return None
    matches = list(SPEED_TIME_RE.finditer(q))
    if len(matches) != 1:
        return None
    m = matches[0]
    speed = int(m.group("speed"))
    hours = int(m.group("time"))
    if speed <= 0 or hours <= 0:
        return None
    distance = speed * hours
    am = ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ", ""))
    if am is None or int(am.group("distance")) != distance:
        return None
    if distance // hours != speed or distance % hours != 0:
        return None
    if distance // speed != hours or distance % speed != 0:
        return None
    return m, speed, hours, distance


def can_generate(parent: dict) -> tuple[bool, str]:
    if _parse_parent(parent) is not None:
        return True, "speed_kmh_integer_hours_distance_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices") is not None:
        return False, "choice_parent"
    return False, "speed_distance_parent_not_exactly_parsed_and_verified"


def _variant_numbers(seed: int, index: int) -> tuple[int, int]:
    speed = 20 + 5 * (((seed >> (index * 5)) + index * 7) % 17)
    hours = 1 + ((seed >> (index * 7 + 2)) + index * 3) % 6
    return speed, hours


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    parsed = _parse_parent(parent)
    if parsed is None:
        ok, reason = can_generate(parent)
        assert not ok
        return [], [], reason

    match, parent_speed, parent_hours, parent_distance = parsed
    q = _norm(parent.get("question"))
    seed = int(_parent_sha(parent)[:12], 16)
    parent_signature = (str(parent_speed), str(parent_hours))
    seen: set[tuple[str, str]] = set()
    rows: list[dict] = []
    evidence: list[dict] = []

    for index in range(1, count + 1):
        speed, hours = _variant_numbers(seed, index)
        signature = (str(speed), str(hours))
        bump = 0
        while signature == parent_signature or signature in seen:
            bump += 1
            speed += 5 * bump
            signature = (str(speed), str(hours))
        seen.add(signature)
        distance = speed * hours
        if distance / hours != speed or distance / speed != hours:
            raise AssertionError("speed-distance inverse identity failed")
        replacement = f"時速{speed}kmで{hours}時間"
        new_question = q[:match.start()] + replacement + q[match.end():]
        rows.append({
            "question": new_question,
            "answer": f"{distance}km",
            "explanation": f"道のり=速さ×時間より、{speed}×{hours}={distance}km。道のり÷時間=速さ、道のり÷速さ=時間でも確認済み。",
            "numeric_signature": signature,
        })
        evidence.append({
            "parent_sha256": _parent_sha(parent),
            "method": "speed_distance_exact_product_and_two_inverse_identities",
            "parent_recalculation": f"{parent_speed}×{parent_hours}={parent_distance}km",
            "variant_recalculation": f"{speed}×{hours}={distance}km",
            "independent_check": "distance/time == speed AND distance/speed == time PASS",
        })
    return rows, evidence, "speed_kmh_integer_hours_distance_exact"
