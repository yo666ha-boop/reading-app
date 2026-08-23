from __future__ import annotations
import hashlib, json, re

ANGLE_RE=re.compile(r"(?P<deg>\d+)\s*(?:°|度)")
ANSWER_RE=re.compile(r"^(?P<n>\d+)\s*角形$")

def _norm(v): return str(v or "").replace("　"," ")
def _sha(parent):
    return hashlib.sha256(json.dumps(parent,ensure_ascii=False,sort_keys=True,separators=(",", ":")).encode("utf-8")).hexdigest()

def _parse(parent):
    if parent.get("figure_refs") or parent.get("choices"): return None
    q=_norm(parent.get("question"))
    if "正多角形" not in q or "内角" not in q: return None
    if not any(t in q for t in ("何角形","何角形か","何角形ですか","何角形でしょう")): return None
    blocked=("内角の和","外角の和","対角線","相似","合同","証明","図")
    if any(t in q for t in blocked): return None
    ms=list(ANGLE_RE.finditer(q))
    if len(ms)!=1: return None
    m=ms[0]; interior=int(m.group("deg"))
    if not 0<interior<180: return None
    exterior=180-interior
    if exterior<=0 or 360%exterior!=0: return None
    n=360//exterior
    if not 3<=n<=30: return None
    am=ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ",""))
    if am is None or int(am.group("n"))!=n: return None
    total=(n-2)*180
    if total%n!=0 or total//n!=interior: return None
    return m,interior,exterior,n,total

def can_generate(parent):
    if _parse(parent) is not None: return True,"regular_polygon_sides_from_single_interior_angle_exact"
    if parent.get("figure_refs"): return False,"figure_parent"
    if parent.get("choices"): return False,"choice_parent"
    return False,"regular_polygon_sides_from_interior_angle_parent_not_exactly_parsed_and_verified"

def generate(parent,count):
    if count not in (1,2,3): raise ValueError("count must be 1, 2, or 3")
    parsed=_parse(parent)
    if parsed is None:
        ok,reason=can_generate(parent); assert not ok
        return [],[],reason
    match,parent_interior,parent_exterior,parent_n,parent_total=parsed
    q=_norm(parent.get("question")); seed=int(_sha(parent)[:12],16)
    candidates=(3,4,5,6,8,9,10,12,15,18,20,24,30)
    valid=[n for n in candidates if 360%n==0 and n!=parent_n]
    seen=set(); rows=[]; evidence=[]
    for index in range(1,count+1):
        n=valid[((seed>>(index*4))+index*11)%len(valid)]
        bump=0
        while n in seen:
            bump+=1; n=valid[(valid.index(n)+bump)%len(valid)]
        seen.add(n)
        exterior=360//n; interior=180-exterior; total=(n-2)*180
        if exterior*n!=360 or interior+exterior!=180 or total//n!=interior:
            raise AssertionError("regular polygon sides-from-interior-angle identity failed")
        nq=q[:match.start("deg")]+str(interior)+q[match.end("deg"):]
        rows.append({"question":nq,"answer":f"{n}角形","explanation":f"外角は180-{interior}={exterior}°。正多角形の外角の和は360°なので、360÷{exterior}={n}角形。内角和からも確認済み。","numeric_signature":(str(interior),)})
        evidence.append({"parent_sha256":_sha(parent),"method":"regular_polygon_sides_from_interior_angle_supplement_division_and_recomposition","parent_recalculation":f"180-{parent_interior}={parent_exterior}; 360÷{parent_exterior}={parent_n}; ({parent_n}-2)×180={parent_total}","variant_recalculation":f"180-{interior}={exterior}; 360÷{exterior}={n}; ({n}-2)×180={total}","independent_check":f"{exterior}×{n}=360 AND {interior}+{exterior}=180 AND {total}÷{n}={interior} PASS"})
    return rows,evidence,"regular_polygon_sides_from_single_interior_angle_exact"
