from __future__ import annotations

import argparse
import hashlib
import json
import shutil
import subprocess
import sys
import tempfile
import zipfile
from pathlib import Path, PurePosixPath

from convert_verified_canonical_to_app import (
    assert_content_preserved,
    build_app_records,
    load_metadata,
)
from recover_canonical_app_records import (
    CANONICAL_ZIP_SHA256,
    EXPECTED,
    EXPECTED_ORIGINAL,
    EXPECTED_VARIANTS,
    has_recorded_canonical_core,
    load_json_records,
    resolve_all_assets,
    sha256_file,
)
from validate_app_records import main as validate_records
from validate_canonical_provenance import validate_provenance

ROOT = Path(__file__).resolve().parent
STATE = ROOT.parent / "state"
DATA = ROOT / "app-records.json"
PROVENANCE = ROOT / "canonical-provenance.json"
AUDIT_DEST = ROOT / "MATHBANK_FINAL_AUDIT_V2.json"
INSPECTOR = ROOT / "inspect_canonical_artifact.py"
EVIDENCE = ROOT / "analyze_canonical_mapping_evidence.py"
DIRECT_RECOVERY = ROOT / "recover_canonical_app_records.py"
EXPECTED_AUDIT_NAME = "MATHBANK_FINAL_AUDIT_V2.json"


def run_checked(args: list[str]) -> subprocess.CompletedProcess[str]:
    proc = subprocess.run(args, text=True, capture_output=True)
    if proc.returncode:
        raise RuntimeError(
            f"command failed rc={proc.returncode}: {' '.join(args)}\nSTDOUT:\n{proc.stdout}\nSTDERR:\n{proc.stderr}"
        )
    return proc


def load_audit(path: Path) -> dict:
    if not path.is_file():
        raise ValueError(f"final audit not found: {path}")
    if path.name != EXPECTED_AUDIT_NAME:
        raise ValueError(f"final audit filename must be {EXPECTED_AUDIT_NAME}")
    obj = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(obj, dict):
        raise ValueError("final audit must be JSON object")
    return obj


def load_zip_member_records(zf: zipfile.ZipFile, member: str, td: Path) -> tuple[Path, list[dict]]:
    target = td / "canonical-member.json"
    target.write_bytes(zf.read(member))
    rows = load_json_records(target)
    if rows is None:
        raise ValueError(f"member is not readable record JSON: {member}")
    return target, rows


def find_unique_legacy_member(source: Path, td: Path) -> tuple[str, Path, list[dict]]:
    matches: list[tuple[str, Path, list[dict]]] = []
    with zipfile.ZipFile(source) as zf:
        for info in zf.infolist():
            if info.is_dir() or Path(info.filename).suffix.lower() not in {".json", ".jsonl"}:
                continue
            temp_member = td / f"candidate-{len(matches)}{Path(info.filename).suffix.lower()}"
            temp_member.write_bytes(zf.read(info))
            rows = load_json_records(temp_member)
            if rows is None or len(rows) != EXPECTED or not has_recorded_canonical_core(rows):
                temp_member.unlink(missing_ok=True)
                continue
            matches.append((info.filename, temp_member, rows))
    if len(matches) != 1:
        raise ValueError(f"expected exactly one legacy 1231 core member, found {len(matches)}")
    return matches[0]


def copy_assets(assets: dict[PurePosixPath, Path]) -> list[dict]:
    entries: list[dict] = []
    for rel, src in sorted(assets.items(), key=lambda x: x[0].as_posix()):
        dest = ROOT.joinpath(*rel.parts)
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dest)
        entries.append({"path": rel.as_posix(), "sha256": sha256_file(dest)})
    return entries


def write_mapped_provenance(
    source: Path,
    member_name: str,
    member_path: Path,
    metadata_path: Path,
    asset_entries: list[dict],
    external_count: int,
) -> None:
    provenance = {
        "status": "VERIFIED_CANONICAL_APP_WIRING",
        "method": "verified_deterministic_mapping_from_exact_zip",
        "canonical_zip_filename": source.name,
        "canonical_zip_sha256": CANONICAL_ZIP_SHA256,
        "canonical_member": member_name,
        "canonical_member_sha256": sha256_file(member_path),
        "app_records_sha256": sha256_file(DATA),
        "verified_metadata_sha256": sha256_file(metadata_path),
        "records": EXPECTED,
        "original_records": EXPECTED_ORIGINAL,
        "generated_variants": EXPECTED_VARIANTS,
        "source_identity_verified": True,
        "schema_mapping_applied": True,
        "title_preserved": True,
        "choices_preserved": True,
        "question_preserved": True,
        "answer_preserved": True,
        "explanation_preserved": True,
        "figure_assets_verified": True,
        "local_figure_assets": asset_entries,
        "external_figure_refs": external_count,
        "mapping_policy": "complete explicit per-ID verified metadata only; no defaults and no inference",
    }
    PROVENANCE.write_text(json.dumps(provenance, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def clean_partial_outputs() -> None:
    DATA.unlink(missing_ok=True)
    PROVENANCE.unlink(missing_ok=True)
    AUDIT_DEST.unlink(missing_ok=True)


def direct_path(source: Path, audit: Path) -> dict | None:
    proc = subprocess.run(
        [sys.executable, str(DIRECT_RECOVERY), str(source), "--output", str(DATA), "--provenance-output", str(PROVENANCE)],
        text=True,
        capture_output=True,
    )
    if proc.returncode == 0:
        shutil.copy2(audit, AUDIT_DEST)
        validate_records(str(DATA), strict=True)
        p = validate_provenance(PROVENANCE, DATA, ROOT)
        return {
            "status": "PASS_CANONICAL_WIRING_READY_FOR_REAL_BROWSER",
            "method": "direct_app_schema_from_exact_zip",
            "app_records_sha256": sha256_file(DATA),
            "provenance": p,
            "audit_sha256": sha256_file(AUDIT_DEST),
        }
    if proc.returncode not in {3}:
        raise RuntimeError(f"direct recovery failed rc={proc.returncode}\n{proc.stdout}\n{proc.stderr}")
    return None


def mapped_path(source: Path, audit: Path, metadata_path: Path) -> dict:
    if not metadata_path.is_file():
        raise ValueError(f"verified metadata not found: {metadata_path}")
    with tempfile.TemporaryDirectory() as td_raw:
        td = Path(td_raw)
        extract_root = td / "extract"
        extract_root.mkdir()
        with zipfile.ZipFile(source) as zf:
            zf.extractall(extract_root)
        member_name, member_temp, canonical_rows = find_unique_legacy_member(source, td)
        metadata = load_metadata(metadata_path)
        app_rows = build_app_records(canonical_rows, metadata)
        assert_content_preserved(canonical_rows, app_rows)

        # Preserve the exact canonical member bytes for provenance while resolving figures
        # against the fully extracted immutable ZIP tree.
        canonical_member_extracted = extract_root.joinpath(*Path(member_name).parts)
        if not canonical_member_extracted.is_file():
            raise ValueError(f"canonical member missing after extraction: {member_name}")

        DATA.write_text(json.dumps(app_rows, ensure_ascii=False, indent=2), encoding="utf-8")
        validate_records(str(DATA), strict=True)
        assert_content_preserved(canonical_rows, json.loads(DATA.read_text(encoding="utf-8")))

        assets, external_count = resolve_all_assets(app_rows, canonical_member_extracted, extract_root, source)
        asset_entries = copy_assets(assets)
        write_mapped_provenance(
            source,
            member_name,
            canonical_member_extracted,
            metadata_path,
            asset_entries,
            external_count,
        )
        shutil.copy2(audit, AUDIT_DEST)
        p = validate_provenance(PROVENANCE, DATA, ROOT)
        return {
            "status": "PASS_CANONICAL_WIRING_READY_FOR_REAL_BROWSER",
            "method": "verified_deterministic_mapping_from_exact_zip",
            "canonical_member": member_name,
            "app_records_sha256": sha256_file(DATA),
            "verified_metadata_sha256": sha256_file(metadata_path),
            "provenance": p,
            "audit_sha256": sha256_file(AUDIT_DEST),
        }


def main() -> int:
    ap = argparse.ArgumentParser(
        description="One-shot canonical math wiring: immutable SHA -> inspect -> evidence -> direct app pass-through or explicit verified metadata mapping -> provenance -> strict validation."
    )
    ap.add_argument("canonical_zip")
    ap.add_argument("final_audit")
    ap.add_argument("--verified-metadata", default="")
    args = ap.parse_args()

    source = Path(args.canonical_zip)
    audit = Path(args.final_audit)
    metadata = Path(args.verified_metadata) if args.verified_metadata else None
    STATE.mkdir(parents=True, exist_ok=True)
    inspection_report = STATE / "canonical-inspection-latest.json"
    evidence_report = STATE / "canonical-mapping-evidence-latest.json"
    completion_report = STATE / "canonical-completion-latest.json"

    try:
        if not source.is_file():
            raise ValueError(f"canonical ZIP not found: {source}")
        if source.suffix.lower() != ".zip":
            raise ValueError("canonical source must be ZIP")
        actual_sha = sha256_file(source)
        if actual_sha != CANONICAL_ZIP_SHA256:
            raise ValueError(f"canonical ZIP SHA mismatch: {actual_sha}")
        load_audit(audit)

        run_checked([sys.executable, str(INSPECTOR), str(source), "--output", str(inspection_report)])
        run_checked([sys.executable, str(EVIDENCE), str(source), "--output", str(evidence_report)])

        clean_partial_outputs()
        result = direct_path(source, audit)
        if result is None:
            if metadata is None:
                result = {
                    "status": "BLOCKED_VERIFIED_METADATA_REQUIRED",
                    "canonical_zip_sha256": actual_sha,
                    "inspection_report": str(inspection_report),
                    "mapping_evidence_report": str(evidence_report),
                    "reason": "The immutable ZIP does not contain a strict current app-schema candidate. A legacy 1231 mapping may proceed only with complete explicit verified per-ID metadata; no defaults or inference are allowed.",
                }
                completion_report.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
                print(json.dumps(result, ensure_ascii=False, indent=2))
                return 3
            result = mapped_path(source, audit, metadata)

        result.update({
            "canonical_zip_sha256": actual_sha,
            "inspection_report": str(inspection_report),
            "mapping_evidence_report": str(evidence_report),
            "app_records": str(DATA),
            "canonical_provenance": str(PROVENANCE),
            "final_audit": str(AUDIT_DEST),
            "next": "Run browser_real_regression.mjs, then build_release_bundle.py, then verify_publish_readiness.py; do not publish before all PASS.",
        })
        completion_report.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return 0
    except Exception as e:
        clean_partial_outputs()
        result = {
            "status": "BLOCKED_CANONICAL_COMPLETION",
            "error": str(e),
            "policy": "No canonical reconstruction, no guessed metadata, no partial promotion.",
        }
        completion_report.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(json.dumps(result, ensure_ascii=False, indent=2), file=sys.stderr)
        return 4


if __name__ == "__main__":
    raise SystemExit(main())
