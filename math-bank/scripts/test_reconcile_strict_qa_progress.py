from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

import reconcile_strict_qa_progress as reconcile
import validate_raw1271_materialization as gate


def strict_record(raw_id: str, *, answer: str = "x=1", graphical: bool = False) -> dict:
    source = raw_id.split(":", 1)[0]
    record = {
        "raw_id": raw_id,
        "source": source,
        "source_document": "doc.docx",
        "source_document_sha256": "a" * 64,
        "grade": 1,
        "major": 1,
        "subslot": 1,
        "score_evidence": {"text": "各10点", "source_path": "word/document.xml"},
        "question": "x+1=2 を解きなさい。",
        "answer": "" if graphical else answer,
        "question_offsets": [{"path": "word/document.xml", "paragraph_index": 1}],
        "answer_offsets": [] if graphical else [{"path": "word/document.xml", "paragraph_index": 20}],
        "figure_refs": [],
        "graphical_answer_asset": {"asset_sha256": "b" * 64, "target": "word/media/image1.png"} if graphical else None,
    }
    record["record_fingerprint"] = gate.recompute_fingerprint(record)
    return record


def write_jsonl(path: Path, records: list[dict]) -> None:
    path.write_text(
        "".join(json.dumps(record, ensure_ascii=False) + "\n" for record in records),
        encoding="utf-8",
    )


class ReconcileStrictProgressTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)

    def tearDown(self):
        self.tmp.cleanup()

    def test_partial_three_records_pass_and_are_counted_once(self):
        path = self.root / "three.jsonl"
        write_jsonl(path, [
            strict_record("Standard:doc:M01:S01"),
            strict_record("Standard:doc:M01:S02"),
            strict_record("Standard:doc:M01:S03"),
        ])
        combined, report = reconcile.reconcile([path])
        self.assertEqual(len(combined), 3)
        self.assertEqual(report["strict_counts"]["Standard"], 3)
        self.assertEqual(report["remaining_total"], 1268)
        self.assertTrue(report["partial_progress_pass"])
        self.assertFalse(report["complete_1271"])

    def test_identical_duplicate_does_not_increase_progress(self):
        record = strict_record("Standard:doc:M01:S01")
        a = self.root / "a.jsonl"
        b = self.root / "b.jsonl"
        write_jsonl(a, [record])
        write_jsonl(b, [record])
        combined, report = reconcile.reconcile([a, b])
        self.assertEqual(len(combined), 1)
        self.assertEqual(len(report["duplicate_identical_copies"]), 1)
        self.assertTrue(report["partial_progress_pass"])

    def test_conflicting_fingerprint_fails(self):
        a = self.root / "a.jsonl"
        b = self.root / "b.jsonl"
        write_jsonl(a, [strict_record("Standard:doc:M01:S01", answer="x=1")])
        write_jsonl(b, [strict_record("Standard:doc:M01:S01", answer="x=2")])
        _, report = reconcile.reconcile([a, b])
        self.assertFalse(report["partial_progress_pass"])
        self.assertTrue(any("conflicting strict fingerprints" in e for e in report["errors"]))

    def test_invalid_record_not_counted(self):
        record = strict_record("Standard:doc:M01:S01")
        record["question_offsets"] = []
        record["record_fingerprint"] = gate.recompute_fingerprint(record)
        path = self.root / "invalid.jsonl"
        write_jsonl(path, [record])
        combined, report = reconcile.reconcile([path])
        self.assertEqual(combined, [])
        self.assertEqual(report["valid_unique_strict_records"], 0)
        self.assertFalse(report["partial_progress_pass"])
        self.assertEqual(len(report["invalid_records"]), 1)

    def test_graphical_answer_asset_counts_as_strict(self):
        path = self.root / "graphical.jsonl"
        write_jsonl(path, [strict_record("Standard:doc:M01:S01", graphical=True)])
        combined, report = reconcile.reconcile([path])
        self.assertEqual(len(combined), 1)
        self.assertEqual(report["graphical_answers_with_asset_identity"], 1)
        self.assertTrue(report["partial_progress_pass"])

    def test_missing_input_fails(self):
        _, report = reconcile.reconcile([self.root / "missing.jsonl"])
        self.assertFalse(report["partial_progress_pass"])
        self.assertTrue(any("missing strict input" in e for e in report["errors"]))


if __name__ == "__main__":
    unittest.main()
