from __future__ import annotations

"""Fail-closed exact engine for sphere radius from surface area with pi=3.14."""

from decimal import Decimal, InvalidOperation
import hashlib, json, re

AREA_RE = re.compile(r"(?:表面積(?:が|は)?\s*)(?P<area>\d+(?:\.\d+)?)\s*(?:cm²|cm\^2|cm2|㎠)")
ANSWER_RE = re.compile(r"^(?P<radius>\d+)\s*cm$")
PI = Decimal("3.14")


def _norm(v: object) -> str:
    return str(v or "").replace("　"," ").replace("ｃｍ","cm").replace("ＣＭ","cm").replace("㎠","cm²")

def _sha(parent: dict) -> str:
    return hashlib.sha256(json.dumps(parent,ensure_ascii=False,sort_keys=True,separators=(",",":")).encode()).hexdigest()

def _fmt(v: Decimal) -> str:
    s=format(v,"f"); return s.rstrip("0").rstrip(".") if "." in s else s

def _parse_parent(parent: dict):
    if parent.get("figure_refs") or parent.get("choices"): return None
    q=_norm(parent.get("question"))
    if "球" not in q or "表面積" not in q or "半径" not in q or "円周率" not in q or "3.14" not in q: return None
    if not any(t in q for t in ("半径を求","半径は何","半径はなん")): return None
    blocked=("直径","体積","半球","円柱","円すい","円錐","図","グラフ","mm","km")
    if any(t in q for t in blocked): return None
    ms=list(AREA_RE.finditer(q))
    if len(ms)!=1: return None
    m=ms[0]
    try: area=Decimal(m.group("area"))
    except InvalidOperation: return None
    if area<=0: return None
    square=area/(Decimal(4)*PI)
    if square!=square.to_integral_value(): return None
    n=int(square); r=int(n**0.5)
    if r<=0 or r*r!=n: return None
    am=ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ",""))
    if am is None or int(am.group("radius"))!=r: return None
    if Decimal(4)*PI*Decimal(r*r)!=area: return None
    return m,area,r

def can_generate(parent: dict):
    if _parse_parent(parent) is not None: return True,"sphere_surface_area_to_integer_radius_pi_3_14_exact"
    if parent.get("figure_refs"): return False,"figure_parent"
    if parent.get("choices"): return False,"choice_parent"
    return False,"sphere_radius_from_surface_area_parent_not_exactly_parsed_and_verified"

def _variant_radius(seed:int,index:int)->int:
    return 2+((seed>>(index*6))+index*7)%18

def generate(parent:dict,count:int):
    if count not in (1,2,3): raise ValueError("count must be 1, 2, or 3")
    parsed=_parse_parent(parent)
    if parsed is None:
        ok,reason=can_generate(parent); assert not ok; return [],[],reason
    match,parent_area,parent_r=parsed; q=_norm(parent.get("question")); seed=int(_sha(parent)[:12],16); seen=set(); rows=[]; evidence=[]
    for index in range(1,count+1):
        r=_variant_radius(seed,index)
        while r==parent_r or r in seen: r+=1
        seen.add(r); area=Decimal(4)*PI*Decimal(r*r)
        if area/(Decimal(4)*PI)!=Decimal(r*r): raise AssertionError("sphere radius surface identity failed")
        repl=f"表面積が{_fmt(area)}cm²"; nq=q[:match.start()]+repl+q[match.end():]
        rows.append({"question":nq,"answer":f"{r}cm","explanation":f"半径²=表面積÷(4×円周率)より、{_fmt(area)}÷(4×3.14)={r*r}。したがって半径は{r}cm。4×3.14×{r}×{r}でも再確認済み。","numeric_signature":(_fmt(area),"4","3.14")})
        evidence.append({"parent_sha256":_sha(parent),"method":"sphere_radius_from_surface_area_exact_division_square_root_and_recomposition","parent_recalculation":f"{_fmt(parent_area)}÷(4×3.14)={parent_r*parent_r}; radius={parent_r}cm","variant_recalculation":f"{_fmt(area)}÷(4×3.14)={r*r}; radius={r}cm","independent_check":f"4×3.14×{r}×{r}={_fmt(area)}cm² PASS"})
    return rows,evidence,"sphere_surface_area_to_integer_radius_pi_3_14_exact"
