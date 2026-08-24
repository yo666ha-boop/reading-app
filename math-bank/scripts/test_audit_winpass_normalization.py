from __future__ import annotations

import importlib.util
from pathlib import Path

MODULE_PATH = Path(__file__).with_name("audit_winpass_normalization.py")
spec = importlib.util.spec_from_file_location("audit_winpass_normalization", MODULE_PATH)
assert spec and spec.loader
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)


def main() -> None:
    records = [{"id": f"R{i}"} for i in range(5)]
    decisions = [
        {"record_id":"R0","action":"include","reason":"source_scoring_slot","evidence":["doc:a"]},
        {"record_id":"R1","action":"include","reason":"source_scoring_slot","evidence":["doc:b"]},
        {"record_id":"R2","action":"include","reason":"source_scoring_slot","evidence":["doc:c"]},
        {"record_id":"R3","action":"exclude","reason":"source_non_scoring_slot","evidence":["trace:d"]},
        {"record_id":"R4","action":"exclude","reason":"answer_block_spill","evidence":["trace:e"]},
    ]
    ok = m.audit(records, decisions, expected_raw=5, expected_included=3)
    assert ok["pass"] is True
    assert ok["policy"]["expected_570_is_verification_only_not_selection_rule"] is True

    missing = m.audit(records, decisions[:-1], expected_raw=5, expected_included=3)
    assert missing["pass"] is False
    assert missing["missing_decisions"] == ["R4"]

    no_evidence = [dict(x) for x in decisions]
    no_evidence[-1] = {"record_id":"R4","action":"exclude","reason":"answer_block_spill","evidence":[]}
    bad = m.audit(records, no_evidence, expected_raw=5, expected_included=3)
    assert bad["pass"] is False
    assert bad["invalid_decisions"]

    count_forced = [dict(x) for x in decisions]
    count_forced[-1] = {"record_id":"R4","action":"exclude","reason":"make_570","evidence":["none"]}
    forced = m.audit(records, count_forced, expected_raw=5, expected_included=3)
    assert forced["pass"] is False
    assert forced["invalid_decisions"]

    wrong_count = m.audit(records, decisions, expected_raw=5, expected_included=4)
    assert wrong_count["structural_decision_coverage_pass"] is True
    assert wrong_count["historical_570_count_match_after_evidence_decisions"] is False
    assert wrong_count["pass"] is False

    print("PASS_WINPASS_NORMALIZATION_EVIDENCE_COVERAGE_NO_COUNT_FORCING_TESTS")


if __name__ == "__main__":
    main()
