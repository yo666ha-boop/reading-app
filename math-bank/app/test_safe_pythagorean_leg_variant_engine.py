from safe_pythagorean_leg_variant_engine import can_generate, generate


def parent(**overrides):
    row={"id":"P-PYTH-LEG-001","question":"斜辺が13cm、直角をはさむ1辺が5cmの直角三角形で、残りの辺の長さを求めなさい。","answer":"12cm","figure_refs":[],"choices":None}
    row.update(overrides); return row


def main():
    ok,reason=can_generate(parent()); assert ok and reason=="pythagorean_leg_integer_exact"
    ok,_=can_generate(parent(choices=[])); assert ok
    rows,evidence,_=generate(parent(),3)
    assert len(rows)==len(evidence)==3
    assert len({tuple(r["numeric_signature"]) for r in rows})==3
    for r,e in zip(rows,evidence):
        assert r["answer"].endswith("cm")
        assert "PASS" in e["independent_check"]
    bad=[
        parent(answer="11cm"),
        parent(question="斜辺が10cm、直角をはさむ1辺が6cmの直角三角形で、残りの辺の長さを求めなさい。",answer="7cm"),
        parent(figure_refs=["fig.svg"]),
        parent(choices=["11cm","12cm"]),
        parent(question="直角をはさむ2辺が5cmと12cmの直角三角形の斜辺を求めなさい。",answer="13cm"),
    ]
    for p in bad:
        ok,_=can_generate(p); assert not ok
        rows,ev,_=generate(p,1); assert rows==[] and ev==[]
    print("PASS_SAFE_PYTHAGOREAN_LEG_VARIANT_ENGINE")

if __name__=="__main__": main()
