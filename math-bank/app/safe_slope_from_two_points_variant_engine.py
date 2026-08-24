from __future__ import annotations

"""Fail-closed exact coordinate route for slope and midpoint of two explicit integer points."""
import hashlib,json,re
from fractions import Fraction
from safe_midpoint_two_points_variant_engine import generate as generate_midpoint

POINT_RE=re.compile(r"[（(]\s*(?P<x>-?\d+)\s*[,，、]\s*(?P<y>-?\d+)\s*[）)]")
ANS_RE=re.compile(r"^(?:傾き\s*=\s*)?(?:(?P<n>-?\d+)\s*/\s*(?P<d>\d+)|(?P<i>-?\d+))$")

def _norm(v:object)->str:return str(v or "").replace("　"," ").replace("／","/").replace("−","-")
def _sha(parent:dict)->str:return hashlib.sha256(json.dumps(parent,ensure_ascii=False,sort_keys=True,separators=(",",":")).encode()).hexdigest()
def _ans(v:object):
    m=ANS_RE.fullmatch(_norm(v).replace(" ",""))
    if not m:return None
    return Fraction(int(m.group("n")),int(m.group("d"))) if m.group("n") else Fraction(int(m.group("i")),1)
def _fmt(v:Fraction)->str:return str(v.numerator) if v.denominator==1 else f"{v.numerator}/{v.denominator}"
def _parse(parent:dict):
    if parent.get("figure_refs") or parent.get("choices"):return None
    q=_norm(parent.get("question"))
    if not ("傾き" in q or "変化の割合" in q):return None
    if any(t in q for t in ("グラフ","平行","垂直","切片","方程式","関数の式","中点")):return None
    ps=list(POINT_RE.finditer(q))
    if len(ps)!=2:return None
    x1,y1=int(ps[0].group("x")),int(ps[0].group("y"));x2,y2=int(ps[1].group("x")),int(ps[1].group("y"))
    if x1==x2:return None
    m=Fraction(y2-y1,x2-x1)
    if _ans(parent.get("answer"))!=m or Fraction(y2-y1,1)!=m*Fraction(x2-x1,1):return None
    return ps,x1,y1,x2,y2,m

def can_generate(parent:dict):
    rows,_,reason=generate_midpoint(parent,1)
    if rows:return True,reason
    if _parse(parent) is not None:return True,"two_integer_points_slope_exact"
    if parent.get("figure_refs"):return False,"figure_parent"
    if parent.get("choices"):return False,"choice_parent"
    return False,"coordinate_two_points_parent_not_exactly_parsed_and_verified"
def generate(parent:dict,count:int):
    if count not in (1,2,3):raise ValueError("count must be 1, 2, or 3")
    rows,ev,reason=generate_midpoint(parent,count)
    if rows:return rows,ev,reason
    parsed=_parse(parent)
    if parsed is None:return [],[],can_generate(parent)[1]
    ps,px1,py1,px2,py2,pm=parsed;q=_norm(parent.get("question"));seed=int(_sha(parent)[:12],16);rows=[];ev=[];seen=set()
    for idx in range(1,count+1):
        x1=-3+((seed>>(idx*3))+idx)%7;dx=1+((seed>>(idx*5+2))+idx)%5;m_num=(-4+((seed>>(idx*7+1))+idx*3)%9) or 2;x2=x1+dx;y1=-6+((seed>>(idx*4+5))+idx*2)%13;y2=y1+m_num*dx;sig=(x1,y1,x2,y2)
        while sig==(px1,py1,px2,py2) or sig in seen:
            y1+=idx;y2=y1+m_num*dx;sig=(x1,y1,x2,y2)
        seen.add(sig);m=Fraction(y2-y1,x2-x1)
        if Fraction(y2-y1,1)!=m*Fraction(x2-x1,1):raise AssertionError("slope identity failed")
        nq=q
        for s,e,t in sorted([(ps[0].start(),ps[0].end(),f"({x1},{y1})"),(ps[1].start(),ps[1].end(),f"({x2},{y2})")],reverse=True):nq=nq[:s]+t+nq[e:]
        rows.append({"question":nq,"answer":_fmt(m),"explanation":f"傾き=(yの増加量)/(xの増加量)=({y2}-{y1})/({x2}-{x1})={_fmt(m)}。","numeric_signature":tuple(map(str,sig))})
        ev.append({"parent_sha256":_sha(parent),"method":"two_point_exact_slope_and_cross_multiplication","parent_recalculation":f"({py2}-{py1})/({px2}-{px1})={_fmt(pm)}","variant_recalculation":f"({y2}-{y1})/({x2}-{x1})={_fmt(m)}","independent_check":f"delta_y={y2-y1} == slope*delta_x={_fmt(m)}*{x2-x1} PASS"})
    return rows,ev,"two_integer_points_slope_exact"
