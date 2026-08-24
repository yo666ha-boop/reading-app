from __future__ import annotations
from safe_affine_intercept_from_slope_point_variant_engine import can_generate, generate

def parent(**kw):
    p={"id":"AFF-B-1","question":"一次関数y=3x+bが点(2,7)を通る。bを求めなさい。","answer":"b=1","figure_refs":[],"choices":None}; p.update(kw); return p

def main():
    for choices in (None,[]):
        p=parent(choices=choices); assert can_generate(p)==(True,"affine_intercept_from_slope_point_exact")
        rows,ev,reason=generate(p,3); assert reason=="affine_intercept_from_slope_point_exact" and len(rows)==len(ev)==3
        assert len({tuple(r["numeric_signature"]) for r in rows})==3
        for r,e in zip(rows,ev): assert r["answer"].startswith("b=") and e["independent_check"].endswith("PASS")
    bad=[parent(answer="b=2"),parent(figure_refs=["f.svg"]),parent(choices=["1","2"]),parent(question="一次関数y=3x+bが点(2,7)を通る。xを求めなさい。",answer="x=2"),parent(question="一次関数y=0x+bが点(2,7)を通る。bを求めなさい。",answer="b=7")]
    for p in bad: assert not can_generate(p)[0] and generate(p,1)[0]==[]
    print("PASS_SAFE_AFFINE_INTERCEPT_FROM_SLOPE_POINT_VARIANT_ENGINE")
if __name__=="__main__": main()
