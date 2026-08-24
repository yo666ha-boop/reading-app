from __future__ import annotations
from safe_sector_area_variant_engine import can_generate, generate

def parent(**overrides):
    row={"id":"SECTOR-A-1","question":"半径6cm、中心角60度の扇形の面積を求めなさい。円周率は3.14とします。","answer":"18.84cm²","figure_refs":[],"choices":None}
    row.update(overrides); return row

def main():
    for choices in (None,[]):
        p=parent(choices=choices); ok,reason=can_generate(p); assert ok and reason=="sector_area_pi_3_14_exact_terminating"
        rows,evidence,reason=generate(p,3); assert len(rows)==len(evidence)==3 and len({tuple(r["numeric_signature"]) for r in rows})==3
        assert all(ev["method"]=="sector_area_exact_fraction_and_360_cross_product" and ev["independent_check"].endswith("PASS") for ev in evidence)
    for bad in (parent(answer="18.85cm²"),parent(figure_refs=["f.svg"]),parent(choices=["18.84","19"]),parent(question="半径7cm、中心角60度の扇形の面積を求めなさい。円周率は3.14。",answer="25.643333cm²"),parent(question="半径6cm、中心角60度の扇形の弧の長さを求めなさい。円周率は3.14。",answer="6.28cm")):
        assert not can_generate(bad)[0]; assert generate(bad,1)[0]==[]
    print("PASS_SAFE_SECTOR_AREA_VARIANT_ENGINE")
if __name__=="__main__": main()
