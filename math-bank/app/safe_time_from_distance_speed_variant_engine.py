from __future__ import annotations

"""Fail-closed exact engine for integer hours from integer distance and km/h speed."""

import hashlib
import json
import re

SPEED_RE = re.compile(r"時速\s*(?P<speed>\d+)\s*km")
DIST_RE = re.compile(r"(?P<distance>\d+)\s*km")
ANSWER_RE = re.compile(r"^(?P<hours>\d+)\s*時間$")


def _norm(value: object) -> str:
    return str(value or "").replace("　", " ").replace("Ｋｍ", "km").replace("ｋｍ", "km")


def _sha(parent: dict) -> str:
    return hashlib.sha256(json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")).hexdigest()


def _parse_parent(parent: dict):
    if parent.get("figure_refs") or parent.get("choices"):
        return None
    q=_norm(parent.get("question"))
    if "時速" not in q or not any(t in q for t in ("何時間", "時間を求", "時間は")):
        return None
    blocked=("平均","往復","行き","帰り","途中","休憩","分","秒","秒速","分速","図","グラフ","追いつ","出会")
    if any(t in q for t in blocked): return None
    ss=list(SPEED_RE.finditer(q)); ds=list(DIST_RE.finditer(q))
    # DIST_RE also sees the km in the speed phrase, so retain only distances not inside the speed match.
    if len(ss)!=1: return None
    sm=ss[0]
    ds=[m for m in ds if not (sm.start() <= m.start() < sm.end())]
    if len(ds)!=1: return None
    dm=ds[0]; speed=int(sm.group("speed")); distance=int(dm.group("distance"))
    if speed<=0 or distance<=0 or distance%speed: return None
    hours=distance//speed
    am=ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ",""))
    if am is None or int(am.group("hours"))!=hours: return None
    if speed*hours!=distance or distance//hours!=speed: return None
    return sm,dm,speed,distance,hours


def can_generate(parent: dict):
    if _parse_parent(parent) is not None: return True,"time_from_distance_speed_exact"
    if parent.get("figure_refs"): return False,"figure_parent"
    if parent.get("choices"): return False,"choice_parent"
    return False,"time_from_distance_speed_parent_not_exactly_parsed_and_verified"


def generate(parent: dict,count:int):
    if count not in (1,2,3): raise ValueError("count must be 1, 2, or 3")
    parsed=_parse_parent(parent)
    if parsed is None:
        ok,reason=can_generate(parent); assert not ok; return [],[],reason
    sm,dm,parent_speed,parent_distance,parent_hours=parsed
    q=_norm(parent.get("question")); seed=int(_sha(parent)[:12],16); seen=set(); rows=[]; evidence=[]
    for index in range(1,count+1):
        speed=20+5*(((seed>>(index*5))+index*7)%17); hours=1+((seed>>(index*7+2))+index*3)%6; distance=speed*hours; sig=(speed,distance)
        while sig==(parent_speed,parent_distance) or sig in seen:
            hours+=1; distance=speed*hours; sig=(speed,distance)
        seen.add(sig)
        if distance//speed!=hours or speed*hours!=distance: raise AssertionError("time inverse identity failed")
        new_q=q
        for start,end,repl in sorted([(sm.start(),sm.end(),f"時速{speed}km"),(dm.start(),dm.end(),f"{distance}km")],reverse=True): new_q=new_q[:start]+repl+new_q[end:]
        rows.append({"question":new_q,"answer":f"{hours}時間","explanation":f"時間=道のり÷速さより、{distance}÷{speed}={hours}時間。{speed}×{hours}={distance}kmでも確認済み。","numeric_signature":(str(speed),str(distance))})
        evidence.append({"parent_sha256":_sha(parent),"method":"time_from_distance_speed_exact_division_and_product_recomposition","parent_recalculation":f"{parent_distance}÷{parent_speed}={parent_hours}時間","variant_recalculation":f"{distance}÷{speed}={hours}時間","independent_check":"distance/speed == time AND speed*time == distance PASS"})
    return rows,evidence,"time_from_distance_speed_exact"
