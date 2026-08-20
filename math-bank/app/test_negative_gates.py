from __future__ import annotations

import json
import subprocess
import sys
import tempfile
import zipfile
from pathlib import Path

import build_release_bundle as release_bundle
from recover_canonical_app_records import local_figure_ref

ROOT = Path(__file__).resolve().parent
RECOVERY = ROOT / "recover_canonical_app_records.py"
VALIDATOR = ROOT / "validate_app_records.py"


def run(*args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run([sys.executable, *args], text=True, capture_output=True)


def must_reject_figure_ref(ref: str) -> None:
    try:
        local_figure_ref(ref)
    except ValueError:
        return
    raise SystemExit(f"FAIL unsafe figure ref was accepted: {ref}")


def valid_original() -> dict:
    return {
        "id": "NEG-BASE-001",
        "grade": 1,
        "unit": {"major": "数と式", "minor": "正負の数", "tags": []},
        "skill": "計算",
        "question_format": "計算",
        "difficulty": "basic",
        "source": {
            "book": "Winpass",
            "document": "negative-fixture",
            "original_no": "1",
            "is_generated_variant": False,
            "parent_id": None,
        },
        "question": "1+1を計算しなさい。",
        "answer": "2",
        "explanation": "",
        "figure_refs": [],
        "variant_group": None,
        "prerequisites": [],
        "audit": {
            "problem_answer_verified": True,
            "structure_verified": True,
            "figure_refs_verified": True,
        },
    }


def must_validator_reject(td: Path, record: dict, label: str) -> None:
    path = td / f"validator_{label}.json"
    path.write_text(json.dumps([record], ensure_ascii=False), encoding="utf-8")
    p = run(str(VALIDATOR), str(path), "--non-strict")
    if p.returncode == 0 or "FAIL:" not in (p.stdout + p.stderr):
        raise SystemExit(f"FAIL validator accepted {label}\n{p.stdout}\n{p.stderr}")


with tempfile.TemporaryDirectory() as td_raw:
    td = Path(td_raw)

    # 1) A similarly named/well-formed ZIP that is not the recorded final artifact must be rejected by hash.
    fake_zip = td / "みかみ塾数学問題バンク_最終完成版_20260820.zip"
    with zipfile.ZipFile(fake_zip, "w") as zf:
        zf.writestr("app-records.json", json.dumps([{}] * 1231))
    fake_out = td / "from_fake_zip.json"
    p = run(str(RECOVERY), str(fake_zip), "--output", str(fake_out))
    if p.returncode != 4 or "ZIP_SHA256_MISMATCH" not in (p.stdout + p.stderr) or fake_out.exists():
        raise SystemExit(f"FAIL fake ZIP gate rc={p.returncode}\n{p.stdout}\n{p.stderr}")

    # 2) The known 161-record partial shape must never be promoted, even when supplied as JSON.
    partial = td / "partial161.json"
    partial.write_text(json.dumps([{}] * 161), encoding="utf-8")
    partial_out = td / "from_partial.json"
    p = run(str(RECOVERY), str(partial), "--output", str(partial_out))
    if p.returncode != 3 or "REJECT_COUNT_161" not in (p.stdout + p.stderr) or partial_out.exists():
        raise SystemExit(f"FAIL partial 161 gate rc={p.returncode}\n{p.stdout}\n{p.stderr}")

    # 3) A 1231-count JSON that does not satisfy the canonical schema/audit contract must still be rejected.
    malformed = td / "malformed1231.json"
    malformed.write_text(json.dumps([{}] * 1231), encoding="utf-8")
    malformed_out = td / "from_malformed.json"
    p = run(str(RECOVERY), str(malformed), "--output", str(malformed_out))
    if p.returncode != 3 or malformed_out.exists():
        raise SystemExit(f"FAIL malformed 1231 gate rc={p.returncode}\n{p.stdout}\n{p.stderr}")

    # 4) The strict validator itself must reject a structurally invalid record set.
    p = run(str(VALIDATOR), str(malformed))
    if p.returncode == 0 or "FAIL:" not in (p.stdout + p.stderr):
        raise SystemExit(f"FAIL strict validator negative case rc={p.returncode}\n{p.stdout}\n{p.stderr}")

    # 5) Figure references cannot escape the app directory or masquerade as non-image payloads.
    for ref in ("../index.html", "figures/../../index.html", "/etc/passwd", "figures\\evil.png", "index.html", "app-records.json", "figures/script.js"):
        must_reject_figure_ref(ref)
    if local_figure_ref("figures/sample.png") is None:
        raise SystemExit("FAIL safe local figure ref rejected")
    if local_figure_ref("https://example.invalid/sample.png") is not None:
        raise SystemExit("FAIL external figure ref treated as local")

    # 6) Python validation must reject the same type/shape defects blocked by the browser canonical gate.
    bad = valid_original()
    bad["variant_group"] = 42
    must_validator_reject(td, bad, "variant_group_type")

    bad = valid_original()
    bad["prerequisites"] = ["一次方程式", "一次方程式"]
    must_validator_reject(td, bad, "duplicate_prerequisites")

    bad = valid_original()
    bad["source"]["is_generated_variant"] = 1
    must_validator_reject(td, bad, "generated_flag_non_bool")

    bad = valid_original()
    bad["source"]["document"] = None
    must_validator_reject(td, bad, "source_document_non_string")

    bad = valid_original()
    bad["source"]["original_no"] = 1
    must_validator_reject(td, bad, "source_original_no_non_string")

    bad = valid_original()
    bad["grade"] = True
    must_validator_reject(td, bad, "grade_bool")

    # 7) Release packaging must reject a missing local figure and include a present one.
    old_release_root = release_bundle.ROOT
    try:
        release_bundle.ROOT = td
        rec = valid_original()
        rec["figure_refs"] = ["figures/missing.png"]
        try:
            release_bundle.collect_figure_assets([rec])
        except ValueError as e:
            if "missing local figure asset" not in str(e):
                raise
        else:
            raise SystemExit("FAIL release gate accepted missing local figure")

        figure_dir = td / "figures"
        figure_dir.mkdir(parents=True, exist_ok=True)
        sample = figure_dir / "sample.png"
        sample.write_bytes(b"test-image-placeholder")
        rec["figure_refs"] = ["figures/sample.png"]
        assets, external_count = release_bundle.collect_figure_assets([rec])
        if assets != [sample] or external_count != 0:
            raise SystemExit("FAIL release gate did not collect local figure asset exactly")

        rec["figure_refs"] = ["https://example.invalid/sample.png"]
        assets, external_count = release_bundle.collect_figure_assets([rec])
        if assets or external_count != 1:
            raise SystemExit("FAIL release gate external figure accounting")
    finally:
        release_bundle.ROOT = old_release_root

print("PASS_NEGATIVE_GATES")
print("fake_zip_hash_bypass=REJECTED")
print("partial_161_promotion=REJECTED")
print("malformed_1231_promotion=REJECTED")
print("strict_validator_invalid_data=REJECTED")
print("figure_path_traversal=REJECTED")
print("figure_non_image_payload=REJECTED")
print("validator_browser_shape_parity_negatives=REJECTED")
print("release_missing_local_figure=REJECTED")
print("release_present_local_figure=COLLECTED")
