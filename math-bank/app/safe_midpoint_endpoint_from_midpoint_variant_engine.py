from __future__ import annotations

"""Fail-closed exact engine for one endpoint + midpoint -> missing endpoint."""
import hashlib,json,re

POINT_RE=re.compile(r"点\s*(?P<label>[AB])\s*[（(]\s*(?P<x>-?\d+)\s*[,，、]\s*(?P<y>-?\d+)\s*[）)]")
MID_RE=re.compile(r"中点\s*M?\s*[（(]\s*(?P<x>-?\d+)\s*[,，、]\s*(?P<y>-?\d+)\s*[）)]")
ANS_RE=re.compile(r"^[（(]\s*(?P<x>-?\d+)\s*[,，、]\s*(?P<y>-?\d+)\s*[）)]$")

def _norm(v:object)->str:return str(v or "").replace("　"," ").replace("−","-")
def _sha(p:dict)->str:return hashlib.sha256(json.dumps(p,ensure_ascii=False,sort_keys=True,separators=(",",":")).encode()).hexdigest()

def _parse(parent:dict):
    if parent.get("figure_refs") or parent.get("choices"):return None
    q=_norm(parent.get("question"))
    if "中点" not in q or any(t in q for t in ("グラフ","傾き","距離","垂直","方程式")):return None
    pts=list(POINT_RE.finditer(q));mids=list(MID_RE.finditer(q))
    if len(pts)!=1 or len(mids)!=1:return None
    pm=pts[0];mm=mids[0];known=pm.group("label");missing="B" if known=="A" else "A"
    if not re.search(rf"点\s*{missing}\s*の?座標",q):return None
    kx,ky=int(pm.group("x")),int(pm.group("y"));mx,my=int(mm.group("x")),int(mm.group("y"));ux,uy=2*mx-kx,2*my-ky
    am=ANS_RE.fullmatch(_norm(parent.get("answer")).replace(" ",""))
    if not am or int(am.group("x"))!=ux or int(am.group("y"))!=uy:return None
    if kx+ux!=2*mx or ky+uy!=2*my:return None
    return pm,mm,known,missing,kx,ky,mx,my,ux,uy

def can_generate(parent:dict):
    if _parse(parent) is not None:return True,"endpoint_from_integer_midpoint_exact"
    if parent.get("figure_refs"):return False,"figure_parent"
    if parent.get("choices"):return False,"choice_parent"
    return False,"midpoint_endpoint_parent_not_exactly_parsed_and_verified"

def generate(parent:dict,count:int):
    if count not in (1,2,3):raise ValueError("count must be 1, 2, or 3")
    parsed=_parse(parent)
    if parsed is None:return [],[],can_generate(parent)[1]
    pm,mm,known,missing,pkx,pky,pmx,pmy,pux,puy=parsed;q=_norm(parent.get("question"));seed=int(_sha(parent)[:12],16)
    rows=[];ev=[];seen=set();parent_sig=(pkx,pky,pmx,pmy)
    for i in range(1,count+1):
        kx=-7+((seed>>(i*4))%15);ky=-7+((seed>>(i*6+2))%15);mx=-6+((seed>>(i*8+3))%13);my=-6+((seed>>(i*10+5))%13);sig=(kx,ky,mx,my)
        while sig==parent_sig or sig in seen:
            mx+=1;my-=1;sig=(kx,ky,mx,my)
        seen.add(sig);ux=2*mx-kx;uy=2*my-ky
        if kx+ux!=2*mx or ky+uy!=2*my:raise AssertionError("midpoint inverse identity failed")
        nq=q
        repl=[(pm.start(),pm.end(),f"点{known}({kx},{ky})"),(mm.start(),mm.end(),f"中点M({mx},{my})")]
        for s,e,t in sorted(repl,reverse=True):nq=nq[:s]+t+nq[e:]
        rows.append({"question":nq,"answer":f"({ux},{uy})","explanation":f"中点の公式より、点{missing}=2M-点{known}=({2*mx}-{kx},{2*my}-{ky})=({ux},{uy})。","numeric_signature":tuple(map(str,sig))})
        ev.append({"parent_sha256":_sha(parent),"method":"endpoint_from_midpoint_exact_double_minus_endpoint","parent_recalculation":f"({pux},{puy})=(2*{pmx}-{pkx},2*{pmy}-{pky})","variant_recalculation":f"({ux},{uy})=(2*{mx}-{kx},2*{my}-{ky})","independent_check":f"(({kx}+{ux})/2,({ky}+{uy})/2)=({mx},{my}) PASS"})
    return rows,ev,"endpoint_from_integer_midpoint_exact"
