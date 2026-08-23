from safe_rectangular_prism_height_from_volume_variant_engine import can_generate, generate


def sample(**kw):
    row={"id":"P-RPH","question":"たて4cm、よこ5cm、体積が120cm³の直方体があります。この直方体の高さを求めなさい。","answer":"6cm","figure_refs":[],"choices":None}
    row.update(kw)
    return row


def main():
    assert can_generate(sample())[0]
    assert can_generate(sample(choices=[]))[0]
    rows, evidence, _ = generate(sample(), 3)
    assert len(rows) == len(evidence) == 3
    assert len({tuple(r["numeric_signature"]) for r in rows}) == 3
    for row, ev in zip(rows, evidence):
        assert row["answer"].endswith("cm")
        assert "PASS" in ev["independent_check"]
    for bad in (
        sample(answer="7cm"),
        sample(figure_refs=["fig.svg"]),
        sample(choices=["5cm","6cm"]),
        sample(question="たて4cm、よこ5cm、高さ6cmの直方体の体積を求めなさい。",answer="120cm³"),
    ):
        assert not can_generate(bad)[0]
        assert generate(bad,1)[0] == []
    print("PASS_RECTANGULAR_PRISM_HEIGHT_FROM_VOLUME")


if __name__ == "__main__":
    main()
