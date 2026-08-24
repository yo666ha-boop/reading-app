from __future__ import annotations

import unittest

import locate_recovered_qa_ooxml as locator


def paragraph(index: int, text: str, images=None) -> dict:
    return {
        "path": f"body/p[{index}]",
        "paragraph_index": index,
        "text": text,
        "text_stripped": text.strip(),
        "images": images or [],
    }


def structures(paragraphs: list[dict]) -> dict:
    return {("Standard", "doc.docx"): {"source": "Standard", "document": "doc.docx", "paragraphs": paragraphs}}


class ExactLocatorTest(unittest.TestCase):
    def test_question_span_skips_blank_and_answer_unique_containment(self):
        draft = {
            "raw_id": "Standard:doc:M01:S01",
            "source": "Standard",
            "source_document": "doc.docx",
            "question": "次の問いに答えなさい。 ⑴ 0より17小さい数を答えなさい。",
            "answer": "-17",
            "score_evidence": "各6点",
        }
        doc = structures([
            paragraph(5, "次の問いに答えなさい。"),
            paragraph(6, ""),
            paragraph(7, "⑴ 0より17小さい数を答えなさい。"),
            paragraph(40, "⑴ -17　⑵ -50人"),
        ])
        row = locator.locate_record(draft, doc, {})
        self.assertEqual(row["status"], "EXACT_QA_OFFSETS_LOCATED")
        self.assertEqual(row["question_offsets"], [
            {"path": "body/p[5]", "paragraph_index": 5},
            {"path": "body/p[7]", "paragraph_index": 7},
        ])
        self.assertEqual(row["answer_offsets"], [{"path": "body/p[40]", "paragraph_index": 40}])

    def test_ambiguous_answer_is_unresolved(self):
        draft = {
            "source": "Standard",
            "source_document": "doc.docx",
            "question": "Q",
            "answer": "1",
            "score_evidence": "10点",
        }
        row = locator.locate_record(draft, structures([
            paragraph(1, "Q"),
            paragraph(2, "答1"),
            paragraph(3, "別解1"),
        ]), {})
        self.assertEqual(row["status"], "UNRESOLVED")
        self.assertEqual(row["answer_match_count"], 2)
        self.assertTrue(any("ambiguous" in reason for reason in row["reasons"]))

    def test_punctuation_is_not_fuzzily_normalized(self):
        draft = {
            "source": "Standard",
            "source_document": "doc.docx",
            "question": "x+1=2を解きなさい。",
            "answer": "x=1",
            "score_evidence": "10点",
        }
        row = locator.locate_record(draft, structures([
            paragraph(1, "x＋1＝2を解きなさい。"),
            paragraph(2, "x=1"),
        ]), {})
        self.assertEqual(row["question_match_count"], 0)
        self.assertEqual(row["status"], "UNRESOLVED")

    def test_image_identity_is_bound_from_asset_manifest(self):
        draft = {
            "source": "Standard",
            "source_document": "doc.docx",
            "question": "図を見て答えなさい。",
            "answer": "3",
            "score_evidence": "10点",
        }
        image = {"relationship_id": "rId5", "target": "word/media/image1.png"}
        asset_map = {
            ("Standard", "doc.docx", "word/media/image1.png"): {
                "asset_sha256": "b" * 64,
                "bytes": 123,
            }
        }
        row = locator.locate_record(draft, structures([
            paragraph(1, "図を見て答えなさい。", [image]),
            paragraph(2, "3"),
        ]), asset_map)
        self.assertEqual(row["status"], "EXACT_QA_OFFSETS_LOCATED")
        self.assertEqual(row["question_figure_refs"][0]["asset_sha256"], "b" * 64)
        self.assertFalse(row["question_figure_refs"][0]["missing"])

    def test_image_without_asset_identity_blocks_locator_ready(self):
        draft = {
            "source": "Standard",
            "source_document": "doc.docx",
            "question": "図を見て答えなさい。",
            "answer": "3",
            "score_evidence": "10点",
        }
        image = {"relationship_id": "rId5", "target": "word/media/image1.png"}
        row = locator.locate_record(draft, structures([
            paragraph(1, "図を見て答えなさい。", [image]),
            paragraph(2, "3"),
        ]), {})
        self.assertEqual(row["status"], "UNRESOLVED")
        self.assertTrue(any("asset identity unavailable" in reason for reason in row["reasons"]))

    def test_graphical_answer_never_auto_promotes_without_explicit_evidence(self):
        draft = {
            "source": "Standard",
            "source_document": "doc.docx",
            "question": "作図しなさい。",
            "answer": "",
            "graphical_answer": True,
            "score_evidence": "10点",
        }
        row = locator.locate_record(draft, structures([paragraph(1, "作図しなさい。")]), {})
        self.assertEqual(row["status"], "UNRESOLVED")
        self.assertTrue(any("graphical answer requires explicit" in reason for reason in row["reasons"]))

    def test_missing_score_evidence_does_not_fake_it(self):
        draft = {
            "source": "Standard",
            "source_document": "doc.docx",
            "question": "Q",
            "answer": "A",
        }
        row = locator.locate_record(draft, structures([paragraph(1, "Q"), paragraph(2, "A")]), {})
        self.assertEqual(row["status"], "EXACT_QA_OFFSETS_LOCATED")
        self.assertNotIn("score_evidence", row)
        self.assertTrue(any("score evidence" in reason for reason in row["reasons"]))


if __name__ == "__main__":
    unittest.main()
