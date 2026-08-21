from __future__ import annotations

import hashlib
import io
import json
import os
import sys
import zipfile
from datetime import datetime, timezone
from pathlib import Path

import scan_actions_artifacts as core

TARGETS = {
    "29bd0cfc8a40287394e8fddf927cb744105e59fed0864e1272aaf1f795d31edf": "winpassデータ.zip",
    "faf6be5a540d9636a8ff07ca6e0c72824ad051a7881f4eb466e8274c58a02f33": "中学実力錬成データ.zip",
    "c26dfbe04e9d28796fecd69e07162ebed7c68e20c9a5c2f6418ce203924d3bf6": "スタンダードデータ.zip",
}
OUT = Path("math-bank/recovered-source-archives")
REPORT = Path("math-bank/state/source-archive-actions-scan-latest.json")
MAX_DEPTH = 3
MAX_MEMBER = 500 * 1024 * 1024
MAX_NESTED = 250 * 1024 * 1024


def sha(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def load_previous() -> dict:
    try:
        obj = json.loads(REPORT.read_text(encoding="utf-8"))
        return obj if isinstance(obj, dict) else {}
    except Exception:
        return {}


def artifact_key(item: dict) -> tuple[int, int, str]:
    return (
        int(item.get("artifact_id") or item.get("id") or 0),
        int(item.get("size_in_bytes") or 0),
        str(item.get("updated_at") or ""),
    )


def reusable(item: dict) -> bool:
    return bool(
        item.get("downloaded") is True
        and not item.get("errors")
        and int(item.get("oversize_members_skipped") or 0) == 0
        and not item.get("target_hits")
    )


def scan_archive(payload: bytes, prefix: str, depth: int, item: dict) -> None:
    if depth > MAX_DEPTH:
        return
    try:
        with zipfile.ZipFile(io.BytesIO(payload)) as zf:
            for info in zf.infolist():
                if info.is_dir():
                    continue
                item["members_seen"] += 1
                full = f"{prefix}{info.filename}"
                if info.file_size > MAX_MEMBER:
                    item["oversize_members_skipped"] += 1
                    continue
                try:
                    data = zf.read(info)
                except Exception as e:
                    item["errors"].append(f"read {full}: {e}")
                    continue
                digest = sha(data)
                item["members_sha256_checked"] += 1
                item["member_bytes_hashed"] += len(data)
                if digest in TARGETS:
                    name = TARGETS[digest]
                    OUT.mkdir(parents=True, exist_ok=True)
                    dest = OUT / name
                    if dest.exists() and sha(dest.read_bytes()) != digest:
                        raise RuntimeError(f"existing recovered source has wrong SHA: {dest}")
                    dest.write_bytes(data)
                    item["target_hits"].append(
                        {
                            "artifact_member": full,
                            "sha256": digest,
                            "bytes": len(data),
                            "canonical_output": str(dest),
                        }
                    )
                is_zip = len(data) >= 4 and data[:2] == b"PK"
                if is_zip and depth < MAX_DEPTH and len(data) <= MAX_NESTED:
                    try:
                        if zipfile.is_zipfile(io.BytesIO(data)):
                            item["nested_zip_members"] += 1
                            scan_archive(data, full + "!/", depth + 1, item)
                    except Exception as e:
                        item["errors"].append(f"nested {full}: {e}")
    except zipfile.BadZipFile as e:
        item["errors"].append(f"bad artifact zip {prefix}: {e}")


def main() -> int:
    if not core.TOKEN:
        print("BLOCKED: GITHUB_TOKEN required")
        return 2

    artifacts = []
    page = 1
    while page <= 20:
        obj = core.request_json(
            f"{core.API}/repos/{core.REPO}/actions/artifacts?per_page=100&page={page}"
        )
        batch = obj.get("artifacts") or []
        if not batch:
            break
        artifacts.extend(batch)
        if len(batch) < 100:
            break
        page += 1

    candidates = [
        a
        for a in artifacts
        if not a.get("expired")
        and int(a.get("size_in_bytes") or 0) <= core.MAX_ARTIFACT_BYTES
    ]
    candidates.sort(key=lambda a: a.get("created_at", ""), reverse=True)

    previous = load_previous()
    previous_items = {
        artifact_key(item): item
        for item in previous.get("artifact_results", [])
        if isinstance(item, dict) and reusable(item)
    }

    report = {
        "scan": "github_actions_all_artifact_members_for_exact_math_source_archive_sha256_incremental",
        "repo": core.REPO,
        "recorded_at_utc": None,
        "targets": [{"filename": n, "sha256": s} for s, n in TARGETS.items()],
        "artifacts_seen": len(artifacts),
        "candidate_artifacts": len(candidates),
        "reused_verified_artifacts": 0,
        "artifacts_downloaded_this_run": 0,
        "download_failures": 0,
        "members_seen": 0,
        "members_sha256_checked": 0,
        "member_bytes_hashed": 0,
        "nested_zip_members": 0,
        "oversize_members_skipped": 0,
        "hits": [],
        "errors": [],
        "artifact_results": [],
        "exact_coverage_complete": False,
        "policy": (
            "No source archive is accepted by filename alone. Every downloaded artifact member and nested ZIP member "
            "under the size caps is SHA-256 checked. Previous no-hit artifact evidence is reused only when artifact id, "
            "size, and updated_at are identical and the previous scan completed without errors or oversize skips."
        ),
    }

    OUT.mkdir(parents=True, exist_ok=True)
    for digest, name in TARGETS.items():
        p = OUT / name
        if p.exists() and sha(p.read_bytes()) != digest:
            raise SystemExit(f"FAIL recovered {name} SHA mismatch")

    for a in candidates:
        key = (
            int(a.get("id") or 0),
            int(a.get("size_in_bytes") or 0),
            str(a.get("updated_at") or ""),
        )
        cached = previous_items.get(key)
        if cached is not None:
            item = dict(cached)
            item["reused_from_previous_verified_scan"] = True
            report["reused_verified_artifacts"] += 1
        else:
            item = {
                "artifact_id": int(a.get("id") or 0),
                "name": str(a.get("name") or ""),
                "size_in_bytes": int(a.get("size_in_bytes") or 0),
                "created_at": str(a.get("created_at") or ""),
                "updated_at": str(a.get("updated_at") or ""),
                "downloaded": False,
                "reused_from_previous_verified_scan": False,
                "members_seen": 0,
                "members_sha256_checked": 0,
                "member_bytes_hashed": 0,
                "nested_zip_members": 0,
                "oversize_members_skipped": 0,
                "target_hits": [],
                "errors": [],
            }
            try:
                raw = core.request_bytes(a["archive_download_url"])
                item["downloaded"] = True
                item["archive_download_bytes"] = len(raw)
                report["artifacts_downloaded_this_run"] += 1
                scan_archive(raw, f"artifact:{a.get('id')}:{a.get('name')}!/", 0, item)
            except Exception as e:
                report["download_failures"] += 1
                item["errors"].append(f"artifact {a.get('id')} {a.get('name')}: {e}")

        report["members_seen"] += int(item.get("members_seen") or 0)
        report["members_sha256_checked"] += int(item.get("members_sha256_checked") or 0)
        report["member_bytes_hashed"] += int(item.get("member_bytes_hashed") or 0)
        report["nested_zip_members"] += int(item.get("nested_zip_members") or 0)
        report["oversize_members_skipped"] += int(item.get("oversize_members_skipped") or 0)
        report["hits"].extend(item.get("target_hits") or [])
        report["errors"].extend(item.get("errors") or [])
        report["artifact_results"].append(item)

    unique = {h["sha256"] for h in report["hits"]}
    report["unique_target_hits"] = len(unique)
    report["all_three_recovered"] = unique == set(TARGETS)
    report["missing_sha256"] = sorted(set(TARGETS) - unique)

    for digest, name in TARGETS.items():
        p = OUT / name
        if p.exists() and sha(p.read_bytes()) != digest:
            raise SystemExit(f"FAIL recovered {name} SHA mismatch")

    report["exact_coverage_complete"] = bool(
        len(report["artifact_results"]) == len(candidates)
        and report["download_failures"] == 0
        and report["oversize_members_skipped"] == 0
        and not report["errors"]
        and all(
            item.get("downloaded") is True
            and not item.get("errors")
            and int(item.get("oversize_members_skipped") or 0) == 0
            for item in report["artifact_results"]
        )
    )
    report["recorded_at_utc"] = datetime.now(timezone.utc).isoformat()
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as e:
        print(f"FAIL: {e}", file=sys.stderr)
        raise SystemExit(1)
