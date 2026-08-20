from __future__ import annotations

import argparse
import hashlib
import json
import zipfile
from collections import Counter
from pathlib import Path

CANONICAL_ZIP_SHA256 = "eb93279a52dd49191612a52ac0df2df2fdd865c8975d815547daa126b4398175"
EXPECTED = 1231
APP_REQUIRED = {
    "id", "grade", "unit", "title", "skill", "question_format", "difficulty", "source",
    "question", "choices", "answer", "explanation", "figure_refs", "variant_group", "audit",
}
RECORDED_CORE = {"id", "stage", "unit", "title", "q", "choices", "ans", "explanation"}
IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".avif"}


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def load_records_bytes(name: str, data: bytes) -> list[dict] | None:
    try:
        text = data.decode("utf-8")
        if name.lower().endswith(".jsonl"):
            rows = [json.loads(line) for line in text.splitlines() if line.strip()]
            return rows if isinstance(rows, list) else None
        obj = json.loads(text)
    except Exception:
        return None
    if isinstance(obj, list):
        return obj
    if isinstance(obj, dict) and isinstance(obj.get("records"), list):
        return obj["records"]
    return None


def key_profile(rows: list[dict]) -> dict:
    dict_rows = [r for r in rows if isinstance(r, dict)]
    if not dict_rows:
        return {
            "dict_records": 0,
            "common_keys": [],
            "union_keys": [],
            "app_required_common": False,
            "recorded_core_common": False,
        }
    common = set(dict_rows[0])
    union: set[str] = set()
    for r in dict_rows:
        common &= set(r)
        union |= set(r)
    return {
        "dict_records": len(dict_rows),
        "common_keys": sorted(common),
        "union_keys": sorted(union),
        "app_required_common": APP_REQUIRED <= common,
        "recorded_core_common": RECORDED_CORE <= common,
    }


def top_types(rows: list[dict], key: str) -> dict[str, int]:
    counts = Counter(type(r.get(key)).__name__ for r in rows if isinstance(r, dict) and key in r)
    return dict(counts.most_common())


def inspect_zip(path: Path) -> dict:
    actual_sha = sha256_file(path)
    report: dict = {
        "artifact": str(path),
        "artifact_sha256": actual_sha,
        "expected_sha256": CANONICAL_ZIP_SHA256,
        "canonical_zip_sha256_match": actual_sha.lower() == CANONICAL_ZIP_SHA256,
        "promotion_allowed": False,
        "policy": "inspection only; do not transform or promote from this report",
    }
    if not report["canonical_zip_sha256_match"]:
        report["status"] = "BLOCKED_ZIP_SHA256_MISMATCH"
        return report

    members: list[dict] = []
    json_candidates: list[dict] = []
    html_members: list[str] = []
    audit_members: list[str] = []
    image_members: list[str] = []

    with zipfile.ZipFile(path) as zf:
        for info in zf.infolist():
            if info.is_dir():
                continue
            name = info.filename
            suffix = Path(name).suffix.lower()
            entry = {"name": name, "size": info.file_size, "compressed_size": info.compress_size}
            if suffix in {".json", ".jsonl"}:
                data = zf.read(info)
                entry["sha256"] = sha256_bytes(data)
                rows = load_records_bytes(name, data)
                if rows is not None:
                    profile = key_profile(rows)
                    candidate = {
                        "name": name,
                        "records": len(rows),
                        **profile,
                        "stage_types": top_types(rows, "stage"),
                        "unit_types": top_types(rows, "unit"),
                        "title_types": top_types(rows, "title"),
                        "choices_types": top_types(rows, "choices"),
                        "source_types": top_types(rows, "source"),
                        "figure_refs_types": top_types(rows, "figure_refs"),
                        "exact_1231": len(rows) == EXPECTED,
                    }
                    if candidate["exact_1231"] and candidate["app_required_common"]:
                        candidate["classification"] = "EXACT_1231_APP_SCHEMA_CANDIDATE_WITH_TITLE_CHOICES"
                    elif candidate["exact_1231"] and candidate["recorded_core_common"]:
                        candidate["classification"] = "EXACT_1231_RECORDED_Q_ANS_CORE_CANDIDATE"
                    elif candidate["exact_1231"]:
                        candidate["classification"] = "EXACT_1231_UNKNOWN_SCHEMA_CANDIDATE"
                    else:
                        candidate["classification"] = "NON_1231_JSON"
                    json_candidates.append(candidate)
            elif suffix in {".html", ".htm"}:
                html_members.append(name)
            elif suffix in IMAGE_EXTS:
                image_members.append(name)
            if "audit" in name.lower() or "監査" in name:
                audit_members.append(name)
            members.append(entry)

    exact = [c for c in json_candidates if c["exact_1231"]]
    report.update({
        "status": "INSPECTED_CANONICAL_ZIP",
        "members_count": len(members),
        "members": members,
        "json_candidates": json_candidates,
        "exact_1231_candidates": len(exact),
        "html_members": sorted(html_members),
        "audit_like_members": sorted(set(audit_members)),
        "image_members_count": len(image_members),
        "image_members_sample": sorted(image_members)[:50],
        "next_action": (
            "Run strict app validator/recovery only if an exact app-schema candidate preserving title+choices exists; "
            "otherwise derive a deterministic mapping only from recovered canonical fields, loader, audit, and metadata files."
        ),
    })
    return report


def main() -> int:
    ap = argparse.ArgumentParser(description="Inspect the immutable final canonical math ZIP without transforming it.")
    ap.add_argument("source")
    ap.add_argument("--output", default="")
    args = ap.parse_args()
    path = Path(args.source)
    if not path.is_file():
        raise SystemExit(f"BLOCKED source not found: {path}")
    if path.suffix.lower() != ".zip":
        raise SystemExit("BLOCKED inspector requires the recorded canonical ZIP")
    try:
        report = inspect_zip(path)
    except zipfile.BadZipFile as e:
        report = {"status": "BLOCKED_BAD_ZIP", "artifact": str(path), "error": str(e)}
    text = json.dumps(report, ensure_ascii=False, indent=2) + "\n"
    if args.output:
        out = Path(args.output)
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(text, encoding="utf-8")
    print(text, end="")
    return 0 if report.get("status") == "INSPECTED_CANONICAL_ZIP" else 4


if __name__ == "__main__":
    raise SystemExit(main())
