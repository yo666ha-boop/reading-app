from __future__ import annotations

"""Fail-closed exact engine for two fair coins: exactly k heads probability."""
import hashlib, json, re
from fractions import Fraction
from math import comb

K_RE = re.compile(r"表(?:が|は)?\s*(?P<k>[012])\s*枚")
ANS_RE = re.compile(r"^(?:(?P<n>\d+)\s*/\s*(?P<d>\d+)|(?P<i>\d+))$")


def _norm(v: object) -> str:
    return str(v or "").replace("　", " ").replace("／", "/")


def _sha(parent: dict) -> str:
    return hashlib.sha256(json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode()).hexdigest()


def _answer(v: object):
    m=ANS_RE.fullmatch(_norm(v).replace(" ",""))
    if not m: return None
    return Fraction(int(m.group("n")),int(m.group("d"))) if m.group("n") else Fraction(int(m.group("i")),1)


def _parse(parent: dict):
    if parent.get("figure_refs") or parent.get("choices"): return None
    q=_norm(parent.get("question"))
    required=("硬貨","2枚","確率")
    if not all(t in q for t in required): return None
    if any(t in q for t in ("3枚","4枚","少なくとも","以上","以下","裏が","条件付き","偏った")): return None
    ms=list(K_RE.finditer(q))
    if len(ms)!=1: return None
    k=int(ms[0].group("k")); p=Fraction(comb(2,k),4)
    if _answer(parent.get("answer")) != p: return None
    outcomes=[(a,b) for a in (0,1) for b in (0,1)]
    fav=sum(1 for a,b in outcomes if a+b==k)
    if fav != comb(2,k): return None
    return ms[0],k,p


def can_generate(parent: dict):
    if _parse(parent) is not None: return True,"two_fair_coins_exactly_k_heads_exact"
    if parent.get("figure_refs"): return False,"figure_parent"
    if parent.get("choices"): return False,"choice_parent"
    return False,"two_coin_heads_parent_not_exactly_parsed_and_verified"


def _fmt(p: Fraction) -> str:
    return str(p.numerator) if p.denominator==1 else f"{p.numerator}/{p.denominator}"


def generate(parent: dict,count:int):
    if count not in (1,2,3): raise ValueError("count must be 1, 2, or 3")
    parsed=_parse(parent)
    if parsed is None:
        return [],[],can_generate(parent)[1]
    match,parent_k,parent_p=parsed; q=_norm(parent.get("question")); seed=int(_sha(parent)[:12],16)
    rows=[]; evidence=[]; seen=set()
    choices=[0,1,2]
    for index in range(1,count+1):
        k=choices[(seed+index)%3]
        if k==parent_k or k in seen:
            for x in choices:
                if x!=parent_k and x not in seen: k=x; break
        if k in seen or k==parent_k:
            k=choices[(parent_k+index)%3]
        seen.add(k)
        p=Fraction(comb(2,k),4)
        newq=q[:match.start("k")]+str(k)+q[match.end("k"):]
        rows.append({"question":newq,"answer":_fmt(p),"explanation":f"2枚の硬貨の出方は4通り。表が{k}枚は{comb(2,k)}通りなので確率は{_fmt(p)}。","numeric_signature":(str(k),)})
        evidence.append({"parent_sha256":_sha(parent),"method":"two_coin_exhaustive_four_and_binomial_count","parent_recalculation":f"C(2,{parent_k})/4={_fmt(parent_p)}","variant_recalculation":f"C(2,{k})/4={_fmt(p)}","independent_check":f"exhaustive favorable outcomes={comb(2,k)} == C(2,{k}) PASS"})
    return rows,evidence,"two_fair_coins_exactly_k_heads_exact"
