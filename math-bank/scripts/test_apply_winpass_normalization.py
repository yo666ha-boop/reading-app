from __future__ import annotations

import importlib.util
from pathlib import Path

MODULE_PATH = Path(__file__).with_name("apply_winpass_normalization.py")
spec = importlib.util.spec_from_file_location("apply_winpass_normalization", MODULE_PATH)
assert spec and spec.loader
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)


def decision(record: dict, action: str, reason: str, evidence: list[str]) -> dict:
    return {
        "record_id": record["id"],
        "record_fingerprint_sha256": m._audit_mod.record_fingerprint(record),
        "action": action,
        "reason": reason,
        "evidence": evidence,
    }


def main() -> None:
    records = [
        {"id":"R0","question":"q0","answer":"a0"},
        {"id":"R1","question":"q1","answer":"a1"},
        {"id":"R2","question":"q2","answer":"a2"},
        {"id":"R3","question":"q3","answer":"a3"},
        {"id":"R4","question":"q4","answer":"a4"},
    ]
    decisions = [
        decision(records[0],"include","scoring_slot",["doc:0"]),
        decision(records[1],"exclude","answer_block_spill",["doc:1"]),
        decision(records[2],"include","scoring_slot",["doc:2"]),
        decision(records[3],"exclude","non_scoring_slot",["doc:3"]),
        decision(records[4],"include","scoring_slot",["doc:4"]),
    ]
    out, manifest = m.apply(records, decisions, expected_raw=5, expected_included=3)
    assert [r["id"] for r in out] == ["R0","R2","R4"]
    assert [p["raw_index"] for p in manifest["provenance"]] == [0,2,4]
    assert manifest["materialized_originals"] == 3 and manifest["audit_pass"] is True
    assert manifest["policy"]["exact_record_fingerprint_binding_rechecked"] is True

    stale = [dict(x) for x in decisions]
    stale[0]["record_fingerprint_sha256"] = "f" * 64
    try:
        m.apply(records, stale, expected_raw=5, expected_included=3)
    except ValueError:
        pass
    else:
        raise AssertionError("stale fingerprint must block materialization")

    missing_evidence = [dict(x) for x in decisions]
    missing_evidence[1] = decision(records[1],"exclude","answer_block_spill",[])
    try:
        m.apply(records, missing_evidence, expected_raw=5, expected_included=3)
    except ValueError:
        pass
    else:
        raise AssertionError("evidence-less exclusion must block materialization")

    changed_record = [dict(x) for x in records]
    changed_record[4]["answer"] = "changed"
    try:
        m.apply(changed_record, decisions, expected_raw=5, expected_included=3)
    except ValueError:
        pass
    else:
        raise AssertionError("raw content drift after review must block materialization")

    print("PASS_WINPASS_NORMALIZATION_MATERIALIZATION_ORDER_FINGERPRINT_FAIL_CLOSED")


if __name__ == "__main__":
    main()
