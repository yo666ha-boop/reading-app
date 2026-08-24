from __future__ import annotations

"""Fail-closed exact engine: circumference with pi=3.14 -> diameter."""
from decimal import Decimal, InvalidOperation
import hashlib,json,re

PI=Decimal('3.14')
C_RE=re.compile(r"円周(?:の長さ)?\s*(?:は|が|=)?\s*(?P<c>\d+(?:\.\d+)?)\s*cm")
ANS_RE=re.compile(r"^(?P<d>\d+(?:\.\d+)?)\s*cm$")
def _norm(v): return str(v or '').replace('　',' ').replace('ｃｍ','cm').replace('ＣＭ','cm')
def _sha(p): return hashlib.sha256(json.dumps(p,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def _fmt(v):
    t=format(v,'f'); return t.rstrip('0').rstrip('.') if '.' in t else t
def _parse(p):
    if p.get('figure_refs') or p.get('choices'): return None
    q=_norm(p.get('question'))
    if '円' not in q or '円周率' not in q or '3.14' not in q: return None
    if not any(t in q for t in ('直径を求','直径の長さ','直径は何')): return None
    if any(t in q for t in ('半径を求','面積','弧','扇形','おうぎ形','中心角','図','グラフ','mm','km')): return None
    ms=list(C_RE.finditer(q))
    if len(ms)!=1: return None
    m=ms[0]
    try: c=Decimal(m.group('c'))
    except InvalidOperation: return None
    if c<=0: return None
    d=c/PI
    if d!=d.to_integral_value(): return None
    am=ANS_RE.fullmatch(_norm(p.get('answer')).replace(' ',''))
    if am is None: return None
    try: actual=Decimal(am.group('d'))
    except InvalidOperation: return None
    if actual!=d or d*PI!=c or c/d!=PI: return None
    return m,c,d
def can_generate(p):
    if _parse(p) is not None: return True,'circle_diameter_from_circumference_pi_3_14_exact'
    if p.get('figure_refs'): return False,'figure_parent'
    if p.get('choices'): return False,'choice_parent'
    return False,'circle_diameter_from_circumference_parent_not_exactly_parsed_and_verified'
def generate(p,count):
    if count not in (1,2,3): raise ValueError('count must be 1, 2, or 3')
    parsed=_parse(p)
    if parsed is None:
        ok,reason=can_generate(p); assert not ok; return [],[],reason
    m,pc,pd=parsed; q=_norm(p.get('question')); seed=int(_sha(p)[:12],16); parent_sig=(str(pc),); seen=set(); rows=[]; ev=[]
    for i in range(1,count+1):
        d=Decimal(2+((seed>>(i*5))+i*7)%24); c=d*PI; sig=(_fmt(c),); guard=0
        while sig==parent_sig or sig in seen:
            guard+=1
            if guard>32: raise AssertionError('circle diameter distinct search exhausted')
            d+=1; c=d*PI; sig=(_fmt(c),)
        seen.add(sig)
        if c/PI!=d or d*PI!=c or c/d!=PI: raise AssertionError('circle diameter identities failed')
        nq=q[:m.start('c')]+_fmt(c)+q[m.end('c'):]
        rows.append({'question':nq,'answer':f'{_fmt(d)}cm','explanation':f'円周=円周率×直径より、直径={_fmt(c)}÷3.14={_fmt(d)}cm。3.14×{_fmt(d)}={_fmt(c)}でも確認。','numeric_signature':sig})
        ev.append({'parent_sha256':_sha(p),'method':'circle_diameter_from_circumference_exact_division_and_product_identities','parent_recalculation':f'd={_fmt(pc)}/3.14={_fmt(pd)} and 3.14*{_fmt(pd)}={_fmt(pc)}','variant_recalculation':f'd={_fmt(c)}/3.14={_fmt(d)} and 3.14*{_fmt(d)}={_fmt(c)}','independent_check':'d == C/pi AND d*pi == C AND C/d == pi PASS'})
    return rows,ev,'circle_diameter_from_circumference_pi_3_14_exact'
