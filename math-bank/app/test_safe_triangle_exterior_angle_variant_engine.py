from safe_triangle_exterior_angle_variant_engine import can_generate, generate

def parent(**overrides):
    p={"id":"P-TRI-EXT-001","question":"三角形の外角について、となり合わない2つの内角が50°と60°です。この外角を求めなさい。","answer":"110°","choices":None,"figure_refs":[]}
    p.update(overrides); return p

def main():
    ok,reason=can_generate(parent()); assert ok and reason=="triangle_exterior_two_remote_integer_angles_exact"
    empty=parent(choices=[]); ok,_=can_generate(empty); assert ok
    rows,evs,_=generate(parent(),3); assert len(rows)==len(evs)==3; assert len({r["question"] for r in rows})==3
    for r,e in zip(rows,evs):
        assert r["answer"].endswith("°"); assert "180 PASS" in e["independent_check"]
    bad=[
        parent(answer="111°"),
        parent(figure_refs=["tri.svg"]),
        parent(choices=["100°","110°"]),
        parent(question="三角形の2つの角が50°と60°です。残りの角を求めなさい。",answer="70°"),
        parent(question="二等辺三角形の外角について、他の2つの内角が50°と60°です。外角を求めなさい。"),
    ]
    for p in bad:
        ok,_=can_generate(p); assert not ok
        rows,evs,_=generate(p,1); assert rows==[] and evs==[]
    print("PASS_SAFE_TRIANGLE_EXTERIOR_ANGLE_VARIANT_ENGINE")

if __name__=="__main__": main()
