from __future__ import annotations

"""Fail-closed exact engine for speed from integer distance and integer hours."""

import hashlib
import json
import re

DIST_RE = re.compile(r"(?P<distance>\d+)\s*km")
TIME_RE = re.compile(r"(?P<hours>\d+)\s*時間")
ANSWER_RE = re.compile(r"^(?:時速\s*)?(?P<speed>\d+)\s*(?:km/h|km)$")


def _norm(value: object) -> str:
    return str(value or "").replace("　", " ").replace("Ｋｍ", "km").replace("ｋｍ", "km")


def _sha(parent: dict) -> str:
    return hashlib.sha256(json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")).hexdigest()


def _parse_parent(parent: dict):
    if parent.get("figure_refs") or parent.get("choices"):
        return None
    q=_norm(parent.get("question"))
    if "時間" not in q or not any(t in q for t in ("速さ", "時速何", "時速を")):
        return None
    blocked=("平均","往復","行き","帰り","途中","休憩","分","秒","秒速","分速","図","グラフ","追いつ","出会")
    if any(t in q for t in blocked): return None
    ds=list(DIST_RE.finditer(q)); ts=list(TIME_RE.finditer(q))
    # Exactly one distance and one duration; reject a stated speed in the question.
    if len(ds)!=1 or len(ts)!=1 or "時速" in q and "時速何" not in q and "時速を" not in q:
        return None
    dm,tm=ds[0],ts[0]; distance=int(dm.group("distance")); hours=int(tm.group("hours"))
    if distance<=0 or hours<=0 or distance%hours: return None
    speed=distance//hours
    am=ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ",""))
    if am is None or int(am.group("speed"))!=speed: return None
    if speed*hours!=distance or distance//speed!=hours: return None
    return dm,tm,distance,hours,speed


def can_generate(parent: dict):
    if _parse_parent(parent) is not None: return True,"speed_from_distance_time_exact"
    if parent.get("figure_refs"): return False,"figure_parent"
    if parent.get("choices"): return False,"choice_parent"
    return False,"speed_from_distance_time_parent_not_exactly_parsed_and_verified"


def generate(parent: dict,count:int):
    if count not in (1,2,3): raise ValueError("count must be 1, 2, or 3")
    parsed=_parse_parent(parent)
    if parsed is None:
        ok,reason=can_generate(parent); assert not ok; return [],[],reason
    dm,tm,parent_distance,parent_hours,parent_speed=parsed
    q=_norm(parent.get("question")); seed=int(_sha(parent)[:12],16); seen=set(); rows=[]; evidence=[]
    for index in range(1,count+1):
        speed=20+5*(((seed>>(index*5))+index*7)%17); hours=1+((seed>>(index*7+2))+index*3)%6; distance=speed*hours; sig=(distance,hours)
        while sig==(parent_distance,parent_hours) or sig in seen:
            speed+=5; distance=speed*hours; sig=(distance,hours)
        seen.add(sig)
        if distance//hours!=speed or speed*hours!=distance: raise AssertionError("speed inverse identity failed")
        new_q=q
        for start,end,repl in sorted([(dm.start(),dm.end(),f"{distance}km"),(tm.start(),tm.end(),f"{hours}時間")],reverse=True): new_q=new_q[:start]+repl+new_q[end:]
        rows.append({"question":new_q,"answer":f"{speed}km/h","explanation":f"速さ=道のり÷時間より、{distance}÷{hours}={speed}km/h。{speed}×{hours}={distance}kmでも確認済み。","numeric_signature":(str(distance),str(hours))})
        evidence.append({"parent_sha256":_sha(parent),"method":"speed_from_distance_time_exact_division_and_product_recomposition","parent_recalculation":f"{parent_distance}÷{parent_hours}={parent_speed}km/h","variant_recalculation":f"{distance}÷{hours}={speed}km/h","independent_check":"distance/time == speed AND speed*time == distance PASS"})
    return rows,evidence,"speed_from_distance_time_exact"
