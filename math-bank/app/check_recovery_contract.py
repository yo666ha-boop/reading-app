from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
STATE = ROOT.parent / "state" / "CANONICAL_RECOVERY_KEYS.json"
SOURCE_RECOVERY_STATE = ROOT.parent / "state" / "source-recovery-latest.json"
RECOVERY = ROOT / "recover_canonical_app_records.py"
INSPECTOR = ROOT / "inspect_canonical_artifact.py"
CONVERTER = ROOT / "convert_verified_canonical_to_app.py"
VALIDATOR = ROOT / "validate_app_records.py"
SCHEMA = ROOT / "app-record.schema.json"
REQUIRED_CONVERTER_META_FIELDS = (
    "grade", "unit", "skill", "question_format", "difficulty", "source",
    "figure_refs", "variant_group", "audit",
)

keys = json.loads(STATE.read_text(encoding="utf-8"))
source_recovery_state = json.loads(SOURCE_RECOVERY_STATE.read_text(encoding="utf-8")) if SOURCE_RECOVERY_STATE.exists() else {}
recovery = RECOVERY.read_text(encoding="utf-8")
inspector = INSPECTOR.read_text(encoding="utf-8")
converter = CONVERTER.read_text(encoding="utf-8")
validator = VALIDATOR.read_text(encoding="utf-8")
schema = SCHEMA.read_text(encoding="utf-8")

expected_hash = keys["canonical_zip"]["sha256"]
expected = keys["expected_counts"]
policy = keys["policy"]
core_fields = set(keys["recorded_prior_core_shape_hint"]["required_fields"])

source_status = str(source_recovery_state.get("status", ""))
source_mode = str(source_recovery_state.get("mode", ""))
source_next = str(source_recovery_state.get("next", ""))
source_promotable = source_recovery_state.get("promotable_to_canonical", False)
source_rebuild_language = any(
    token in (source_status + " " + source_mode + " " + source_next).upper()
    for token in ("REBUILDING_ORIGINAL", "RECONSTRUCT_ORIGINAL", "BUILD AND VALIDATE SOURCE-SPECIFIC", "REBUILD FINAL")
)

checks = {
    "zip_sha256_in_recovery_tool": expected_hash in recovery,
    "zip_sha256_in_inspector": expected_hash in inspector,
    "final_records_in_recovery_tool": str(expected["final_records"]) in recovery,
    "final_records_in_inspector": str(expected["final_records"]) in inspector,
    "final_records_in_validator": f'EXPECTED_FINAL_RECORDS = {expected["final_records"]}' in validator,
    "original_records_in_validator": f'EXPECTED_ORIGINAL_RECORDS = {expected["original_records"]}' in validator,
    "variants_in_validator": f'EXPECTED_GENERATED_VARIANTS = {expected["generated_variants"]}' in validator,
    "winpass_count_in_validator": '"Winpass": 570' in validator,
    "jitsuryoku_count_in_validator": '"実力錬成": 237' in validator,
    "standard_count_in_validator": '"Standard": 317' in validator,
    "title_required_in_validator": '"title"' in validator.split("REQUIRED =", 1)[1].split("}", 1)[0],
    "choices_required_in_validator": '"choices"' in validator.split("REQUIRED =", 1)[1].split("}", 1)[0],
    "title_required_in_schema": '"title"' in schema,
    "choices_required_in_schema": '"choices"' in schema,
    "partial_161_rejected": bool(policy.get("do_not_promote_partial_161_dataset")),
    "no_reconstruction": bool(policy.get("do_not_reconstruct_from_old_or_partial_files")),
    "no_guess_mapping": bool(policy.get("do_not_guess_canonical_to_app_mapping")),
    "inspect_before_mapping": bool(policy.get("inspect_actual_zip_members_before_mapping")),
    "zip_hash_required": bool(policy.get("zip_input_must_match_recorded_sha256")),
    "legacy_core_detector_present": "RECORDED_CANONICAL_CORE_1231_DETECTED_APP_MAPPING_NOT_VERIFIED" in recovery,
    "inspector_q_ans_classifier_present": "EXACT_1231_RECORDED_Q_ANS_CORE_CANDIDATE" in inspector,
    "inspector_app_classifier_preserves_title_choices": "EXACT_1231_APP_SCHEMA_CANDIDATE_WITH_TITLE_CHOICES" in inspector,
    "converter_requires_verified_metadata": "verified_metadata" in converter and "REQUIRED_META_FIELDS" in converter,
    "converter_no_guess_block": "BLOCKED_NO_GUESS_MAPPING" in converter,
    "converter_content_preservation": "assert_content_preserved" in converter,
    "converter_copies_title": '"title": row["title"]' in converter,
    "converter_copies_choices": '"choices": row["choices"]' in converter,
    "converter_copies_question": '"question": row["q"]' in converter,
    "converter_copies_answer": '"answer": row["ans"]' in converter,
    "converter_no_default_get_for_required_metadata": all(f'meta["{field}"]' in converter for field in REQUIRED_CONVERTER_META_FIELDS),
    "core_fields_match_recovery": all(repr(field) in recovery or f'"{field}"' in recovery for field in core_fields),
    "core_fields_match_inspector": all(repr(field) in inspector or f'"{field}"' in inspector for field in core_fields),
    "source_archives_not_promotable": source_promotable is False,
    "source_archives_diagnostic_only": (not source_recovery_state) or source_mode == "DIAGNOSTIC_ONLY_NON_CANONICAL",
    "source_rebuild_path_disabled": not source_rebuild_language,
}

failed = [name for name, ok in checks.items() if not ok]
if failed:
    raise SystemExit("FAIL_RECOVERY_CONTRACT: " + ", ".join(failed))

if not re.fullmatch(r"[0-9a-f]{64}", expected_hash):
    raise SystemExit("FAIL_RECOVERY_CONTRACT: invalid SHA-256 format")

print("PASS_RECOVERY_CONTRACT")
print(f"canonical_zip_sha256={expected_hash}")
print(f"records={expected['final_records']} original={expected['original_records']} variants={expected['generated_variants']}")
print("title_choices_preservation=REQUIRED")
print("partial_161_promotion=REJECTED")
print("old_partial_reconstruction=REJECTED")
print("source_archives=DIAGNOSTIC_ONLY_NON_CANONICAL")
print("source_archive_rebuild_path=DISABLED")
print("legacy_q_ans_core=DETECT_ONLY_NO_GUESS_MAPPING")
print("verified_deterministic_converter=REQUIRED_NO_DEFAULTS")
print("canonical_zip_inspection_before_mapping=REQUIRED")
