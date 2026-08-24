from __future__ import annotations
import hashlib, json, re

PAIR = re.compile(r"(?P<a>\d+)\s*(?:°|度)\s*(?:と|、|,|，)\s*(?P<b>\d+)\s*(?:°|度)")
ANS = re.compile(r"^(?P<v>\d+)\s*(?:°|度)$")

def norm(v): return str(v or "").replace("　", " ")
def psha(p): return hashlib.sha256(json.dumps(p,ensure_ascii=False,sort_keys=True,separators=(",",":")).encode()).hexdigest()

def _blocked(q):
    return any(t in q for t in ("二等辺","直角三角形","合同","相似","平行","多角形","四角形","図","面積","辺","比"))

def parse_exterior(p):
    if p.get("figure_refs") or p.get("choices"): return None
    q=norm(p.get("question"))
    if "三角形" not in q or "外角" not in q: return None
    if not any(t in q for t in ("離れた2つ","離れた二つ","となり合わない2つ","となり合わない二つ","他の2つ","他の二つ","2つの内角","二つの内角")): return None
    if _blocked(q): return None
    ms=list(PAIR.finditer(q))
    if len(ms)!=1: return None
    m=ms[0]; a=int(m.group("a")); b=int(m.group("b")); e=a+b; adj=180-e
    am=ANS.fullmatch(norm(p.get("answer")).replace(" ",""))
    if min(a,b,adj)<=0 or e>=180 or am is None or int(am.group("v"))!=e: return None
    return m,a,b,e,adj

def parse_interior_missing(p):
    if p.get("figure_refs") or p.get("choices"): return None
    q=norm(p.get("question"))
    if "三角形" not in q or "外角" in q: return None
    if not any(t in q for t in ("2つの角","二つの角","2つの内角","二つの内角")): return None
    if not any(t in q for t in ("残りの角","残り1つの角","残り一つの角","もう1つの角","もう一つの角")): return None
    if _blocked(q): return None
    ms=list(PAIR.finditer(q))
    if len(ms)!=1: return None
    m=ms[0]; a=int(m.group("a")); b=int(m.group("b")); c=180-a-b
    am=ANS.fullmatch(norm(p.get("answer")).replace(" ",""))
    if min(a,b,c)<=0 or am is None or int(am.group("v"))!=c: return None
    return m,a,b,c

def can_generate(p):
    if parse_exterior(p) is not None: return True,"triangle_exterior_two_remote_integer_angles_exact"
    if parse_interior_missing(p) is not None: return True,"triangle_interior_missing_from_two_integer_angles_exact"
    if p.get("figure_refs"): return False,"figure_parent"
    if p.get("choices"): return False,"choice_parent"
    return False,"triangle_angle_parent_not_exactly_parsed_and_verified"

def nums(seed,index):
    a=20+((seed>>(index*5))+index*11)%70; b=20+((seed>>(index*7+3))+index*13)%70
    guard=0
    while a+b>=175:
        guard+=1
        if guard>32: raise AssertionError("triangle angle candidate search exhausted")
        b=20+((b+7)%70)
    return a,b

def _next_distinct(seed,index,parent_sig,seen):
    a,b=nums(seed,index); sig=(str(a),str(b)); bump=0
    while sig==parent_sig or sig in seen:
        bump+=1
        if bump>32: raise AssertionError("triangle angle distinct search exhausted")
        a=20+((a+5*bump)%70); b=20+((b+9*bump)%70)
        guard=0
        while a+b>=175:
            guard+=1
            if guard>32: raise AssertionError("triangle angle candidate search exhausted")
            b=20+((b+7)%70)
        sig=(str(a),str(b))
    return a,b,sig

def generate(p,count):
    if count not in (1,2,3): raise ValueError("count must be 1, 2, or 3")
    ext=parse_exterior(p); interior=parse_interior_missing(p)
    if ext is None and interior is None:
        ok,reason=can_generate(p); assert not ok; return [],[],reason
    q=norm(p.get("question")); seed=int(psha(p)[:12],16); seen=set(); rows=[]; evs=[]
    if ext is not None:
        m,pa,pb,pe,padj=ext; parent_sig=(str(pa),str(pb))
        for i in range(1,count+1):
            a,b,sig=_next_distinct(seed,i,parent_sig,seen); seen.add(sig); e=a+b; adj=180-e
            if adj<=0 or e!=a+b or a+b+adj!=180: raise AssertionError("triangle exterior angle identity failed")
            nq=q[:m.start()]+f"{a}°と{b}°"+q[m.end():]
            rows.append({"question":nq,"answer":f"{e}°","explanation":f"外角={a}+{b}={e}°。隣の内角は{adj}°で内角和180°も確認済み。","numeric_signature":sig})
            evs.append({"parent_sha256":psha(p),"method":"triangle_exterior_remote_sum_and_supplement_identity","parent_recalculation":f"{pa}+{pb}={pe};adjacent={padj}","variant_recalculation":f"{a}+{b}={e};adjacent={adj}","independent_check":f"exterior==a+b AND {a}+{b}+{adj}=180 PASS"})
        return rows,evs,"triangle_exterior_two_remote_integer_angles_exact"
    m,pa,pb,pc=interior; parent_sig=(str(pa),str(pb))
    for i in range(1,count+1):
        a,b,sig=_next_distinct(seed,i,parent_sig,seen); seen.add(sig); c=180-a-b
        if min(a,b,c)<=0 or a+b+c!=180: raise AssertionError("triangle interior angle sum identity failed")
        nq=q[:m.start()]+f"{a}°と{b}°"+q[m.end():]
        rows.append({"question":nq,"answer":f"{c}°","explanation":f"三角形の内角の和は180°なので、残りの角は180-{a}-{b}={c}°。","numeric_signature":sig})
        evs.append({"parent_sha256":psha(p),"method":"triangle_interior_sum_missing_angle_identity","parent_recalculation":f"180-{pa}-{pb}={pc}","variant_recalculation":f"180-{a}-{b}={c}","independent_check":f"{a}+{b}+{c}=180 PASS"})
    return rows,evs,"triangle_interior_missing_from_two_integer_angles_exact"
