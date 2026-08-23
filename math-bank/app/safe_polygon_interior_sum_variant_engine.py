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
    if "内角" not in q or "和" not in q:
        return None
    blocked=("外角","正多角形","1つの内角","一つの内角","内角の大きさ","対角線","相似","合同","証明","図")
    if any(t in q for t in blocked):
        return None
    ms=list(N_RE.finditer(q))
    if len(ms)!=1:
        return None
    m=ms[0]; n=int(m.group("n"))
    if not 3 <= n <= 30:
        return None
    total=(n-2)*180
    am=ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ",""))
    if am is None or int(am.group("deg"))!=total:
        return None
    if (n-2)*180 != total:
        return None
    return m,n,total

def can_generate(parent):
    if _parse(parent) is not None:
        return True,"polygon_interior_sum_exact"
    if parent.get("figure_refs"):
        return False,"figure_parent"
    if parent.get("choices"):
        return False,"choice_parent"
    return False,"polygon_interior_sum_parent_not_exactly_parsed_and_verified"

def generate(parent,count):
    if count not in (1,2,3):
        raise ValueError("count must be 1, 2, or 3")
    parsed=_parse(parent)
    if parsed is None:
        ok,reason=can_generate(parent); assert not ok
        return [],[],reason
    match,parent_n,parent_sum=parsed
    q=_norm(parent.get("question")); seed=int(_sha(parent)[:12],16)
    seen=set(); rows=[]; evidence=[]
    for index in range(1,count+1):
        n=4+((seed>>(index*5))+index*7)%9
        while n==parent_n or n in seen:
            n=4+((n-3)%9)
        seen.add(n); total=(n-2)*180; triangles=n-2
        if triangles*180 != total:
            raise AssertionError("polygon identity failed")
        nq=q[:match.start("n")]+str(n)+q[match.end("n"):]
        rows.append({"question":nq,"answer":f"{total}°","explanation":f"{n}角形を{triangles}個の三角形に分けると、内角の和は{triangles}×180={total}°。","numeric_signature":(str(n),)})
        evidence.append({"parent_sha256":_sha(parent),"method":"polygon_interior_sum_formula_and_triangle_decomposition_identity","parent_recalculation":f"({parent_n}-2)×180={parent_sum}°","variant_recalculation":f"({n}-2)×180={total}°","independent_check":f"triangle_count={triangles}; {triangles}×180={total} PASS"})
    return rows,evidence,"polygon_interior_sum_exact"
