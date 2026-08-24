from __future__ import annotations
import copy
from safe_two_dice_difference_probability_variant_engine import generate
from test_expanded_variant_layer import make_base

def base():
    p=copy.deepcopy(make_base()[0]);p["id"]="DICE-DIFF";p["question"]="2個のさいころを投げるとき、出た目の差が2になる確率を求めなさい。";p["answer"]="2/9";p["choices"]=None;p["figure_refs"]=[]
    return p

def main():
    p=base();rows,ev,reason=generate(p,3);assert reason=="two_fair_dice_absolute_difference_exact_36_outcomes" and len(rows)==len(ev)==3
    assert len({r["numeric_signature"] for r in rows})==3
    for r,e in zip(rows,ev):assert "PASS" in e["independent_check"] and "36通り" in r["explanation"]
    bad=base();bad["answer"]="1/3";assert generate(bad,1)[0]==[]
    mixed=base();mixed["question"]="2個のさいころを投げるとき、出た目の差が2で和が8になる確率を求めなさい。";assert generate(mixed,1)[0]==[]
    fig=base();fig["figure_refs"]=["dice.png"];assert generate(fig,1)[0]==[]
    ch=base();ch["choices"]=["2/9","1/3"];assert generate(ch,1)[0]==[]
    print("PASS_SAFE_TWO_DICE_DIFFERENCE_PROBABILITY_VARIANT_ENGINE")
if __name__=="__main__":main()
