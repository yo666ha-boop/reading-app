from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

import promote_recovered_qa_drafts as promotion
import run_recovered_strict_batch as runner

RAW_ID = "Standard:doc:M01:S01"


def write_json(path: Path, value: dict) -> None:
    path.write_text(json.dumps(value, ensure_ascii=False) + "\n", encoding="utf-8")


def write_jsonl(path: Path, values: list[dict]) -> None:
    path.write_text("".join(json.dumps(v, ensure_ascii=False) + "\n" for v in values), encoding="utf-8")


class RecoveredStrictBatchTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        self.draft = self.root / "draft.jsonl"
        self.structure = self.root / "structure.json"
        self.slot = self.root / "slot.jsonl"
        write_jsonl(self.draft, [{
            "raw_id": RAW_ID,
            "source": "Standard",
            "source_document": "doc.docx",
            "grade": 1,
            "major": 1,
            "subslot": 1,
            "question": "x+1=2 を解きなさい。",
            "answer": "x=1",
        }])
        write_json(self.structure, {
            "documents": [{
                "source": "Standard",
                "document": "doc.docx",
                "document_sha256": "a" * 64,
                "paragraphs": [
                    {"path": "body/p[1]", "paragraph_index": 1, "text": "x+1=2 を解きなさい。", "text_stripped": "x+1=2 を解きなさい。", "images": []},
                    {"path": "body/p[20]", "paragraph_index": 20, "text": "答 x=1", "text_stripped": "答 x=1", "images": []},
                ],
            }]
        })
        write_jsonl(self.slot, [{
            "raw_id": RAW_ID,
            "source": "Standard",
            "source_document": "doc.docx",
            "grade": 1,
            "major": 1,
            "subslot": 1,
            "score_evidence": {"text": "10点", "source_path": "body/p[30]"},
        }])
        self.sha = promotion.sha256_file(self.draft)

    def tearDown(self):
        self.tmp.cleanup()

    def run_once(self, *, existing: Path | None = None, work_name: str = "work") -> dict:
        return runner.run_batch(
            source="Standard",
            draft_path=self.draft,
            expected_sha256=self.sha,
            expected_count=1,
            structure_path=self.structure,
            asset_manifest_path=None,
            slot_evidence_path=self.slot,
            graphical_evidence_path=None,
            existing_path=existing,
            work_dir=self.root / work_name,
        )

    def test_end_to_end_text_record_creates_valid_partial_strict_output(self):
        summary = self.run_once()
        self.assertTrue(summary["pass"])
        self.assertEqual(summary["draft_records_verified"], 1)
        self.assertEqual(summary["strict_candidates"], 1)
        self.assertEqual(summary["strict_output_records"], 1)
        self.assertEqual(summary["drafts_without_strict_candidate"], 0)
        self.assertTrue(summary["reconcile_partial_progress_pass"])
        self.assertFalse(summary["reconcile_complete_1271"])
        strict_path = Path(summary["outputs"]["strict_promoted"])
        records = promotion.load_jsonl(strict_path)
        self.assertEqual(records[0]["raw_id"], RAW_ID)

    def test_wrong_recovered_draft_sha_is_rejected_before_matching(self):
        with self.assertRaises(ValueError):
            runner.run_batch(
                source="Standard",
                draft_path=self.draft,
                expected_sha256="0" * 64,
                expected_count=1,
                structure_path=self.structure,
                asset_manifest_path=None,
                slot_evidence_path=self.slot,
                graphical_evidence_path=None,
                existing_path=None,
                work_dir=self.root / "bad",
            )

    def test_resume_with_same_strict_record_does_not_duplicate_progress(self):
        first = self.run_once(work_name="first")
        existing = Path(first["outputs"]["strict_promoted"])
        second = self.run_once(existing=existing, work_name="second")
        self.assertTrue(second["pass"])
        self.assertEqual(second["existing_strict_records_input"], 1)
        self.assertEqual(second["strict_output_records"], 1)
        self.assertEqual(second["new_candidate_ids_not_already_strict"], 0)


if __name__ == "__main__":
    unittest.main()
