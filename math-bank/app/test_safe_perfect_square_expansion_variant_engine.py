from safe_perfect_square_expansion_variant_engine import can_generate,generate

def parent(**overrides):
    p={"id":"P-PSQEXP-001","question":"(x+3)²を展開しなさい。","answer":"x²+6x+9","figure_refs":[],"choices":None}
    p.update(overrides); return p

def main():
    ok,reason=can_generate(parent()); assert ok and reason=="perfect_square_integer_expansion_exact"
    ok,_=can_generate(parent(choices=[])); assert ok
    rows,ev,_=generate(parent(),3)
    assert len(rows)==len(ev)==3 and len({r["question"] for r in rows})==3
    sigs=[tuple(r["numeric_signature"]) for r in rows]
    assert len(set(sigs))==3 and ("3",) not in sigs
    for r,e in zip(rows,ev):
        assert r["answer"].startswith("x²") and "展開" in r["question"]
        assert e["method"]=="perfect_square_expansion_double_and_square_coefficients" and "PASS" in e["independent_check"]
        assert "absolute numeric surfaces unique" in e["independent_check"]
    bad=[
        parent(answer="x²+6x+8"),
        parent(question="(x+3)²=0を解きなさい。",answer="x=-3"),
        parent(question="x²+6x+9を因数分解しなさい。",answer="(x+3)²"),
        parent(question="(2x+3)²を展開しなさい。",answer="4x²+12x+9"),
        parent(figure_refs=["fig.svg"]),
        parent(choices=["x²+6x+9","x²+9"]),
    ]
    for p in bad:
        ok,_=can_generate(p); assert not ok
        rows,ev,_=generate(p,1); assert rows==[] and ev==[]
    print("PASS_SAFE_PERFECT_SQUARE_EXPANSION_VARIANT_ENGINE")
if __name__=="__main__": main()
