from __future__ import annotations

"""Fail-closed exact engine for two fair six-sided dice product probability."""
import hashlib,json,re
from fractions import Fraction

DICE_RE=re.compile(r"(?:2|二)\s*(?:個|つ)\s*の?\s*(?:サイコロ|さいころ)")
PRODUCT_RE=re.compile(r"(?:出た目(?:の)?|目(?:の)?)?\s*積(?:が|は)\s*(?P<product>\d+)\s*(?:に)?なる")
ANSWER_RE=re.compile(r"^(?:P\s*=\s*)?(?P<p>\d+\s*/\s*\d+|0|1)$",re.IGNORECASE)
BLOCKED_RE=re.compile(r"和|差|大きい|小さい|以上|以下|未満|より|少なくとも|高々|同じ目|ぞろ目|偶数|奇数|最大|最小|場合の数|期待値|3\s*(?:個|つ)\s*の?\s*(?:サイコロ|さいころ)")

def _norm(v:object)->str:return str(v or "").replace("　"," ").replace("／","/").replace("＝","=")
def _sha(p:dict)->str:return hashlib.sha256(json.dumps(p,ensure_ascii=False,sort_keys=True,separators=(",",":")).encode()).hexdigest()
def _answer(v:object):
    m=ANSWER_RE.fullmatch(_norm(v).replace(" ",""))
    if not m:return None
    try:return Fraction(m.group("p"))
    except (ValueError,ZeroDivisionError):return None

def _count(product:int)->int:return sum(1 for a in range(1,7) for b in range(1,7) if a*b==product)
def _divisor_pair_count(product:int)->int:return sum(1 for a in range(1,7) if product%a==0 and 1<=product//a<=6)

def _parse(parent:dict):
    if parent.get("figure_refs") or parent.get("choices"):return None
    q=_norm(parent.get("question"))
    if BLOCKED_RE.search(q) or "確率" not in q:return None
    ds=list(DICE_RE.finditer(q));ps=list(PRODUCT_RE.finditer(q))
    if len(ds)!=1 or len(ps)!=1:return None
    target=int(ps[0].group("product"));fav=_count(target);div=_divisor_pair_count(target)
    if fav<=0 or fav!=div:return None
    expected=Fraction(fav,36);stated=_answer(parent.get("answer"))
    if stated is None or stated!=expected:return None
    return q,ps[0],target,fav,expected

def can_generate(parent:dict):
    if _parse(parent) is not None:return True,"two_fair_dice_product_exact_36_outcomes"
    if parent.get("figure_refs"):return False,"figure_parent"
    if parent.get("choices"):return False,"choice_parent"
    return False,"two_dice_product_probability_parent_not_exactly_parsed_and_verified"

def generate(parent:dict,count:int):
    if count not in (1,2,3):raise ValueError("count must be 1, 2, or 3")
    parsed=_parse(parent)
    if parsed is None:return [],[],can_generate(parent)[1]
    q,m,parent_target,parent_fav,parent_p=parsed;seed=int(_sha(parent)[:12],16);rows=[];ev=[];seen=set()
    feasible=[n for n in range(1,37) if _count(n)>0]
    candidates=[feasible[(seed+i*5)%len(feasible)] for i in range(1,len(feasible)*2+1)]+feasible
    targets=[]
    for t in candidates:
        if t==parent_target or t in seen:continue
        seen.add(t);targets.append(t)
        if len(targets)==count:break
    if len(targets)!=count:raise AssertionError("insufficient distinct two-dice product targets")
    for t in targets:
        fav=_count(t);div=_divisor_pair_count(t)
        if fav!=div or fav<=0:raise AssertionError("two-dice product divisor identity failed")
        p=Fraction(fav,36);nq=q[:m.start("product")]+str(t)+q[m.end("product"):]
        rows.append({"question":nq,"answer":str(p),"explanation":f"2個のサイコロの出方36通りを数えると、積が{t}になるのは{fav}通り。確率は{fav}/36={p}。","numeric_signature":("2",str(t))})
        ev.append({"parent_sha256":_sha(parent),"method":"two_fair_dice_product_exhaustive_36_and_divisor_pairs","parent_recalculation":f"enumerated favorable={parent_fav}/36 => {parent_p}","variant_recalculation":f"enumerated favorable={fav}/36 => {p}","independent_check":f"ordered divisor-pair count={div}=enumerated favorable={fav} PASS"})
    return rows,ev,"two_fair_dice_product_exact_36_outcomes"
