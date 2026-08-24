from __future__ import annotations

"""Fail-closed exact engine for text-only square area -> side inverse parents."""

import hashlib
import json
import math
import re

AREA_RE = re.compile(r"面積\s*(?P<area>\d+)\s*(?:cm²|cm\^2|cm2|㎠)")
ANSWER_RE = re.compile(r"^(?P<side>\d+)\s*cm$")


def _norm(value: object) -> str:
    return str(value or "").replace("　", " ").replace("ｃｍ", "cm").replace("ＣＭ", "cm").replace("㎠", "cm²")


def _sha(parent: dict) -> str:
    raw=json.dumps(parent,ensure_ascii=False,sort_keys=True,separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _parse_parent(parent: dict):
    if parent.get("figure_refs") or parent.get("choices"):
        return None
    q=_norm(parent.get("question"))
    if "正方形" not in q or "面積" not in q or not any(t in q for t in ("1辺", "一辺", "辺の長さ")):
        return None
    blocked=("周の長さ","周りの長さ","まわりの長さ","対角線","図","mm","平方メートル")
    if any(t in q for t in blocked):
        return None
    if re.search(r"(?<!c)m(?:²|\^2|2)", q, re.IGNORECASE):
        return None
    matches=list(AREA_RE.finditer(q))
    if len(matches)!=1:
        return None
    m=matches[0]; area=int(m.group("area"))
    if area<=0:
        return None
    side=math.isqrt(area)
    if side*side!=area:
        return None
    am=ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ",""))
    if am is None or int(am.group("side"))!=side:
        return None
    if side*side!=area:
        return None
    return m,area,side


def can_generate(parent: dict)->tuple[bool,str]:
    if _parse_parent(parent) is not None:
        return True,"square_side_from_area_exact_integer_square_root"
    if parent.get("figure_refs"):
        return False,"figure_parent"
    if parent.get("choices"):
        return False,"choice_parent"
    return False,"square_side_from_area_parent_not_exactly_parsed_and_verified"


def generate(parent: dict,count:int)->tuple[list[dict],list[dict],str]:
    if count not in (1,2,3):
        raise ValueError("count must be 1, 2, or 3")
    parsed=_parse_parent(parent)
    if parsed is None:
        ok,reason=can_generate(parent); assert not ok
        return [],[],reason
    match,parent_area,parent_side=parsed
    q=_norm(parent.get("question")); seed=int(_sha(parent)[:12],16)
    seen=set(); rows=[]; evidence=[]
    for index in range(1,count+1):
        side=2+((seed>>(index*5))+index*7)%24
        while side==parent_side or side in seen:
            side+=1
        seen.add(side); area=side*side
        root=math.isqrt(area)
        if root*root!=area or root!=side:
            raise AssertionError("square side-from-area identity failed")
        repl=f"面積{area}cm²"
        new_q=q[:match.start()]+repl+q[match.end():]
        rows.append({"question":new_q,"answer":f"{side}cm","explanation":f"正方形の1辺は面積の正の平方根。√{area}={side}cm。{side}×{side}={area}cm²でも確認済み。","numeric_signature":(str(area),)})
        evidence.append({"parent_sha256":_sha(parent),"method":"square_side_from_area_exact_integer_square_root_and_recomposition","parent_recalculation":f"√{parent_area}={parent_side}cm and {parent_side}²={parent_area}","variant_recalculation":f"√{area}={side}cm and {side}²={area}","independent_check":"isqrt(area)^2 == area AND side^2 == area PASS"})
    return rows,evidence,"square_side_from_area_exact_integer_square_root"
