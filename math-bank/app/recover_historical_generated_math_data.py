from __future__ import annotations

import argparse
import hashlib
import io
import json
import os
import subprocess
import urllib.request
import zipfile
from datetime import datetime, timezone
from pathlib import Path

REPO = os.environ.get("GITHUB_REPOSITORY", "yo666ha-boop/reading-app")
TOKEN = os.environ.get("GITHUB_TOKEN", "")
API = "https://api.github.com"
CREATED_SINCE = "2026-08-19T00:00:00Z"
CREATED_UNTIL = "2026-08-21T23:59:59Z"
MAX_ARTIFACT_BYTES = 500 * 1024 * 1024
MAX_MEMBER_BYTES = 250 * 1024 * 1024
MAX_NESTED_DEPTH = 3
MAX_GIT_BLOB_BYTES = 250 * 1024 * 1024

TARGET_SHA256 = {
    "winpass_stage4_answer_complete": "b532d64f83bb0cb0444a6b556e2490a9b56366d5c3916256ae2e96572eb1abe3",
    "winpass_stage5_question_repair": "c50053ba1765e81e256aaa95b67f94071cec3b6bb625deef801b71b0af5ae984",
    "winpass_answer_asset_index": "0e96efc7097c61ddfc1c5218da90e7ea92cbb4fd0a1e9babccfcad3756731af2",
    "combined_diagnostic_1271": "16c71b87744a3c00bb29b53d63bdaf727feaae86a5d7a505b83920c8dfefc63a",
}
TARGET_BY_SHA = {v: k for k, v in TARGET_SHA256.items()}
TEXT_NEEDLES = [
    b"25winpasst1suhy000417",
    b"25winpasst1suhy000521",
    b"25winpasst1suhy000522",
    b"winpass_verified_union570_authoritative_norm_20260820",
    b"jitsuren_verified_union225_complete27_20260820",
]
NAME_HINTS = [
    "winpass_verified_union570_authoritative_norm_20260820",
    "jitsuren_verified_union225_complete27_20260820",
    "stage4_answer_complete",
    "stage5_question_repair",
    "answer_asset_index",
    "combined_diagnostic",
    "1271",
    "2140",
]

OUT_STATE = Path("math-bank/state/historical-generated-data-recovery-latest.json")
OUT_RECOVERY = Path("math-bank/recovered-historical-generated-data")


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def request_json(url: str) -> dict:
    req = urllib.request.Request(url)
    req.add_header("Accept", "application/vnd.github+json")
    req.add_header("X-GitHub-Api-Version", "2022-11-28")
    if TOKEN:
        req.add_header("Authorization", f"Bearer {TOKEN}")
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.load(r)


def request_bytes(url: str) -> bytes:
    cmd = [
        "curl", "-fsSL",
        "-H", "Accept: application/vnd.github+json",
        "-H", "X-GitHub-Api-Version: 2022-11-28",
    ]
    if TOKEN:
        cmd += ["-H", f"Authorization: Bearer {TOKEN}"]
    cmd.append(url)
    p = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=180)
    if p.returncode:
        raise RuntimeError(f"curl rc={p.returncode}: {p.stderr.decode('utf-8','replace')[:500]}")
    return p.stdout


def safe_name(s: str) -> str:
    return "".join(c if c.isalnum() or c in "._-" else "_" for c in s)[-180:]


def record_payload_hit(report: dict, source: str, name: str, data: bytes, *, git_oid: str | None = None) -> None:
    digest = sha256_bytes(data)
    target = TARGET_BY_SHA.get(digest)
    needle_hits = [n.decode("utf-8") for n in TEXT_NEEDLES if n in data]
    hint_hit = any(h.lower() in name.lower() for h in NAME_HINTS)
    if not target and not needle_hits and not hint_hit:
        return
    row = {
        "source": source,
        "name": name,
        "bytes": len(data),
        "sha256": digest,
        "target": target,
        "text_needles": needle_hits,
        "name_hint": hint_hit,
    }
    if git_oid:
        row["git_oid"] = git_oid
    report["evidence_hits"].append(row)
    if target:
        OUT_RECOVERY.mkdir(parents=True, exist_ok=True)
        out = OUT_RECOVERY / f"{target}__{safe_name(Path(name).name or 'blob')}"
        out.write_bytes(data)
        row["recovered_path"] = str(out)
        report["exact_sha_hits"][target] += 1


def scan_git(report: dict) -> None:
    proc = subprocess.run(
        ["git", "rev-list", "--objects", "--all"],
        check=True, text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
    )
    seen: set[str] = set()
    for line in proc.stdout.splitlines():
        parts = line.split(" ", 1)
        oid = parts[0]
        name = parts[1] if len(parts) > 1 else f"git-blob-{oid}"
        if oid in seen:
            continue
        seen.add(oid)
        typ = subprocess.run(["git", "cat-file", "-t", oid], text=True, capture_output=True)
        if typ.returncode or typ.stdout.strip() != "blob":
            continue
        size_p = subprocess.run(["git", "cat-file", "-s", oid], text=True, capture_output=True)
        if size_p.returncode:
            continue
        size = int(size_p.stdout.strip() or 0)
        report["git_blobs_seen"] += 1
        if size > MAX_GIT_BLOB_BYTES:
            report["git_blobs_skipped_oversize"] += 1
            continue
        data = subprocess.check_output(["git", "cat-file", "blob", oid])
        report["git_blobs_sha256_checked"] += 1
        report["git_blob_bytes_hashed"] += len(data)
        record_payload_hit(report, "git", name, data, git_oid=oid)


def is_zip(data: bytes) -> bool:
    if len(data) < 4 or data[:2] != b"PK":
        return False
    try:
        return zipfile.is_zipfile(io.BytesIO(data))
    except Exception:
        return False


def scan_zip(report: dict, payload: bytes, prefix: str, depth: int = 0) -> None:
    if depth > MAX_NESTED_DEPTH:
        return
    try:
        with zipfile.ZipFile(io.BytesIO(payload)) as zf:
            for info in zf.infolist():
                if info.is_dir():
                    continue
                report["artifact_members_seen"] += 1
                full = f"{prefix}{info.filename}"
                if info.file_size > MAX_MEMBER_BYTES:
                    report["artifact_members_skipped_oversize"] += 1
                    continue
                try:
                    data = zf.read(info)
                except Exception as exc:
                    report["member_read_errors"].append(f"{full}: {type(exc).__name__}: {exc}")
                    continue
                report["artifact_members_sha256_checked"] += 1
                report["artifact_member_bytes_hashed"] += len(data)
                record_payload_hit(report, "actions", full, data)
                if depth < MAX_NESTED_DEPTH and len(data) <= MAX_MEMBER_BYTES and is_zip(data):
                    report["nested_zip_members"] += 1
                    scan_zip(report, data, full + "!/", depth + 1)
    except Exception as exc:
        report["zip_errors"].append(f"{prefix}: {type(exc).__name__}: {exc}")


def scan_actions(report: dict) -> None:
    if not TOKEN:
        report["actions_scan_complete"] = False
        report["actions_listing_errors"].append("GITHUB_TOKEN missing")
        return
    arts: list[dict] = []
    for page in range(1, 11):
        try:
            obj = request_json(f"{API}/repos/{REPO}/actions/artifacts?per_page=100&page={page}")
        except Exception as exc:
            report["actions_scan_complete"] = False
            report["actions_listing_errors"].append(f"page {page}: {type(exc).__name__}: {exc}")
            return
        batch = obj.get("artifacts") or []
        arts.extend(batch)
        if len(batch) < 100:
            break
    report["actions_artifacts_seen"] = len(arts)
    candidates = [
        a for a in arts
        if not a.get("expired")
        and CREATED_SINCE <= str(a.get("created_at") or "") <= CREATED_UNTIL
        and int(a.get("size_in_bytes") or 0) <= MAX_ARTIFACT_BYTES
    ]
    candidates.sort(key=lambda x: str(x.get("created_at") or ""))
    report["actions_candidate_artifacts"] = len(candidates)
    for a in candidates:
        try:
            raw = request_bytes(a["archive_download_url"])
            report["actions_artifacts_downloaded"] += 1
            scan_zip(report, raw, f"artifact:{a.get('id')}:{a.get('name')}!/")
        except Exception as exc:
            report["actions_download_failures"] += 1
            report["actions_scan_complete"] = False
            report["actions_download_errors"].append(
                f"{a.get('id')}:{a.get('name')}: {type(exc).__name__}: {exc}"
            )


def build_report() -> dict:
    return {
        "workflow": "Math Historical Generated Data Content-Addressed Recovery",
        "repo": REPO,
        "target_sha256": TARGET_SHA256,
        "text_needles": [n.decode("utf-8") for n in TEXT_NEEDLES],
        "created_window": {"since": CREATED_SINCE, "until": CREATED_UNTIL},
        "git_blobs_seen": 0,
        "git_blobs_sha256_checked": 0,
        "git_blob_bytes_hashed": 0,
        "git_blobs_skipped_oversize": 0,
        "actions_artifacts_seen": 0,
        "actions_candidate_artifacts": 0,
        "actions_artifacts_downloaded": 0,
        "actions_download_failures": 0,
        "actions_scan_complete": True,
        "actions_listing_errors": [],
        "actions_download_errors": [],
        "artifact_members_seen": 0,
        "artifact_members_sha256_checked": 0,
        "artifact_member_bytes_hashed": 0,
        "artifact_members_skipped_oversize": 0,
        "nested_zip_members": 0,
        "member_read_errors": [],
        "zip_errors": [],
        "exact_sha_hits": {k: 0 for k in TARGET_SHA256},
        "evidence_hits": [],
        "recovered_exact_targets": [],
        "completed_at_utc": None,
        "policy": (
            "Recover previously generated math data before recomputing it. Exact SHA-256 matches are recoverable evidence. "
            "Text/name hits are forensic clues only and are never promoted without validation. "
            "An incomplete Actions scan is UNKNOWN, never absence evidence."
        ),
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--skip-git", action="store_true")
    ap.add_argument("--skip-actions", action="store_true")
    args = ap.parse_args()
    OUT_RECOVERY.mkdir(parents=True, exist_ok=True)
    for p in OUT_RECOVERY.iterdir():
        if p.is_file():
            p.unlink()
    report = build_report()
    if not args.skip_git:
        scan_git(report)
    if not args.skip_actions:
        scan_actions(report)
    report["recovered_exact_targets"] = [k for k, v in report["exact_sha_hits"].items() if v]
    report["completed_at_utc"] = datetime.now(timezone.utc).isoformat()
    OUT_STATE.parent.mkdir(parents=True, exist_ok=True)
    OUT_STATE.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
