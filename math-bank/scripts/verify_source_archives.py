from __future__ import annotations

import argparse
import hashlib
import json
import re
import zipfile
from collections import Counter
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable

EXPECTED_ARCHIVES = {
    "winpass": {
        "canonical_name": "winpassデータ.zip",
        "sha256": "29bd0cfc8a40287394e8fddf927cb744105e59fed0864e1272aaf1f795d31edf",
        "historical_original_records": 570,
        "historical_raw_diagnostic_records": 717,
    },
    "jitsuren": {
        "canonical_name": "中学実力錬成データ.zip",
        "sha256": "d32d37e2ffeffce059f5ee81b4cf40c1097c0961af2a50e9017534abe4d47b2d",
        "historical_original_records": 237,
        "historical_raw_diagnostic_records": 237,
    },
    "standard": {
        "canonical_name": "スタンダードデータ.zip",
        "sha256": "c828516bccc230ebc7d7217ae708117d4b6971108417c5e0d0eff48cb075fec9",
        "historical_original_records": 317,
        "historical_raw_diagnostic_records": 317,
    },
}

_COPY_SUFFIX = re.compile(r"\s*\(\d+\)$")


@dataclass(frozen=True)
class ArchiveCandidate:
    path: Path
    sha256: str
    size: int


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def normalized_zip_name(name: str) -> str:
    p = Path(name)
    if p.suffix.lower() != ".zip":
        return name
    return _COPY_SUFFIX.sub("", p.stem).casefold() + ".zip"


def expected_normalized_name(spec: dict) -> str:
    return normalized_zip_name(str(spec["canonical_name"]))


def find_candidates(source_dir: Path, spec: dict) -> list[ArchiveCandidate]:
    wanted = expected_normalized_name(spec)
    found: list[ArchiveCandidate] = []
    for path in sorted(source_dir.glob("*.zip")):
        if normalized_zip_name(path.name) != wanted:
            continue
        found.append(ArchiveCandidate(path=path, sha256=sha256_file(path), size=path.stat().st_size))
    return found


def inspect_zip(path: Path) -> dict:
    with zipfile.ZipFile(path) as zf:
        infos = zf.infolist()
        file_infos = [i for i in infos if not i.is_dir()]
        names = [i.filename for i in file_infos]
        duplicate_member_names = sorted(name for name, n in Counter(names).items() if n > 1)
        extension_counts = Counter(Path(name).suffix.lower() or "<none>" for name in names)
        bad_member = zf.testzip()
        return {
            "zip_valid": bad_member is None,
            "first_bad_member": bad_member,
            "file_members": len(file_infos),
            "directory_members": sum(i.is_dir() for i in infos),
            "uncompressed_bytes": sum(i.file_size for i in file_infos),
            "extension_counts": dict(sorted(extension_counts.items())),
            "duplicate_member_names": duplicate_member_names,
            "sample_members": names[:20],
        }


def verify_archive(source_dir: Path, logical_name: str, spec: dict) -> dict:
    candidates = find_candidates(source_dir, spec)
    expected_sha = str(spec["sha256"])
    exact = [c for c in candidates if c.sha256 == expected_sha]
    result = {
        "logical_name": logical_name,
        "canonical_name": spec["canonical_name"],
        "expected_sha256": expected_sha,
        "historical_original_records": spec["historical_original_records"],
        "historical_raw_diagnostic_records": spec["historical_raw_diagnostic_records"],
        "candidates": [
            {"path": str(c.path), "name": c.path.name, "bytes": c.size, "sha256": c.sha256}
            for c in candidates
        ],
        "status": "MISSING",
        "selected": None,
        "zip_inspection": None,
    }
    if not candidates:
        return result
    if not exact:
        result["status"] = "HASH_MISMATCH"
        return result
    result["status"] = "EXACT_MATCH_DUPLICATED_UPLOAD" if len(exact) > 1 else "EXACT_MATCH"
    selected = exact[0]
    result["selected"] = {
        "path": str(selected.path),
        "name": selected.path.name,
        "bytes": selected.size,
        "sha256": selected.sha256,
    }
    try:
        result["zip_inspection"] = inspect_zip(selected.path)
        if not result["zip_inspection"]["zip_valid"]:
            result["status"] = "ZIP_CRC_FAILURE"
    except (zipfile.BadZipFile, OSError) as exc:
        result["status"] = "INVALID_ZIP"
        result["zip_inspection"] = {"error": f"{type(exc).__name__}: {exc}"}
    return result


def build_report(source_dir: Path, specs: dict[str, dict] | None = None) -> dict:
    specs = specs or EXPECTED_ARCHIVES
    archives = {name: verify_archive(source_dir, name, spec) for name, spec in specs.items()}
    exact_statuses = {"EXACT_MATCH", "EXACT_MATCH_DUPLICATED_UPLOAD"}
    all_exact = all(item["status"] in exact_statuses for item in archives.values())
    all_zip_valid = all(
        bool(item.get("zip_inspection") and item["zip_inspection"].get("zip_valid"))
        for item in archives.values()
    )
    exact_sources_verified = all_exact and all_zip_valid
    return {
        "workflow": "Math Source Archive Exact Identity Verification",
        "recorded_at_utc": datetime.now(timezone.utc).isoformat(),
        "source_dir": str(source_dir),
        "mode": "SOURCE_REBUILD_INPUT_VERIFICATION",
        "policy": {
            "renamed_copy_suffix_allowed": "trailing (N) before .zip may differ",
            "content_identity": "SHA-256 must exactly match historical source archive SHA",
            "hash_mismatch_fail_closed": True,
            "raw_diagnostic_records_never_promote_directly": True,
            "winpass_717_to_570_count_forcing_forbidden": True,
            "reconstruction_from_exact_sources_allowed_only_after_full_reaudit": True,
            "historical_canonical_bytes_are_not_recreated_by_claim": True,
            "new_rebuilt_base_requires_problem_answer_figure_duplicate_structure_gates": True,
        },
        "historical_targets": {
            "documents_total": 140,
            "raw_diagnostic_records": {"winpass": 717, "jitsuren": 237, "standard": 317, "total": 1271},
            "authoritative_original_records": {"winpass": 570, "jitsuren": 237, "standard": 317, "total": 1124},
        },
        "archives": archives,
        "all_expected_archives_exact": all_exact,
        "all_selected_archives_zip_valid": all_zip_valid,
        "exact_source_archives_verified_for_rebuild": exact_sources_verified,
        "promotable_to_historical_canonical_without_revalidation": False,
        "ready_for_rebuild_pipeline": exact_sources_verified,
        "ready_for_real_rebuild": exact_sources_verified,
        "next": (
            "If exact sources are verified, extract and re-audit all three sources; reproduce 140 documents, "
            "raw 717/237/317, then establish Winpass 570 by evidence rather than count forcing. "
            "Only the fully revalidated 1124 originals may become the new rebuilt BASE."
        ),
    }


def main(argv: Iterable[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Verify three re-uploaded math source ZIPs before evidence-based BASE reconstruction.")
    parser.add_argument("--source-dir", type=Path, default=Path("math-bank/source"))
    parser.add_argument("--report", type=Path, default=Path("math-bank/state/source-rebuild-archive-verification-latest.json"))
    parser.add_argument("--strict", action="store_true", help="return non-zero unless all three exact source ZIPs are present, byte-identical to historical inputs, and valid ZIPs")
    args = parser.parse_args(list(argv) if argv is not None else None)

    report = build_report(args.source_dir)
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    if args.strict and not report["ready_for_rebuild_pipeline"]:
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
