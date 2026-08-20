from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from pathlib import Path

from recover_canonical_app_records import local_figure_ref
from validate_app_records import load_records, main as validate_records_main

CANONICAL_ZIP_SHA256 = "eb93279a52dd49191612a52ac0df2df2fdd865c8975d815547daa126b4398175"
EXPECTED_RECORDS = 1231
EXPECTED_ORIGINAL = 1124
EXPECTED_VARIANTS = 107
ALLOWED_METHODS = {
    "direct_app_schema_from_exact_zip",
    "verified_deterministic_mapping_from_exact_zip",
}
PRESERVATION_FLAGS = (
    "title_preserved",
    "choices_preserved",
    "question_preserved",
    "answer_preserved",
    "explanation_preserved",
)


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def require_hash(value: object, label: str) -> str:
    if not isinstance(value, str) or not re.fullmatch(r"[0-9a-f]{64}", value):
        raise ValueError(f"invalid {label}")
    return value


def validate_provenance(provenance_path: Path, data_path: Path, asset_root: Path) -> dict:
    if not provenance_path.is_file():
        raise ValueError(f"missing canonical provenance: {provenance_path}")
    if not data_path.is_file():
        raise ValueError(f"missing app records: {data_path}")

    provenance = json.loads(provenance_path.read_text(encoding="utf-8"))
    if not isinstance(provenance, dict):
        raise ValueError("canonical provenance must be object")
    if provenance.get("status") != "VERIFIED_CANONICAL_APP_WIRING":
        raise ValueError("canonical provenance status is not verified")
    if provenance.get("canonical_zip_sha256") != CANONICAL_ZIP_SHA256:
        raise ValueError("canonical ZIP SHA-256 identity mismatch")
    method = provenance.get("method")
    if method not in ALLOWED_METHODS:
        raise ValueError(f"unsupported provenance method: {method}")
    if not isinstance(provenance.get("canonical_member"), str) or not provenance["canonical_member"].strip():
        raise ValueError("blank canonical member")
    require_hash(provenance.get("canonical_member_sha256"), "canonical_member_sha256")

    app_hash = require_hash(provenance.get("app_records_sha256"), "app_records_sha256")
    actual_app_hash = sha256_file(data_path)
    if actual_app_hash != app_hash:
        raise ValueError("app-records SHA-256 changed after canonical wiring")

    if provenance.get("records") != EXPECTED_RECORDS:
        raise ValueError("provenance record count mismatch")
    if provenance.get("original_records") != EXPECTED_ORIGINAL:
        raise ValueError("provenance original count mismatch")
    if provenance.get("generated_variants") != EXPECTED_VARIANTS:
        raise ValueError("provenance variant count mismatch")
    if provenance.get("source_identity_verified") is not True:
        raise ValueError("source identity was not verified")
    if provenance.get("figure_assets_verified") is not True:
        raise ValueError("figure assets were not verified")
    for flag in PRESERVATION_FLAGS:
        if provenance.get(flag) is not True:
            raise ValueError(f"canonical content preservation flag not true: {flag}")

    mapping_applied = provenance.get("schema_mapping_applied")
    if method == "direct_app_schema_from_exact_zip":
        if mapping_applied is not False:
            raise ValueError("direct app-schema provenance cannot claim a schema mapping")
    else:
        if mapping_applied is not True:
            raise ValueError("mapped provenance must declare schema_mapping_applied=true")
        require_hash(provenance.get("verified_metadata_sha256"), "verified_metadata_sha256")

    validate_records_main(str(data_path), strict=True)
    records = load_records(data_path)
    local_refs: set[str] = set()
    external_refs = 0
    for record in records:
        for ref in record.get("figure_refs", []):
            rel = local_figure_ref(ref)
            if rel is None:
                external_refs += 1
            else:
                local_refs.add(rel.as_posix())

    assets = provenance.get("local_figure_assets")
    if not isinstance(assets, list):
        raise ValueError("local_figure_assets must be list")
    provenance_assets: dict[str, str] = {}
    for item in assets:
        if not isinstance(item, dict):
            raise ValueError("invalid local figure provenance entry")
        path = item.get("path")
        digest = require_hash(item.get("sha256"), "figure sha256")
        if not isinstance(path, str) or not path.strip():
            raise ValueError("blank local figure provenance path")
        rel = local_figure_ref(path)
        if rel is None:
            raise ValueError(f"provenance asset is external, not local: {path}")
        key = rel.as_posix()
        if key in provenance_assets:
            raise ValueError(f"duplicate provenance figure asset: {key}")
        provenance_assets[key] = digest

    if set(provenance_assets) != local_refs:
        missing = sorted(local_refs - set(provenance_assets))
        extra = sorted(set(provenance_assets) - local_refs)
        raise ValueError(f"figure provenance path mismatch missing={missing[:10]} extra={extra[:10]}")
    if provenance.get("external_figure_refs") != external_refs:
        raise ValueError("external figure reference count mismatch")

    for rel, expected_hash in provenance_assets.items():
        path = asset_root.joinpath(*Path(rel).parts)
        if not path.is_file():
            raise ValueError(f"provenance figure asset missing: {rel}")
        actual = sha256_file(path)
        if actual != expected_hash:
            raise ValueError(f"provenance figure SHA-256 mismatch: {rel}")

    return {
        "status": "PASS_CANONICAL_PROVENANCE",
        "method": method,
        "canonical_zip_sha256": CANONICAL_ZIP_SHA256,
        "canonical_member": provenance["canonical_member"],
        "canonical_member_sha256": provenance["canonical_member_sha256"],
        "app_records_sha256": actual_app_hash,
        "records": len(records),
        "local_figure_assets": len(local_refs),
        "external_figure_refs": external_refs,
        "title_choices_and_content_preserved": True,
    }


def main() -> int:
    ap = argparse.ArgumentParser(description="Require immutable canonical origin before a math app release can be built.")
    ap.add_argument("provenance")
    ap.add_argument("app_records")
    ap.add_argument("--asset-root", default="")
    args = ap.parse_args()
    provenance = Path(args.provenance)
    data = Path(args.app_records)
    root = Path(args.asset_root) if args.asset_root else data.parent
    try:
        result = validate_provenance(provenance, data, root)
    except Exception as e:
        print(f"FAIL_CANONICAL_PROVENANCE: {e}", file=sys.stderr)
        return 1
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
