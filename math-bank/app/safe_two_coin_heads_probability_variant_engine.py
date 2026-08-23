from __future__ import annotations

"""Fail-closed exact engine for 2-4 fair coins: exactly k heads probability."""
import hashlib, json, re
from fractions import Fraction
from itertools import product
from math import comb

N_RE = re.compile(r"硬貨(?:を|は)?\s*(?P<n>[234])\s*枚")
K_RE = re.compile(r"表(?:が|は)?\s*(?P<k>[0-4])\s*枚")
ANS_RE = re.compile(r"^(?:(?P<num>\d+)\s*/\s*(?P<den>\d+)|(?P<i>\d+))$")


def _norm(v: object) -> str:
    return str(v or "").replace("　", " ").replace("／", "/")


def _sha(parent: dict) -> str:
    return hashlib.sha256(json.dumps(parent, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode()).hexdigest()


def _answer(v: object):
    m=ANS_RE.fullmatch(_norm(v).replace(" ",""))
    if not m: return None
    return Fraction(int(m.group("num")),int(m.group("den"))) if m.group("num") else Fraction(int(m.group("i")),1)


def _parse(parent: dict):
    if parent.get("figure_refs") or parent.get("choices"): return None
    q=_norm(parent.get("question"))
    if "公平" not in q or "確率" not in q: return None
    if any(t in q for t in ("少なくとも","以上","以下","裏が","条件付き","偏った","コイン")): return None
    ns=list(N_RE.finditer(q)); ks=list(K_RE.finditer(q))
    if len(ns)!=1 or len(ks)!=1: return None
    n=int(ns[0].group("n")); k=int(ks[0].group("k"))
    if not 0 <= k <= n: return None
    total=2**n; p=Fraction(comb(n,k),total)
    if _answer(parent.get("answer")) != p: return None
    fav=sum(1 for bits in product((0,1), repeat=n) if sum(bits)==k)
    if fav != comb(n,k): return None
    return ns[0],ks[0],n,k,p


def can_generate(parent: dict):
    if _parse(parent) is not None: return True,"fair_coins_2_to_4_exactly_k_heads_exact"
    if parent.get("figure_refs"): return False,"figure_parent"
    if parent.get("choices"): return False,"choice_parent"
    return False,"coin_heads_parent_not_exactly_parsed_and_verified"


def _fmt(p: Fraction) -> str:
    return str(p.numerator) if p.denominator==1 else f"{p.numerator}/{p.denominator}"


def _replace(q: str, nm, km, n: int, k: int) -> str:
    reps=[(nm.start("n"),nm.end("n"),str(n)),(km.start("k"),km.end("k"),str(k))]
    out=q
    for start,end,text in sorted(reps, reverse=True): out=out[:start]+text+out[end:]
    return out


def generate(parent: dict,count:int):
    if count not in (1,2,3): raise ValueError("count must be 1, 2, or 3")
    parsed=_parse(parent)
    if parsed is None: return [],[],can_generate(parent)[1]
    nm,km,parent_n,parent_k,parent_p=parsed; q=_norm(parent.get("question")); seed=int(_sha(parent)[:12],16)
    candidates=[(n,k) for n in (2,3,4) for k in range(n+1) if (n,k)!=(parent_n,parent_k)]
    offset=seed % len(candidates); candidates=candidates[offset:]+candidates[:offset]
    rows=[]; evidence=[]
    for n,k in candidates[:count]:
        total=2**n; favorable=comb(n,k); p=Fraction(favorable,total)
        newq=_replace(q,nm,km,n,k)
        rows.append({"question":newq,"answer":_fmt(p),"explanation":f"{n}枚の公平な硬貨の出方は{total}通り。表が{k}枚は{favorable}通りなので確率は{_fmt(p)}。","numeric_signature":(str(n),str(k))})
        evidence.append({"parent_sha256":_sha(parent),"method":"fair_coin_exhaustive_outcomes_and_binomial_count","parent_recalculation":f"C({parent_n},{parent_k})/2^{parent_n}={_fmt(parent_p)}","variant_recalculation":f"C({n},{k})/{total}={_fmt(p)}","independent_check":f"exhaustive favorable outcomes={favorable} == C({n},{k}) PASS"})
    return rows,evidence,"fair_coins_2_to_4_exactly_k_heads_exact"
