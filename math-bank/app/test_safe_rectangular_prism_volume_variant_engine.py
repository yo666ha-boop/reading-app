from safe_rectangular_prism_volume_variant_engine import can_generate, generate


def parent(question="たて4cm、よこ5cm、高さ6cmの直方体の体積を求めなさい。", answer="120cm³", **extra):
    row = {"id":"P-VOL-001","question":question,"answer":answer,"explanation":"","figure_refs":[],"choices":None}
    row.update(extra)
    return row


def test_positive_three_siblings():
    p = parent()
    assert can_generate(p)[0]
    rows, evidence, reason = generate(p, 3)
    assert reason == "rectangular_prism_integer_cm_volume_exact"
    assert len(rows) == 3 and len(evidence) == 3
    sigs = [tuple(r["numeric_signature"]) for r in rows]
    assert len(set(sigs)) == 3
    assert ("4", "5", "6") not in sigs
    for row, ev in zip(rows, evidence):
        assert row["answer"].endswith("cm³")
        assert "3方向の逆算" in row["explanation"]
        assert ev["independent_check"].endswith("PASS")


def test_wrong_answer_fails_closed():
    assert not can_generate(parent(answer="121cm³"))[0]
    assert generate(parent(answer="121cm³"), 1)[0] == []


def test_figure_and_choice_fail_closed():
    assert not can_generate(parent(figure_refs=["fig-1"]))[0]
    assert not can_generate(parent(choices=["100cm³", "120cm³"]))[0]


def test_surface_area_reverse_and_mixed_unit_fail_closed():
    assert not can_generate(parent(question="たて4cm、よこ5cm、高さ6cmの直方体の表面積を求めなさい。", answer="148cm²"))[0]
    assert not can_generate(parent(question="たて4cm、よこ5cmの直方体の体積が120cm³です。高さを求めなさい。", answer="6cm"))[0]
    assert not can_generate(parent(question="たて4cm、よこ5cm、高さ60mmの直方体の体積を求めなさい。", answer="120cm³"))[0]


if __name__ == "__main__":
    test_positive_three_siblings()
    test_wrong_answer_fails_closed()
    test_figure_and_choice_fail_closed()
    test_surface_area_reverse_and_mixed_unit_fail_closed()
    print("PASS: safe rectangular prism volume variant engine")
