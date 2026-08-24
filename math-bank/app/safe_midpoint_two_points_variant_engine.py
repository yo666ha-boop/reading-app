from __future__ import annotations

"""Fail-closed exact engine for the midpoint of two explicit coordinate points."""
import hashlib,json,re
from fractions import Fraction

POINT_RE=re.compile(r"[（(]\s*(?P<x>-?\d+)\s*[,，、]\s*(?P<y>-?\d+)\s*[）)]")
ANS_RE=re.compile(r"^[（(]\s*(?P<x>-?\d+(?:/\d+)?)\s*[,，、]\s*(?P<y>-?\d+(?:/\d+)?)\s*[）)]$")

def _norm(v:object)->str:return str(v or "").replace("　"," ").replace("−","-").replace("／","/")
def _sha(p:dict)->str:return hashlib.sha256(json.dumps(p,ensure_ascii=False,sort_keys=True,separators=(",",":")).encode()).hexdigest()
def _fmt(v:Fraction)->str:return str(v.numerator) if v.denominator==1 else f"{v.numerator}/{v.denominator}"
def _parse(parent:dict):
    if parent.get("figure_refs") or parent.get("choices"):return None
    q=_norm(parent.get("question"))
    if "中点" not in q or any(t in q for t in ("グラフ","傾き","距離","垂直","方程式")):return None
    ps=list(POINT_RE.finditer(q))
    if len(ps)!=2:return None
    x1,y1=int(ps[0].group("x")),int(ps[0].group("y"));x2,y2=int(ps[1].group("x")),int(ps[1].group("y"))
    mx=Fraction(x1+x2,2);my=Fraction(y1+y2,2)
    am=ANS_RE.fullmatch(_norm(parent.get("answer")).replace(" ",""))
    if not am or Fraction(am.group("x"))!=mx or Fraction(am.group("y"))!=my:return None
    if 2*mx!=x1+x2 or 2*my!=y1+y2:return None
    return ps,x1,y1,x2,y2,mx,my

def can_generate(parent:dict):
    if _parse(parent) is not None:return True,"two_integer_points_midpoint_exact"
    if parent.get("figure_refs"):return False,"figure_parent"
    if parent.get("choices"):return False,"choice_parent"
    return False,"midpoint_parent_not_exactly_parsed_and_verified"

def generate(parent:dict,count:int):
    if count not in (1,2,3):raise ValueError("count must be 1, 2, or 3")
    parsed=_parse(parent)
    if parsed is None:return [],[],can_generate(parent)[1]
    ps,px1,py1,px2,py2,pmx,pmy=parsed;q=_norm(parent.get("question"));seed=int(_sha(parent)[:12],16);rows=[];ev=[];seen=set();parent_sig=(px1,py1,px2,py2)
    for i in range(1,count+1):
        x1=-8+((seed>>(i*4))%17);y1=-8+((seed>>(i*6+2))%17);x2=-8+((seed>>(i*8+3))%17);y2=-8+((seed>>(i*10+5))%17);sig=(x1,y1,x2,y2)
        while sig==parent_sig or sig in seen:
            x2+=1;y2-=1;sig=(x1,y1,x2,y2)
        seen.add(sig);mx=Fraction(x1+x2,2);my=Fraction(y1+y2,2)
        if 2*mx!=x1+x2 or 2*my!=y1+y2:raise AssertionError("midpoint identity failed")
        nq=q
        for s,e,t in sorted([(ps[0].start(),ps[0].end(),f"({x1},{y1})"),(ps[1].start(),ps[1].end(),f"({x2},{y2})")],reverse=True):nq=nq[:s]+t+nq[e:]
        rows.append({"question":nq,"answer":f"({_fmt(mx)},{_fmt(my)})","explanation":f"中点=(({x1}+{x2})/2,({y1}+{y2})/2)=({_fmt(mx)},{_fmt(my)})。","numeric_signature":tuple(map(str,sig))})
        ev.append({"parent_sha256":_sha(parent),"method":"two_point_midpoint_exact_average_and_double_identity","parent_recalculation":f"(({px1}+{px2})/2,({py1}+{py2})/2)=({_fmt(pmx)},{_fmt(pmy)})","variant_recalculation":f"(({x1}+{x2})/2,({y1}+{y2})/2)=({_fmt(mx)},{_fmt(my)})","independent_check":"2*mx=x1+x2 AND 2*my=y1+y2 PASS"})
    return rows,ev,"two_integer_points_midpoint_exact"
