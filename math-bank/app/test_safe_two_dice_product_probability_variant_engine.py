from __future__ import annotations
import copy
from safe_two_dice_product_probability_variant_engine import generate
from test_expanded_variant_layer import make_base

def base():
    p=copy.deepcopy(make_base()[0]);p["id"]="DICE-PROD";p["question"]="2個のさいころを投げるとき、出た目の積が12になる確率を求めなさい。";p["answer"]="1/9";p["choices"]=None;p["figure_refs"]=[]
    return p

def main():
    p=base();rows,ev,reason=generate(p,3);assert reason=="two_fair_dice_product_exact_36_outcomes" and len(rows)==len(ev)==3
    assert len({r["numeric_signature"] for r in rows})==3
    for r,e in zip(rows,ev):assert "PASS" in e["independent_check"] and "36通り" in r["explanation"]
    bad=base();bad["answer"]="1/6";assert generate(bad,1)[0]==[]
    mixed=base();mixed["question"]="2個のさいころを投げるとき、出た目の積が12で和が7になる確率を求めなさい。";assert generate(mixed,1)[0]==[]
    fig=base();fig["figure_refs"]=["dice.png"];assert generate(fig,1)[0]==[]
    ch=base();ch["choices"]=["1/9","1/6"];assert generate(ch,1)[0]==[]
    print("PASS_SAFE_TWO_DICE_PRODUCT_PROBABILITY_VARIANT_ENGINE")
if __name__=="__main__":main()
