from safe_regular_polygon_sides_from_interior_angle_variant_engine import can_generate, generate

def parent(**overrides):
    row={"id":"P-RPOLY-INT-INV-001","question":"1つの内角が135°である正多角形は何角形ですか。","answer":"8角形","figure_refs":[],"choices":None}
    row.update(overrides); return row

def main():
    ok,reason=can_generate(parent()); assert ok and reason=="regular_polygon_sides_from_single_interior_angle_exact"
    ok,_=can_generate(parent(choices=[])); assert ok
    rows,evidence,_=generate(parent(),3); assert len(rows)==len(evidence)==3; assert len({r["question"] for r in rows})==3
    for row,ev in zip(rows,evidence):
        assert row["answer"].endswith("角形"); assert "PASS" in ev["independent_check"]
    bad=[parent(answer="7角形"),parent(question="内角の和が1080°である正多角形は何角形ですか。",answer="8角形"),parent(question="1つの内角が100°である正多角形は何角形ですか。",answer="5角形"),parent(figure_refs=["fig.svg"]),parent(choices=["6角形","8角形"])]
    for b in bad:
        ok,_=can_generate(b); assert not ok
        rows,ev,_=generate(b,1); assert rows==[] and ev==[]
    print("PASS_SAFE_REGULAR_POLYGON_SIDES_FROM_INTERIOR_ANGLE")

if __name__=="__main__": main()
