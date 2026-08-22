from safe_pythagorean_hypotenuse_variant_engine import can_generate, generate

def parent(**overrides):
    row={"id":"P-PYTH-001","question":"直角をはさむ2辺が3cmと4cmの直角三角形があります。斜辺の長さを求めなさい。","answer":"5cm","figure_refs":[],"choices":None}
    row.update(overrides); return row

def main():
    for choices in (None, []):
        p=parent(choices=choices); ok,reason=can_generate(p); assert ok and reason=="pythagorean_hypotenuse_integer_exact"
        rows,evidence,_=generate(p,3); assert len(rows)==len(evidence)==3
        assert len({tuple(r["numeric_signature"]) for r in rows})==3
        assert ("3","4") not in {tuple(r["numeric_signature"]) for r in rows}
        for r,e in zip(rows,evidence): assert r["answer"].endswith("cm") and e["independent_check"].endswith("PASS")
    bad=[parent(answer="6cm"),parent(question="直角をはさむ2辺が2cmと3cmの直角三角形があります。斜辺の長さを求めなさい。",answer="4cm"),parent(figure_refs=["fig.svg"]),parent(choices=["5cm","6cm"]),parent(question="直角をはさむ2辺が3cmと4cmの直角三角形の面積を求めなさい。",answer="6cm2")]
    for p in bad:
        ok,_=can_generate(p); assert not ok
        rows,evidence,_=generate(p,1); assert rows==[] and evidence==[]
    print("PASS_SAFE_PYTHAGOREAN_HYPOTENUSE_VARIANT_ENGINE")

if __name__=="__main__": main()
