from __future__ import annotations

import hashlib
import io
import json
import os
import subprocess
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
MAX_NESTED_ZIP_BYTES = 250 * 1024 * 1024
MAX_NESTED_DEPTH = 3
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
    # curl strips credentials when GitHub redirects the authenticated artifact
    # endpoint to a different storage host; urllib forwarded auth and produced 401.
    cmd = [
        "curl", "-fsSL",
        "-H", "Accept: application/vnd.github+json",
        "-H", "X-GitHub-Api-Version: 2022-11-28",
    ]
    if TOKEN:
        cmd += ["-H", f"Authorization: Bearer {TOKEN}"]
    cmd.append(url)
    proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=120)
    if proc.returncode:
        raise RuntimeError(f"curl rc={proc.returncode}: {proc.stderr.decode('utf-8', 'replace')[:500]}")
    return proc.stdout


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


def scan_zip_payload(payload: bytes, prefix: str = "", depth: int = 0) -> tuple[list[dict], list[tuple[str, bytes]], list[str]]:
    entries: list[dict] = []
    hits: list[tuple[str, bytes]] = []
    errors: list[str] = []
    if depth > MAX_NESTED_DEPTH:
        return entries, hits, errors
    try:
        with zipfile.ZipFile(io.BytesIO(payload)) as zf:
            for info in zf.infolist():
                if info.is_dir():
                    continue
                full_name = f"{prefix}{info.filename}"
                is_zip = info.filename.lower().endswith(".zip")
                if not is_zip and not member_interest(info.filename):
                    continue
                try:
                    data = zf.read(info)
                except Exception as e:
                    errors.append(f"read {full_name}: {e}")
                    continue
                entry = {
                    "name": full_name,
                    "bytes": len(data),
                    "sha256": sha256_bytes(data),
                    "depth": depth,
                }
                entries.append(entry)
                if is_zip and entry["sha256"] == EXPECTED_SHA256:
                    hits.append((full_name, data))
                if is_zip and depth < MAX_NESTED_DEPTH and len(data) <= MAX_NESTED_ZIP_BYTES:
                    child_entries, child_hits, child_errors = scan_zip_payload(
                        data, prefix=full_name + "!/", depth=depth + 1
                    )
                    entries.extend(child_entries)
                    hits.extend(child_hits)
                    errors.extend(child_errors)
    except zipfile.BadZipFile as e:
        errors.append(f"bad zip {prefix or '<artifact>'}: {e}")
    return entries, hits, errors


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
        entries, hits, errors = scan_zip_payload(raw)
        result["interesting_members"] = entries
        result["canonical_sha_hits"] = [entry for entry in entries if entry["sha256"] == EXPECTED_SHA256]
        result["errors"].extend(errors)
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
        "download_failures": 0,
        "artifacts": [],
        "recovered_files": [],
        "completed_at_utc": datetime.now(timezone.utc).isoformat(),
        "policy": "discovery only; exact canonical ZIP promotion requires immutable SHA-256 match",
    }

    OUT_RECOVERY.mkdir(parents=True, exist_ok=True)
    for artifact in candidates:
        item, hits = inspect_artifact(artifact)
        if not item["downloaded"]:
            report["download_failures"] += 1
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
