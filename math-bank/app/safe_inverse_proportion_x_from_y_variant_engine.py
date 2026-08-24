from __future__ import annotations

"""Fail-closed exact engine: inverse proportion constant a and y -> x."""
import hashlib,json,re
from fractions import Fraction
NUM=r"[+-]?\d+"
A_RE=re.compile(rf"比例定数\s*(?:は|が)?\s*(?:[aａ]\s*=\s*)?(?P<a>{NUM})")
Y_RE=re.compile(rf"[yｙ]\s*=\s*(?P<y>{NUM})")
ANS_RE=re.compile(r"^(?:[xｘ]\s*=\s*)?(?P<x>[+-]?\d+)$")
def _norm(v): return str(v or '').replace('　',' ').replace('−','-').replace('＋','+')
def _sha(p): return hashlib.sha256(json.dumps(p,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def _parse(p):
    if p.get('figure_refs') or p.get('choices'): return None
    q=_norm(p.get('question'))
    if not any(t in q for t in ('yはxに反比例','y は x に反比例','ｙはｘに反比例')): return None
    if not any(t in q for t in ('xの値','x の値','ｘの値','xを求','ｘを求')): return None
    if any(t in q for t in ('比例定数を求','yの値','式を求','グラフ','図')): return None
    am=list(A_RE.finditer(q)); ym=list(Y_RE.finditer(q))
    if len(am)!=1 or len(ym)!=1: return None
    a=int(am[0].group('a')); y=int(ym[0].group('y'))
    if a==0 or y==0 or a%y: return None
    x=a//y; ans=ANS_RE.fullmatch(_norm(p.get('answer')).replace(' ',''))
    if ans is None or int(ans.group('x'))!=x or x*y!=a: return None
    return am[0],ym[0],a,y,x
def can_generate(p):
    if _parse(p) is not None: return True,'inverse_proportion_x_from_y_exact'
    if p.get('figure_refs'): return False,'figure_parent'
    if p.get('choices'): return False,'choice_parent'
    return False,'inverse_proportion_x_from_y_parent_not_exactly_parsed_and_verified'
def generate(p,count):
    if count not in (1,2,3): raise ValueError('count must be 1, 2, or 3')
    parsed=_parse(p)
    if parsed is None:
        ok,reason=can_generate(p); assert not ok; return [],[],reason
    am,ym,pa,py,px=parsed; q=_norm(p.get('question')); seed=int(_sha(p)[:12],16); seen=set(); rows=[]; ev=[]; parent_sig=(str(pa),str(py))
    for i in range(1,count+1):
        y=2+((seed>>(i*5))+i*3)%10
        if ((seed>>(i+17))&1): y=-y
        x=2+((seed>>(i*7+2))+i*5)%11
        a=x*y; sig=(str(a),str(y)); guard=0
        while sig==parent_sig or sig in seen:
            guard+=1
            if guard>32: raise AssertionError('inverse proportion x-from-y distinct search exhausted')
            x+=1; a=x*y; sig=(str(a),str(y))
        seen.add(sig)
        if y==0 or Fraction(a,y)!=x or x*y!=a: raise AssertionError('inverse proportion x-from-y identity failed')
        nq=q
        for s,e,v in sorted([(am.start('a'),am.end('a'),str(a)),(ym.start('y'),ym.end('y'),str(y))],reverse=True): nq=nq[:s]+v+nq[e:]
        rows.append({'question':nq,'answer':f'x={x}','explanation':f'反比例 y=a/x から x=a/y。a={a}, y={y} より x={a}/({y})={x}。x×y={x}×({y})={a} でも確認。','numeric_signature':sig})
        ev.append({'parent_sha256':_sha(p),'method':'inverse_proportion_x_from_y_exact_division_and_product_identity','parent_recalculation':f'x={pa}/({py})={px} and {px}*({py})={pa}','variant_recalculation':f'x={a}/({y})={x} and {x}*({y})={a}','independent_check':'x == a/y AND x*y == a PASS'})
    return rows,ev,'inverse_proportion_x_from_y_exact'
