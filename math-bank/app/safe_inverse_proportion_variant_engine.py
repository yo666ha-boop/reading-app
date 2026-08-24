from __future__ import annotations

"""Fail-closed exact engine for narrow inverse-proportion parent shapes."""

import hashlib
import json
import re
from fractions import Fraction

from safe_inverse_proportion_constant_variant_engine import generate as generate_inverse_proportion_constant

NUM = r"[+-]?\d+"
FORMULA_RE = re.compile(rf"(?P<formula>[yｙ]\s*=\s*(?P<a>{NUM})\s*/\s*[xｘ])")
X_VALUE_RE = re.compile(rf"[xｘ]\s*=\s*(?P<x>{NUM})")
Y_ANSWER_RE = re.compile(r"^(?:[yｙ]\s*=\s*)?(?P<y>[+-]?\d+(?:/\d+)?)$")


def _norm(value: object) -> str:
    return str(value or "").replace("　", " ").replace("／", "/").replace("−", "-").replace("＋", "+")


def _fraction_text(value: Fraction) -> str:
    return str(value.numerator) if value.denominator == 1 else f"{value.numerator}/{value.denominator}"


def _parent_sha(parent: dict) -> str:
    raw=json.dumps(parent,ensure_ascii=False,sort_keys=True,separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _parse_parent(parent: dict):
    if parent.get("figure_refs") or parent.get("choices"):
        return None
    q=_norm(parent.get("question")); formulas=list(FORMULA_RE.finditer(q)); x_values=list(X_VALUE_RE.finditer(q))
    if len(formulas)!=1 or len(x_values)!=1:
        return None
    fm=formulas[0]; xm=x_values[0]; a=int(fm.group("a")); x=int(xm.group("x"))
    if a==0 or x==0:
        return None
    y=Fraction(a,x); answer=_norm(parent.get("answer")).replace(" ",""); am=Y_ANSWER_RE.fullmatch(answer)
    if am is None or Fraction(am.group("y"))!=y:
        return None
    if Fraction(x)*y!=a:
        return None
    return fm,xm,a,x,y


def can_generate(parent:dict)->tuple[bool,str]:
    rows,_,reason=generate_inverse_proportion_constant(parent,1)
    if rows:
        return True,reason
    if _parse_parent(parent) is not None:
        return True,"inverse_proportion_exact"
    if parent.get("figure_refs"):
        return False,"figure_parent"
    if parent.get("choices"):
        return False,"choice_parent"
    return False,"inverse_proportion_parent_not_exactly_parsed_and_verified"


def generate(parent:dict,count:int)->tuple[list[dict],list[dict],str]:
    if count not in (1,2,3):
        raise ValueError("count must be 1, 2, or 3")
    rows,evidence,reason=generate_inverse_proportion_constant(parent,count)
    if rows:
        return rows,evidence,reason
    parsed=_parse_parent(parent)
    if parsed is None:
        ok,reason=can_generate(parent); assert not ok
        return [],[],reason
    fm,xm,parent_a,parent_x,parent_y=parsed; q=_norm(parent.get("question")); seed=int(_parent_sha(parent)[:12],16)
    parent_signature=(str(parent_a),str(parent_x)); seen=set(); rows=[]; evidence=[]
    for index in range(1,count+1):
        nx=2+((seed>>(index*5))+index*3)%9
        ny_abs=2+((seed>>(index*7+3))+index*5)%11
        ny=(-1 if ((seed>>(index+17))&1) else 1)*ny_abs
        na=nx*ny; signature=(str(na),str(nx)); bump=0
        while signature==parent_signature or signature in seen:
            bump+=1; nx+=1; ny+=1 if ny>0 else -1
            if ny==0: ny=2
            na=nx*ny; signature=(str(na),str(nx))
        seen.add(signature); vy=Fraction(na,nx)
        if Fraction(nx)*vy!=na or vy!=ny:
            raise AssertionError("inverse proportion identity failed")
        new_question=q
        replacements=[(fm.start("formula"),fm.end("formula"),f"y={na}/x"),(xm.start("x"),xm.end("x"),str(nx))]
        for start,end,value in sorted(replacements,reverse=True): new_question=new_question[:start]+value+new_question[end:]
        rows.append({"question":new_question,"answer":f"y={_fraction_text(vy)}","explanation":f"x={nx} を y={na}/x に代入すると y={_fraction_text(vy)}。x×y={nx}×{_fraction_text(vy)}={na} でも確認。","numeric_signature":signature})
        evidence.append({"parent_sha256":_parent_sha(parent),"method":"inverse_proportion_exact_division_and_product_identity","parent_recalculation":f"y={parent_a}/{parent_x}={_fraction_text(parent_y)}","variant_recalculation":f"y={na}/{nx}={_fraction_text(vy)}","independent_check":f"x*y={nx}*{_fraction_text(vy)}={na} PASS"})
    return rows,evidence,"inverse_proportion_exact"
