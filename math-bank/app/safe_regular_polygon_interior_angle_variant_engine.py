from __future__ import annotations
import hashlib, json, re
from safe_regular_polygon_exterior_angle_variant_engine import can_generate as can_generate_exterior, generate as generate_exterior
from safe_regular_polygon_sides_from_interior_angle_variant_engine import can_generate as can_generate_sides_from_interior, generate as generate_sides_from_interior

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
    if "正" not in q or "角形" not in q or "内角" not in q:
        return None
    if not any(t in q for t in ("1つの内角","一つの内角","内角の大きさ")):
        return None
    blocked=("内角の和","外角","対角線","相似","合同","証明","図")
    if any(t in q for t in blocked):
        return None
    ms=list(N_RE.finditer(q))
    if len(ms)!=1:
        return None
    m=ms[0]; n=int(m.group("n"))
    if not 3 <= n <= 30:
        return None
    total=(n-2)*180
    if total % n != 0:
        return None
    angle=total//n
    am=ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ",""))
    if am is None or int(am.group("deg"))!=angle:
        return None
    if angle*n != total:
        return None
    return m,n,total,angle

def _interior_failure_reason(parent):
    q=_norm(parent.get("question"))
    if "内角" in q:
        return "regular_polygon_interior_angle_parent_not_exactly_parsed_and_verified"
    return "regular_polygon_interior_or_exterior_angle_parent_not_exactly_parsed_and_verified"

def can_generate(parent):
    if _parse(parent) is not None:
        return True,"regular_polygon_single_interior_angle_exact"
    inverse_ok,inverse_reason=can_generate_sides_from_interior(parent)
    if inverse_ok:
        return True,inverse_reason
    ext_ok,ext_reason=can_generate_exterior(parent)
    if ext_ok:
        return True,ext_reason
    if parent.get("figure_refs"):
        return False,"figure_parent"
    if parent.get("choices"):
        return False,"choice_parent"
    return False,_interior_failure_reason(parent)

def generate(parent,count):
    if count not in (1,2,3):
        raise ValueError("count must be 1, 2, or 3")
    parsed=_parse(parent)
    if parsed is None:
        inverse_rows,inverse_evidence,inverse_reason=generate_sides_from_interior(parent,count)
        if inverse_rows:
            return inverse_rows,inverse_evidence,inverse_reason
        ext_rows,ext_evidence,ext_reason=generate_exterior(parent,count)
        if ext_rows:
            return ext_rows,ext_evidence,ext_reason
        return [],[],_interior_failure_reason(parent)
    match,parent_n,parent_total,parent_angle=parsed
    q=_norm(parent.get("question")); seed=int(_sha(parent)[:12],16)
    candidates=(3,4,5,6,8,9,10,12,15,18,20,24,30)
    valid=[n for n in candidates if ((n-2)*180)%n==0 and n!=parent_n]
    seen=set(); rows=[]; evidence=[]
    for index in range(1,count+1):
        n=valid[((seed>>(index*4))+index*5)%len(valid)]
        pos=0
        while n in seen:
            pos+=1; n=valid[(valid.index(n)+pos)%len(valid)]
        seen.add(n)
        total=(n-2)*180; angle=total//n
        if angle*n != total:
            raise AssertionError("regular polygon interior angle identity failed")
        nq=q[:match.start("n")]+str(n)+q[match.end("n"):]
        rows.append({"question":nq,"answer":f"{angle}°","explanation":f"{n}角形の内角の和は({n}-2)×180={total}°。正{n}角形では等しい{n}個の内角に分かれるので、1つは{total}÷{n}={angle}°。","numeric_signature":(str(n),)})
        evidence.append({"parent_sha256":_sha(parent),"method":"regular_polygon_interior_sum_divided_by_n_and_recomposition_identity","parent_recalculation":f"({parent_n}-2)×180={parent_total}; {parent_total}÷{parent_n}={parent_angle}°","variant_recalculation":f"({n}-2)×180={total}; {total}÷{n}={angle}°","independent_check":f"{angle}×{n}={total} PASS"})
    return rows,evidence,"regular_polygon_single_interior_angle_exact"
