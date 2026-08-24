from __future__ import annotations

"""Fail-closed exact engine for absolute difference of two fair six-sided dice."""
import hashlib,json,re
from fractions import Fraction
DICE_RE=re.compile(r"(?:2|二)\s*(?:個|つ)\s*の?\s*(?:サイコロ|さいころ)")
DIFF_RE=re.compile(r"(?:出た目(?:の)?|目(?:の)?)?\s*(?:差|差の絶対値)(?:が|は)\s*(?P<diff>\d+)\s*(?:に)?なる")
ANSWER_RE=re.compile(r"^(?:P\s*=\s*)?(?P<p>\d+\s*/\s*\d+|0|1)$",re.IGNORECASE)
BLOCKED_RE=re.compile(r"和|積|以上|以下|未満|より|少なくとも|高々|同じ目|ぞろ目|偶数|奇数|最大|最小|場合の数|期待値|3\s*(?:個|つ)\s*の?\s*(?:サイコロ|さいころ)")
def _norm(v:object)->str:return str(v or "").replace("　"," ").replace("／","/").replace("＝","=")
def _sha(p:dict)->str:return hashlib.sha256(json.dumps(p,ensure_ascii=False,sort_keys=True,separators=(",",":")).encode()).hexdigest()
def _ans(v:object):
    m=ANSWER_RE.fullmatch(_norm(v).replace(" ",""))
    if not m:return None
    try:return Fraction(m.group("p"))
    except (ValueError,ZeroDivisionError):return None
def _count(d:int)->int:return sum(1 for a in range(1,7) for b in range(1,7) if abs(a-b)==d)
def _formula(d:int)->int:return 6 if d==0 else 2*(6-d) if 1<=d<=5 else 0
def _parse(parent:dict):
    if parent.get("figure_refs") or parent.get("choices"):return None
    q=_norm(parent.get("question"))
    if BLOCKED_RE.search(q) or "確率" not in q:return None
    ds=list(DICE_RE.finditer(q));ms=list(DIFF_RE.finditer(q))
    if len(ds)!=1 or len(ms)!=1:return None
    d=int(ms[0].group("diff"));fav=_count(d);formula=_formula(d)
    if fav<=0 or fav!=formula:return None
    expected=Fraction(fav,36);stated=_ans(parent.get("answer"))
    if stated is None or stated!=expected:return None
    return q,ms[0],d,fav,expected
def can_generate(parent:dict):
    if _parse(parent) is not None:return True,"two_fair_dice_absolute_difference_exact_36_outcomes"
    if parent.get("figure_refs"):return False,"figure_parent"
    if parent.get("choices"):return False,"choice_parent"
    return False,"two_dice_difference_probability_parent_not_exactly_parsed_and_verified"
def generate(parent:dict,count:int):
    if count not in (1,2,3):raise ValueError("count must be 1, 2, or 3")
    parsed=_parse(parent)
    if parsed is None:return [],[],can_generate(parent)[1]
    q,m,pd,pfav,pp=parsed;seed=int(_sha(parent)[:12],16);rows=[];ev=[];targets=[]
    for j in range(1,20):
        d=(seed+j*3)%6
        if d!=pd and d not in targets:targets.append(d)
        if len(targets)==count:break
    for d in range(6):
        if len(targets)==count:break
        if d!=pd and d not in targets:targets.append(d)
    if len(targets)!=count:raise AssertionError("insufficient distinct two-dice difference targets")
    for d in targets:
        fav=_count(d);formula=_formula(d)
        if fav!=formula:raise AssertionError("two-dice difference identity failed")
        p=Fraction(fav,36);nq=q[:m.start("diff")]+str(d)+q[m.end("diff"):]
        rows.append({"question":nq,"answer":str(p),"explanation":f"2個のサイコロの出方36通りを数えると、目の差が{d}になるのは{fav}通り。確率は{fav}/36={p}。","numeric_signature":("2",str(d))})
        ev.append({"parent_sha256":_sha(parent),"method":"two_fair_dice_absolute_difference_exhaustive_36_and_closed_form","parent_recalculation":f"enumerated favorable={pfav}/36 => {pp}","variant_recalculation":f"enumerated favorable={fav}/36 => {p}","independent_check":f"closed-form favorable={formula}=enumerated favorable={fav} PASS"})
    return rows,ev,"two_fair_dice_absolute_difference_exact_36_outcomes"
