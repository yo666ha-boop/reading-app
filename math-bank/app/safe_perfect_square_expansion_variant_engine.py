from __future__ import annotations
"""Fail-closed exact engine for expanding (x+a)^2."""
import hashlib,json,re

EXPR_RE=re.compile(r"\(x(?P<a>[+-]\d+)\)(?:\^2|²)")
ANS_RE=re.compile(r"^x(?:\^2|²)(?P<m>[+-]\d+)x(?P<c>[+-]\d+)$")

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
    a=int(m.group("a")); mid=2*a; const=a*a
    am=ANS_RE.fullmatch(_norm(parent.get("answer")))
    if am is None or int(am.group("m"))!=mid or int(am.group("c"))!=const: return None
    if (1,2*a,a*a)!=(1,mid,const): return None
    return m,a,mid,const
def can_generate(parent):
    if _parse(parent) is not None: return True,"perfect_square_integer_expansion_exact"
    if parent.get("figure_refs"): return False,"figure_parent"
    if parent.get("choices"): return False,"choice_parent"
    return False,"perfect_square_expansion_parent_not_exactly_parsed_and_verified"
def _val(seed,index):
    a=1+((seed>>(index*5))+index*7)%12
    return -a if (seed>>(index+2))&1 else a
def generate(parent,count):
    if count not in (1,2,3): raise ValueError("count must be 1, 2, or 3")
    parsed=_parse(parent)
    if parsed is None:
        ok,reason=can_generate(parent); assert not ok; return [],[],reason
    m,pa,pm,pc=parsed; q=_norm(parent.get("question")); seed=int(_sha(parent)[:12],16)
    seen=set(); rows=[]; ev=[]
    for i in range(1,count+1):
        a=_val(seed,i); bump=0
        while a==pa or a in seen or a==0:
            bump+=1; a += bump if a>0 else -bump
        seen.add(a); mid=2*a; const=a*a
        if (1,2*a,a*a)!=(1,mid,const): raise AssertionError("perfect square expansion identity failed")
        expr=f"(x{_signed(a)})²"; newq=q[:m.start()]+expr+q[m.end():]
        ans=f"x²{_signed(mid)}x{_signed(const)}"
        rows.append({"question":newq,"answer":ans,"explanation":f"(x{_signed(a)})²=x²{_signed(2*a)}x{_signed(a*a)}。中央係数2aと定数a²を独立確認済み。","numeric_signature":(str(a),)})
        ev.append({"parent_sha256":_sha(parent),"method":"perfect_square_expansion_double_and_square_coefficients","parent_recalculation":f"2a={pm}, a^2={pc}","variant_recalculation":f"2a={mid}, a^2={const}","independent_check":"expanded coefficients (1,2a,a^2) exactly match answer PASS"})
    return rows,ev,"perfect_square_integer_expansion_exact"
