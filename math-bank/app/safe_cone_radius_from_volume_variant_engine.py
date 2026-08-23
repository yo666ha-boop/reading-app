from __future__ import annotations

"""Fail-closed exact engine for cone radius from volume using pi=3.14."""

from decimal import Decimal, InvalidOperation
import hashlib, json, math, re

PI=Decimal("3.14")
HEIGHT_RE=re.compile(r"高さ\s*(?P<height>\d+)\s*cm")
VOLUME_RE=re.compile(r"体積\s*(?P<volume>\d+(?:\.\d+)?)\s*(?:cm³|cm\^3|cm3)")
ANSWER_RE=re.compile(r"^(?P<radius>\d+)\s*cm$")
METER_CUBED_RE=re.compile(r"(?<!c)m(?:³|\^3|3)")

def _norm(v):
    return str(v or "").replace("　"," ").replace("ｃｍ","cm").replace("ＣＭ","cm").replace("㎤","cm³")

def _sha(parent):
    return hashlib.sha256(json.dumps(parent,ensure_ascii=False,sort_keys=True,separators=(",",":")).encode()).hexdigest()

def _fmt(v:Decimal):
    t=format(v,"f"); return t.rstrip("0").rstrip(".") if "." in t else t

def _parse_parent(parent):
    if parent.get("figure_refs") or parent.get("choices"): return None
    q=_norm(parent.get("question"))
    if not any(t in q for t in ("円すい","円錐")) or not all(t in q for t in ("半径","高さ","体積","円周率","3.14")): return None
    blocked=("直径","表面積","側面積","底面積","高さを求","体積を求","円柱","球","図","グラフ","mm","km")
    if any(t in q for t in blocked) or METER_CUBED_RE.search(q): return None
    hms=list(HEIGHT_RE.finditer(q)); vms=list(VOLUME_RE.finditer(q))
    if len(hms)!=1 or len(vms)!=1: return None
    hm,vm=hms[0],vms[0]; h=int(hm.group("height"))
    if h<=0: return None
    try: V=Decimal(vm.group("volume"))
    except InvalidOperation: return None
    if V<=0: return None
    r2=(Decimal(3)*V)/(PI*Decimal(h))
    if r2!=r2.to_integral_value() or r2<=0: return None
    r=math.isqrt(int(r2))
    if r*r!=int(r2): return None
    am=ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ",""))
    if am is None or int(am.group("radius"))!=r: return None
    if PI*Decimal(r*r*h)/Decimal(3)!=V: return None
    return hm,vm,h,V,r

def can_generate(parent):
    if _parse_parent(parent) is not None: return True,"cone_radius_from_volume_pi_3_14_exact"
    if parent.get("figure_refs"): return False,"figure_parent"
    if parent.get("choices"): return False,"choice_parent"
    return False,"cone_radius_parent_not_exactly_parsed_and_verified"

def generate(parent,count):
    if count not in (1,2,3): raise ValueError("count must be 1, 2, or 3")
    parsed=_parse_parent(parent)
    if parsed is None:
        ok,reason=can_generate(parent); assert not ok; return [],[],reason
    hm,vm,ph,pv,pr=parsed; q=_norm(parent.get("question")); seed=int(_sha(parent)[:12],16)
    rows=[]; evidence=[]; seen=set()
    for i in range(1,count+1):
        r=3+((seed>>(i*5))+i*7)%10
        h=3+((seed>>(i*7+3))+i*5)%15
        while (r*r*h)%3!=0: h+=1
        sig=(r,h)
        while sig==(pr,ph) or sig in seen:
            h+=3; sig=(r,h)
        seen.add(sig)
        V=PI*Decimal(r*r*h)/Decimal(3)
        r2=(Decimal(3)*V)/(PI*Decimal(h)); root=math.isqrt(int(r2)) if r2==r2.to_integral_value() else -1
        if root!=r or PI*Decimal(r*r*h)/Decimal(3)!=V: raise AssertionError("cone radius inverse identity failed")
        reps=[(hm.start(),hm.end(),f"高さ{h}cm"),(vm.start(),vm.end(),f"体積{_fmt(V)}cm³")]
        nq=q
        for s,e,repl in sorted(reps,reverse=True): nq=nq[:s]+repl+nq[e:]
        rows.append({"question":nq,"answer":f"{r}cm","explanation":f"半径²=3×体積÷(円周率×高さ)より、3×{_fmt(V)}÷(3.14×{h})={r*r}。したがって半径は{r}cm。体積へ戻しても一致します。","numeric_signature":(str(h),_fmt(V),"3.14")})
        evidence.append({"parent_sha256":_sha(parent),"method":"cone_radius_exact_triple_volume_division_square_root_and_recomposition","parent_recalculation":f"3×{_fmt(pv)}÷(3.14×{ph})={pr*pr}; sqrt={pr}cm","variant_recalculation":f"3×{_fmt(V)}÷(3.14×{h})={r*r}; sqrt={r}cm","independent_check":f"3.14×{r}²×{h}÷3={_fmt(V)}cm³ PASS"})
    return rows,evidence,"cone_radius_from_volume_pi_3_14_exact"
