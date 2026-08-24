from __future__ import annotations

from safe_sector_angle_from_arc_length_variant_engine import PI,SAFE_TRIPLES,_terminates,generate


def base_parent():
    return {"question":"円周率を3.14とします。半径10cm、弧の長さ15.7cmのおうぎ形の中心角を求めなさい。","answer":"90度","choices":None,"figure_refs":[]}


def main():
    for r,length,angle in SAFE_TRIPLES:
        assert _terminates(length)
        assert length*360==2*PI*r*angle
    rows,evidence,reason=generate(base_parent(),3)
    assert reason=="sector_angle_from_arc_length_pi_3_14_exact"
    assert len(rows)==len(evidence)==3
    sigs={tuple(r["numeric_signature"]) for r in rows}; assert len(sigs)==3
    assert all(r["answer"].endswith("度") for r in rows)
    for ev in evidence:
        assert ev["independent_check"]=="arc_length*360=2*pi*r*angle PASS"
    bad=base_parent(); bad["answer"]="60度"; assert generate(bad,1)[0]==[]
    fig=base_parent(); fig["figure_refs"]=["f1"]; assert generate(fig,1)[0]==[]
    choice=base_parent(); choice["choices"]=["60度","90度"]; assert generate(choice,1)[0]==[]
    mixed=base_parent(); mixed["question"]+=" 面積も求めなさい。"; assert generate(mixed,1)[0]==[]
    print("PASS_SAFE_SECTOR_ANGLE_FROM_ARC_LENGTH_VARIANT_ENGINE")

if __name__=="__main__": main()
