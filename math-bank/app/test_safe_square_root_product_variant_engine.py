from safe_square_root_product_variant_engine import generate


def parent(question, answer, choices=None, figure_refs=None):
    return {"id":"P-ROOT-PROD","question":question,"answer":answer,"choices":choices,"figure_refs":[] if figure_refs is None else figure_refs}


def main():
    p=parent("√2×√8を計算しなさい。","4")
    rows,evidence,reason=generate(p,3)
    assert reason=="square_root_product_integer_exact"
    assert len(rows)==len(evidence)==3
    assert len({tuple(r["numeric_signature"]) for r in rows})==3
    for row,ev in zip(rows,evidence):
        assert row["question"]!=p["question"]
        assert row["answer"].isdigit()
        assert ev["method"]=="square_root_product_exact_perfect_square_and_square_identity"
        assert ev["independent_check"].endswith("PASS")
    assert generate(parent("√2×√3を計算しなさい。","√6"),1)[0]==[]
    assert generate(parent("√2×√8を計算しなさい。","5"),1)[0]==[]
    assert generate(parent("√2÷√8を計算しなさい。","1/2"),1)[0]==[]
    assert generate(parent("√2×√8を計算しなさい。","4",figure_refs=["f"]),1)[0]==[]
    assert generate(parent("√2×√8を計算しなさい。","4",choices=["4","5"]),1)[0]==[]
    print("PASS_SAFE_SQUARE_ROOT_PRODUCT_VARIANT_ENGINE")

if __name__=="__main__": main()
