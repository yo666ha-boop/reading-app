from safe_binomial_expansion_variant_engine import can_generate,generate

def parent(**kw):
    p={"id":"P-BINEXP","question":"(x+3)(x-5)を展開しなさい。","answer":"x²-2x-15","choices":None,"figure_refs":[]}; p.update(kw); return p

def main():
    ok,r=can_generate(parent()); assert ok and r=="binomial_integer_expansion_exact"
    ok,_=can_generate(parent(choices=[])); assert ok
    rows,ev,_=generate(parent(),3); assert len(rows)==len(ev)==3
    assert len({tuple(x["numeric_signature"]) for x in rows})==3
    for row,e in zip(rows,ev):
        assert row["answer"].startswith("x²") and "PASS" in e["independent_check"]
    bad=[
      parent(answer="x²-2x+15"),
      parent(choices=["x²-2x-15"]),
      parent(figure_refs=["f.svg"]),
      parent(question="x²-2x-15を因数分解しなさい。",answer="(x+3)(x-5)"),
      parent(question="(x+3)(x-5)=0を解きなさい。",answer="x=5,-3"),
      parent(question="(2x+3)(x-5)を展開しなさい。",answer="2x²-7x-15"),
    ]
    for b in bad:
        ok,_=can_generate(b); assert not ok; rr,ee,_=generate(b,1); assert rr==[] and ee==[]
    print("PASS_SAFE_BINOMIAL_EXPANSION_VARIANT_ENGINE")
if __name__=="__main__": main()
