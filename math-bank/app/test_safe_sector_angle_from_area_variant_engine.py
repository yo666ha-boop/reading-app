from __future__ import annotations
from safe_sector_angle_from_area_variant_engine import generate

def parent(q="半径6cm、面積18.84cm²の扇形の中心角を求めなさい。円周率は3.14とする。",a="60度"):
    return {"id":"T-SAFA","question":q,"answer":a,"choices":None,"figure_refs":[]}
def main():
    rows,ev,reason=generate(parent(),3);assert reason=="sector_angle_from_area_pi_3_14_exact" and len(rows)==len(ev)==3
    assert len({tuple(r["numeric_signature"]) for r in rows})==3
    for r,e in zip(rows,ev):assert r["answer"].endswith("度") and "area*360=pi*r^2*angle PASS" in e["independent_check"]
    for bad in (parent(a="90度"),parent("半径6cm、面積20cm²の扇形の中心角を求めなさい。円周率は3.14とする。","60度"),parent("半径6cm、面積18.84cm²の扇形の面積を求めなさい。円周率は3.14とする。","60度")):
        assert generate(bad,1)[0]==[]
    p=parent();p["figure_refs"]=["f"];assert generate(p,1)[0]==[]
    print("PASS_SAFE_SECTOR_ANGLE_FROM_AREA_VARIANT_ENGINE")
if __name__=="__main__":main()
