from __future__ import annotations

from analyze_canonical_mapping_evidence import record_evidence

rows = [
    {
        "id": "WIN-G1-001",
        "stage": "中1",
        "unit": "正負の数",
        "title": "確認問題",
        "q": "次の図を見なさい。[[IMAGE:figures/a.png]]",
        "choices": ["A", "B"],
        "ans": "A",
        "explanation": "",
        "source_book": "Winpass",
        "parent_id": None,
    },
    {
        "id": "VAR-G1-001",
        "stage": "中1",
        "unit": "正負の数",
        "title": "類題",
        "q": "計算しなさい。",
        "choices": None,
        "ans": "2",
        "explanation": "",
        "source_book": "generated",
        "parent_id": "WIN-G1-001",
    },
]

report = record_evidence(rows)
assert report["records"] == 2, report
assert report["recorded_core_present_all"] is True, report
assert report["stage_values"] == {"中1": 2}, report
assert report["unit_values_top100"] == {"正負の数": 2}, report
assert report["choice_lengths"] == {"2": 1, "null": 1}, report
assert report["source_literal_hits_by_field"]["source_book"] == {"Winpass": 1, "generated": 1}, report
assert "parent_id" in report["variant_or_source_key_candidates"], report
assert "source_book" in report["variant_or_source_key_candidates"], report
assert report["image_marker_fields"] == {"q": 1}, report
assert report["image_marker_refs"] == {"figures/a.png": 1}, report
assert report["distinct_image_marker_refs"] == 1, report
assert report["id_shape_signatures"], report
assert report["id_prefix_signatures"], report

print("PASS_MAPPING_EVIDENCE_TEST")
print("stage_values=EXACT_ONLY")
print("unit_values=EXACT_ONLY")
print("source_literals=REPORTED_NOT_INFERRED")
print("variant_parent_keys=REPORTED_NOT_INFERRED")
print("image_markers=REPORTED_NOT_REWRITTEN")
print("id_patterns=REPORTED_NOT_MAPPED")
