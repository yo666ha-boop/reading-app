from __future__ import annotations
"""Fail-closed exact engine for distance from origin to one explicit integer point."""
import hashlib,json,math,re
POINT_RE=re.compile(r"[（(]\s*(?P<x>-?\d+)\s*[,，、]\s*(?P<y>-?\d+)\s*[）)]")
ANS_RE=re.compile(r"^(?:距離\s*=\s*)?(?P<d>\d+)$")
TRIPLES=((3,4,5),(5,12,13),(8,15,17),(7,24,25))
def _norm(v:object)->str:return str(v or "").replace("　"," ").replace("−","-")
def _sha(p:dict)->str:return hashlib.sha256(json.dumps(p,ensure_ascii=False,sort_keys=True,separators=(",",":")).encode()).hexdigest()
def _parse(parent:dict):
    if parent.get("figure_refs") or parent.get("choices"):return None
    q=_norm(parent.get("question"))
    if "原点" not in q or "距離" not in q or any(t in q for t in ("グラフ","中点","傾き","変化の割合","方程式")):return None
    ps=list(POINT_RE.finditer(q))
    if len(ps)!=1:return None
    x,y=int(ps[0].group("x")),int(ps[0].group("y"));sq=x*x+y*y;d=math.isqrt(sq);am=ANS_RE.fullmatch(_norm(parent.get("answer")).replace(" ",""))
    if d<=0 or d*d!=sq or not am or int(am.group("d"))!=d:return None
    return ps[0],x,y,d
def can_generate(parent:dict):
    if _parse(parent) is not None:return True,"origin_to_integer_point_distance_exact_square"
    if parent.get("figure_refs"):return False,"figure_parent"
    if parent.get("choices"):return False,"choice_parent"
    return False,"origin_point_distance_parent_not_exactly_parsed_and_verified"
def generate(parent:dict,count:int):
    if count not in (1,2,3):raise ValueError("count must be 1, 2, or 3")
    parsed=_parse(parent)
    if parsed is None:return [],[],can_generate(parent)[1]
    pm,px,py,pd=parsed;q=_norm(parent.get("question"));seed=int(_sha(parent)[:12],16);rows=[];ev=[];seen=set();parent_sig=(px,py)
    for i in range(1,count+1):
        a,b,d=TRIPLES[(seed+i*5)%len(TRIPLES)];x=(-a if ((seed>>(i+2))&1) else a);y=(-b if ((seed>>(i+8))&1) else b);sig=(x,y);k=0
        while sig==parent_sig or sig in seen:
            k+=1;x,y=(y,-x);sig=(x,y)
            if k>4: x=a*(k+1);y=b*(k+1);d=d*(k+1);sig=(x,y)
        seen.add(sig);sq=x*x+y*y
        if sq!=d*d:raise AssertionError("origin distance square identity failed")
        nq=q[:pm.start()]+f"({x},{y})"+q[pm.end():]
        rows.append({"question":nq,"answer":str(d),"explanation":f"原点からの距離=√(({x})²+({y})²)=√{sq}={d}。","numeric_signature":tuple(map(str,sig))})
        ev.append({"parent_sha256":_sha(parent),"method":"origin_point_distance_exact_pythagorean_square_identity","parent_recalculation":f"{px}^2+{py}^2={pd*pd}={pd}^2","variant_recalculation":f"{x}^2+{y}^2={sq}={d}^2","independent_check":"x^2+y^2=d^2 PASS"})
    return rows,ev,"origin_to_integer_point_distance_exact_square"
