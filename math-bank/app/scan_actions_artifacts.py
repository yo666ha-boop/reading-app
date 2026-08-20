from __future__ import annotations

import hashlib
import io
import json
import os
import sys
import urllib.request
import zipfile
from datetime import datetime, timezone
from pathlib import Path

REPO = os.environ.get("GITHUB_REPOSITORY", "yo666ha-boop/reading-app")
TOKEN = os.environ.get("GITHUB_TOKEN", "")
API = "https://api.github.com"
EXPECTED_SHA256 = "eb93279a52dd49191612a52ac0df2df2fdd865c8975d815547daa126b4398175"
EXPECTED_FILENAME = "みかみ塾数学問題バンク_最終完成版_20260820.zip"
AUDIT_HINT = "MATHBANK_FINAL_AUDIT_V2.json"
RECOVERY_HINTS = (
    "winpass_verified_union570_authoritative_norm_20260820",
    "jitsuren_verified_union225_complete27_20260820",
)
CREATED_SINCE = "2026-08-19T00:00:00Z"
MAX_ARTIFACT_BYTES = 500 * 1024 * 1024
OUT_REPORT = Path("math-bank/state/actions-artifact-scan-latest.json")
OUT_RECOVERY = Path("math-bank/recovered")


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def request_json(url: str) -> dict:
    req = urllib.request.Request(url)
    req.add_header("Accept", "application/vnd.github+json")
    req.add_header("X-GitHub-Api-Version", "2022-11-28")
    if TOKEN:
        req.add_header("Authorization", f"Bearer {TOKEN}")
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.load(resp)


def request_bytes(url: str) -> bytes:
    req = urllib.request.Request(url)
    req.add_header("Accept", "application/vnd.github+json")
    req.add_header("X-GitHub-Api-Version", "2022-11-28")
    if TOKEN:
        req.add_header("Authorization", f"Bearer {TOKEN}")
    with urllib.request.urlopen(req, timeout=120) as resp:
        return resp.read()


def recent_enough(created_at: str) -> bool:
    return created_at >= CREATED_SINCE


def member_interest(name: str) -> bool:
    low = name.lower()
    return (
        low.endswith(".zip")
        or AUDIT_HINT.lower() in low
        or EXPECTED_FILENAME.lower() in low
        or any(h.lower() in low for h in RECOVERY_HINTS)
    )


def inspect_artifact(artifact: dict) -> tuple[dict, list[tuple[str, bytes]]]:
    result = {
        "artifact_id": artifact.get("id"),
        "name": artifact.get("name"),
        "size_in_bytes": artifact.get("size_in_bytes"),
        "created_at": artifact.get("created_at"),
        "updated_at": artifact.get("updated_at"),
        "expired": artifact.get("expired"),
        "workflow_run": artifact.get("workflow_run"),
        "downloaded": False,
        "interesting_members": [],
        "canonical_sha_hits": [],
        "errors": [],
    }
    hits: list[tuple[str, bytes]] = []
    try:
        raw = request_bytes(artifact["archive_download_url"])
        result["downloaded"] = True
        result["archive_download_bytes"] = len(raw)
        with zipfile.ZipFile(io.BytesIO(raw)) as outer:
            for info in outer.infolist():
                if info.is_dir() or not member_interest(info.filename):
                    continue
                try:
                    data = outer.read(info)
                except Exception as e:
                    result["errors"].append(f"read {info.filename}: {e}")
                    continue
                entry = {
                    "name": info.filename,
                    "bytes": len(data),
                    "sha256": sha256_bytes(data),
                }
                result["interesting_members"].append(entry)
                if info.filename.lower().endswith(".zip") and entry["sha256"] == EXPECTED_SHA256:
                    result["canonical_sha_hits"].append(entry)
                    hits.append((info.filename, data))
    except Exception as e:
        result["errors"].append(str(e))
    return result, hits


def main() -> int:
    if not TOKEN:
        print("BLOCKED: GITHUB_TOKEN is required", file=sys.stderr)
        return 2

    artifacts: list[dict] = []
    page = 1
    while page <= 10:
        payload = request_json(f"{API}/repos/{REPO}/actions/artifacts?per_page=100&page={page}")
        batch = payload.get("artifacts", [])
        if not batch:
            break
        artifacts.extend(batch)
        if len(batch) < 100:
            break
        page += 1

    candidates = [
        a for a in artifacts
        if not a.get("expired")
        and recent_enough(a.get("created_at", ""))
        and int(a.get("size_in_bytes") or 0) <= MAX_ARTIFACT_BYTES
    ]
    candidates.sort(key=lambda a: a.get("created_at", ""), reverse=True)

    report = {
        "scan": "github_actions_artifacts_for_exact_math_canonical",
        "repo": REPO,
        "expected_filename": EXPECTED_FILENAME,
        "expected_sha256": EXPECTED_SHA256,
        "created_since": CREATED_SINCE,
        "all_artifacts_seen": len(artifacts),
        "candidate_artifacts": len(candidates),
        "canonical_hits": 0,
        "audit_name_hits": 0,
        "recovery_hint_hits": 0,
        "artifacts": [],
        "recovered_files": [],
        "completed_at_utc": datetime.now(timezone.utc).isoformat(),
        "policy": "discovery only; exact canonical ZIP promotion requires immutable SHA-256 match",
    }

    OUT_RECOVERY.mkdir(parents=True, exist_ok=True)
    for artifact in candidates:
        item, hits = inspect_artifact(artifact)
        for member in item["interesting_members"]:
            low = member["name"].lower()
            if AUDIT_HINT.lower() in low:
                report["audit_name_hits"] += 1
            if any(h.lower() in low for h in RECOVERY_HINTS):
                report["recovery_hint_hits"] += 1
        for member_name, data in hits:
            report["canonical_hits"] += 1
            out = OUT_RECOVERY / EXPECTED_FILENAME
            out.write_bytes(data)
            report["recovered_files"].append({
                "source_artifact_id": artifact.get("id"),
                "source_artifact_name": artifact.get("name"),
                "member": member_name,
                "path": str(out),
                "bytes": len(data),
                "sha256": sha256_bytes(data),
            })
        report["artifacts"].append(item)

    OUT_REPORT.parent.mkdir(parents=True, exist_ok=True)
    OUT_REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
