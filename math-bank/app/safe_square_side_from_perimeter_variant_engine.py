from __future__ import annotations

"""Fail-closed exact engine for text-only square perimeter -> side inverse parents."""

import hashlib
import json
import re

PERIMETER_RE = re.compile(r"(?:周の長さ|周りの長さ|まわりの長さ)\s*(?P<perimeter>\d+)\s*cm")
ANSWER_RE = re.compile(r"^(?P<side>\d+)\s*cm$")


def _norm(value: object) -> str:
    return str(value or "").replace("　", " ").replace("ｃｍ", "cm").replace("ＣＭ", "cm")


def _sha(parent: dict) -> str:
    raw=json.dumps(parent,ensure_ascii=False,sort_keys=True,separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _parse_parent(parent: dict):
    if parent.get("figure_refs") or parent.get("choices"):
        return None
    q=_norm(parent.get("question"))
    if "正方形" not in q or not any(t in q for t in ("周の長さ","周りの長さ","まわりの長さ")) or not any(t in q for t in ("1辺","一辺","辺の長さ")):
        return None
    blocked=("面積","対角線","図","mm","km","メートル")
    if any(t in q for t in blocked):
        return None
    matches=list(PERIMETER_RE.finditer(q))
    if len(matches)!=1:
        return None
    m=matches[0]; perimeter=int(m.group("perimeter"))
    if perimeter<=0 or perimeter%4:
        return None
    side=perimeter//4
    am=ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ",""))
    if am is None or int(am.group("side"))!=side:
        return None
    if side*4!=perimeter:
        return None
    return m,perimeter,side


def can_generate(parent: dict)->tuple[bool,str]:
    if _parse_parent(parent) is not None:
        return True,"square_side_from_perimeter_exact_division_by_four"
    if parent.get("figure_refs"):
        return False,"figure_parent"
    if parent.get("choices"):
        return False,"choice_parent"
    return False,"square_side_from_perimeter_parent_not_exactly_parsed_and_verified"


def generate(parent: dict,count:int)->tuple[list[dict],list[dict],str]:
    if count not in (1,2,3):
        raise ValueError("count must be 1, 2, or 3")
    parsed=_parse_parent(parent)
    if parsed is None:
        ok,reason=can_generate(parent); assert not ok
        return [],[],reason
    match,parent_perimeter,parent_side=parsed
    q=_norm(parent.get("question")); seed=int(_sha(parent)[:12],16)
    seen=set(); rows=[]; evidence=[]
    for index in range(1,count+1):
        side=2+((seed>>(index*5))+index*5)%25
        while side==parent_side or side in seen:
            side+=1
        seen.add(side); perimeter=4*side
        if perimeter%4 or perimeter//4!=side:
            raise AssertionError("square side-from-perimeter identity failed")
        repl=f"周の長さ{perimeter}cm"
        new_q=q[:match.start()]+repl+q[match.end():]
        rows.append({"question":new_q,"answer":f"{side}cm","explanation":f"正方形の1辺=周の長さ÷4より、{perimeter}÷4={side}cm。{side}×4={perimeter}cmでも確認済み。","numeric_signature":(str(perimeter),)})
        evidence.append({"parent_sha256":_sha(parent),"method":"square_side_from_perimeter_exact_division_and_recomposition","parent_recalculation":f"{parent_perimeter}÷4={parent_side}cm and {parent_side}×4={parent_perimeter}","variant_recalculation":f"{perimeter}÷4={side}cm and {side}×4={perimeter}","independent_check":"perimeter/4 == side AND side*4 == perimeter PASS"})
    return rows,evidence,"square_side_from_perimeter_exact_division_by_four"
