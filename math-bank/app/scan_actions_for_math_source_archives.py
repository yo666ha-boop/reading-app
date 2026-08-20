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


def scan_archive(payload: bytes, prefix: str, depth: int, report: dict) -> None:
    if depth > MAX_DEPTH:
        return
    try:
        with zipfile.ZipFile(io.BytesIO(payload)) as zf:
            for info in zf.infolist():
                if info.is_dir():
                    continue
                report["members_seen"] += 1
                full = f"{prefix}{info.filename}"
                if info.file_size > MAX_MEMBER:
                    report["oversize_members_skipped"] += 1
                    continue
                try:
                    data = zf.read(info)
                except Exception as e:
                    report["errors"].append(f"read {full}: {e}")
                    continue
                digest = sha(data)
                report["members_sha256_checked"] += 1
                report["member_bytes_hashed"] += len(data)
                if digest in TARGETS:
                    name = TARGETS[digest]
                    OUT.mkdir(parents=True, exist_ok=True)
                    dest = OUT / name
                    if dest.exists() and sha(dest.read_bytes()) != digest:
                        raise RuntimeError(f"existing recovered source has wrong SHA: {dest}")
                    dest.write_bytes(data)
                    report["hits"].append({
                        "artifact_member": full,
                        "sha256": digest,
                        "bytes": len(data),
                        "canonical_output": str(dest),
                    })
                is_zip = len(data) >= 4 and data[:2] == b"PK"
                if is_zip and depth < MAX_DEPTH and len(data) <= MAX_NESTED:
                    try:
                        if zipfile.is_zipfile(io.BytesIO(data)):
                            report["nested_zip_members"] += 1
                            scan_archive(data, full + "!/", depth + 1, report)
                    except Exception as e:
                        report["errors"].append(f"nested {full}: {e}")
    except zipfile.BadZipFile as e:
        report["errors"].append(f"bad artifact zip {prefix}: {e}")


def main() -> int:
    if not core.TOKEN:
        print("BLOCKED: GITHUB_TOKEN required")
        return 2
    artifacts=[]
    page=1
    while page <= 20:
        obj=core.request_json(f"{core.API}/repos/{core.REPO}/actions/artifacts?per_page=100&page={page}")
        batch=obj.get("artifacts") or []
        if not batch:
            break
        artifacts.extend(batch)
        if len(batch) < 100:
            break
        page += 1
    candidates=[a for a in artifacts if not a.get("expired") and int(a.get("size_in_bytes") or 0) <= core.MAX_ARTIFACT_BYTES]
    candidates.sort(key=lambda a:a.get("created_at", ""), reverse=True)
    report={
        "scan":"github_actions_all_artifact_members_for_exact_math_source_archive_sha256",
        "repo":core.REPO,
        "recorded_at_utc":None,
        "targets":[{"filename":n,"sha256":s} for s,n in TARGETS.items()],
        "artifacts_seen":len(artifacts),
        "candidate_artifacts":len(candidates),
        "artifacts_downloaded":0,
        "download_failures":0,
        "members_seen":0,
        "members_sha256_checked":0,
        "member_bytes_hashed":0,
        "nested_zip_members":0,
        "oversize_members_skipped":0,
        "hits":[],
        "errors":[],
    }
    for a in candidates:
        try:
            raw=core.request_bytes(a["archive_download_url"])
            report["artifacts_downloaded"] += 1
            scan_archive(raw, f"artifact:{a.get('id')}:{a.get('name')}!/", 0, report)
        except Exception as e:
            report["download_failures"] += 1
            report["errors"].append(f"artifact {a.get('id')} {a.get('name')}: {e}")
    unique={h["sha256"] for h in report["hits"]}
    report["unique_target_hits"]=len(unique)
    report["all_three_recovered"]=unique == set(TARGETS)
    report["missing_sha256"]=sorted(set(TARGETS)-unique)
    for digest,name in TARGETS.items():
        p=OUT/name
        if p.exists() and sha(p.read_bytes()) != digest:
            raise SystemExit(f"FAIL recovered {name} SHA mismatch")
    report["recorded_at_utc"]=datetime.now(timezone.utc).isoformat()
    REPORT.parent.mkdir(parents=True,exist_ok=True)
    REPORT.write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print(json.dumps(report,ensure_ascii=False,indent=2))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as e:
        print(f"FAIL: {e}", file=sys.stderr)
        raise SystemExit(1)
