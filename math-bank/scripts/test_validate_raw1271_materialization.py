from __future__ import annotations

import copy
import unittest
import validate_raw1271_materialization as gate


def make_record(source: str = "Winpass", raw_id: str = "Winpass:doc:M01:S01") -> dict:
    record = {"raw_id":raw_id,"source":source,"source_document":"doc.docx","source_document_sha256":"a"*64,"grade":1,"major":1,"subslot":1,"score_evidence":{"text":"各10点","source_path":"body/tbl[0]/tr[0]/tc[0]/p[0]"},"question":"x+1=2 を解きなさい。","answer":"x=1","question_offsets":[{"path":"body/p[1]","paragraph_index":1}],"answer_offsets":[{"path":"body/p[20]","paragraph_index":20}],"figure_refs":[]}
    record["record_fingerprint"] = gate.recompute_fingerprint(record); return record

class GateTest(unittest.TestCase):
    def test_valid_record(self): self.assertEqual(gate.validate_record(make_record(), 1), [])
    def test_placeholder_without_offsets_rejected(self):
        r=make_record(); r["question_offsets"]=[]; r["record_fingerprint"]=gate.recompute_fingerprint(r); self.assertTrue(any("question_offsets" in e for e in gate.validate_record(r,1)))
    def test_graphical_answer_allowed_with_asset_identity(self):
        r=make_record(); r["answer"]=""; r["answer_offsets"]=[]; r["graphical_answer_asset"]={"asset_sha256":"b"*64,"target":"word/media/image1.png"}; r["record_fingerprint"]=gate.recompute_fingerprint(r); e=gate.validate_record(r,1); self.assertFalse(any("answer has neither" in x for x in e)); self.assertFalse(any("answer_offsets" in x for x in e))
    def test_graphical_answer_asset_is_fingerprint_bound(self):
        r=make_record(); r["answer"]=""; r["answer_offsets"]=[]; r["graphical_answer_asset"]={"asset_sha256":"b"*64,"target":"word/media/image1.png"}; r["record_fingerprint"]=gate.recompute_fingerprint(r); t=copy.deepcopy(r); t["graphical_answer_asset"]["asset_sha256"]="c"*64; self.assertTrue(any("record_fingerprint mismatch" in e for e in gate.validate_record(t,1)))
    def test_fingerprint_binds_content(self):
        r=make_record(); t=copy.deepcopy(r); t["answer"]="x=2"; self.assertTrue(any("record_fingerprint mismatch" in e for e in gate.validate_record(t,1)))
    def test_missing_figure_rejected(self):
        r=make_record(); r["figure_refs"]=[{"relationship_id":"rId5","target":"word/media/image5.png","missing":True}]; r["record_fingerprint"]=gate.recompute_fingerprint(r); self.assertTrue(any("marked missing" in e for e in gate.validate_record(r,1)))
    def test_figure_count_not_historical_constant(self):
        old_expected=gate.EXPECTED.copy()
        try:
            gate.EXPECTED.clear(); gate.EXPECTED.update({"Winpass":1,"実力錬成":0,"Standard":0})
            r=make_record(); r["figure_refs"]=[{"relationship_id":"rId1","target":"word/media/image1.png","asset_sha256":"b"*64} for _ in range(3)]; r["record_fingerprint"]=gate.recompute_fingerprint(r)
            report=gate.build_report([r]); self.assertTrue(report["pass"]); self.assertEqual(report["figure_refs"],3)
            strict=gate.build_report([r], expected_figure_refs=2); self.assertFalse(strict["pass"]); self.assertTrue(any("evidence-derived expected" in e for e in strict["errors"]))
        finally:
            gate.EXPECTED.clear(); gate.EXPECTED.update(old_expected)

if __name__ == "__main__": unittest.main()
