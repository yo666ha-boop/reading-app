from __future__ import annotations

"""Fail-closed exact engine for trapezoid height from two bases and area."""
import hashlib, json, re
Q_RE=re.compile(r"上底\s*(?P<u>\d+)\s*(?P<unit>mm|cm|m).*?下底\s*(?P<l>\d+)\s*(?P=unit).*?面積\s*(?P<a>\d+)\s*(?P=unit)(?:²|\^2|2)")
A_RE=re.compile(r"^(?P<h>\d+)\s*(?P<unit>mm|cm|m)$")
def _norm(v): return str(v or "").replace("　"," ").replace("㎠","cm²").replace("㎡","m²").replace("㎟","mm²")
def _sha(p): return hashlib.sha256(json.dumps(p,ensure_ascii=False,sort_keys=True,separators=(",",":")).encode()).hexdigest()
def _parse(p):
    if p.get("figure_refs") or p.get("choices"): return None
    q=_norm(p.get("question"))
    if "台形" not in q or "高さ" not in q or not any(t in q for t in ("求め","何")): return None
    if any(t in q for t in ("上底を","下底を","周","図","グラフ","相似")): return None
    ms=list(Q_RE.finditer(q))
    if len(ms)!=1: return None
    m=ms[0]; u=int(m.group("u")); l=int(m.group("l")); a=int(m.group("a")); unit=m.group("unit")
    s=u+l
    if min(u,l,a)<=0 or (2*a)%s: return None
    h=2*a//s
    am=A_RE.fullmatch(_norm(p.get("answer")).replace(" ",""))
    if am is None or am.group("unit")!=unit or int(am.group("h"))!=h: return None
    if s*h!=2*a: return None
    return m,u,l,a,h,unit
def can_generate(p):
    if _parse(p) is not None: return True,"trapezoid_height_from_area_exact"
    if p.get("figure_refs"): return False,"figure_parent"
    if p.get("choices"): return False,"choice_parent"
    return False,"trapezoid_height_from_area_parent_not_exactly_parsed_and_verified"
def generate(p,count):
    if count not in (1,2,3): raise ValueError("count must be 1, 2, or 3")
    x=_parse(p)
    if x is None:
        ok,r=can_generate(p); assert not ok; return [],[],r
    m,pu,pl,pa,ph,unit=x; q=_norm(p.get("question")); seed=int(_sha(p)[:12],16); seen=set(); rows=[]; ev=[]
    for i in range(1,count+1):
        u=2+((seed>>(i*4))+i*5)%10; l=u+2+((seed>>(i*6+1))+i*3)%9; h=2+((seed>>(i*7+2))+i*4)%10
        s=u+l
        if s*h%2: l+=1; s=u+l
        a=s*h//2; sig=(u,l,a)
        while sig==(pu,pl,pa) or sig in seen:
            h+=2; a=s*h//2; sig=(u,l,a)
        seen.add(sig)
        if s*h!=2*a or (2*a)//s!=h: raise AssertionError("trapezoid height identity failed")
        repl=f"上底{u}{unit}、下底{l}{unit}、面積{a}{unit}²"; nq=q[:m.start()]+repl+q[m.end():]
        rows.append({"question":nq,"answer":f"{h}{unit}","explanation":f"高さ=2×面積÷(上底+下底)より、2×{a}÷({u}+{l})={h}{unit}。面積公式への戻し計算でも確認済み。","numeric_signature":(str(u),str(l),str(a))})
        ev.append({"parent_sha256":_sha(p),"method":"trapezoid_height_from_area_exact_inverse_and_recomposition","parent_recalculation":f"2*{pa}/({pu}+{pl})={ph}{unit}","variant_recalculation":f"2*{a}/({u}+{l})={h}{unit}","independent_check":"(upper+lower)*height == 2*area PASS"})
    return rows,ev,"trapezoid_height_from_area_exact"
