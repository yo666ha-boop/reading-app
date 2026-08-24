from __future__ import annotations

from safe_affine_x_from_y_variant_engine import can_generate, generate


def parent(**overrides):
    row={"id":"AFF-X-1","question":"y=3x+2で、y=20のときのxの値を求めなさい。","answer":"x=6","figure_refs":[],"choices":None}
    row.update(overrides); return row


def main():
    for choices in (None,[]):
        p=parent(choices=choices); ok,reason=can_generate(p); assert ok and reason=="affine_x_from_y_exact"
        rows,evidence,reason=generate(p,3); assert len(rows)==len(evidence)==3
        assert len({tuple(r["numeric_signature"]) for r in rows})==3
        for row,ev in zip(rows,evidence):
            assert row["answer"].startswith("x=")
            assert ev["method"]=="affine_x_from_y_exact_inverse_and_forward_recomposition"
            assert ev["independent_check"].endswith("PASS")
    for bad in (parent(answer="x=5"),parent(figure_refs=["f.svg"]),parent(choices=["5","6"]),parent(question="y=3x+2で、x=6のときのyの値を求めなさい。",answer="20"),parent(question="y=0x+2で、y=2のときのxの値を求めなさい。",answer="x=1")):
        assert not can_generate(bad)[0]
        assert generate(bad,1)[0]==[]
    print("PASS_SAFE_AFFINE_X_FROM_Y_VARIANT_ENGINE")

if __name__=="__main__": main()
