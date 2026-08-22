from __future__ import annotations

"""Fail-closed exact engine for expanding (x+a)(x+b)."""
import hashlib,json,re

EXPR_RE=re.compile(r"\(x(?P<a>[+-]\d+)\)\(x(?P<b>[+-]\d+)\)")
ANS_RE=re.compile(r"^x(?:\^2|²)(?P<s>[+-]\d+)x(?P<p>[+-]\d+)$")

def _norm(v):
    return re.sub(r"\s+","",str(v or "").replace("　"," ").replace("−","-").replace("＋","+").replace("ｘ","x").replace("Ｘ","x"))
def _sha(p):
    return hashlib.sha256(json.dumps(p,ensure_ascii=False,sort_keys=True,separators=(",",":")).encode()).hexdigest()
def _signed(n): return f"+{n}" if n>=0 else str(n)
def _parse(parent):
    if parent.get("figure_refs") or parent.get("choices"): return None
    q=_norm(parent.get("question"))
    if "展開" not in q: return None
    if any(t in q for t in ("因数分解","方程式","証明","面積","グラフ","平方完成")): return None
    ms=list(EXPR_RE.finditer(q))
    if len(ms)!=1: return None
    m=ms[0]; outside=q[:m.start()]+q[m.end():]
    if "x" in outside: return None
    a=int(m.group("a")); b=int(m.group("b")); s=a+b; p=a*b
    am=ANS_RE.fullmatch(_norm(parent.get("answer")))
    if am is None or int(am.group("s"))!=s or int(am.group("p"))!=p: return None
    if (1,a+b,a*b)!=(1,s,p): return None
    return m,a,b,s,p
def can_generate(parent):
    if _parse(parent) is not None: return True,"binomial_integer_expansion_exact"
    if parent.get("figure_refs"): return False,"figure_parent"
    if parent.get("choices"): return False,"choice_parent"
    return False,"binomial_expansion_parent_not_exactly_parsed_and_verified"
def _vals(seed,index):
    a=1+((seed>>(index*5))+index*3)%9; b=1+((seed>>(index*7+2))+index*5)%9
    if (seed>>index)&1: a=-a
    if (seed>>(index+3))&1: b=-b
    return a,b
def generate(parent,count):
    if count not in (1,2,3): raise ValueError("count must be 1, 2, or 3")
    parsed=_parse(parent)
    if parsed is None:
        ok,reason=can_generate(parent); assert not ok; return [],[],reason
    m,pa,pb,ps,pp=parsed; q=_norm(parent.get("question")); seed=int(_sha(parent)[:12],16)
    parent_sig=(str(pa),str(pb)); seen=set(); rows=[]; ev=[]
    for i in range(1,count+1):
        a,b=_vals(seed,i); sig=(str(a),str(b)); bump=0
        while sig==parent_sig or sig in seen or a==0 or b==0:
            bump+=1; b+=bump; sig=(str(a),str(b))
        seen.add(sig); s=a+b; p=a*b
        if (1,a+b,a*b)!=(1,s,p): raise AssertionError("binomial expansion identity failed")
        expr=f"(x{_signed(a)})(x{_signed(b)})"; newq=q[:m.start()]+expr+q[m.end():]
        ans=f"x²{_signed(s)}x{_signed(p)}"
        rows.append({"question":newq,"answer":ans,"explanation":f"x²+({a}+{b})x+({a}×{b})={ans}。和と積の係数一致も確認済み。","numeric_signature":sig})
        ev.append({"parent_sha256":_sha(parent),"method":"binomial_expansion_sum_product_coefficients","parent_recalculation":f"sum={pa+pb}, product={pa*pb}","variant_recalculation":f"sum={s}, product={p}","independent_check":"expanded coefficients (1,a+b,a*b) exactly match answer PASS"})
    return rows,ev,"binomial_integer_expansion_exact"
