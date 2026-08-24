from __future__ import annotations
"""Fail-closed exact engine: radius -> diameter."""
import hashlib,json,re
R_RE=re.compile(r"半径\s*(?:は|が|=)?\s*(?P<r>\d+)\s*cm")
ANS_RE=re.compile(r"^(?P<d>\d+)\s*cm$")
def _norm(v): return str(v or '').replace('　',' ').replace('ｃｍ','cm').replace('ＣＭ','cm')
def _sha(p): return hashlib.sha256(json.dumps(p,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def _parse(p):
    if p.get('figure_refs') or p.get('choices'): return None
    q=_norm(p.get('question'))
    if not any(t in q for t in ('直径を求','直径の長さ','直径は何')): return None
    if any(t in q for t in ('円周率','円周','面積','弧','扇形','おうぎ形','中心角','図','グラフ','mm','km')): return None
    ms=list(R_RE.finditer(q))
    if len(ms)!=1: return None
    m=ms[0]; r=int(m.group('r'))
    if r<=0: return None
    d=2*r; am=ANS_RE.fullmatch(_norm(p.get('answer')).replace(' ',''))
    if am is None or int(am.group('d'))!=d or d/2!=r: return None
    return m,r,d
def can_generate(p):
    if _parse(p) is not None: return True,'circle_diameter_from_radius_exact'
    if p.get('figure_refs'): return False,'figure_parent'
    if p.get('choices'): return False,'choice_parent'
    return False,'circle_diameter_from_radius_parent_not_exactly_parsed_and_verified'
def generate(p,count):
    if count not in (1,2,3): raise ValueError('count must be 1, 2, or 3')
    parsed=_parse(p)
    if parsed is None:
        ok,reason=can_generate(p); assert not ok; return [],[],reason
    m,pr,pd=parsed; q=_norm(p.get('question')); seed=int(_sha(p)[:12],16); seen=set(); rows=[]; ev=[]
    for i in range(1,count+1):
        r=2+((seed>>(i*5))+i*7)%20; d=2*r; sig=(str(r),); guard=0
        while sig==(str(pr),) or sig in seen:
            guard+=1
            if guard>32: raise AssertionError('circle diameter from radius distinct search exhausted')
            r+=1; d=2*r; sig=(str(r),)
        seen.add(sig)
        if 2*r!=d or d/2!=r: raise AssertionError('circle diameter from radius identities failed')
        nq=q[:m.start('r')]+str(r)+q[m.end('r'):]
        rows.append({'question':nq,'answer':f'{d}cm','explanation':f'直径=半径×2より、{r}×2={d}cm。{d}÷2={r}でも確認。','numeric_signature':sig})
        ev.append({'parent_sha256':_sha(p),'method':'circle_diameter_from_radius_exact_doubling_and_halving_identities','parent_recalculation':f'd=2*{pr}={pd} and {pd}/2={pr}','variant_recalculation':f'd=2*{r}={d} and {d}/2={r}','independent_check':'d == 2*r AND r == d/2 PASS'})
    return rows,ev,'circle_diameter_from_radius_exact'
