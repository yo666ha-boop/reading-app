from safe_rectangular_prism_height_from_surface_area_variant_engine import can_generate, generate


def parent(**overrides):
    row={"id":"P-RP-H-SA-001","question":"たて4cm、よこ3cm、表面積94cm²の直方体の高さを求めなさい。","answer":"5cm","figure_refs":[],"choices":None}
    row.update(overrides); return row


def main():
    ok,reason=can_generate(parent()); assert ok and reason=="rectangular_prism_height_from_surface_area_exact"
    ok,_=can_generate(parent(choices=[])); assert ok
    rows,evidence,_=generate(parent(),3)
    assert len(rows)==len(evidence)==3
    assert len({tuple(r["numeric_signature"]) for r in rows})==3
    for r,e in zip(rows,evidence): assert r["answer"].endswith("cm") and "PASS" in e["independent_check"]
    bad=[
        parent(answer="6cm"),
        parent(question="たて4cm、よこ3cm、表面積95cm²の直方体の高さを求めなさい。",answer="5cm"),
        parent(figure_refs=["fig.svg"]),
        parent(choices=["4cm","5cm"]),
        parent(question="たて4cm、よこ3cm、体積60cm³の直方体の高さを求めなさい。",answer="5cm"),
    ]
    for p in bad:
        ok,_=can_generate(p); assert not ok
        rows,ev,_=generate(p,1); assert rows==[] and ev==[]
    print("PASS_SAFE_RECTANGULAR_PRISM_HEIGHT_FROM_SURFACE_AREA_VARIANT_ENGINE")

if __name__=="__main__": main()
