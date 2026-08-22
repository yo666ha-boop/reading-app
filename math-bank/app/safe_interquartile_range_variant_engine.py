from __future__ import annotations

"""Fail-closed exact engine for an 8-value integer interquartile-range parent.

Only parents with exactly one explicit comma-separated list of 8 integers asking
solely for the interquartile range (四分位範囲) are accepted. Q1 and Q3 are the
medians of the lower/upper four sorted values, so 2*IQR is checked independently
as (u2+u3)-(l2+l3). Frequency tables, box plots, compound statistics, figures
and real choices fail closed.
"""

from fractions import Fraction
import hashlib, json, re

LIST_RE = re.compile(r"(?P<expr>-?\d+(?:\s*[、,]\s*-?\d+){7})")
ANSWER_RE = re.compile(r"^-?\d+(?:\.5)?$")

def _norm(v: object) -> str:
    return str(v or "").replace("，", ",").replace("　", " ")

def _parent_sha(parent: dict) -> str:
    raw=json.dumps(parent,ensure_ascii=False,sort_keys=True,separators=(",",":")).encode()
    return hashlib.sha256(raw).hexdigest()

def _fmt(x: Fraction) -> str:
    if x.denominator == 1: return str(x.numerator)
    if x.denominator == 2: return f"{x.numerator/2:.1f}"
    raise AssertionError("unexpected non-half fraction")

def _parse_parent(parent: dict):
    if parent.get("figure_refs") or parent.get("choices"): return None
    q=_norm(parent.get("question"))
    if "四分位範囲" not in q: return None
    blocked=("中央値","平均","最頻値","範囲を","度数","階級","表","グラフ","箱ひげ","四分位数を","分散","標準偏差")
    if any(t in q for t in blocked): return None
    ms=list(LIST_RE.finditer(q))
    if len(ms)!=1: return None
    m=ms[0]; values=[int(x) for x in re.split(r"\s*[、,]\s*",m.group("expr"))]
    if len(values)!=8: return None
    s=sorted(values)
    q1=Fraction(s[1]+s[2],2); q3=Fraction(s[5]+s[6],2); iqr=q3-q1
    a=_norm(parent.get("answer")).replace(" ","")
    if ANSWER_RE.fullmatch(a) is None or Fraction(a) != iqr: return None
    if 2*iqr != Fraction((s[5]+s[6])-(s[1]+s[2]),1): return None
    return m, values, q1, q3, iqr

def can_generate(parent: dict) -> tuple[bool,str]:
    if _parse_parent(parent) is not None: return True,"eight_integer_iqr_exact"
    if parent.get("figure_refs"): return False,"figure_parent"
    if parent.get("choices"): return False,"choice_parent"
    return False,"iqr_parent_not_exactly_parsed_and_verified"

def _variant_values(seed:int,index:int)->list[int]:
    base=3+((seed>>(index*5))+index*7)%20
    gaps=[1+((seed>>(index*7+j*4))+j+index)%5 for j in range(7)]
    vals=[base]
    for g in gaps: vals.append(vals[-1]+g)
    if index%2==0: vals=vals[3:]+vals[:3]
    elif index==3: vals[0],vals[6]=vals[6],vals[0]
    return vals

def generate(parent:dict,count:int):
    if count not in (1,2,3): raise ValueError("count must be 1, 2, or 3")
    parsed=_parse_parent(parent)
    if parsed is None:
        ok,reason=can_generate(parent); assert not ok; return [],[],reason
    match,parent_values,parent_q1,parent_q3,parent_iqr=parsed
    q=_norm(parent.get("question")); seed=int(_parent_sha(parent)[:12],16)
    parent_sig=tuple(map(str,parent_values)); seen=set(); rows=[]; evidence=[]
    for index in range(1,count+1):
        vals=_variant_values(seed,index); sig=tuple(map(str,vals)); bump=0
        while sig==parent_sig or sig in seen:
            bump+=1; vals=[v+bump for v in vals]; sig=tuple(map(str,vals))
        seen.add(sig); s=sorted(vals)
        q1=Fraction(s[1]+s[2],2); q3=Fraction(s[5]+s[6],2); iqr=q3-q1
        if 2*iqr != Fraction((s[5]+s[6])-(s[1]+s[2]),1): raise AssertionError("IQR identity failed")
        replacement="、".join(map(str,vals)); nq=q[:match.start("expr")]+replacement+q[match.end("expr"):]
        rows.append({"question":nq,"answer":_fmt(iqr),"explanation":f"小さい順に並べ、Q1={_fmt(q1)}、Q3={_fmt(q3)}。四分位範囲=Q3-Q1={_fmt(iqr)}。","numeric_signature":sig})
        evidence.append({"parent_sha256":_parent_sha(parent),"method":"eight_integer_iqr_lower_upper_half_medians","parent_recalculation":f"Q1={_fmt(parent_q1)},Q3={_fmt(parent_q3)},IQR={_fmt(parent_iqr)}","variant_recalculation":f"Q1={_fmt(q1)},Q3={_fmt(q3)},IQR={_fmt(iqr)}","independent_check":"2*IQR == (s6+s7)-(s2+s3) PASS"})
    return rows,evidence,"eight_integer_iqr_exact"
