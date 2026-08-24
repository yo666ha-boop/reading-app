from __future__ import annotations

"""Fail-closed exact engine for text-only cone surface-area families using pi=3.14."""
from decimal import Decimal, InvalidOperation
import hashlib
import json
import re
from safe_cone_radius_from_surface_area_variant_engine import generate as generate_radius_from_surface_area
from safe_cone_slant_from_surface_area_variant_engine import can_generate as can_generate_slant_from_surface_area, generate as generate_slant_from_surface_area

RADIUS_RE = re.compile(r"半径\s*(?P<radius>\d+)\s*cm")
SLANT_RE = re.compile(r"母線\s*(?:の長さ\s*)?(?P<slant>\d+)\s*cm")
ANSWER_RE = re.compile(r"^(?P<value>\d+(?:\.\d+)?)\s*(?:cm²|cm\^2|cm2)$")
PI = Decimal("3.14")

def _norm(value: object) -> str:
    return str(value or "").replace("　", " ").replace("ｃｍ", "cm").replace("ＣＭ", "cm").replace("㎠", "cm²")
def _sha(parent: dict) -> str:
    raw = json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8");return hashlib.sha256(raw).hexdigest()
def _fmt(value: Decimal) -> str:
    text = format(value, "f");return text.rstrip("0").rstrip(".") if "." in text else text
def _parse_parent(parent: dict):
    if parent.get("figure_refs") or parent.get("choices"):return None
    q = _norm(parent.get("question"))
    if not any(token in q for token in ("円すい", "円錐")) or "表面積" not in q or "円周率" not in q or "3.14" not in q:return None
    blocked = ("直径", "体積", "側面積を求", "底面積を求", "半径を求", "母線を求", "高さ", "円柱", "球", "図", "グラフ", "mm", "km")
    if any(token in q for token in blocked):return None
    if re.search(r"(?<!c)m(?:²|\^2|2)", q, re.IGNORECASE):return None
    radius_matches = list(RADIUS_RE.finditer(q));slant_matches = list(SLANT_RE.finditer(q))
    if len(radius_matches) != 1 or len(slant_matches) != 1:return None
    rm, lm = radius_matches[0], slant_matches[0];radius, slant = int(rm.group("radius")), int(lm.group("slant"))
    if radius <= 0 or slant <= 0 or slant < radius:return None
    expected = PI * Decimal(radius) * Decimal(radius + slant)
    am = ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ", ""))
    if am is None:return None
    try:actual = Decimal(am.group("value"))
    except InvalidOperation:return None
    if actual != expected:return None
    base = PI * Decimal(radius * radius);lateral = PI * Decimal(radius * slant)
    if base + lateral != expected or expected / (PI * Decimal(radius)) != Decimal(radius + slant):return None
    return rm, lm, radius, slant, expected

def can_generate(parent: dict) -> tuple[bool, str]:
    rows,_,reason=generate_radius_from_surface_area(parent,1)
    if rows:return True,reason
    inverse_ok, inverse_reason = can_generate_slant_from_surface_area(parent)
    if inverse_ok:return True, inverse_reason
    if _parse_parent(parent) is not None:return True, "cone_surface_area_pi_3_14_exact"
    if parent.get("figure_refs"):return False, "figure_parent"
    if parent.get("choices"):return False, "choice_parent"
    return False, "cone_surface_area_parent_not_exactly_parsed_and_verified"

def generate(parent: dict, count: int) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):raise ValueError("count must be 1, 2, or 3")
    rows,evidence,reason=generate_radius_from_surface_area(parent,count)
    if rows:return rows,evidence,reason
    inverse_rows, inverse_evidence, inverse_reason = generate_slant_from_surface_area(parent, count)
    if inverse_rows:return inverse_rows, inverse_evidence, inverse_reason
    parsed = _parse_parent(parent)
    if parsed is None:
        ok, reason = can_generate(parent);assert not ok
        return [], [], reason
    rm, lm, parent_radius, parent_slant, parent_value = parsed;q = _norm(parent.get("question"));seed = int(_sha(parent)[:12], 16)
    seen=set();rows=[];evidence=[]
    for index in range(1, count + 1):
        radius = 2 + ((seed >> (index * 5)) + index * 5) % 10;slant = radius + 2 + ((seed >> (index * 7 + 3)) + index * 7) % 12;sig = (radius, slant)
        while sig == (parent_radius, parent_slant) or sig in seen:slant += 1;sig = (radius, slant)
        seen.add(sig);value = PI * Decimal(radius) * Decimal(radius + slant);base = PI * Decimal(radius * radius);lateral = PI * Decimal(radius * slant)
        if base + lateral != value or value / (PI * Decimal(radius)) != Decimal(radius + slant):raise AssertionError("cone surface area identity failed")
        new_q = q
        for start, end, repl in sorted([(rm.start(), rm.end(), f"半径{radius}cm"), (lm.start(), lm.end(), f"母線{slant}cm")], reverse=True):new_q = new_q[:start] + repl + new_q[end:]
        rows.append({"question": new_q,"answer": f"{_fmt(value)}cm²","explanation": f"円すいの表面積=底面積+側面積=3.14×{radius}×{radius}+3.14×{radius}×{slant}={_fmt(value)}cm²。3.14×半径×(半径+母線)でも確認済み。","numeric_signature": (str(radius), str(slant), "3.14")})
        evidence.append({"parent_sha256": _sha(parent),"method": "cone_surface_area_exact_pi_r2_plus_pi_r_l_and_factored_identity","parent_recalculation": f"3.14×{parent_radius}×{parent_radius}+3.14×{parent_radius}×{parent_slant}={_fmt(parent_value)}cm²","variant_recalculation": f"3.14×{radius}×{radius}+3.14×{radius}×{slant}={_fmt(value)}cm²","independent_check": "pi*r^2 + pi*r*l == S AND S/(pi*r) == r+l PASS"})
    return rows, evidence, "cone_surface_area_pi_3_14_exact"
