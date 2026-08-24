from __future__ import annotations

import unittest

import compose_strict_qa_candidates as composer
import validate_raw1271_materialization as gate

RAW_ID = "Standard:doc:M01:S01"


def draft(*, answer: str = "x=1", graphical: bool = False) -> dict:
    return {
        "raw_id": RAW_ID,
        "source": "Standard",
        "source_document": "doc.docx",
        "grade": 1,
        "major": 1,
        "subslot": 1,
        "question": "x+1=2 を解きなさい。",
        "answer": "" if graphical else answer,
        "graphical_answer": graphical,
    }


def locator(*, answer_ready: bool = True, figure: bool = False) -> dict:
    refs = []
    if figure:
        refs = [{
            "relationship_id": "rId5",
            "target": "word/media/image1.png",
            "asset_sha256": "b" * 64,
            "bytes": 123,
            "missing": False,
        }]
    return {
        "raw_id": RAW_ID,
        "source": "Standard",
        "source_document": "doc.docx",
        "source_document_sha256": "a" * 64,
        "question_match_count": 1,
        "answer_match_count": 1 if answer_ready else 0,
        "question_offsets": [{"path": "body/p[1]", "paragraph_index": 1}],
        "answer_offsets": [{"path": "body/p[20]", "paragraph_index": 20}] if answer_ready else [],
        "question_figure_refs": refs,
        "status": "EXACT_QA_OFFSETS_LOCATED" if answer_ready else "UNRESOLVED",
    }


def slot(*, grade: int = 1, doc_sha: str = "a" * 64) -> dict:
    return {
        "raw_id": RAW_ID,
        "source": "Standard",
        "source_document": "doc.docx",
        "source_document_sha256": doc_sha,
        "grade": grade,
        "major": 1,
        "subslot": 1,
        "score_evidence": {"text": "各10点", "source_path": "body/tbl[0]/p[0]"},
    }


def locator_report(row: dict) -> dict:
    return {"results": [row]}


def asset_map(*, target: str, sha: str, relationship_ids=None) -> dict:
    return {
        ("Standard", "doc.docx", target): {
            "target": target,
            "asset_sha256": sha,
            "bytes": 123,
            "relationship_ids": relationship_ids or [],
        }
    }


class StrictCandidateComposerTest(unittest.TestCase):
    def test_text_answer_candidate_passes_strict_validator(self):
        candidates, report = composer.compose([draft()], locator_report(locator()), [slot()], [], {})
        self.assertEqual(report["strict_candidates"], 1)
        self.assertEqual(report["unresolved"], 0)
        self.assertEqual(gate.validate_record(candidates[0], 1), [])
        self.assertEqual(candidates[0]["source_document_sha256"], "a" * 64)

    def test_missing_source_bound_slot_evidence_blocks_candidate(self):
        candidates, report = composer.compose([draft()], locator_report(locator()), [], [], {})
        self.assertEqual(candidates, [])
        self.assertEqual(report["unresolved"], 1)
        self.assertTrue(any("slot evidence missing" in reason for reason in report["details"][0]["reasons"]))

    def test_slot_document_sha_mismatch_blocks_candidate(self):
        candidates, report = composer.compose([draft()], locator_report(locator()), [slot(doc_sha="d" * 64)], [], {})
        self.assertEqual(candidates, [])
        self.assertTrue(any("source_document_sha256 disagrees" in reason for reason in report["details"][0]["reasons"]))

    def test_conflicting_grade_blocks_candidate(self):
        candidates, report = composer.compose([draft()], locator_report(locator()), [slot(grade=2)], [], {})
        self.assertEqual(candidates, [])
        self.assertTrue(any("conflicting grade" in reason for reason in report["details"][0]["reasons"]))

    def test_ambiguous_answer_locator_blocks_candidate(self):
        candidates, report = composer.compose([draft()], locator_report(locator(answer_ready=False)), [slot()], [], {})
        self.assertEqual(candidates, [])
        self.assertTrue(any("text answer exact" in reason for reason in report["details"][0]["reasons"]))

    def test_figure_asset_must_match_manifest_and_binds_fingerprint(self):
        assets = asset_map(target="word/media/image1.png", sha="b" * 64, relationship_ids=["rId5"])
        candidates, report = composer.compose([draft()], locator_report(locator(figure=True)), [slot()], [], assets)
        self.assertEqual(report["strict_candidates"], 1)
        record = candidates[0]
        self.assertEqual(record["figure_refs"][0]["asset_sha256"], "b" * 64)
        original_fp = record["record_fingerprint"]
        record["figure_refs"][0]["asset_sha256"] = "c" * 64
        self.assertNotEqual(gate.recompute_fingerprint(record), original_fp)

        wrong_assets = asset_map(target="word/media/image1.png", sha="c" * 64, relationship_ids=["rId5"])
        candidates2, report2 = composer.compose([draft()], locator_report(locator(figure=True)), [slot()], [], wrong_assets)
        self.assertEqual(candidates2, [])
        self.assertTrue(any("figure refs" in reason for reason in report2["details"][0]["reasons"]))

    def test_graphical_answer_requires_manifest_verified_source_bound_asset(self):
        graphical_draft = draft(graphical=True)
        loc = locator(answer_ready=False)
        evidence = [{
            "raw_id": RAW_ID,
            "graphical_answer_asset": {
                "asset_sha256": "c" * 64,
                "target": "word/media/answer1.png",
                "relationship_id": "rId9",
                "source_document_sha256": "a" * 64,
            },
            "answer_offsets": [],
        }]
        assets = asset_map(target="word/media/answer1.png", sha="c" * 64, relationship_ids=["rId9"])
        candidates, report = composer.compose([graphical_draft], locator_report(loc), [slot()], evidence, assets)
        self.assertEqual(report["strict_candidates"], 1)
        self.assertEqual(gate.validate_record(candidates[0], 1), [])

        candidates_without_manifest, report_without_manifest = composer.compose(
            [graphical_draft], locator_report(loc), [slot()], evidence, {}
        )
        self.assertEqual(candidates_without_manifest, [])
        self.assertTrue(any("asset manifest" in reason for reason in report_without_manifest["details"][0]["reasons"]))

        bad = [{
            "raw_id": RAW_ID,
            "graphical_answer_asset": {
                "asset_sha256": "c" * 64,
                "target": "word/media/answer1.png",
                "relationship_id": "rId9",
                "source_document_sha256": "d" * 64,
            },
        }]
        candidates2, report2 = composer.compose([graphical_draft], locator_report(loc), [slot()], bad, assets)
        self.assertEqual(candidates2, [])
        self.assertTrue(any("graphical answer asset" in reason for reason in report2["details"][0]["reasons"]))


if __name__ == "__main__":
    unittest.main()
