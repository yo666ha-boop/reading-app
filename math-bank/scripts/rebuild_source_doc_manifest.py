from __future__ import annotations

import argparse
import hashlib
import json
import zipfile
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path, PurePosixPath

import verify_source_archives as verifier

EXPECTED_UNIQUE_BY_SOURCE = {"Winpass": 81, "実力錬成": 27, "Standard": 32}
EXPECTED_DOCX_BEFORE_DEDUPE = 246
EXPECTED_DUPLICATES = 106
EXPECTED_UNIQUE_TOTAL = 140


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def infer_source(member_name: str, archive_logical: str) -> str:
    low = PurePosixPath(member_name).name.casefold()
    if "winpass" in low:
        return "Winpass"
    if "jitsuren" in low:
        return "実力錬成"
    if "standard" in low:
        return "Standard"
    return {"winpass": "Winpass", "jitsuren": "実力錬成", "standard": "Standard"}.get(archive_logical, archive_logical)


def collect_docx(source_dir: Path) -> tuple[dict, list[dict]]:
    identity = verifier.build_report(source_dir)
    if not identity.get("ready_for_rebuild_pipeline"):
        return identity, []
    rows: list[dict] = []
    for archive_logical, archive in identity["archives"].items():
        selected = archive.get("selected")
        if not selected:
            continue
        with zipfile.ZipFile(selected["path"]) as zf:
            for info in zf.infolist():
                if info.is_dir() or PurePosixPath(info.filename).suffix.casefold() != ".docx":
                    continue
                data = zf.read(info)
                rows.append({
                    "archive_logical": archive_logical,
                    "archive_name": Path(selected["path"]).name,
                    "member": info.filename,
                    "basename": PurePosixPath(info.filename).name,
                    "bytes": len(data),
                    "sha256": sha256_bytes(data),
                    "source": infer_source(info.filename, archive_logical),
                })
    return identity, rows


def dedupe_rows(rows: list[dict]) -> tuple[list[dict], list[dict], list[dict]]:
    by_sha: dict[str, list[dict]] = defaultdict(list)
    for row in rows:
        by_sha[row["sha256"]].append(row)

    unique: list[dict] = []
    duplicate_groups: list[dict] = []
    conflicts: list[dict] = []
    for digest in sorted(by_sha):
        group = sorted(by_sha[digest], key=lambda x: (x["source"], x["basename"], x["archive_name"], x["member"]))
        sources = sorted(set(r["source"] for r in group))
        if len(sources) > 1:
            conflicts.append({"sha256": digest, "sources": sources, "members": group})
            continue
        chosen = dict(group[0])
        chosen["duplicate_copies"] = len(group) - 1
        chosen["all_locations"] = [
            {"archive_name": r["archive_name"], "member": r["member"], "basename": r["basename"]}
            for r in group
        ]
        unique.append(chosen)
        if len(group) > 1:
            duplicate_groups.append({"sha256": digest, "copies": len(group), "source": sources[0], "members": group})
    unique.sort(key=lambda x: (x["source"], x["basename"], x["sha256"]))
    return unique, duplicate_groups, conflicts


def build_report(source_dir: Path) -> dict:
    identity, rows = collect_docx(source_dir)
    unique, duplicate_groups, conflicts = dedupe_rows(rows) if rows else ([], [], [])
    raw_by_source = Counter(r["source"] for r in rows)
    unique_by_source = Counter(r["source"] for r in unique)
    duplicate_copies = len(rows) - len(unique)
    gates = {
        "exact_source_identity": bool(identity.get("ready_for_rebuild_pipeline")),
        "docx_before_dedupe_246": len(rows) == EXPECTED_DOCX_BEFORE_DEDUPE,
        "duplicate_copies_106": duplicate_copies == EXPECTED_DUPLICATES,
        "unique_total_140": len(unique) == EXPECTED_UNIQUE_TOTAL,
        "unique_by_source_81_27_32": dict(unique_by_source) == EXPECTED_UNIQUE_BY_SOURCE,
        "no_cross_source_sha_conflicts": not conflicts,
    }
    return {
        "workflow": "Math Rebuild Source DOCX Manifest",
        "recorded_at_utc": datetime.now(timezone.utc).isoformat(),
        "source_identity": identity,
        "raw_docx_count": len(rows),
        "raw_docx_by_source": dict(sorted(raw_by_source.items())),
        "unique_docx_count": len(unique),
        "unique_docx_by_source": dict(sorted(unique_by_source.items())),
        "duplicate_copies": duplicate_copies,
        "duplicate_groups": duplicate_groups,
        "cross_source_sha_conflicts": conflicts,
        "gates": gates,
        "ready_for_ooxml_extraction": all(gates.values()),
        "documents": unique,
        "policy": "The 246->140 result is reproduced from exact source bytes by DOCX SHA-256 identity. Counts are gates, never targets used to delete documents.",
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--source-dir", type=Path, default=Path("math-bank/source"))
    ap.add_argument("--report", type=Path, default=Path("math-bank/state/source-doc-manifest-latest.json"))
    ap.add_argument("--strict", action="store_true")
    args = ap.parse_args()
    report = build_report(args.source_dir)
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({k: report[k] for k in ["raw_docx_count", "raw_docx_by_source", "unique_docx_count", "unique_docx_by_source", "duplicate_copies", "gates", "ready_for_ooxml_extraction"]}, ensure_ascii=False, indent=2))
    return 0 if (not args.strict or report["ready_for_ooxml_extraction"]) else 6


if __name__ == "__main__":
    raise SystemExit(main())
