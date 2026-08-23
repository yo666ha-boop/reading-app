from __future__ import annotations

"""Fail-closed exact engine for a rectangle missing side from area and one known side."""

import hashlib
import json
import re

KNOWN_RE = re.compile(r"(?P<label>たて|縦|よこ|横)\s*(?P<known>\d+)\s*(?P<unit>mm|cm|m)")
AREA_RE = re.compile(r"面積\s*(?:が|は)?\s*(?P<area>\d+)\s*(?P<unit>mm|cm|m)(?:²|\^2|2)")
ANSWER_RE = re.compile(r"^(?P<missing>\d+)\s*(?P<unit>mm|cm|m)$")


def _norm(value: object) -> str:
    return str(value or "").replace("　", " ").replace("㎠", "cm²").replace("㎡", "m²").replace("㎟", "mm²")


def _sha(parent: dict) -> str:
    return hashlib.sha256(json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")).hexdigest()


def _parse_parent(parent: dict):
    if parent.get("figure_refs") or parent.get("choices"):
        return None
    q = _norm(parent.get("question"))
    if "長方形" not in q or "面積" not in q or "長さ" not in q or "求" not in q:
        return None
    blocked = ("周", "周囲", "正方形", "対角線", "複合", "図", "グラフ")
    if any(token in q for token in blocked):
        return None
    kms = list(KNOWN_RE.finditer(q))
    ams = list(AREA_RE.finditer(q))
    if len(kms) != 1 or len(ams) != 1:
        return None
    km, ar = kms[0], ams[0]
    known = int(km.group("known")); area = int(ar.group("area")); unit = km.group("unit")
    if unit != ar.group("unit") or known <= 0 or area <= 0 or area % known:
        return None
    label = km.group("label")
    target_vertical = any(token in q for token in ("たての長さ", "縦の長さ"))
    target_horizontal = any(token in q for token in ("よこの長さ", "横の長さ"))
    if target_vertical == target_horizontal:
        return None
    known_vertical = label in ("たて", "縦")
    if known_vertical == target_vertical:
        return None
    missing = area // known
    ans = ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ", ""))
    if ans is None or ans.group("unit") != unit or int(ans.group("missing")) != missing:
        return None
    if known * missing != area or area // missing != known:
        return None
    return km, ar, known, missing, area, unit, target_vertical


def can_generate(parent: dict) -> tuple[bool, str]:
    if _parse_parent(parent) is not None:
        return True, "rectangle_missing_side_from_area_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices"):
        return False, "choice_parent"
    return False, "rectangle_missing_side_parent_not_exactly_parsed_and_verified"


def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    parsed = _parse_parent(parent)
    if parsed is None:
        ok, reason = can_generate(parent)
        assert not ok
        return [], [], reason
    km, ar, parent_known, parent_missing, parent_area, unit, target_vertical = parsed
    q = _norm(parent.get("question")); seed = int(_sha(parent)[:12], 16)
    seen: set[tuple[int, int]] = set(); rows=[]; evidence=[]
    for index in range(1, count + 1):
        known = 2 + ((seed >> (index * 5)) + index * 3) % 12
        missing = 3 + ((seed >> (index * 7 + 2)) + index * 5) % 14
        sig=(known,missing)
        while sig == (parent_known,parent_missing) or sig in seen:
            missing += 1; sig=(known,missing)
        seen.add(sig); area=known*missing
        if area // known != missing or area // missing != known:
            raise AssertionError("rectangle side inverse identity failed")
        known_label = "横" if target_vertical else "たて"
        replacements=[(km.start(),km.end(),f"{known_label}{known}{unit}"),(ar.start(),ar.end(),f"面積{area}{unit}²")]
        new_q=q
        for start,end,repl in sorted(replacements,reverse=True):
            new_q=new_q[:start]+repl+new_q[end:]
        rows.append({"question":new_q,"answer":f"{missing}{unit}","explanation":f"求める辺=面積÷分かっている辺より、{area}÷{known}={missing}{unit}。{known}×{missing}={area}{unit}²でも確認済み。","numeric_signature":(str(known),str(area))})
        evidence.append({"parent_sha256":_sha(parent),"method":"rectangle_missing_side_from_area_exact_division_and_product_recomposition","parent_recalculation":f"{parent_area}÷{parent_known}={parent_missing}{unit}","variant_recalculation":f"{area}÷{known}={missing}{unit}","independent_check":"area/known == missing AND known*missing == area PASS"})
    return rows,evidence,"rectangle_missing_side_from_area_exact"
