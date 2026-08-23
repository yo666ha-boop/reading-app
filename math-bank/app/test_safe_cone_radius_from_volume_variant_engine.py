from safe_cone_radius_from_volume_variant_engine import can_generate, generate


def parent(**overrides):
    row={"id":"P-CONE-RADIUS-001","question":"円周率を3.14とします。高さ10cm、体積94.2cm³の円すいの半径を求めなさい。","answer":"3cm","figure_refs":[],"choices":None}
    row.update(overrides); return row


def main():
    ok,reason=can_generate(parent()); assert ok and reason=="cone_radius_from_volume_pi_3_14_exact"
    ok,reason=can_generate(parent(choices=[])); assert ok
    rows,ev,reason=generate(parent(),3)
    assert reason=="cone_radius_from_volume_pi_3_14_exact" and len(rows)==len(ev)==3
    assert len({tuple(r["numeric_signature"]) for r in rows})==3
    assert all("PASS" in e["independent_check"] for e in ev)
    bad=[
        parent(answer="4cm"),
        parent(figure_refs=["cone.svg"]),
        parent(choices=["2cm","3cm"]),
        parent(question="円周率を3.14とします。高さ10cm、体積100cm³の円すいの半径を求めなさい。",answer="3cm"),
        parent(question="円周率を3.14とします。高さ10cm、体積94.2cm³の円すいの高さを求めなさい。",answer="10cm"),
        parent(question="円周率を3.14とします。高さ10cm、体積94.2cm³の円すいの直径を求めなさい。",answer="6cm"),
    ]
    for row in bad:
        ok,_=can_generate(row); assert not ok
        rs,es,_=generate(row,1); assert rs==[] and es==[]
    print("PASS_SAFE_CONE_RADIUS_FROM_VOLUME_VARIANT_ENGINE")


if __name__=="__main__": main()
