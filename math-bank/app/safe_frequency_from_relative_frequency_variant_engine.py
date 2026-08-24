from __future__ import annotations

"""Fail-closed exact engine for total + relative frequency -> class frequency."""

import hashlib
import json
import re
from decimal import Decimal, InvalidOperation
from fractions import Fraction

DATA_RE = re.compile(r"全体(?:の度数)?(?:は|が)\s*(?P<total>\d+)\s*(?:人|個|回|名)?[^\d]{0,32}相対度数(?:は|が)\s*(?P<rel>0(?:\.\d+)?|1(?:\.0+)?)")
ANSWER_RE = re.compile(r"^(?P<freq>\d+)\s*(?P<unit>人|個|回|名)?$")


def _norm(v:object)->str:
    return str(v or "").replace("　"," ").replace("．",".")


def _sha(parent:dict)->str:
    return hashlib.sha256(json.dumps(parent,ensure_ascii=False,sort_keys=True,separators=(",", ":")).encode("utf-8")).hexdigest()


def _frac(text:str):
    try: return Fraction(Decimal(text))
    except (InvalidOperation,ValueError): return None


def _parse_parent(parent:dict):
    if parent.get("figure_refs") or parent.get("choices"): return None
    q=_norm(parent.get("question"))
    if "相対度数" not in q or not any(t in q for t in ("度数を求","度数は何","何人","何個","何回","何名")): return None
    blocked=("百分率","%","累積","平均","中央値","最頻値","範囲","表","グラフ","ヒストグラム","箱ひげ")
    if any(t in q for t in blocked): return None
    ms=list(DATA_RE.finditer(q))
    if len(ms)!=1: return None
    m=ms[0]; total=int(m.group("total")); rel=_frac(m.group("rel"))
    if total<=0 or rel is None or rel<0 or rel>1: return None
    freq=rel*total
    if freq.denominator!=1: return None
    freq_i=freq.numerator
    am=ANSWER_RE.fullmatch(_norm(parent.get("answer")).replace(" ",""))
    if am is None or int(am.group("freq"))!=freq_i: return None
    if Fraction(freq_i,total)!=rel: return None
    return m,total,rel,freq_i,(am.group("unit") or "")


def can_generate(parent:dict)->tuple[bool,str]:
    if _parse_parent(parent) is not None: return True,"frequency_from_relative_frequency_exact"
    if parent.get("figure_refs"): return False,"figure_parent"
    if parent.get("choices"): return False,"choice_parent"
    return False,"frequency_from_relative_frequency_parent_not_exactly_parsed_and_verified"


def _fmt(frac:Fraction)->str:
    d=Decimal(frac.numerator)/Decimal(frac.denominator); s=format(d,"f")
    return s.rstrip("0").rstrip(".") if "." in s else s


def generate(parent:dict,count:int)->tuple[list[dict],list[dict],str]:
    if count not in (1,2,3): raise ValueError("count must be 1, 2, or 3")
    parsed=_parse_parent(parent)
    if parsed is None:
        ok,reason=can_generate(parent); assert not ok
        return [],[],reason
    match,ptotal,prel,pfreq,unit=parsed; q=_norm(parent.get("question")); seed=int(_sha(parent)[:12],16)
    options=((20,Fraction(1,4)),(40,Fraction(3,10)),(50,Fraction(2,5)),(25,Fraction(1,5)),(100,Fraction(7,20)))
    seen=set(); rows=[]; evidence=[]
    for index in range(count):
        total,rel=options[(seed+index)%len(options)]; freq=rel*total
        if freq.denominator!=1: raise AssertionError("fixture must give integer frequency")
        freq_i=freq.numerator; sig=(str(total),_fmt(rel)); bump=0
        while sig==(str(ptotal),_fmt(prel)) or sig in seen:
            bump+=1; total,rel=options[(seed+index+bump)%len(options)]; freq_i=(rel*total).numerator; sig=(str(total),_fmt(rel))
        seen.add(sig)
        if Fraction(freq_i,total)!=rel: raise AssertionError("relative frequency inverse identity failed")
        matched=match.group(0); repl=matched
        spans=[(match.start("total")-match.start(),match.end("total")-match.start(),str(total)),(match.start("rel")-match.start(),match.end("rel")-match.start(),_fmt(rel))]
        for a,b,val in sorted(spans,reverse=True): repl=repl[:a]+val+repl[b:]
        new_q=q[:match.start()]+repl+q[match.end():]
        rows.append({"question":new_q,"answer":f"{freq_i}{unit}","explanation":f"度数=全体の度数×相対度数より、{total}×{_fmt(rel)}={freq_i}{unit}。{freq_i}/{total}={_fmt(rel)}でも確認済み。","numeric_signature":sig})
        evidence.append({"parent_sha256":_sha(parent),"method":"frequency_from_relative_frequency_exact_product_and_division_identity","parent_recalculation":f"{ptotal}*{_fmt(prel)}={pfreq} and {pfreq}/{ptotal}={_fmt(prel)}","variant_recalculation":f"{total}*{_fmt(rel)}={freq_i} and {freq_i}/{total}={_fmt(rel)}","independent_check":"frequency == total*relative AND frequency/total == relative PASS"})
    return rows,evidence,"frequency_from_relative_frequency_exact"
