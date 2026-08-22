from __future__ import annotations
import hashlib,json,re
from fractions import Fraction
EXPR=re.compile(r'(?P<a>-?\d+\.\d+)\s*(?P<op>[+\-×÷])\s*(?P<b>-?\d+\.\d+)')
def norm(v): return str(v or '').replace('　',' ').replace('−','-')
def sha(p): return hashlib.sha256(json.dumps(p,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()
def frac(s):
    neg=s.startswith('-'); t=s[1:] if neg else s; w,d=t.split('.'); x=Fraction(int(w+d),10**len(d)); return -x if neg else x
def finite(x):
    d=x.denominator
    while d%2==0:d//=2
    while d%5==0:d//=5
    return d==1
def render(x):
    if x.denominator==1:return str(x.numerator)
    if not finite(x):raise ValueError('nonfinite')
    sign='-' if x<0 else ''; n=abs(x.numerator); d=x.denominator; p2=p5=0; t=d
    while t%2==0:p2+=1;t//=2
    while t%5==0:p5+=1;t//=5
    k=max(p2,p5); z=n*(10**k//d); s=str(z).rjust(k+1,'0'); return sign+(s[:-k]+'.'+s[-k:]).rstrip('0').rstrip('.')
def calc(a,op,b):
    if op=='+':return a+b
    if op=='-':return a-b
    if op=='×':return a*b
    if op=='÷' and b!=0:return a/b
    return None
def parse(p):
    if p.get('figure_refs') or p.get('choices'):return None
    q=norm(p.get('question'))
    if any(x in q for x in ('方程式','文字','割合','確率','√')):return None
    ms=list(EXPR.finditer(q))
    if len(ms)!=1 or len(re.findall(r'-?\d+(?:\.\d+)?',q))!=2:return None
    m=ms[0]; a=frac(m.group('a')); b=frac(m.group('b')); op=m.group('op'); v=calc(a,op,b)
    if v is None or not finite(v):return None
    ans=norm(p.get('answer')).replace(' ','')
    if not re.fullmatch(r'-?\d+(?:\.\d+)?',ans):return None
    av=frac(ans if '.' in ans else ans+'.0')
    return (m,a,op,b,v) if av==v else None
def can_generate(p): return (True,'finite_decimal_binary_arithmetic_exact') if parse(p) else (False,'decimal_arithmetic_parent_not_exactly_parsed_and_verified')
def generate(p,count):
    if count not in (1,2,3):raise ValueError('count must be 1, 2, or 3')
    z=parse(p)
    if not z:return [],[],can_generate(p)[1]
    m,pa,op,pb,pv=z; q=norm(p.get('question')); seed=int(sha(p)[:8],16); rows=[]; ev=[]; seen=set()
    for i in range(1,count+1):
        a=Fraction(11+(seed+i*13)%70,10); b=Fraction(12+(seed//7+i*9)%60,10)
        if op=='÷': b=Fraction(2+i,2); a=b*Fraction(3+i,2)
        v=calc(a,op,b)
        while v is None or not finite(v) or (render(a),render(b)) in seen: a+=Fraction(1,10); v=calc(a,op,b)
        seen.add((render(a),render(b))); expr=f'{render(a)}{op}{render(b)}'; ans=render(v)
        check=v-b if op=='+' else v+b if op=='-' else v/b if op=='×' else v*b
        if check!=a:raise AssertionError('inverse check failed')
        rows.append({'question':q[:m.start()]+expr+q[m.end():],'answer':ans,'explanation':f'{expr}={ans}。逆演算でも確認済み。','numeric_signature':(render(a),render(b))})
        ev.append({'parent_sha256':sha(p),'method':'finite_decimal_exact_fraction_and_inverse_operation_identity','parent_recalculation':f'{render(pa)}{op}{render(pb)}={render(pv)}','variant_recalculation':f'{expr}={ans}','independent_check':'inverse operation reconstructs left operand PASS'})
    return rows,ev,'finite_decimal_binary_arithmetic_exact'
