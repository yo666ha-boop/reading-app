from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
STATE = ROOT.parent / "state" / "CANONICAL_RECOVERY_KEYS.json"
RECOVERY = ROOT / "recover_canonical_app_records.py"
VALIDATOR = ROOT / "validate_app_records.py"

keys = json.loads(STATE.read_text(encoding="utf-8"))
recovery = RECOVERY.read_text(encoding="utf-8")
validator = VALIDATOR.read_text(encoding="utf-8")

expected_hash = keys["canonical_zip"]["sha256"]
expected = keys["expected_counts"]

checks = {
    "zip_sha256_in_recovery_tool": expected_hash in recovery,
    "final_records_in_recovery_tool": str(expected["final_records"]) in recovery,
    "final_records_in_validator": f'EXPECTED_FINAL_RECORDS = {expected["final_records"]}' in validator,
    "original_records_in_validator": f'EXPECTED_ORIGINAL_RECORDS = {expected["original_records"]}' in validator,
    "variants_in_validator": f'EXPECTED_GENERATED_VARIANTS = {expected["generated_variants"]}' in validator,
    "winpass_count_in_validator": '"Winpass": 570' in validator,
    "jitsuryoku_count_in_validator": '"実力錬成": 237' in validator,
    "standard_count_in_validator": '"Standard": 317' in validator,
    "partial_161_rejected": bool(keys["policy"].get("do_not_promote_partial_161_dataset")),
    "no_reconstruction": bool(keys["policy"].get("do_not_reconstruct_from_old_or_partial_files")),
    "zip_hash_required": bool(keys["policy"].get("zip_input_must_match_recorded_sha256")),
}

failed = [name for name, ok in checks.items() if not ok]
if failed:
    raise SystemExit("FAIL_RECOVERY_CONTRACT: " + ", ".join(failed))

if not re.fullmatch(r"[0-9a-f]{64}", expected_hash):
    raise SystemExit("FAIL_RECOVERY_CONTRACT: invalid SHA-256 format")

print("PASS_RECOVERY_CONTRACT")
print(f"canonical_zip_sha256={expected_hash}")
print(f"records={expected['final_records']} original={expected['original_records']} variants={expected['generated_variants']}")
print("partial_161_promotion=REJECTED")
print("old_partial_reconstruction=REJECTED")
