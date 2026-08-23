from safe_sphere_radius_from_surface_area_variant_engine import can_generate, generate


def parent(**overrides):
    row={"id":"P-SPHERE-R-AREA-001","question":"円周率を3.14とします。表面積が314cm²の球の半径を求めなさい。","answer":"5cm","figure_refs":[],"choices":None}
    row.update(overrides); return row


def main():
    ok,reason=can_generate(parent()); assert ok and reason=="sphere_surface_area_to_integer_radius_pi_3_14_exact"
    ok,reason=can_generate(parent(choices=[])); assert ok
    rows,evidence,_=generate(parent(),3); assert len(rows)==len(evidence)==3
    assert len({r["question"] for r in rows})==3
    for row,ev in zip(rows,evidence):
        assert row["answer"].endswith("cm") and "表面積" in row["question"]
        assert "PASS" in ev["independent_check"]
    bad=[
        parent(answer="4cm"),
        parent(figure_refs=["fig.svg"]),
        parent(choices=["4cm","5cm"]),
        parent(question="円周率を3.14とします。体積が523.33cm³の球の半径を求めなさい。"),
        parent(question="円周率を3.14とします。表面積が300cm²の球の半径を求めなさい。"),
        parent(question="円周率を3.14とします。表面積が314cm²の球の直径を求めなさい。",answer="10cm"),
    ]
    for b in bad:
        ok,_=can_generate(b); assert not ok
        rows,ev,_=generate(b,1); assert rows==[] and ev==[]
    print("PASS_SAFE_SPHERE_RADIUS_FROM_SURFACE_AREA_VARIANT_ENGINE")

if __name__=="__main__": main()
