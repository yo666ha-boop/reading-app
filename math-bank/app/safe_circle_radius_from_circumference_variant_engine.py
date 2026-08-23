from __future__ import annotations

"""Fail-closed exact engine for radius-from-circumference circle parents."""

from decimal import Decimal, InvalidOperation
import hashlib, json, re

CIRC_RE = re.compile(r"(?:円周の長さ|円の周の長さ|周の長さ)\s*(?:は|が|=|：|:)??\s*(?P<c>\d+(?:\.\d+)?)\s*cm")
ANSWER_RE = re.compile(r"^(?P<r>\d+(?:\.\d+)?)\s*cm$")
PI = Decimal("3.14")


def _norm(v: object) -> str:
    return str(v or "").replace("　", " ").replace("ｃｍ", "cm").replace("ＣＭ", "cm")


def _sha(parent: dict) -> str:
    raw=json.dumps(parent,ensure_ascii=False,sort_keys=True,separators=(",",":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _fmt(v: Decimal) -> str:
    s=format(v,"f")
    return s.rstrip("0").rstrip(".") if "." in s else s


def _parse_parent(parent: dict):
    if parent.get("figure_refs") or parent.get("choices"):
        return None
    q=_norm(parent.get("question"))
    if "円" not in q or "円周率" not in q or "3.14" not in q or "半径" not in q or "求" not in q:
        return None
    blocked=("面積","直径を求","弧","扇形","おうぎ形","中心角","半円","四分円","図","グラフ","mm","km")
    if any(t in q for t in blocked):
        return None
    matches=list(CIRC_RE.finditer(q))
    if len(matches)!=1:
        return None
    m=matches[0]
    try:
        c=Decimal(m.group("c"))
    except InvalidOperation:
        return None
    if c<=0:
        return None
    r=c/(Decimal(2)*PI)
    if r!=r.to_integral_value() or r<=0:
        return None
    am=ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ",""))
    if am is None:
        return None
    try:
        actual=Decimal(am.group("r"))
    except InvalidOperation:
        return None
    if actual!=r or Decimal(2)*PI*r!=c:
        return None
    return m,c,int(r)


def can_generate(parent: dict) -> tuple[bool,str]:
    if _parse_parent(parent) is not None:
        return True,"circle_radius_from_circumference_pi_3_14_exact"
    if parent.get("figure_refs"):
        return False,"figure_parent"
    if parent.get("choices"):
        return False,"choice_parent"
    return False,"circle_radius_from_circumference_parent_not_exactly_parsed_and_verified"


def generate(parent: dict,count: int) -> tuple[list[dict],list[dict],str]:
    if count not in (1,2,3):
        raise ValueError("count must be 1, 2, or 3")
    parsed=_parse_parent(parent)
    if parsed is None:
        return [],[],can_generate(parent)[1]
    match,parent_c,parent_r=parsed
    q=_norm(parent.get("question")); seed=int(_sha(parent)[:12],16)
    seen=set(); rows=[]; evidence=[]
    for index in range(1,count+1):
        r=2+((seed>>(index*5))+index*7)%18
        while r==parent_r or r in seen:
            r+=1
            if r>30: r=2
        seen.add(r)
        c=Decimal(2*r)*PI
        if c/(Decimal(2)*PI)!=Decimal(r) or Decimal(2)*PI*Decimal(r)!=c:
            raise AssertionError("circle radius inverse identity failed")
        new_q=q[:match.start()]+f"円周の長さ{_fmt(c)}cm"+q[match.end():]
        rows.append({"question":new_q,"answer":f"{r}cm","explanation":f"半径=円周÷(2×円周率)より、{_fmt(c)}÷(2×3.14)={r}cm。円周へ戻して再確認済み。","numeric_signature":(_fmt(c),"3.14")})
        evidence.append({"parent_sha256":_sha(parent),"method":"circle_radius_from_circumference_exact_division_and_recomposition","parent_recalculation":f"{_fmt(parent_c)}÷(2×3.14)={parent_r}cm","variant_recalculation":f"{_fmt(c)}÷(2×3.14)={r}cm","independent_check":"radius*2*3.14 == circumference PASS"})
    return rows,evidence,"circle_radius_from_circumference_pi_3_14_exact"
