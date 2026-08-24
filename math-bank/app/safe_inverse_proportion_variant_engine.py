from __future__ import annotations

"""Fail-closed exact engine for narrow inverse-proportion parent shapes."""
import hashlib,json,re
from fractions import Fraction
from safe_inverse_proportion_constant_variant_engine import generate as generate_inverse_proportion_constant
from safe_inverse_proportion_value_variant_engine import generate as generate_inverse_proportion_value
NUM=r"[+-]?\d+"
FORMULA_RE=re.compile(rf"(?P<formula>[yｙ]\s*=\s*(?P<a>{NUM})\s*/\s*[xｘ])")
X_VALUE_RE=re.compile(rf"[xｘ]\s*=\s*(?P<x>{NUM})")
Y_ANSWER_RE=re.compile(r"^(?:[yｙ]\s*=\s*)?(?P<y>[+-]?\d+(?:/\d+)?)$")
def _norm(v): return str(v or '').replace('　',' ').replace('／','/').replace('−','-').replace('＋','+')
def _fraction_text(v): return str(v.numerator) if v.denominator==1 else f'{v.numerator}/{v.denominator}'
def _parent_sha(p): return hashlib.sha256(json.dumps(p,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def _parse_parent(p):
    if p.get('figure_refs') or p.get('choices'): return None
    q=_norm(p.get('question')); fs=list(FORMULA_RE.finditer(q)); xs=list(X_VALUE_RE.finditer(q))
    if len(fs)!=1 or len(xs)!=1: return None
    fm,xm=fs[0],xs[0]; a=int(fm.group('a')); x=int(xm.group('x'))
    if a==0 or x==0: return None
    y=Fraction(a,x); am=Y_ANSWER_RE.fullmatch(_norm(p.get('answer')).replace(' ',''))
    if am is None or Fraction(am.group('y'))!=y or Fraction(x)*y!=a: return None
    return fm,xm,a,x,y
def can_generate(p):
    for fn in (generate_inverse_proportion_constant,generate_inverse_proportion_value):
        rows,_,reason=fn(p,1)
        if rows: return True,reason
    if _parse_parent(p) is not None: return True,'inverse_proportion_exact'
    if p.get('figure_refs'): return False,'figure_parent'
    if p.get('choices'): return False,'choice_parent'
    return False,'inverse_proportion_parent_not_exactly_parsed_and_verified'
def generate(p,count):
    if count not in (1,2,3): raise ValueError('count must be 1, 2, or 3')
    for fn in (generate_inverse_proportion_constant,generate_inverse_proportion_value):
        rows,evidence,reason=fn(p,count)
        if rows: return rows,evidence,reason
    parsed=_parse_parent(p)
    if parsed is None:
        ok,reason=can_generate(p); assert not ok; return [],[],reason
    fm,xm,pa,px,py=parsed; q=_norm(p.get('question')); seed=int(_parent_sha(p)[:12],16); parent_sig=(str(pa),str(px)); seen=set(); rows=[]; evidence=[]
    for i in range(1,count+1):
        nx=2+((seed>>(i*5))+i*3)%9; ny_abs=2+((seed>>(i*7+3))+i*5)%11; ny=(-1 if ((seed>>(i+17))&1) else 1)*ny_abs; na=nx*ny; sig=(str(na),str(nx)); guard=0
        while sig==parent_sig or sig in seen:
            guard+=1
            if guard>32: raise AssertionError('inverse proportion distinct search exhausted')
            nx+=1; ny+=1 if ny>0 else -1
            if ny==0: ny=2
            na=nx*ny; sig=(str(na),str(nx))
        seen.add(sig); vy=Fraction(na,nx)
        if Fraction(nx)*vy!=na or vy!=ny: raise AssertionError('inverse proportion identity failed')
        nq=q
        for s,e,v in sorted([(fm.start('formula'),fm.end('formula'),f'y={na}/x'),(xm.start('x'),xm.end('x'),str(nx))],reverse=True): nq=nq[:s]+v+nq[e:]
        rows.append({'question':nq,'answer':f'y={_fraction_text(vy)}','explanation':f'x={nx} を y={na}/x に代入すると y={_fraction_text(vy)}。x×y={nx}×{_fraction_text(vy)}={na} でも確認。','numeric_signature':sig})
        evidence.append({'parent_sha256':_parent_sha(p),'method':'inverse_proportion_exact_division_and_product_identity','parent_recalculation':f'y={pa}/{px}={_fraction_text(py)}','variant_recalculation':f'y={na}/{nx}={_fraction_text(vy)}','independent_check':f'x*y={nx}*{_fraction_text(vy)}={na} PASS'})
    return rows,evidence,'inverse_proportion_exact'
