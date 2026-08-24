from __future__ import annotations

import copy
import unittest

import validate_raw1271_materialization as gate


def make_record(source: str = "Winpass", raw_id: str = "Winpass:doc:M01:S01") -> dict:
    record = {
        "raw_id": raw_id,
        "source": source,
        "source_document": "doc.docx",
        "source_document_sha256": "a" * 64,
        "grade": 1,
        "major": 1,
        "subslot": 1,
        "score_evidence": {"text": "各10点", "source_path": "body/tbl[0]/tr[0]/tc[0]/p[0]"},
        "question": "x+1=2 を解きなさい。",
        "answer": "x=1",
        "question_offsets": [{"path": "body/p[1]", "paragraph_index": 1}],
        "answer_offsets": [{"path": "body/p[20]", "paragraph_index": 20}],
        "figure_refs": [],
    }
    record["record_fingerprint"] = gate.recompute_fingerprint(record)
    return record


class GateTest(unittest.TestCase):
    def test_valid_record(self):
        self.assertEqual(gate.validate_record(make_record(), 1), [])

    def test_placeholder_without_offsets_rejected(self):
        record = make_record()
        record["question_offsets"] = []
        record["record_fingerprint"] = gate.recompute_fingerprint(record)
        errors = gate.validate_record(record, 1)
        self.assertTrue(any("question_offsets" in e for e in errors))

    def test_graphical_answer_allowed_with_asset_identity(self):
        record = make_record()
        record["answer"] = ""
        record["answer_offsets"] = []
        record["graphical_answer_asset"] = {"asset_sha256": "b" * 64, "target": "word/media/image1.png"}
        record["record_fingerprint"] = gate.recompute_fingerprint(record)
        errors = gate.validate_record(record, 1)
        self.assertFalse(any("answer has neither" in e for e in errors))
        self.assertFalse(any("answer_offsets" in e for e in errors))

    def test_graphical_answer_asset_is_fingerprint_bound(self):
        record = make_record()
        record["answer"] = ""
        record["answer_offsets"] = []
        record["graphical_answer_asset"] = {"asset_sha256": "b" * 64, "target": "word/media/image1.png"}
        record["record_fingerprint"] = gate.recompute_fingerprint(record)
        tampered = copy.deepcopy(record)
        tampered["graphical_answer_asset"]["asset_sha256"] = "c" * 64
        errors = gate.validate_record(tampered, 1)
        self.assertTrue(any("record_fingerprint mismatch" in e for e in errors))

    def test_fingerprint_binds_content(self):
        record = make_record()
        tampered = copy.deepcopy(record)
        tampered["answer"] = "x=2"
        errors = gate.validate_record(tampered, 1)
        self.assertTrue(any("record_fingerprint mismatch" in e for e in errors))

    def test_missing_figure_rejected(self):
        record = make_record()
        record["figure_refs"] = [{"relationship_id": "rId5", "target": "word/media/image5.png", "missing": True}]
        record["record_fingerprint"] = gate.recompute_fingerprint(record)
        errors = gate.validate_record(record, 1)
        self.assertTrue(any("marked missing" in e for e in errors))


if __name__ == "__main__":
    unittest.main()
