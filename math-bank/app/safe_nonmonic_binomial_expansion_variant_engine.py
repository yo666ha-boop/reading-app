from __future__ import annotations
import hashlib,json,re

EXPR_RE=re.compile(r"(?P<expr>\((?P<a>\d+)x(?P<b>[+-]\d+)\)\((?P<c>\d+)x(?P<d>[+-]\d+)\))")
ANS_RE=re.compile(r"^(?P<A>\d+)x(?:\^2|²)(?P<B>[+-](?:\d+)?)x(?P<C>[+-]\d+)$")

def _norm(v):
    return re.sub(r"\s+","",str(v or "").replace("　","").replace("−","-").replace("＋","+").replace("ｘ","x").replace("Ｘ","x"))
def _sha(p): return hashlib.sha256(json.dumps(p,ensure_ascii=False,sort_keys=True,separators=(",",":")).encode()).hexdigest()
def _sgn(n): return f"+{n}" if n>=0 else str(n)
def _xcoef(n):
    if n==1: return "+x"
    if n==-1: return "-x"
    return f"{_sgn(n)}x"
def _signed_coef(text):
    if text=="+": return 1
    if text=="-": return -1
    return int(text)
def _parse(parent):
    if parent.get("figure_refs") or parent.get("choices"): return None
    q=_norm(parent.get("question"))
    if "展開" not in q or any(t in q for t in ("因数分解","方程式","証明","面積","グラフ","平方完成")): return None
    ms=list(EXPR_RE.finditer(q))
    if len(ms)!=1: return None
    m=ms[0]; outside=q[:m.start()]+q[m.end():]
    if "x" in outside: return None
    a=int(m.group("a")); b=int(m.group("b")); c=int(m.group("c")); d=int(m.group("d"))
    if a<=0 or c<=0 or a==1 and c==1: return None
    A=a*c; B=a*d+b*c; C=b*d
    am=ANS_RE.fullmatch(_norm(parent.get("answer")))
    if am is None or (int(am.group("A")),_signed_coef(am.group("B")),int(am.group("C")))!=(A,B,C): return None
    return m,a,b,c,d,A,B,C
def can_generate(parent):
    if _parse(parent) is not None: return True,"nonmonic_binomial_integer_expansion_exact"
    if parent.get("figure_refs"): return False,"figure_parent"
    if parent.get("choices"): return False,"choice_parent"
    return False,"nonmonic_binomial_expansion_parent_not_exactly_parsed_and_verified"
def generate(parent,count):
    if count not in (1,2,3): raise ValueError("count must be 1, 2, or 3")
    parsed=_parse(parent)
    if parsed is None:
        ok,reason=can_generate(parent); assert not ok; return [],[],reason
    m,pa,pb,pc,pd,pA,pB,pC=parsed; q=_norm(parent.get("question")); seed=int(_sha(parent)[:12],16)
    parent_sig=(str(pa),str(pb),str(pc),str(pd)); seen=set(); rows=[]; ev=[]
    for i in range(1,count+1):
        a=1+((seed>>(i*4))%4); c=1+((seed>>(i*6+2))%4); b=1+((seed>>(i*7+3))%7); d=1+((seed>>(i*8+5))%7)
        if (seed>>(i+11))&1: b=-b
        if (seed>>(i+15))&1: d=-d
        if a==1 and c==1: a=2
        sig=(str(a),str(b),str(c),str(d)); bump=0
        while sig==parent_sig or sig in seen or b==0 or d==0:
            bump+=1; d += 1 if d>0 else -1; sig=(str(a),str(b),str(c),str(d))
        seen.add(sig); A=a*c; B=a*d+b*c; C=b*d
        if (A,B,C)!=(a*c,a*d+b*c,b*d): raise AssertionError("nonmonic binomial expansion identity failed")
        expr=f"({a}x{_sgn(b)})({c}x{_sgn(d)})"; nq=q[:m.start("expr")]+expr+q[m.end("expr"):]; ans=f"{A}x²{_xcoef(B)}{_sgn(C)}"
        rows.append({"question":nq,"answer":ans,"explanation":f"{a*c}x²+({_sgn(a*d)}{_sgn(b*c)})x+({b}×{d})を整理して{ans}。3係数を独立確認済み。","numeric_signature":sig})
        ev.append({"parent_sha256":_sha(parent),"method":"nonmonic_binomial_four_products_and_coefficient_recomposition","parent_recalculation":f"A={pa}*{pc}={pA}; B={pa}*{pd}+{pb}*{pc}={pB}; C={pb}*{pd}={pC}","variant_recalculation":f"A={a}*{c}={A}; B={a}*{d}+{b}*{c}={B}; C={b}*{d}={C}","independent_check":"all three expanded coefficients exactly recomposed from four products PASS"})
    return rows,ev,"nonmonic_binomial_integer_expansion_exact"
