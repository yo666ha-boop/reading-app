from __future__ import annotations
"""Fail-closed exact engine: diameter -> radius."""
import hashlib,json,re
D_RE=re.compile(r"直径\s*(?:は|が|=)?\s*(?P<d>\d+)\s*cm")
ANS_RE=re.compile(r"^(?P<r>\d+(?:\.5)?)\s*cm$")
def _norm(v): return str(v or '').replace('　',' ').replace('ｃｍ','cm').replace('ＣＭ','cm')
def _sha(p): return hashlib.sha256(json.dumps(p,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def _parse(p):
    if p.get('figure_refs') or p.get('choices'): return None
    q=_norm(p.get('question'))
    if not any(t in q for t in ('半径を求','半径の長さ','半径は何')): return None
    if any(t in q for t in ('円周率','円周','面積','弧','扇形','おうぎ形','中心角','図','グラフ','mm','km')): return None
    ms=list(D_RE.finditer(q))
    if len(ms)!=1: return None
    m=ms[0]; d=int(m.group('d'))
    if d<=0 or d%2: return None
    r=d//2; am=ANS_RE.fullmatch(_norm(p.get('answer')).replace(' ',''))
    if am is None or float(am.group('r'))!=r or 2*r!=d: return None
    return m,d,r
def can_generate(p):
    if _parse(p) is not None: return True,'circle_radius_from_diameter_exact'
    if p.get('figure_refs'): return False,'figure_parent'
    if p.get('choices'): return False,'choice_parent'
    return False,'circle_radius_from_diameter_parent_not_exactly_parsed_and_verified'
def generate(p,count):
    if count not in (1,2,3): raise ValueError('count must be 1, 2, or 3')
    parsed=_parse(p)
    if parsed is None:
        ok,reason=can_generate(p); assert not ok; return [],[],reason
    m,pd,pr=parsed; q=_norm(p.get('question')); seed=int(_sha(p)[:12],16); seen=set(); rows=[]; ev=[]
    for i in range(1,count+1):
        r=2+((seed>>(i*5))+i*7)%20; d=2*r; sig=(str(d),); guard=0
        while sig==(str(pd),) or sig in seen:
            guard+=1
            if guard>32: raise AssertionError('circle radius distinct search exhausted')
            r+=1; d=2*r; sig=(str(d),)
        seen.add(sig)
        if d/2!=r or 2*r!=d: raise AssertionError('circle radius identities failed')
        nq=q[:m.start('d')]+str(d)+q[m.end('d'):]
        rows.append({'question':nq,'answer':f'{r}cm','explanation':f'半径=直径÷2より、{d}÷2={r}cm。2×{r}={d}でも確認。','numeric_signature':sig})
        ev.append({'parent_sha256':_sha(p),'method':'circle_radius_from_diameter_exact_halving_and_doubling_identities','parent_recalculation':f'r={pd}/2={pr} and 2*{pr}={pd}','variant_recalculation':f'r={d}/2={r} and 2*{r}={d}','independent_check':'r == d/2 AND 2*r == d PASS'})
    return rows,ev,'circle_radius_from_diameter_exact'
