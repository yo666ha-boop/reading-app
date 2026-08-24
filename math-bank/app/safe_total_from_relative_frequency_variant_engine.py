from __future__ import annotations

"""Fail-closed exact engine for class frequency + relative frequency -> total."""

import hashlib
import json
import re
from decimal import Decimal, InvalidOperation
from fractions import Fraction

DATA_RE=re.compile(r"度数(?:は|が)\s*(?P<freq>\d+)\s*(?:人|個|回|名)?[^\d]{0,32}相対度数(?:は|が)\s*(?P<rel>0(?:\.\d+)?|1(?:\.0+)?)")
ANSWER_RE=re.compile(r"^(?P<total>\d+)\s*(?:人|個|回|名)?$")


def _norm(v:object)->str:
    return str(v or "").replace("　"," ").replace("．",".")


def _sha(parent:dict)->str:
    return hashlib.sha256(json.dumps(parent,ensure_ascii=False,sort_keys=True,separators=(",", ":")).encode("utf-8")).hexdigest()


def _frac(text:str):
    try: return Fraction(Decimal(text))
    except (InvalidOperation,ValueError): return None


def _fmt(frac:Fraction)->str:
    d=Decimal(frac.numerator)/Decimal(frac.denominator); s=format(d,"f")
    return s.rstrip("0").rstrip(".") if "." in s else s


def _parse_parent(parent:dict):
    if parent.get("figure_refs") or parent.get("choices"): return None
    q=_norm(parent.get("question"))
    if "相対度数" not in q or not any(t in q for t in ("全体の度数を求","全体の度数は何","全体は何")): return None
    blocked=("百分率","%","累積","平均","中央値","最頻値","範囲","表","グラフ","ヒストグラム","箱ひげ")
    if any(t in q for t in blocked): return None
    ms=list(DATA_RE.finditer(q))
    if len(ms)!=1: return None
    m=ms[0]; freq=int(m.group("freq")); rel=_frac(m.group("rel"))
    if freq<=0 or rel is None or rel<=0 or rel>1: return None
    total=Fraction(freq,1)/rel
    if total.denominator!=1 or total.numerator<freq: return None
    total_i=total.numerator
    am=ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ",""))
    if am is None or int(am.group("total"))!=total_i: return None
    if Fraction(freq,total_i)!=rel: return None
    return m,freq,rel,total_i


def can_generate(parent:dict)->tuple[bool,str]:
    if _parse_parent(parent) is not None: return True,"total_from_relative_frequency_exact"
    if parent.get("figure_refs"): return False,"figure_parent"
    if parent.get("choices"): return False,"choice_parent"
    return False,"total_from_relative_frequency_parent_not_exactly_parsed_and_verified"


def generate(parent:dict,count:int)->tuple[list[dict],list[dict],str]:
    if count not in (1,2,3): raise ValueError("count must be 1, 2, or 3")
    parsed=_parse_parent(parent)
    if parsed is None:
        ok,reason=can_generate(parent); assert not ok
        return [],[],reason
    match,pfreq,prel,ptotal=parsed; q=_norm(parent.get("question")); seed=int(_sha(parent)[:12],16)
    options=((5,Fraction(1,4),20),(12,Fraction(3,10),40),(20,Fraction(2,5),50),(5,Fraction(1,5),25),(35,Fraction(7,20),100))
    seen=set(); rows=[]; evidence=[]
    for index in range(count):
        freq,rel,total=options[(seed+index)%len(options)]; sig=(str(freq),_fmt(rel))
        bump=0
        while sig==(str(pfreq),_fmt(prel)) or sig in seen:
            bump+=1; freq,rel,total=options[(seed+index+bump)%len(options)]; sig=(str(freq),_fmt(rel))
        seen.add(sig)
        if Fraction(freq,total)!=rel or Fraction(freq,1)/rel!=total: raise AssertionError("total relative frequency identity failed")
        matched=match.group(0); repl=matched
        spans=[(match.start("freq")-match.start(),match.end("freq")-match.start(),str(freq)),(match.start("rel")-match.start(),match.end("rel")-match.start(),_fmt(rel))]
        for a,b,val in sorted(spans,reverse=True): repl=repl[:a]+val+repl[b:]
        new_q=q[:match.start()]+repl+q[match.end():]
        rows.append({"question":new_q,"answer":str(total),"explanation":f"全体の度数=度数÷相対度数より、{freq}÷{_fmt(rel)}={total}。{freq}/{total}={_fmt(rel)}でも確認済み。","numeric_signature":sig})
        evidence.append({"parent_sha256":_sha(parent),"method":"total_from_relative_frequency_exact_division_and_fraction_identity","parent_recalculation":f"{pfreq}/{_fmt(prel)}={ptotal} and {pfreq}/{ptotal}={_fmt(prel)}","variant_recalculation":f"{freq}/{_fmt(rel)}={total} and {freq}/{total}={_fmt(rel)}","independent_check":"total == frequency/relative AND frequency/total == relative PASS"})
    return rows,evidence,"total_from_relative_frequency_exact"
