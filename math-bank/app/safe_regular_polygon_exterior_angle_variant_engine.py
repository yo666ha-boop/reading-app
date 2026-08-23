from __future__ import annotations
import hashlib, json, re

N_RE = re.compile(r"(?P<n>\d+)\s*角形")
ANSWER_RE = re.compile(r"^(?P<deg>\d+)\s*(?:°|度)$")

def _norm(v):
    return str(v or "").replace("　", " ")

def _sha(parent):
    raw=json.dumps(parent,ensure_ascii=False,sort_keys=True,separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()

def _parse(parent):
    if parent.get("figure_refs") or parent.get("choices"):
        return None
    q=_norm(parent.get("question"))
    if "正" not in q or "角形" not in q or "外角" not in q:
        return None
    if not any(t in q for t in ("1つの外角","一つの外角","外角の大きさ")):
        return None
    blocked=("外角の和","内角","対角線","相似","合同","証明","図")
    if any(t in q for t in blocked):
        return None
    ms=list(N_RE.finditer(q))
    if len(ms)!=1:
        return None
    m=ms[0]; n=int(m.group("n"))
    if not 3 <= n <= 30 or 360 % n != 0:
        return None
    angle=360//n
    am=ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ",""))
    if am is None or int(am.group("deg"))!=angle:
        return None
    if angle*n != 360:
        return None
    interior=180-angle
    if interior+angle != 180:
        return None
    return m,n,angle,interior

def can_generate(parent):
    if _parse(parent) is not None:
        return True,"regular_polygon_single_exterior_angle_exact"
    if parent.get("figure_refs"):
        return False,"figure_parent"
    if parent.get("choices"):
        return False,"choice_parent"
    return False,"regular_polygon_exterior_angle_parent_not_exactly_parsed_and_verified"

def generate(parent,count):
    if count not in (1,2,3):
        raise ValueError("count must be 1, 2, or 3")
    parsed=_parse(parent)
    if parsed is None:
        ok,reason=can_generate(parent); assert not ok
        return [],[],reason
    match,parent_n,parent_angle,parent_interior=parsed
    q=_norm(parent.get("question")); seed=int(_sha(parent)[:12],16)
    candidates=(3,4,5,6,8,9,10,12,15,18,20,24,30)
    valid=[n for n in candidates if 360%n==0 and n!=parent_n]
    seen=set(); rows=[]; evidence=[]
    for index in range(1,count+1):
        n=valid[((seed>>(index*4))+index*7)%len(valid)]
        pos=0
        while n in seen:
            pos+=1; n=valid[(valid.index(n)+pos)%len(valid)]
        seen.add(n)
        angle=360//n; interior=180-angle
        if angle*n != 360 or interior+angle != 180:
            raise AssertionError("regular polygon exterior angle identity failed")
        nq=q[:match.start("n")]+str(n)+q[match.end("n"):]
        rows.append({"question":nq,"answer":f"{angle}°","explanation":f"正{n}角形の外角はすべて等しく、外角の和は360°なので、1つの外角は360÷{n}={angle}°。内角{interior}°との和も180°。","numeric_signature":(str(n),)})
        evidence.append({"parent_sha256":_sha(parent),"method":"regular_polygon_exterior_sum_divided_by_n_and_supplement_identity","parent_recalculation":f"360÷{parent_n}={parent_angle}°; interior={parent_interior}°","variant_recalculation":f"360÷{n}={angle}°; interior={interior}°","independent_check":f"{angle}×{n}=360 AND {interior}+{angle}=180 PASS"})
    return rows,evidence,"regular_polygon_single_exterior_angle_exact"
