from __future__ import annotations

import json
import subprocess
import sys
import tempfile
import zipfile
from pathlib import Path

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


with tempfile.TemporaryDirectory() as td:
    td = Path(td)

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

print("PASS_NEGATIVE_GATES")
print("fake_zip_hash_bypass=REJECTED")
print("partial_161_promotion=REJECTED")
print("malformed_1231_promotion=REJECTED")
print("strict_validator_invalid_data=REJECTED")
print("figure_path_traversal=REJECTED")
print("figure_non_image_payload=REJECTED")
