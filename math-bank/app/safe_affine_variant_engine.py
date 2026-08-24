from __future__ import annotations

"""Fail-closed exact engine for narrow affine/direct-proportion parent shapes."""
import hashlib,json,re
from fractions import Fraction
from safe_affine_equation_from_two_points_variant_engine import generate as generate_affine_two_points
from safe_affine_intercept_from_slope_point_variant_engine import generate as generate_affine_intercept
from safe_affine_x_from_y_variant_engine import generate as generate_affine_x_from_y
from safe_direct_proportion_constant_variant_engine import generate as generate_direct_proportion_constant
from safe_direct_proportion_value_variant_engine import generate as generate_direct_proportion_value
from safe_direct_proportion_x_from_y_variant_engine import generate as generate_direct_proportion_x_from_y
from safe_linear_equation_variant_engine import generate as generate_linear_equation
from safe_linear_inequality_variant_engine import generate as generate_linear_inequality
NUM=r"[+-]?\d+(?:/\d+)?"
AFFINE_RE=re.compile(rf"(?P<formula>[yｙ]\s*=\s*(?P<a>{NUM})?\s*[xｘ]\s*(?:(?P<sign>[+＋\-−])\s*(?P<b>\d+(?:/\d+)?))?)")
X_VALUE_RE=re.compile(rf"[xｘ]\s*=\s*(?P<x>{NUM})")
Y_ANSWER_RE=re.compile(rf"^(?:[yｙ]\s*=\s*)?(?P<y>{NUM})$")
def _norm(v): return str(v or '').replace('−','-').replace('＋','+')
def _fraction(s): return Fraction(_norm(s).replace(' ',''))
def _fraction_text(v): return str(v.numerator) if v.denominator==1 else f'{v.numerator}/{v.denominator}'
def _parent_sha(p): return hashlib.sha256(json.dumps(p,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def _parse_parent(p):
    if p.get('figure_refs') or p.get('choices') is not None: return (None,None,None,None,None,None)
    q=_norm(p.get('question')); fm=list(AFFINE_RE.finditer(q)); xm=list(X_VALUE_RE.finditer(q))
    if len(fm)!=1 or len(xm)!=1: return (None,None,None,None,None,None)
    formula=fm[0]; xmatch=xm[0]; at=formula.group('a'); a=Fraction(1) if at in (None,'','+') else _fraction(at); b=Fraction(0)
    if formula.group('b'):
        b=_fraction(formula.group('b'))
        if _norm(formula.group('sign'))=='-': b=-b
    x=_fraction(xmatch.group('x')); y=a*x+b; am=Y_ANSWER_RE.fullmatch(_norm(p.get('answer')).replace(' ',''))
    if am is None or _fraction(am.group('y'))!=y or a==0 or (y-b)/a!=x: return (None,None,None,None,None,None)
    return formula,xmatch,a,b,x,y
def can_generate(p):
    for fn in (generate_affine_two_points,generate_linear_inequality,generate_linear_equation,generate_affine_intercept,generate_affine_x_from_y,generate_direct_proportion_constant,generate_direct_proportion_value,generate_direct_proportion_x_from_y):
        rows,_,reason=fn(p,1)
        if rows: return True,reason
    parsed=_parse_parent(p)
    if parsed[0] is None:
        if p.get('figure_refs'): return False,'figure_parent'
        if p.get('choices') is not None: return False,'choice_parent'
        return False,'affine_parent_not_exactly_parsed_and_verified'
    return True,'affine_function_exact'
def generate(p,count):
    if count not in (1,2,3): raise ValueError('count must be 1, 2, or 3')
    for fn in (generate_affine_two_points,generate_linear_inequality,generate_linear_equation,generate_affine_intercept,generate_affine_x_from_y,generate_direct_proportion_constant,generate_direct_proportion_value,generate_direct_proportion_x_from_y):
        rows,evidence,reason=fn(p,count)
        if rows: return rows,evidence,reason
    parsed=_parse_parent(p); formula,xmatch,a,b,x,parent_y=parsed
    if formula is None or xmatch is None:
        ok,reason=can_generate(p); assert not ok; return [],[],reason
    q=_norm(p.get('question')); seed=int(_parent_sha(p)[:12],16); rows=[]; evidence=[]; seen=set(); parent_sig=(_fraction_text(a),_fraction_text(b),_fraction_text(x))
    for i in range(1,count+1):
        na=Fraction((abs(a.numerator)+1+i)*(-1 if ((seed>>i)&1) else 1),max(1,a.denominator)); nb=b+Fraction(2+i+((seed>>(i+5))&3)); nx=x+Fraction(1+i+((seed>>(i+11))&3))
        if na==0: na=Fraction(i+1)
        sig=(_fraction_text(na),_fraction_text(nb),_fraction_text(nx)); guard=0
        while sig==parent_sig or sig in seen:
            guard+=1
            if guard>32: raise AssertionError('affine numeric signature distinct search exhausted')
            nx+=i+1; sig=(_fraction_text(na),_fraction_text(nb),_fraction_text(nx))
        seen.add(sig); ny=na*nx+nb
        if (ny-nb)/na!=nx: raise AssertionError('affine inverse identity failed')
        lhs='y=x' if na==1 else 'y=-x' if na==-1 else f'y={_fraction_text(na)}x'
        if nb>0: lhs+=f'+{_fraction_text(nb)}'
        elif nb<0: lhs+=_fraction_text(nb)
        nq=q
        for s,e,v in sorted([(formula.start('formula'),formula.end('formula'),lhs),(xmatch.start('x'),xmatch.end('x'),_fraction_text(nx))],reverse=True): nq=nq[:s]+v+nq[e:]
        rows.append({'question':nq,'answer':f'y={_fraction_text(ny)}','explanation':f'x={_fraction_text(nx)} を {lhs} に代入すると y={_fraction_text(ny)}。逆算でも x={_fraction_text(nx)} を確認。','numeric_signature':sig})
        evidence.append({'parent_sha256':_parent_sha(p),'method':'affine_function_exact_rational_substitution','parent_recalculation':f'y={_fraction_text(a)}*{_fraction_text(x)}+({_fraction_text(b)})={_fraction_text(parent_y)}','variant_recalculation':f'y={_fraction_text(na)}*{_fraction_text(nx)}+({_fraction_text(nb)})={_fraction_text(ny)}','independent_check':f'(y-b)/a=({_fraction_text(ny)}-{_fraction_text(nb)})/{_fraction_text(na)}={_fraction_text(nx)} PASS'})
    return rows,evidence,'affine_function_exact'
