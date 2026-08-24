from __future__ import annotations

import importlib.util
from pathlib import Path

MODULE_PATH = Path(__file__).with_name("validate_rebuilt_originals.py")
spec = importlib.util.spec_from_file_location("validate_rebuilt_originals", MODULE_PATH)
assert spec and spec.loader
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)


def row(source: str, i: int) -> dict:
    return {"id": f"{source}-{i}", "source": source, "question": f"q-{source}-{i}", "answer": f"a-{source}-{i}", "figure_refs": []}


def main() -> None:
    old_targets = dict(m.TARGETS)
    old_total = m.TOTAL
    m.TARGETS.clear(); m.TARGETS.update({"Winpass": 2, "実力錬成": 1, "Standard": 1}); m.TOTAL = 4
    try:
        good = {"Winpass": [row("Winpass",0), row("Winpass",1)], "実力錬成": [row("実力錬成",0)], "Standard": [row("Standard",0)]}
        ok = m.validate(good, set())
        assert ok["pass"] is True and ok["actual_total"] == 4

        dup = {k:[dict(x) for x in v] for k,v in good.items()}
        dup["Standard"][0]["id"] = dup["Winpass"][0]["id"]
        assert m.validate(dup, set())["pass"] is False

        contaminated = {k:[dict(x) for x in v] for k,v in good.items()}
        contaminated["Winpass"][0]["is_generated_variant"] = True
        report = m.validate(contaminated, set())
        assert report["pass"] is False
        assert any(x["issue"] == "generated_variant_contaminated_originals" for x in report["issues"])

        missing_figure = {k:[dict(x) for x in v] for k,v in good.items()}
        missing_figure["実力錬成"][0]["figure_refs"] = ["fig-x.png"]
        report = m.validate(missing_figure, set())
        assert report["pass"] is False and report["missing_figure_refs"]

        duplicate_text = {k:[dict(x) for x in v] for k,v in good.items()}
        duplicate_text["Standard"][0]["question"] = duplicate_text["Winpass"][0]["question"]
        duplicate_text["Standard"][0]["answer"] = duplicate_text["Winpass"][0]["answer"]
        report = m.validate(duplicate_text, set())
        assert report["pass"] is True
        assert report["duplicate_question_answer_groups_for_review"]

        wrong_count = {k:[dict(x) for x in v] for k,v in good.items()}
        wrong_count["Winpass"] = wrong_count["Winpass"][:1]
        assert m.validate(wrong_count, set())["pass"] is False
    finally:
        m.TARGETS.clear(); m.TARGETS.update(old_targets); m.TOTAL = old_total
    print("PASS_REBUILT_ORIGINALS_1124_COUNTS_ID_FINGERPRINT_FIGURE_GENERATED_GATES")


if __name__ == "__main__":
    main()
