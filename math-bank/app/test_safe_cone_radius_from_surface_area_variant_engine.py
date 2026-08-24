from __future__ import annotations
import copy
from safe_cone_radius_from_surface_area_variant_engine import generate
from test_expanded_variant_layer import make_base

def base():
    p=copy.deepcopy(make_base()[0]);p["id"]="CONE-R-S";p["question"]="円周率を3.14とする。母線7cm、表面積188.4cm²の円すいの半径を求めなさい。";p["answer"]="5cm";p["choices"]=None;p["figure_refs"]=[]
    return p

def main():
    p=base();rows,ev,reason=generate(p,3);assert reason=="cone_radius_from_surface_area_pi_3_14_exact_integer_root" and len(rows)==len(ev)==3
    assert len({r["numeric_signature"] for r in rows})==3
    for r,e in zip(rows,ev):assert "PASS" in e["independent_check"] and "r²" in r["explanation"]
    bad=base();bad["answer"]="6cm";assert generate(bad,1)[0]==[]
    nonroot=base();nonroot["question"]="円周率を3.14とする。母線7cm、表面積190cm²の円すいの半径を求めなさい。";assert generate(nonroot,1)[0]==[]
    fig=base();fig["figure_refs"]=["cone.png"];assert generate(fig,1)[0]==[]
    ch=base();ch["choices"]=["5cm","6cm"];assert generate(ch,1)[0]==[]
    print("PASS_SAFE_CONE_RADIUS_FROM_SURFACE_AREA_VARIANT_ENGINE")
if __name__=="__main__":main()
