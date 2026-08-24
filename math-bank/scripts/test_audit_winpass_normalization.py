from __future__ import annotations

import importlib.util
from pathlib import Path

MODULE_PATH = Path(__file__).with_name("audit_winpass_normalization.py")
spec = importlib.util.spec_from_file_location("audit_winpass_normalization", MODULE_PATH)
assert spec and spec.loader
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)


def make_decision(record: dict, action: str, reason: str, evidence: list[str]) -> dict:
    return {
        "record_id": record["id"],
        "record_fingerprint_sha256": m.record_fingerprint(record),
        "action": action,
        "reason": reason,
        "evidence": evidence,
    }


def main() -> None:
    records = [{"id": f"R{i}"} for i in range(5)]
    decisions = [
        make_decision(records[0],"include","source_scoring_slot",["doc:a"]),
        make_decision(records[1],"include","source_scoring_slot",["doc:b"]),
        make_decision(records[2],"include","source_scoring_slot",["doc:c"]),
        make_decision(records[3],"exclude","source_non_scoring_slot",["trace:d"]),
        make_decision(records[4],"exclude","answer_block_spill",["trace:e"]),
    ]
    ok = m.audit(records, decisions, expected_raw=5, expected_included=3)
    assert ok["pass"] is True
    assert ok["policy"]["expected_570_is_verification_only_not_selection_rule"] is True
    assert ok["policy"]["decision_must_match_exact_raw_record_fingerprint"] is True

    missing = m.audit(records, decisions[:-1], expected_raw=5, expected_included=3)
    assert missing["pass"] is False
    assert missing["missing_decisions"] == ["R4"]

    no_evidence = [dict(x) for x in decisions]
    no_evidence[-1] = make_decision(records[4],"exclude","answer_block_spill",[])
    bad = m.audit(records, no_evidence, expected_raw=5, expected_included=3)
    assert bad["pass"] is False
    assert bad["invalid_decisions"]

    count_forced = [dict(x) for x in decisions]
    count_forced[-1] = make_decision(records[4],"exclude","make_570",["none"])
    forced = m.audit(records, count_forced, expected_raw=5, expected_included=3)
    assert forced["pass"] is False
    assert forced["invalid_decisions"]

    wrong_count = m.audit(records, decisions, expected_raw=5, expected_included=4)
    assert wrong_count["structural_decision_coverage_pass"] is True
    assert wrong_count["historical_570_count_match_after_evidence_decisions"] is False
    assert wrong_count["pass"] is False

    stale = [dict(x) for x in decisions]
    stale[0]["record_fingerprint_sha256"] = "0" * 64
    stale_report = m.audit(records, stale, expected_raw=5, expected_included=3)
    assert stale_report["pass"] is False
    assert stale_report["fingerprint_mismatches"][0]["record_id"] == "R0"
    assert "record fingerprint mismatch" in stale_report["invalid_decisions"][0]["issues"]

    absent = [dict(x) for x in decisions]
    absent[1].pop("record_fingerprint_sha256")
    absent_report = m.audit(records, absent, expected_raw=5, expected_included=3)
    assert absent_report["pass"] is False
    assert any("record_fingerprint_sha256 required" in x["issues"] for x in absent_report["invalid_decisions"])

    print("PASS_WINPASS_NORMALIZATION_EVIDENCE_FINGERPRINT_BINDING_NO_COUNT_FORCING_TESTS")


if __name__ == "__main__":
    main()
