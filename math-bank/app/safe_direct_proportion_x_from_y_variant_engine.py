from __future__ import annotations

"""Fail-closed exact engine: direct proportion constant a and y -> x."""
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
    if not any(t in q for t in ('yはxに比例','y は x に比例','ｙはｘに比例')): return None
    if not any(t in q for t in ('xの値','x の値','ｘの値','xを求','ｘを求')): return None
    if any(t in q for t in ('反比例','比例定数を求','yの値','式を求','グラフ','図')): return None
    am=list(A_RE.finditer(q)); ym=list(Y_RE.finditer(q))
    if len(am)!=1 or len(ym)!=1: return None
    a=int(am[0].group('a')); y=int(ym[0].group('y'))
    if a==0 or y%a: return None
    x=y//a; ans=ANS_RE.fullmatch(_norm(p.get('answer')).replace(' ',''))
    if ans is None or int(ans.group('x'))!=x or a*x!=y: return None
    return am[0],ym[0],a,y,x
def can_generate(p):
    if _parse(p) is not None: return True,'direct_proportion_x_from_y_exact'
    if p.get('figure_refs'): return False,'figure_parent'
    if p.get('choices'): return False,'choice_parent'
    return False,'direct_proportion_x_from_y_parent_not_exactly_parsed_and_verified'
def generate(p,count):
    if count not in (1,2,3): raise ValueError('count must be 1, 2, or 3')
    parsed=_parse(p)
    if parsed is None:
        ok,reason=can_generate(p); assert not ok; return [],[],reason
    am,ym,pa,py,px=parsed; q=_norm(p.get('question')); seed=int(_sha(p)[:12],16); seen=set(); rows=[]; ev=[]; parent_sig=(str(pa),str(py))
    for i in range(1,count+1):
        a=2+((seed>>(i*5))+i*3)%8
        if ((seed>>(i+17))&1): a=-a
        x=2+((seed>>(i*7+2))+i*5)%11
        if ((seed>>(i+23))&1): x=-x
        y=a*x; sig=(str(a),str(y)); guard=0
        while sig==parent_sig or sig in seen:
            guard+=1
            if guard>32: raise AssertionError('direct proportion x-from-y distinct search exhausted')
            x+=1; y=a*x; sig=(str(a),str(y))
        seen.add(sig)
        if a==0 or Fraction(y,a)!=x or a*x!=y: raise AssertionError('direct proportion x-from-y identity failed')
        nq=q
        for s,e,v in sorted([(am.start('a'),am.end('a'),str(a)),(ym.start('y'),ym.end('y'),str(y))],reverse=True): nq=nq[:s]+v+nq[e:]
        rows.append({'question':nq,'answer':f'x={x}','explanation':f'比例 y=ax から x=y/a。a={a}, y={y} より x={y}/({a})={x}。a×x={a}×({x})={y} でも確認。','numeric_signature':sig})
        ev.append({'parent_sha256':_sha(p),'method':'direct_proportion_x_from_y_exact_division_and_product_identity','parent_recalculation':f'x={py}/({pa})={px} and {pa}*({px})={py}','variant_recalculation':f'x={y}/({a})={x} and {a}*({x})={y}','independent_check':'x == y/a AND a*x == y PASS'})
    return rows,ev,'direct_proportion_x_from_y_exact'
