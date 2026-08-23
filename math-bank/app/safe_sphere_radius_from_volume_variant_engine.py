from __future__ import annotations

"""Fail-closed exact engine for sphere radius from volume with pi=3.14."""

from decimal import Decimal, InvalidOperation
import hashlib, json, re

VOLUME_RE = re.compile(r"(?:体積(?:が|は)?\s*)(?P<volume>\d+(?:\.\d+)?)\s*(?:cm³|cm\^3|cm3|㎤)")
ANSWER_RE = re.compile(r"^(?P<radius>\d+)\s*cm$")
PI = Decimal("3.14")


def _norm(v: object) -> str:
    return str(v or "").replace("　", " ").replace("ｃｍ", "cm").replace("ＣＭ", "cm").replace("㎤", "cm³")


def _sha(parent: dict) -> str:
    return hashlib.sha256(json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode()).hexdigest()


def _fmt(v: Decimal) -> str:
    s = format(v, "f")
    return s.rstrip("0").rstrip(".") if "." in s else s


def _exact_integer_cube_root(n: int) -> int | None:
    if n <= 0:
        return None
    r = round(n ** (1 / 3))
    for candidate in range(max(1, r - 2), r + 3):
        if candidate ** 3 == n:
            return candidate
    return None


def _parse_parent(parent: dict):
    if parent.get("figure_refs") or parent.get("choices"):
        return None
    q = _norm(parent.get("question"))
    if "球" not in q or "体積" not in q or "半径" not in q or "円周率" not in q or "3.14" not in q:
        return None
    if not any(t in q for t in ("半径を求", "半径は何", "半径はなん")):
        return None
    blocked = ("直径", "表面積", "半球", "円柱", "円すい", "円錐", "図", "グラフ", "mm", "km")
    if any(t in q for t in blocked):
        return None
    ms = list(VOLUME_RE.finditer(q))
    if len(ms) != 1:
        return None
    m = ms[0]
    try:
        volume = Decimal(m.group("volume"))
    except InvalidOperation:
        return None
    if volume <= 0:
        return None
    cube = volume * Decimal(3) / (Decimal(4) * PI)
    if cube != cube.to_integral_value():
        return None
    r = _exact_integer_cube_root(int(cube))
    if r is None or r % 3 != 0:
        return None
    am = ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ", ""))
    if am is None or int(am.group("radius")) != r:
        return None
    if volume * Decimal(3) != Decimal(4) * PI * Decimal(r ** 3):
        return None
    return m, volume, r


def can_generate(parent: dict):
    if _parse_parent(parent) is not None:
        return True, "sphere_volume_to_integer_radius_pi_3_14_exact"
    if parent.get("figure_refs"):
        return False, "figure_parent"
    if parent.get("choices"):
        return False, "choice_parent"
    return False, "sphere_radius_from_volume_parent_not_exactly_parsed_and_verified"


def _variant_radius(seed: int, index: int) -> int:
    base = 3 + ((seed >> (index * 6)) + index * 7) % 18
    return base + (-base) % 3


def generate(parent: dict, count: int):
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    parsed = _parse_parent(parent)
    if parsed is None:
        ok, reason = can_generate(parent)
        assert not ok
        return [], [], reason
    match, parent_volume, parent_r = parsed
    q = _norm(parent.get("question"))
    seed = int(_sha(parent)[:12], 16)
    seen = set()
    rows, evidence = [], []
    for index in range(1, count + 1):
        r = _variant_radius(seed, index)
        while r == parent_r or r in seen:
            r += 3
        seen.add(r)
        volume = Decimal(4) * PI * Decimal(r ** 3 // 3)
        cube = volume * Decimal(3) / (Decimal(4) * PI)
        if cube != Decimal(r ** 3) or _exact_integer_cube_root(int(cube)) != r:
            raise AssertionError("sphere radius volume identity failed")
        repl = f"体積が{_fmt(volume)}cm³"
        nq = q[:match.start()] + repl + q[match.end():]
        rows.append({"question": nq, "answer": f"{r}cm", "explanation": f"半径³=3×体積÷(4×円周率)より、3×{_fmt(volume)}÷(4×3.14)={r**3}。したがって半径は{r}cm。4/3×3.14×{r}³でも再確認済み。", "numeric_signature": (_fmt(volume), "3", "4", "3.14")})
        evidence.append({"parent_sha256": _sha(parent), "method": "sphere_radius_from_volume_exact_division_cube_root_and_recomposition", "parent_recalculation": f"3×{_fmt(parent_volume)}÷(4×3.14)={parent_r**3}; radius={parent_r}cm", "variant_recalculation": f"3×{_fmt(volume)}÷(4×3.14)={r**3}; radius={r}cm", "independent_check": f"4/3×3.14×{r}³={_fmt(volume)}cm³ PASS"})
    return rows, evidence, "sphere_volume_to_integer_radius_pi_3_14_exact"
