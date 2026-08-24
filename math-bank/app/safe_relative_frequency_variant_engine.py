from __future__ import annotations

"""Fail-closed exact engine for narrow relative-frequency parent shapes."""

import hashlib
import json
import re
from decimal import Decimal, InvalidOperation
from fractions import Fraction

from safe_frequency_from_relative_frequency_variant_engine import generate as generate_frequency_inverse
from safe_total_from_relative_frequency_variant_engine import generate as generate_total_inverse

PAIR_PATTERNS=(
    re.compile(r"度数(?:は|が)\s*(?P<freq>\d+)\s*(?:人|個|回|名)?[^\d]{0,24}全体(?:の度数)?(?:は|が)\s*(?P<total>\d+)"),
    re.compile(r"全体(?:の度数)?(?:は|が)\s*(?P<total>\d+)\s*(?:人|個|回|名)?[^\d]{0,24}度数(?:は|が)\s*(?P<freq>\d+)"),
)
ANSWER_RE=re.compile(r"^(?:0(?:\.\d+)?|1(?:\.0+)?)$")


def _norm(value:object)->str:
    return str(value or "").replace("　"," ").replace("．",".").replace("，",",")


def _parent_sha(parent:dict)->str:
    raw=json.dumps(parent,ensure_ascii=False,sort_keys=True,separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def _decimal_fraction(text:str):
    try: return Fraction(Decimal(text))
    except (InvalidOperation,ValueError): return None


def _terminates_base10(frac:Fraction)->bool:
    d=frac.denominator
    for p in (2,5):
        while d%p==0: d//=p
    return d==1


def _format_fraction(frac:Fraction)->str:
    if not _terminates_base10(frac): raise ValueError("non-terminating decimal")
    d=frac.denominator; twos=fives=0
    while d%2==0: twos+=1; d//=2
    while d%5==0: fives+=1; d//=5
    places=max(twos,fives); scaled=frac.numerator*(10**places)//frac.denominator
    if places==0: return str(scaled)
    s=str(scaled).zfill(places+1); out=s[:-places]+"."+s[-places:]
    return out.rstrip("0").rstrip(".")


def _parse_parent(parent:dict):
    if parent.get("figure_refs") or parent.get("choices"): return None
    q=_norm(parent.get("question"))
    if "相対度数" not in q: return None
    blocked=("百分率","%","累積","平均","中央値","最頻値","範囲","表","グラフ","ヒストグラム","箱ひげ")
    if any(t in q for t in blocked): return None
    matches=[]
    for pat in PAIR_PATTERNS: matches.extend(pat.finditer(q))
    if len(matches)!=1: return None
    m=matches[0]; freq=int(m.group("freq")); total=int(m.group("total"))
    if total<=0 or freq<0 or freq>total: return None
    frac=Fraction(freq,total)
    if not _terminates_base10(frac): return None
    answer_text=_norm(parent.get("answer")).replace(" ","")
    if not ANSWER_RE.fullmatch(answer_text): return None
    answer_frac=_decimal_fraction(answer_text)
    if answer_frac!=frac or answer_frac*total!=freq: return None
    return m,freq,total,frac


def can_generate(parent:dict)->tuple[bool,str]:
    rows,_,reason=generate_total_inverse(parent,1)
    if rows: return True,reason
    rows,_,reason=generate_frequency_inverse(parent,1)
    if rows: return True,reason
    if _parse_parent(parent) is not None: return True,"relative_frequency_exact_terminating_decimal"
    if parent.get("figure_refs"): return False,"figure_parent"
    if parent.get("choices"): return False,"choice_parent"
    return False,"relative_frequency_parent_not_exactly_parsed_and_verified"


def _variant_pair(seed:int,index:int)->tuple[int,int]:
    totals=(10,20,25,40,50); total=totals[(seed+index*7)%len(totals)]
    freq=1+((seed>>(index*5))+index*3)%(total-1)
    while not _terminates_base10(Fraction(freq,total)): freq=(freq%(total-1))+1
    return freq,total


def generate(parent:dict,count:int)->tuple[list[dict],list[dict],str]:
    if count not in (1,2,3): raise ValueError("count must be 1, 2, or 3")
    rows,evidence,reason=generate_total_inverse(parent,count)
    if rows: return rows,evidence,reason
    rows,evidence,reason=generate_frequency_inverse(parent,count)
    if rows: return rows,evidence,reason
    parsed=_parse_parent(parent)
    if parsed is None:
        ok,reason=can_generate(parent); assert not ok
        return [],[],reason
    match,parent_freq,parent_total,parent_frac=parsed; q=_norm(parent.get("question")); seed=int(_parent_sha(parent)[:12],16)
    parent_signature=(str(parent_freq),str(parent_total)); seen=set(); rows=[]; evidence=[]
    for index in range(1,count+1):
        freq,total=_variant_pair(seed,index); signature=(str(freq),str(total)); bump=0
        while signature==parent_signature or signature in seen:
            bump+=1; total=(10,20,25,40,50)[(index+bump)%5]; freq=1+((freq+bump)%(total-1))
            while not _terminates_base10(Fraction(freq,total)): freq=(freq%(total-1))+1
            signature=(str(freq),str(total))
        seen.add(signature); frac=Fraction(freq,total); answer=_format_fraction(frac)
        if _decimal_fraction(answer)*total!=freq: raise AssertionError("relative frequency cross-product check failed")
        matched=match.group(0); replacement=matched
        spans=[(match.start("freq")-match.start(),match.end("freq")-match.start(),str(freq)),(match.start("total")-match.start(),match.end("total")-match.start(),str(total))]
        for a,b,value in sorted(spans,reverse=True): replacement=replacement[:a]+value+replacement[b:]
        new_question=q[:match.start()]+replacement+q[match.end():]
        rows.append({"question":new_question,"answer":answer,"explanation":f"相対度数=度数÷全体の度数より、{freq}÷{total}={answer}。{answer}×{total}={freq}でも確認済み。","numeric_signature":signature})
        evidence.append({"parent_sha256":_parent_sha(parent),"method":"relative_frequency_exact_fraction_and_cross_product","parent_recalculation":f"{parent_freq}/{parent_total}={_format_fraction(parent_frac)}","variant_recalculation":f"{freq}/{total}={answer}","independent_check":f"{answer}*{total}={freq} PASS"})
    return rows,evidence,"relative_frequency_exact_terminating_decimal"
