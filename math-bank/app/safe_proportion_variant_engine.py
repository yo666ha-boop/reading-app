from __future__ import annotations

"""Fail-closed exact engine for narrow middle-school ratio/proportion parents.

The primary path solves A:B=C:D with exactly one x using exact Fraction and
cross-product verification. When that shape does not match, simple reduction of
a two-integer ratio to its simplest integer ratio is delegated to the dedicated
exact ratio-simplification engine. Figure/real-choice and ambiguous parents fail
closed.
"""

import hashlib
import json
import re
from fractions import Fraction
from safe_ratio_simplification_variant_engine import generate as generate_ratio_simplification

TERM=r"(?:[xｘ]|\d+)"
PROP_RE=re.compile(rf"(?P<prop>(?P<t0>{TERM})\s*[:：]\s*(?P<t1>{TERM})\s*=\s*(?P<t2>{TERM})\s*[:：]\s*(?P<t3>{TERM}))")
X_ANSWER_RE=re.compile(r"^[xｘ]\s*=\s*(?P<v>[+-]?\d+(?:/\d+)?)$")

def _norm(value:object)->str: return str(value or "").replace("ｘ","x").replace("：",":").replace("−","-")
def _parent_sha(parent:dict)->str:
    raw=json.dumps(parent,ensure_ascii=False,sort_keys=True,separators=(",", ":")).encode("utf-8"); return hashlib.sha256(raw).hexdigest()
def _fraction_text(v:Fraction)->str: return str(v.numerator) if v.denominator==1 else f"{v.numerator}/{v.denominator}"
def _solve(values:list[Fraction|None],xpos:int)->Fraction:
    a,b,c,d=values
    if xpos==0:
        assert b is not None and c is not None and d is not None and d!=0; return b*c/d
    if xpos==1:
        assert a is not None and c is not None and d is not None and c!=0; return a*d/c
    if xpos==2:
        assert a is not None and b is not None and d is not None and b!=0; return a*d/b
    assert a is not None and b is not None and c is not None and a!=0; return b*c/a
def _cross_product_ok(values:list[Fraction|None],xpos:int,x:Fraction)->bool:
    resolved=[x if i==xpos else v for i,v in enumerate(values)]
    if any(v is None for v in resolved): return False
    a,b,c,d=resolved; assert a is not None and b is not None and c is not None and d is not None; return a*d==b*c

def _parse_parent(parent:dict):
    if parent.get("figure_refs") or parent.get("choices") is not None: return None
    q=_norm(parent.get("question"))
    if "比例式" not in q and "比" not in q: return None
    matches=list(PROP_RE.finditer(q))
    if len(matches)!=1: return None
    m=matches[0]; terms=[_norm(m.group(f"t{i}")).strip() for i in range(4)]; xpos=[i for i,t in enumerate(terms) if t=="x"]
    if len(xpos)!=1: return None
    xpos=xpos[0]; values:list[Fraction|None]=[]
    for i,t in enumerate(terms):
        if i==xpos: values.append(None); continue
        if not t.isdigit() or int(t)<=0: return None
        values.append(Fraction(int(t)))
    try: expected=_solve(values,xpos)
    except Exception: return None
    am=X_ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ",""))
    if am is None or Fraction(am.group("v"))!=expected or not _cross_product_ok(values,xpos,expected): return None
    return m,terms,values,xpos,expected

def can_generate(parent:dict)->tuple[bool,str]:
    if _parse_parent(parent) is not None: return True,"proportion_exact"
    delegated,_,reason=generate_ratio_simplification(parent,1)
    if delegated: return True,reason
    if parent.get("figure_refs"): return False,"figure_parent"
    if parent.get("choices") is not None: return False,"choice_parent"
    return False,"proportion_parent_not_exactly_parsed_and_verified"
def _variant_terms(xpos:int,seed:int,index:int)->tuple[list[int|str],int]:
    base=2+((seed>>(index*3))&3)+index; other=3+((seed>>(index*5+7))&3)+index; scale=2+((seed>>(index*4+13))&2)+index
    if xpos==0: b,d=base,other; c=d*scale; return ["x",b,c,d],b*scale
    if xpos==1: c,d=base,other; a=c*scale; return [a,"x",c,d],d*scale
    if xpos==2: b,d=base,other; a=b*scale; return [a,b,"x",d],d*scale
    a,b=base,other; c=a*scale; return [a,b,c,"x"],b*scale

def generate(parent:dict,count:int)->tuple[list[dict],list[dict],str]:
    if count not in (1,2,3): raise ValueError("count must be 1, 2, or 3")
    parsed=_parse_parent(parent)
    if parsed is None:
        rows,evidence,reason=generate_ratio_simplification(parent,count)
        if rows: return rows,evidence,reason
        return [],[],"proportion_parent_not_exactly_parsed_and_verified"
    match,terms,values,xpos,parent_x=parsed; q=_norm(parent.get("question")); seed=int(_parent_sha(parent)[:12],16); parent_signature=tuple(terms); seen:set[tuple[str,...]]=set(); rows=[]; evidence=[]
    for index in range(1,count+1):
        new_terms,expected_int=_variant_terms(xpos,seed,index); signature=tuple(str(v) for v in new_terms)
        if signature==parent_signature or signature in seen: raise AssertionError("proportion numeric signature collision")
        seen.add(signature); new_values=[None if i==xpos else Fraction(int(v)) for i,v in enumerate(new_terms)]; solved=_solve(new_values,xpos)
        if solved!=expected_int or not _cross_product_ok(new_values,xpos,solved): raise AssertionError("proportion independent verification failed")
        prop_text=f"{new_terms[0]}:{new_terms[1]}={new_terms[2]}:{new_terms[3]}"; new_question=q[:match.start("prop")]+prop_text+q[match.end("prop"):]
        rows.append({"question":new_question,"answer":f"x={_fraction_text(solved)}","explanation":f"比例式 {prop_text} を外項の積=内項の積で解くと x={_fraction_text(solved)}。代入して両辺の積一致も確認済み。","numeric_signature":signature})
        evidence.append({"parent_sha256":_parent_sha(parent),"method":"proportion_exact_cross_product","parent_recalculation":f"x={_fraction_text(parent_x)}","variant_recalculation":f"{prop_text} => x={_fraction_text(solved)}","independent_check":"resolved_A*D == resolved_B*C PASS"})
    return rows,evidence,"proportion_exact"
