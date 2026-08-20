from __future__ import annotations

import hashlib
import json
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CONVERTER = ROOT / "convert_verified_canonical_to_app.py"
VALIDATOR = ROOT / "validate_app_records.py"
PROVENANCE_VALIDATOR = ROOT / "validate_canonical_provenance.py"
RECOVERY = ROOT / "recover_canonical_app_records.py"
CANONICAL_ZIP_SHA256 = "eb93279a52dd49191612a52ac0df2df2fdd865c8975d815547daa126b4398175"


def run(*args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run([sys.executable, *args], text=True, capture_output=True)


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def canonical_row(rid: str, i: int) -> dict:
    choices = ["選択肢A", "選択肢B", "選択肢C"] if i % 10 == 0 else None
    return {
        "id": rid,
        "stage": "中1" if i <= 411 else ("中2" if i <= 821 else "中3"),
        "unit": "変換テスト単元",
        "title": f"変換テスト {i}",
        "q": f"テスト専用問題 {i}",
        "choices": choices,
        "ans": "選択肢B" if choices else str(i),
        "explanation": f"テスト専用解説 {i}",
    }


def metadata_row(rid: str, i: int, book: str, original_no: str | None, variant: bool, parent_id: str | None) -> dict:
    return {
        "id": rid,
        "grade": 1 if i <= 411 else (2 if i <= 821 else 3),
        "unit": {"major": "テスト", "minor": "変換", "tags": ["converter-test"]},
        "skill": "検証",
        "question_format": "選択" if i % 10 == 0 else "記述",
        "difficulty": "standard",
        "source": {
            "book": book,
            "document": "TEST_ONLY_NOT_CANONICAL",
            "original_no": original_no,
            "is_generated_variant": variant,
            "parent_id": parent_id,
        },
        "figure_refs": [],
        "variant_group": parent_id if variant else None,
        "prerequisites": [],
        "audit": {
            "problem_answer_verified": True,
            "structure_verified": True,
            "figure_refs_verified": True,
            "notes": ["synthetic regression fixture only"],
        },
    }


def build_fixture() -> tuple[list[dict], list[dict]]:
    canonical: list[dict] = []
    metadata: list[dict] = []
    original_ids: list[str] = []
    i = 0
    for book, count in (("Winpass", 570), ("実力錬成", 237), ("Standard", 317)):
        for n in range(1, count + 1):
            i += 1
            rid = f"TEST-ORIG-{i:04d}"
            original_ids.append(rid)
            canonical.append(canonical_row(rid, i))
            metadata.append(metadata_row(rid, i, book, str(n), False, None))
    for n in range(1, 108):
        i += 1
        rid = f"TEST-VAR-{n:03d}"
        parent_id = original_ids[n - 1]
        canonical.append(canonical_row(rid, i))
        metadata.append(metadata_row(rid, i, "generated", None, True, parent_id))
    assert i == 1231
    return canonical, metadata


with tempfile.TemporaryDirectory() as td_raw:
    td = Path(td_raw)
    canonical, metadata = build_fixture()
    canonical_path = td / "canonical.json"
    metadata_path = td / "verified_metadata.json"
    output_path = td / "app-records.json"
    canonical_path.write_text(json.dumps(canonical, ensure_ascii=False), encoding="utf-8")
    metadata_path.write_text(json.dumps(metadata, ensure_ascii=False), encoding="utf-8")

    p = run(str(CONVERTER), str(canonical_path), str(metadata_path), "--output", str(output_path))
    combined = p.stdout + p.stderr
    if p.returncode != 0 or "PASS_VERIFIED_DETERMINISTIC_MAPPING" not in combined or not output_path.is_file():
        raise SystemExit(f"FAIL converter positive case rc={p.returncode}\n{p.stdout}\n{p.stderr}")

    p2 = run(str(VALIDATOR), str(output_path))
    if p2.returncode != 0 or '"status": "PASS"' not in p2.stdout:
        raise SystemExit(f"FAIL converted strict validator rc={p2.returncode}\n{p2.stdout}\n{p2.stderr}")

    app = json.loads(output_path.read_text(encoding="utf-8"))
    for src, dst in zip(canonical, app):
        expected = (src["id"], src["title"], src["q"], src["choices"], src["ans"], src["explanation"])
        actual = (dst["id"], dst["title"], dst["question"], dst["choices"], dst["answer"], dst["explanation"])
        if expected != actual:
            raise SystemExit(f"FAIL content preservation mismatch: {src['id']}")

    # Provenance validator: exact SHA chain and content flags are required, and later app tampering must fail.
    provenance_path = td / "canonical-provenance.json"
    provenance = {
        "status": "VERIFIED_CANONICAL_APP_WIRING",
        "method": "verified_deterministic_mapping_from_exact_zip",
        "canonical_zip_sha256": CANONICAL_ZIP_SHA256,
        "canonical_member": "TEST_ONLY/canonical.json",
        "canonical_member_sha256": sha256(canonical_path),
        "verified_metadata_sha256": sha256(metadata_path),
        "app_records_sha256": sha256(output_path),
        "records": 1231,
        "original_records": 1124,
        "generated_variants": 107,
        "source_identity_verified": True,
        "schema_mapping_applied": True,
        "title_preserved": True,
        "choices_preserved": True,
        "question_preserved": True,
        "answer_preserved": True,
        "explanation_preserved": True,
        "figure_assets_verified": True,
        "local_figure_assets": [],
        "external_figure_refs": 0,
    }
    provenance_path.write_text(json.dumps(provenance, ensure_ascii=False, indent=2), encoding="utf-8")
    p_prov = run(str(PROVENANCE_VALIDATOR), str(provenance_path), str(output_path), "--asset-root", str(td))
    if p_prov.returncode != 0 or "PASS_CANONICAL_PROVENANCE" not in p_prov.stdout:
        raise SystemExit(f"FAIL provenance positive case rc={p_prov.returncode}\n{p_prov.stdout}\n{p_prov.stderr}")

    original_output_bytes = output_path.read_bytes()
    output_path.write_bytes(original_output_bytes + b"\n")
    p_tamper = run(str(PROVENANCE_VALIDATOR), str(provenance_path), str(output_path), "--asset-root", str(td))
    if p_tamper.returncode == 0 or "app-records SHA-256 changed" not in (p_tamper.stdout + p_tamper.stderr):
        raise SystemExit(f"FAIL provenance app tamper gate rc={p_tamper.returncode}\n{p_tamper.stdout}\n{p_tamper.stderr}")
    output_path.write_bytes(original_output_bytes)

    # A standalone strict-valid JSON can never promote itself as canonical without the immutable final ZIP identity.
    standalone_out = td / "standalone-must-not-promote.json"
    standalone_prov = td / "standalone-must-not-prove.json"
    p_nonzip = run(str(RECOVERY), str(output_path), "--output", str(standalone_out), "--provenance-output", str(standalone_prov))
    if p_nonzip.returncode != 6 or "BLOCKED_STRICT_APP_JSON_WITHOUT_CANONICAL_ZIP_IDENTITY" not in (p_nonzip.stdout + p_nonzip.stderr) or standalone_out.exists() or standalone_prov.exists():
        raise SystemExit(f"FAIL strict standalone JSON identity gate rc={p_nonzip.returncode}\n{p_nonzip.stdout}\n{p_nonzip.stderr}")

    bad_metadata_path = td / "missing_metadata.json"
    bad_metadata_path.write_text(json.dumps(metadata[:-1], ensure_ascii=False), encoding="utf-8")
    blocked_out = td / "must_not_exist.json"
    p3 = run(str(CONVERTER), str(canonical_path), str(bad_metadata_path), "--output", str(blocked_out))
    if p3.returncode != 3 or "BLOCKED_NO_GUESS_MAPPING" not in (p3.stdout + p3.stderr) or blocked_out.exists():
        raise SystemExit(f"FAIL missing metadata gate rc={p3.returncode}\n{p3.stdout}\n{p3.stderr}")

print("PASS_VERIFIED_CONVERTER_TEST")
print("synthetic_fixture_only=1231")
print("strict_counts=1124_original+107_variant")
print("source_counts=570+237+317")
print("content_preserved=id,title,q,choices,ans,explanation")
print("canonical_provenance_sha_chain=PASS")
print("app_records_post_wiring_tamper=REJECTED")
print("strict_nonzip_self_promotion=REJECTED")
print("missing_per_id_metadata=REJECTED")
