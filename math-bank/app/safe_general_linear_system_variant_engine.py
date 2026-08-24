from __future__ import annotations

"""Fail-closed exact engine for two explicit linear equations in x and y."""

import hashlib
import json
import re
from fractions import Fraction

COEF=r"[+-]?\d*"
EQ_RE=re.compile(rf"(?P<eq>(?P<a>{COEF})\s*[xｘ]\s*(?P<sign>[+＋\-−])\s*(?P<b>\d*)\s*[yｙ]\s*=\s*(?P<c>[+-]?\d+))")
ANSWER_RE=re.compile(r"^(?:[xｘ]\s*=\s*)?(?P<x>[+-]?\d+(?:/\d+)?)\s*[,、]\s*(?:[yｙ]\s*=\s*)?(?P<y>[+-]?\d+(?:/\d+)?)$")


def _norm(v:object)->str:
    return str(v or "").replace("−","-").replace("＋","+").replace("　"," ")


def _coef(text:str)->Fraction:
    t=_norm(text).replace(" ","")
    if t in ("","+"): return Fraction(1)
    if t=="-": return Fraction(-1)
    return Fraction(int(t))


def _ycoef(sign:str,digits:str)->Fraction:
    v=Fraction(1 if digits=="" else int(digits))
    return -v if _norm(sign)=="-" else v


def _ft(v:Fraction)->str:
    return str(v.numerator) if v.denominator==1 else f"{v.numerator}/{v.denominator}"


def _sha(parent:dict)->str:
    raw=json.dumps(parent,ensure_ascii=False,sort_keys=True,separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _parse(parent:dict):
    if parent.get("figure_refs") or parent.get("choices"): return None
    q=_norm(parent.get("question"))
    if any(t in q for t in ("グラフ","文章","速さ","代金","個数","割合")): return None
    matches=list(EQ_RE.finditer(q))
    if len(matches)!=2 or q.count("=")!=2: return None
    vals=[]
    for m in matches:
        vals.append((_coef(m.group("a")),_ycoef(m.group("sign"),m.group("b")),Fraction(int(m.group("c")))))
    (a,b,c),(d,e,f)=vals; det=a*e-b*d
    if det==0: return None
    x=(c*e-b*f)/det; y=(a*f-c*d)/det
    am=ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ",""))
    if am is None or Fraction(am.group("x"))!=x or Fraction(am.group("y"))!=y: return None
    if a*x+b*y!=c or d*x+e*y!=f: return None
    return matches,a,b,c,d,e,f,x,y


def can_generate(parent:dict)->tuple[bool,str]:
    if _parse(parent) is not None: return True,"general_linear_system_exact"
    if parent.get("figure_refs"): return False,"figure_parent"
    if parent.get("choices"): return False,"choice_parent"
    return False,"general_linear_system_parent_not_exactly_parsed_and_verified"


def _expr(a:Fraction,b:Fraction)->str:
    first="x" if a==1 else "-x" if a==-1 else f"{_ft(a)}x"
    if b>0:
        second="+y" if b==1 else f"+{_ft(b)}y"
    else:
        second="-y" if b==-1 else f"{_ft(b)}y"
    return first+second


def generate(parent:dict,count:int):
    if count not in (1,2,3): raise ValueError("count must be 1, 2, or 3")
    parsed=_parse(parent)
    if parsed is None:
        ok,reason=can_generate(parent); assert not ok
        return [],[],reason
    matches,pa,pb,pc,pd,pe,pf,px,py=parsed; q=_norm(parent.get("question")); seed=int(_sha(parent)[:12],16)
    parent_sig=tuple(_ft(v) for v in (pa,pb,pc,pd,pe,pf)); seen=set(); rows=[]; evidence=[]
    for i in range(1,count+1):
        x=Fraction(-6+((seed>>(i*4))%13)); y=Fraction(-5+((seed>>(i*6+2))%11))
        a=Fraction(1+((seed>>(i*7+3))%5)); b=Fraction(-4+((seed>>(i*8+4))%9)); d=Fraction(-4+((seed>>(i*9+5))%9)); e=Fraction(1+((seed>>(i*10+6))%5))
        det=a*e-b*d; bump=0
        while det==0:
            bump+=1; e+=1; det=a*e-b*d
        c=a*x+b*y; f=d*x+e*y; sig=tuple(_ft(v) for v in (a,b,c,d,e,f))
        while sig==parent_sig or sig in seen:
            x+=1; c=a*x+b*y; f=d*x+e*y; sig=tuple(_ft(v) for v in (a,b,c,d,e,f))
        seen.add(sig)
        cx=(c*e-b*f)/det; cy=(a*f-c*d)/det
        if cx!=x or cy!=y or a*x+b*y!=c or d*x+e*y!=f: raise AssertionError("general linear system identity failed")
        eq1=f"{_expr(a,b)}={_ft(c)}"; eq2=f"{_expr(d,e)}={_ft(f)}"
        nq=q
        reps=[(matches[0].start("eq"),matches[0].end("eq"),eq1),(matches[1].start("eq"),matches[1].end("eq"),eq2)]
        for s,eidx,text in sorted(reps,reverse=True): nq=nq[:s]+text+nq[eidx:]
        rows.append({"question":nq,"answer":f"x={_ft(x)}, y={_ft(y)}","explanation":f"2式を消去して x={_ft(x)}, y={_ft(y)}。両方の式へ代入して成立することを確認。","numeric_signature":sig})
        evidence.append({"parent_sha256":_sha(parent),"method":"general_linear_system_cramer_and_double_substitution","parent_recalculation":f"det={_ft(pa*pe-pb*pd)} x={_ft(px)} y={_ft(py)}","variant_recalculation":f"det={_ft(det)} x={_ft(cx)} y={_ft(cy)}","independent_check":f"eq1={_ft(a*x+b*y)}={_ft(c)} AND eq2={_ft(d*x+e*y)}={_ft(f)} PASS"})
    return rows,evidence,"general_linear_system_exact"
