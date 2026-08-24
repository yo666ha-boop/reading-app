from __future__ import annotations

"""Fail-closed exact engine for circle circumference and inverse routes."""
from decimal import Decimal, InvalidOperation
import hashlib,json,re
from safe_circle_radius_from_circumference_variant_engine import generate as generate_radius_from_circumference
from safe_circle_diameter_from_circumference_variant_engine import generate as generate_diameter_from_circumference
from safe_circle_radius_from_diameter_variant_engine import generate as generate_radius_from_diameter
RADIUS_RE=re.compile(r"半径\s*(?P<radius>\d+)\s*cm")
ANSWER_RE=re.compile(r"^(?P<value>\d+(?:\.\d+)?)\s*cm$")
PI=Decimal('3.14')
def _norm(v): return str(v or '').replace('　',' ').replace('ｃｍ','cm').replace('ＣＭ','cm')
def _sha(p): return hashlib.sha256(json.dumps(p,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def _fmt(v):
    t=format(v,'f'); return t.rstrip('0').rstrip('.') if '.' in t else t
def _parse_parent(p):
    if p.get('figure_refs') or p.get('choices'): return None
    q=_norm(p.get('question'))
    if '円' not in q or '円周率' not in q or '3.14' not in q: return None
    if not any(t in q for t in ('円周の長さ','円の周の長さ','周の長さ')): return None
    if any(t in q for t in ('面積','直径','弧','扇形','おうぎ形','中心角','半円','四分円','半径を求','直径を求','図','グラフ','mm','km')): return None
    ms=list(RADIUS_RE.finditer(q))
    if len(ms)!=1: return None
    m=ms[0]; r=int(m.group('radius'))
    if r<=0: return None
    expected=Decimal(2*r)*PI; am=ANSWER_RE.fullmatch(_norm(p.get('answer')).replace(' ',''))
    if am is None: return None
    try: actual=Decimal(am.group('value'))
    except InvalidOperation: return None
    if actual!=expected or expected/PI!=Decimal(2*r) or expected/Decimal(2*r)!=PI: return None
    return m,r,expected
def can_generate(p):
    if _parse_parent(p) is not None: return True,'circle_integer_cm_circumference_pi_3_14_exact'
    for fn in (generate_radius_from_circumference,generate_diameter_from_circumference,generate_radius_from_diameter):
        rows,_,reason=fn(p,1)
        if rows: return True,reason
    if p.get('figure_refs'): return False,'figure_parent'
    if p.get('choices'): return False,'choice_parent'
    return False,'circle_circumference_parent_not_exactly_parsed_and_verified'
def generate(p,count):
    if count not in (1,2,3): raise ValueError('count must be 1, 2, or 3')
    parsed=_parse_parent(p)
    if parsed is None:
        for fn in (generate_radius_from_circumference,generate_diameter_from_circumference,generate_radius_from_diameter):
            rows,ev,reason=fn(p,count)
            if rows: return rows,ev,reason
        return [],[],'circle_circumference_parent_not_exactly_parsed_and_verified'
    m,pr,pv=parsed; q=_norm(p.get('question')); seed=int(_sha(p)[:12],16); seen=set(); rows=[]; ev=[]
    for i in range(1,count+1):
        r=2+((seed>>(i*5))+i*7)%18; guard=0
        while r==pr or r in seen:
            guard+=1
            if guard>32: raise AssertionError('circle circumference distinct search exhausted')
            r+=1
            if r>30: r=2
        seen.add(r); value=Decimal(2*r)*PI
        if value/PI!=Decimal(2*r) or value/Decimal(2*r)!=PI: raise AssertionError('circle circumference identity failed')
        nq=q[:m.start()]+f'半径{r}cm'+q[m.end():]
        rows.append({'question':nq,'answer':f'{_fmt(value)}cm','explanation':f'円周の長さ=2×円周率×半径より、2×3.14×{r}={_fmt(value)}cm。逆算でも直径と円周率3.14を確認済み。','numeric_signature':(str(r),'3.14')})
        ev.append({'parent_sha256':_sha(p),'method':'circle_circumference_exact_pi_3_14_product_and_two_inverse_identities','parent_recalculation':f'2×3.14×{pr}={_fmt(pv)}cm','variant_recalculation':f'2×3.14×{r}={_fmt(value)}cm','independent_check':'circumference/3.14 == 2*radius AND circumference/(2*radius) == 3.14 PASS'})
    return rows,ev,'circle_integer_cm_circumference_pi_3_14_exact'
