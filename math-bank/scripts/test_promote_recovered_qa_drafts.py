from __future__ import annotations

import hashlib
import json
import tempfile
import unittest
from pathlib import Path

import promote_recovered_qa_drafts as promote
import validate_raw1271_materialization as gate


def write_jsonl(path: Path, records: list[dict]) -> str:
    text = "".join(json.dumps(r, ensure_ascii=False) + "\n" for r in records)
    path.write_text(text, encoding="utf-8")
    return hashlib.sha256(path.read_bytes()).hexdigest()


def strict_record(raw_id: str = "Standard:doc:M01:S01", answer: str = "x=1") -> dict:
    record = {
        "raw_id": raw_id,
        "source": raw_id.split(":", 1)[0],
        "source_document": "doc.docx",
        "source_document_sha256": "a" * 64,
        "grade": 1,
        "major": 1,
        "subslot": 1,
        "score_evidence": "各10点",
        "question": "x+1=2 を解きなさい。",
        "answer": answer,
        "question_offsets": [{"path": "word/document.xml", "paragraph_index": 1}],
        "answer_offsets": [{"path": "word/document.xml", "paragraph_index": 20}],
        "figure_refs": [],
        "graphical_answer_asset": None,
    }
    record["record_fingerprint"] = gate.recompute_fingerprint(record)
    return record


class PromoteRecoveredDraftsTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)

    def tearDown(self):
        self.tmp.cleanup()

    def spec(self, drafts: list[dict], expected_count: int | None = None):
        path = self.root / "draft.jsonl"
        sha = write_jsonl(path, drafts)
        return {"Standard": (path, sha, len(drafts) if expected_count is None else expected_count)}

    def test_exact_draft_promotes_with_strict_evidence(self):
        draft = {"raw_id": "Standard:doc:M01:S01", "question": "x+1=2 を解きなさい。", "answer": "x=1"}
        records, report = promote.promote(self.spec([draft]), [strict_record()])
        self.assertEqual(len(records), 1)
        self.assertEqual(report["newly_promoted"], 1)
        self.assertEqual(report["drafts_pending_strict_evidence"], 0)
        self.assertTrue(report["pass"])

    def test_composite_identity_derives_canonical_raw_id(self):
        draft = {"source_document": "doc.docx", "major": 1, "subslot": 1, "question": "x+1=2 を解きなさい。", "answer": "x=1"}
        records, report = promote.promote(self.spec([draft]), [strict_record()])
        self.assertEqual(len(records), 1)
        self.assertEqual(report["newly_promoted"], 1)

    def test_hash_mismatch_rejected(self):
        draft = {"raw_id": "Standard:doc:M01:S01", "question": "q", "answer": "a"}
        path = self.root / "draft.jsonl"
        write_jsonl(path, [draft])
        with self.assertRaisesRegex(ValueError, "sha256"):
            promote.promote({"Standard": (path, "0" * 64, 1)}, [strict_record()])

    def test_count_mismatch_rejected(self):
        draft = {"raw_id": "Standard:doc:M01:S01", "question": "q", "answer": "a"}
        with self.assertRaisesRegex(ValueError, "record count"):
            promote.promote(self.spec([draft], expected_count=2), [strict_record()])

    def test_content_mismatch_not_promoted(self):
        draft = {"raw_id": "Standard:doc:M01:S01", "question": "different", "answer": "x=1"}
        records, report = promote.promote(self.spec([draft]), [strict_record()])
        self.assertEqual(records, [])
        self.assertFalse(report["pass"])
        self.assertTrue(report["content_mismatches"])

    def test_invalid_strict_evidence_rejected(self):
        draft = {"raw_id": "Standard:doc:M01:S01", "question": "x+1=2 を解きなさい。", "answer": "x=1"}
        evidence = strict_record()
        evidence["question_offsets"] = []
        evidence["record_fingerprint"] = gate.recompute_fingerprint(evidence)
        with self.assertRaisesRegex(ValueError, "invalid strict record"):
            promote.promote(self.spec([draft]), [evidence])

    def test_duplicate_draft_identity_rejected(self):
        draft = {"raw_id": "Standard:doc:M01:S01", "question": "q", "answer": "a"}
        with self.assertRaisesRegex(ValueError, "duplicate exact identity"):
            promote.promote(self.spec([draft, dict(draft)]), [strict_record()])

    def test_resume_exact_fingerprint_is_idempotent(self):
        draft = {"raw_id": "Standard:doc:M01:S01", "question": "x+1=2 を解きなさい。", "answer": "x=1"}
        evidence = strict_record()
        records, report = promote.promote(self.spec([draft]), [evidence], [dict(evidence)])
        self.assertEqual(len(records), 1)
        self.assertEqual(report["newly_promoted"], 0)

    def test_resume_conflicting_fingerprint_rejected(self):
        draft = {"raw_id": "Standard:doc:M01:S01", "question": "x+1=2 を解きなさい。", "answer": "x=1"}
        evidence = strict_record()
        existing = strict_record(answer="x=2")
        with self.assertRaisesRegex(ValueError, "resume conflict"):
            promote.promote(self.spec([draft]), [evidence], [existing])


if __name__ == "__main__":
    unittest.main()
