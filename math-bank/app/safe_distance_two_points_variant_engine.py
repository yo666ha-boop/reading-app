from __future__ import annotations

"""Fail-closed exact engine for distance between two explicit integer coordinate points."""
import hashlib,json,math,re

POINT_RE=re.compile(r"[（(]\s*(?P<x>-?\d+)\s*[,，、]\s*(?P<y>-?\d+)\s*[）)]")
ANS_RE=re.compile(r"^(?:距離\s*=\s*)?(?P<d>\d+)$")
TRIPLES=((3,4,5),(5,12,13),(8,15,17),(7,24,25))

def _norm(v:object)->str:return str(v or "").replace("　"," ").replace("−","-")
def _sha(p:dict)->str:return hashlib.sha256(json.dumps(p,ensure_ascii=False,sort_keys=True,separators=(",",":")).encode()).hexdigest()
def _parse(parent:dict):
    if parent.get("figure_refs") or parent.get("choices"):return None
    q=_norm(parent.get("question"))
    if "距離" not in q or any(t in q for t in ("グラフ","中点","傾き","変化の割合","垂直","方程式","原点から")):return None
    ps=list(POINT_RE.finditer(q))
    if len(ps)!=2:return None
    x1,y1=int(ps[0].group("x")),int(ps[0].group("y"));x2,y2=int(ps[1].group("x")),int(ps[1].group("y"))
    dx=x2-x1;dy=y2-y1;sq=dx*dx+dy*dy;d=math.isqrt(sq)
    am=ANS_RE.fullmatch(_norm(parent.get("answer")).replace(" ",""))
    if d<=0 or d*d!=sq or not am or int(am.group("d"))!=d:return None
    return ps,x1,y1,x2,y2,dx,dy,d

def can_generate(parent:dict):
    if _parse(parent) is not None:return True,"two_integer_points_distance_exact_square"
    if parent.get("figure_refs"):return False,"figure_parent"
    if parent.get("choices"):return False,"choice_parent"
    return False,"two_point_distance_parent_not_exactly_parsed_and_verified"
def generate(parent:dict,count:int):
    if count not in (1,2,3):raise ValueError("count must be 1, 2, or 3")
    parsed=_parse(parent)
    if parsed is None:return [],[],can_generate(parent)[1]
    ps,px1,py1,px2,py2,pdx,pdy,pd=parsed;q=_norm(parent.get("question"));seed=int(_sha(parent)[:12],16);rows=[];ev=[];seen=set();parent_sig=(px1,py1,px2,py2)
    for i in range(1,count+1):
        a,b,d=TRIPLES[(seed+i*3)%len(TRIPLES)];sx=-1 if ((seed>>(i+3))&1) else 1;sy=-1 if ((seed>>(i+9))&1) else 1
        x1=-6+((seed>>(i*4))%13);y1=-6+((seed>>(i*6+2))%13);x2=x1+sx*a;y2=y1+sy*b;sig=(x1,y1,x2,y2)
        bump=0
        while sig==parent_sig or sig in seen:
            bump+=1;x1+=bump;y1-=bump;x2=x1+sx*a;y2=y1+sy*b;sig=(x1,y1,x2,y2)
        seen.add(sig);dx=x2-x1;dy=y2-y1;sq=dx*dx+dy*dy
        if sq!=d*d:raise AssertionError("distance square identity failed")
        nq=q
        for s,e,t in sorted([(ps[0].start(),ps[0].end(),f"({x1},{y1})"),(ps[1].start(),ps[1].end(),f"({x2},{y2})")],reverse=True):nq=nq[:s]+t+nq[e:]
        rows.append({"question":nq,"answer":str(d),"explanation":f"2点間の距離=√(({x2}-{x1})²+({y2}-{y1})²)=√{sq}={d}。","numeric_signature":tuple(map(str,sig))})
        ev.append({"parent_sha256":_sha(parent),"method":"two_point_distance_exact_pythagorean_square_identity","parent_recalculation":f"({pdx})^2+({pdy})^2={pd*pd}={pd}^2","variant_recalculation":f"({dx})^2+({dy})^2={sq}={d}^2","independent_check":"dx^2+dy^2=d^2 PASS"})
    return rows,ev,"two_integer_points_distance_exact_square"
