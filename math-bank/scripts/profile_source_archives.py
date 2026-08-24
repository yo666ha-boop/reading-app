from __future__ import annotations

import argparse
import importlib.util
import json
import zipfile
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path, PurePosixPath
from typing import Any

VERIFIER_PATH = Path(__file__).with_name("verify_source_archives.py")
spec = importlib.util.spec_from_file_location("verify_source_archives", VERIFIER_PATH)
assert spec and spec.loader
verifier = importlib.util.module_from_spec(spec)
spec.loader.exec_module(verifier)

HISTORICAL_DOCUMENT_TARGETS = {"winpass": 81, "jitsuren": 27, "standard": 32}
IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp", ".svg", ".emf", ".wmf"}


def json_shape(value: Any) -> dict:
    if isinstance(value, dict):
        return {
            "root_type": "dict",
            "keys": sorted(str(k) for k in value.keys()),
            "key_value_types": {str(k): type(v).__name__ for k, v in sorted(value.items(), key=lambda kv: str(kv[0]))},
        }
    if isinstance(value, list):
        first_type = type(value[0]).__name__ if value else None
        first_keys = sorted(str(k) for k in value[0].keys()) if value and isinstance(value[0], dict) else []
        return {"root_type": "list", "length": len(value), "first_item_type": first_type, "first_item_keys": first_keys}
    return {"root_type": type(value).__name__}


def profile_zip(path: Path) -> dict:
    with zipfile.ZipFile(path) as zf:
        files = [i for i in zf.infolist() if not i.is_dir()]
        math_members = [i for i in files if PurePosixPath(i.filename).name.casefold() == "math.json"]
        image_members = [i.filename for i in files if PurePosixPath(i.filename).suffix.casefold() in IMAGE_EXTS]
        ext_counts = Counter(PurePosixPath(i.filename).suffix.casefold() or "<none>" for i in files)
        shapes: Counter[str] = Counter()
        per_document = []
        parse_errors = []
        for info in math_members:
            try:
                value = json.loads(zf.read(info).decode("utf-8-sig"))
                shape = json_shape(value)
                shape_key = json.dumps(shape, ensure_ascii=False, sort_keys=True)
                shapes[shape_key] += 1
                per_document.append({"path": info.filename, "bytes": info.file_size, "shape": shape})
            except Exception as exc:
                parse_errors.append({"path": info.filename, "error": f"{type(exc).__name__}: {exc}"})
        return {
            "zip_path": str(path),
            "file_members": len(files),
            "extension_counts": dict(sorted(ext_counts.items())),
            "math_json_documents": len(math_members),
            "math_json_parse_success": len(per_document),
            "math_json_parse_errors": parse_errors,
            "image_asset_members": len(image_members),
            "image_asset_sample": image_members[:20],
            "math_json_shape_histogram": [
                {"count": count, "shape": json.loads(key)} for key, count in sorted(shapes.items())
            ],
            "math_json_documents_detail": per_document,
        }


def build_profile(source_dir: Path, archive_specs: dict | None = None, document_targets: dict | None = None) -> dict:
    archive_specs = archive_specs or verifier.EXPECTED_ARCHIVES
    document_targets = document_targets or HISTORICAL_DOCUMENT_TARGETS
    identity = verifier.build_report(source_dir, archive_specs)
    source_profiles = {}
    for logical_name, item in identity["archives"].items():
        selected = item.get("selected")
        if not selected:
            source_profiles[logical_name] = {"status": "BLOCKED_SOURCE_IDENTITY_NOT_EXACT"}
            continue
        p = Path(selected["path"])
        prof = profile_zip(p)
        target = document_targets.get(logical_name)
        prof["historical_document_target"] = target
        prof["historical_document_count_match"] = target is None or prof["math_json_documents"] == target
        source_profiles[logical_name] = prof

    total_docs = sum(
        int(p.get("math_json_documents", 0)) for p in source_profiles.values() if isinstance(p, dict)
    )
    identity_ready = bool(identity.get("ready_for_rebuild_pipeline"))
    document_counts_match = identity_ready and all(
        p.get("historical_document_count_match") is True for p in source_profiles.values()
    )
    no_parse_errors = identity_ready and all(
        not p.get("math_json_parse_errors") for p in source_profiles.values()
    )
    return {
        "workflow": "Math Source Archive Structure Profile",
        "recorded_at_utc": datetime.now(timezone.utc).isoformat(),
        "source_identity": identity,
        "historical_document_targets": document_targets,
        "source_profiles": source_profiles,
        "math_json_documents_total": total_docs,
        "historical_140_documents_match": total_docs == 140,
        "all_source_document_counts_match": document_counts_match,
        "all_math_json_parse_clean": no_parse_errors,
        "ready_for_record_extraction": identity_ready and document_counts_match and no_parse_errors,
        "next": "Profile exact MATH.json shapes, then parse problem/answer structures without assuming a schema; reproduce raw 717/237/317 before any authoritative filtering.",
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--source-dir", type=Path, default=Path("math-bank/source"))
    ap.add_argument("--report", type=Path, default=Path("math-bank/state/source-rebuild-structure-profile-latest.json"))
    ap.add_argument("--strict", action="store_true")
    args = ap.parse_args()
    report = build_profile(args.source_dir)
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0 if (not args.strict or report["ready_for_record_extraction"]) else 3


if __name__ == "__main__":
    raise SystemExit(main())
