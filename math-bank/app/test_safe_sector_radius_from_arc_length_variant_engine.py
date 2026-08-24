from __future__ import annotations
from safe_sector_radius_from_arc_length_variant_engine import generate

def base_parent():
    return {"question":"円周率を3.14とします。中心角90度、弧の長さ15.7cmのおうぎ形の半径を求めなさい。","answer":"10cm","choices":None,"figure_refs":[]}

def main():
    rows,evidence,reason=generate(base_parent(),3)
    assert reason=="sector_radius_from_arc_length_pi_3_14_exact" and len(rows)==len(evidence)==3
    assert len({tuple(r["numeric_signature"]) for r in rows})==3
    for ev in evidence: assert ev["independent_check"]=="arc_length*360=2*pi*radius*angle PASS"
    bad=base_parent();bad["answer"]="8cm";assert generate(bad,1)[0]==[]
    fig=base_parent();fig["figure_refs"]=["f1"];assert generate(fig,1)[0]==[]
    choice=base_parent();choice["choices"]=["8cm","10cm"];assert generate(choice,1)[0]==[]
    mixed=base_parent();mixed["question"]+=" 面積も求めなさい。";assert generate(mixed,1)[0]==[]
    print("PASS_SAFE_SECTOR_RADIUS_FROM_ARC_LENGTH_VARIANT_ENGINE")
if __name__=="__main__":main()
