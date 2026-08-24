from __future__ import annotations

"""Fail-closed exact engine: inverse proportion constant a and x -> y."""
import hashlib,json,re
from fractions import Fraction
NUM=r"[+-]?\d+"
A_RE=re.compile(rf"比例定数\s*(?:は|が)?\s*(?:[aａ]\s*=\s*)?(?P<a>{NUM})")
X_RE=re.compile(rf"[xｘ]\s*=\s*(?P<x>{NUM})")
ANS_RE=re.compile(r"^(?:[yｙ]\s*=\s*)?(?P<y>[+-]?\d+)$")
def _norm(v): return str(v or '').replace('　',' ').replace('−','-').replace('＋','+')
def _sha(p): return hashlib.sha256(json.dumps(p,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def _parse(p):
    if p.get('figure_refs') or p.get('choices'): return None
    q=_norm(p.get('question'))
    if not any(t in q for t in ('yはxに反比例','y は x に反比例','ｙはｘに反比例')): return None
    if not any(t in q for t in ('yの値','y の値','ｙの値')): return None
    if any(t in q for t in ('比例定数を求','xの値','式を求','グラフ','図')): return None
    am=list(A_RE.finditer(q)); xm=list(X_RE.finditer(q))
    if len(am)!=1 or len(xm)!=1: return None
    a=int(am[0].group('a')); x=int(xm[0].group('x'))
    if a==0 or x==0 or a%x: return None
    y=a//x; ans=ANS_RE.fullmatch(_norm(p.get('answer')).replace(' ',''))
    if ans is None or int(ans.group('y'))!=y or x*y!=a: return None
    return am[0],xm[0],a,x,y
def can_generate(p):
    if _parse(p) is not None: return True,'inverse_proportion_value_exact'
    if p.get('figure_refs'): return False,'figure_parent'
    if p.get('choices'): return False,'choice_parent'
    return False,'inverse_proportion_value_parent_not_exactly_parsed_and_verified'
def generate(p,count):
    if count not in (1,2,3): raise ValueError('count must be 1, 2, or 3')
    parsed=_parse(p)
    if parsed is None:
        ok,reason=can_generate(p); assert not ok; return [],[],reason
    am,xm,pa,px,py=parsed; q=_norm(p.get('question')); seed=int(_sha(p)[:12],16); seen=set(); rows=[]; ev=[]
    for i in range(1,count+1):
        x=2+((seed>>(i*5))+i*3)%9; y=2+((seed>>(i*7+2))+i*5)%11
        if ((seed>>(i+19))&1): y=-y
        a=x*y; sig=(str(a),str(x)); guard=0
        while sig==(str(pa),str(px)) or sig in seen:
            guard+=1
            if guard>32: raise AssertionError('inverse proportion value distinct search exhausted')
            x+=1; a=x*y; sig=(str(a),str(x))
        seen.add(sig)
        if x==0 or Fraction(a,x)!=y or x*y!=a: raise AssertionError('inverse proportion value identity failed')
        nq=q
        for s,e,v in sorted([(am.start('a'),am.end('a'),str(a)),(xm.start('x'),xm.end('x'),str(x))],reverse=True): nq=nq[:s]+v+nq[e:]
        rows.append({'question':nq,'answer':f'y={y}','explanation':f'反比例 y=a/x に a={a}, x={x} を代入すると y={a}/{x}={y}。x×y={x}×({y})={a} でも確認。','numeric_signature':sig})
        ev.append({'parent_sha256':_sha(p),'method':'inverse_proportion_value_exact_division_and_product_identity','parent_recalculation':f'y={pa}/{px}={py} and {px}*({py})={pa}','variant_recalculation':f'y={a}/{x}={y} and {x}*({y})={a}','independent_check':'y == a/x AND x*y == a PASS'})
    return rows,ev,'inverse_proportion_value_exact'
