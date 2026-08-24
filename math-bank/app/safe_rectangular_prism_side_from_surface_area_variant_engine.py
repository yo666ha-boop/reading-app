from __future__ import annotations

"""Fail-closed exact engine: rectangular-prism surface area + width + height -> length."""

import hashlib,json,re
DATA_RE=re.compile(r"よこ\s*(?P<w>\d+)\s*cm\s*[、, ]*高さ\s*(?P<h>\d+)\s*cm\s*[、, ]*表面積\s*(?P<s>\d+)\s*(?:cm²|cm\^2|cm2|㎠)")
ANSWER_RE=re.compile(r"^(?P<l>\d+)\s*cm$")

def _norm(v:object)->str:return str(v or "").replace("　"," ").replace("ｃｍ","cm").replace("ＣＭ","cm").replace("㎠","cm²")
def _sha(p:dict)->str:return hashlib.sha256(json.dumps(p,ensure_ascii=False,sort_keys=True,separators=(",", ":")).encode()).hexdigest()
def _parse(p:dict):
    if p.get("figure_refs") or p.get("choices"):return None
    q=_norm(p.get("question"))
    if "直方体" not in q or "表面積" not in q or not any(t in q for t in ("たてを求","たては何")):return None
    if any(t in q for t in ("体積","立方体","展開図","図","mm","メートル")):return None
    ms=list(DATA_RE.finditer(q))
    if len(ms)!=1:return None
    m=ms[0];w=int(m.group("w"));h=int(m.group("h"));s=int(m.group("s"))
    if min(w,h,s)<=0 or s%2:return None
    num=s//2-w*h;den=w+h
    if num<=0 or num%den:return None
    l=num//den
    am=ANSWER_RE.fullmatch(_norm(p.get("answer")).replace(" ",""))
    if am is None or int(am.group("l"))!=l:return None
    if 2*(l*w+l*h+w*h)!=s:return None
    return m,w,h,s,l
def can_generate(p:dict):
    if _parse(p) is not None:return True,"rectangular_prism_side_from_surface_area_exact"
    if p.get("figure_refs"):return False,"figure_parent"
    if p.get("choices"):return False,"choice_parent"
    return False,"rectangular_prism_side_from_surface_area_parent_not_exactly_parsed_and_verified"
def generate(p:dict,count:int):
    if count not in (1,2,3):raise ValueError("count must be 1, 2, or 3")
    parsed=_parse(p)
    if parsed is None:
        ok,reason=can_generate(p);assert not ok;return [],[],reason
    m,pw,ph,ps,pl=parsed;q=_norm(p.get("question"));seed=int(_sha(p)[:12],16);parent_sig=(str(pw),str(ph),str(ps));seen=set();rows=[];ev=[]
    for i in range(1,count+1):
        w=2+((seed>>(i*4))+i*3)%10;h=2+((seed>>(i*6+1))+i*5)%11;l=2+((seed>>(i*7+2))+i*7)%12;s=2*(l*w+l*h+w*h);sig=(str(w),str(h),str(s))
        while sig==parent_sig or sig in seen:
            l+=1;s=2*(l*w+l*h+w*h);sig=(str(w),str(h),str(s))
        seen.add(sig)
        if s//2-w*h!=l*(w+h) or 2*(l*w+l*h+w*h)!=s:raise AssertionError("prism surface side inverse failed")
        repl=f"よこ{w}cm、高さ{h}cm、表面積{s}cm²";nq=q[:m.start()]+repl+q[m.end():]
        rows.append({"question":nq,"answer":f"{l}cm","explanation":f"表面積の半分から{w}×{h}を引くと、たて×({w}+{h})。よってたて=({s}/2-{w*h})/({w}+{h})={l}cm。表面積へ戻して確認。","numeric_signature":sig})
        ev.append({"parent_sha256":_sha(p),"method":"rectangular_prism_side_from_surface_area_exact_linear_inverse_and_recomposition","parent_recalculation":f"({ps}/2-{pw*ph})/({pw}+{ph})={pl}","variant_recalculation":f"({s}/2-{w*ph})/({w}+{h})={l}","independent_check":"S/2-wh == l(w+h) AND 2(lw+lh+wh)==S PASS"})
    return rows,ev,"rectangular_prism_side_from_surface_area_exact"
