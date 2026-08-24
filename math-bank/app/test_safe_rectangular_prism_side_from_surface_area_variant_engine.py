from __future__ import annotations
from safe_rectangular_prism_side_from_surface_area_variant_engine import generate

def base_parent():
    return {"question":"直方体で、よこ4cm、高さ5cm、表面積148cm²です。たてを求めなさい。","answer":"6cm","choices":None,"figure_refs":[]}

def main():
    rows,ev,reason=generate(base_parent(),3)
    assert reason=="rectangular_prism_side_from_surface_area_exact" and len(rows)==len(ev)==3
    assert len({tuple(r["numeric_signature"]) for r in rows})==3
    for e in ev: assert e["independent_check"]=="S/2-wh == l(w+h) AND 2(lw+lh+wh)==S PASS"
    bad=base_parent();bad["answer"]="7cm";assert generate(bad,1)[0]==[]
    fig=base_parent();fig["figure_refs"]=["f1"];assert generate(fig,1)[0]==[]
    choice=base_parent();choice["choices"]=["6cm","7cm"];assert generate(choice,1)[0]==[]
    mixed=base_parent();mixed["question"]+=" 体積も求めなさい。";assert generate(mixed,1)[0]==[]
    print("PASS_SAFE_RECTANGULAR_PRISM_SIDE_FROM_SURFACE_AREA_VARIANT_ENGINE")
if __name__=="__main__":main()
