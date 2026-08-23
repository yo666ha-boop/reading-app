from __future__ import annotations
import hashlib, json, re

ANGLE_RE = re.compile(r"(?P<deg>\d+)\s*(?:°|度)")
ANSWER_RE = re.compile(r"^(?P<n>\d+)\s*角形$")

def _norm(v):
    return str(v or "").replace("　", " ")

def _sha(parent):
    raw=json.dumps(parent,ensure_ascii=False,sort_keys=True,separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()

def _parse(parent):
    if parent.get("figure_refs") or parent.get("choices"):
        return None
    q=_norm(parent.get("question"))
    if "正多角形" not in q or "外角" not in q:
        return None
    if not any(t in q for t in ("何角形","何角形か","何角形ですか","何角形でしょう")):
        return None
    blocked=("外角の和","内角","対角線","相似","合同","証明","図")
    if any(t in q for t in blocked):
        return None
    ms=list(ANGLE_RE.finditer(q))
    if len(ms)!=1:
        return None
    m=ms[0]; angle=int(m.group("deg"))
    if not 1 <= angle < 180 or 360 % angle != 0:
        return None
    n=360//angle
    if not 3 <= n <= 30:
        return None
    am=ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ",""))
    if am is None or int(am.group("n"))!=n:
        return None
    if angle*n != 360:
        return None
    interior=180-angle
    if interior+angle != 180:
        return None
    return m,angle,n,interior

def can_generate(parent):
    if _parse(parent) is not None:
        return True,"regular_polygon_sides_from_single_exterior_angle_exact"
    if parent.get("figure_refs"):
        return False,"figure_parent"
    if parent.get("choices"):
        return False,"choice_parent"
    return False,"regular_polygon_sides_from_exterior_angle_parent_not_exactly_parsed_and_verified"

def generate(parent,count):
    if count not in (1,2,3):
        raise ValueError("count must be 1, 2, or 3")
    parsed=_parse(parent)
    if parsed is None:
        ok,reason=can_generate(parent); assert not ok
        return [],[],reason
    match,parent_angle,parent_n,parent_interior=parsed
    q=_norm(parent.get("question")); seed=int(_sha(parent)[:12],16)
    ns=(3,4,5,6,8,9,10,12,15,18,20,24,30)
    valid=[n for n in ns if 360%n==0 and n!=parent_n]
    seen=set(); rows=[]; evidence=[]
    for index in range(1,count+1):
        n=valid[((seed>>(index*4))+index*7)%len(valid)]
        pos=0
        while n in seen:
            pos+=1; n=valid[(valid.index(n)+pos)%len(valid)]
        seen.add(n)
        angle=360//n; interior=180-angle
        if 360//angle != n or angle*n != 360 or interior+angle != 180:
            raise AssertionError("regular polygon sides-from-exterior-angle identity failed")
        nq=q[:match.start("deg")]+str(angle)+q[match.end("deg"):]
        rows.append({"question":nq,"answer":f"{n}角形","explanation":f"正多角形の外角の和は360°。1つの外角が{angle}°なので、辺の数は360÷{angle}={n}。内角{interior}°との和も180°。","numeric_signature":(str(angle),)})
        evidence.append({"parent_sha256":_sha(parent),"method":"regular_polygon_sides_from_exterior_angle_exact_division_and_recomposition","parent_recalculation":f"360÷{parent_angle}={parent_n}; {parent_angle}×{parent_n}=360","variant_recalculation":f"360÷{angle}={n}; {angle}×{n}=360","independent_check":f"{angle}×{n}=360 AND {interior}+{angle}=180 PASS"})
    return rows,evidence,"regular_polygon_sides_from_single_exterior_angle_exact"
