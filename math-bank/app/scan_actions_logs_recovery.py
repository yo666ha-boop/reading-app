from __future__ import annotations

import hashlib
import io
import json
import os
import re
import subprocess
import zipfile
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

REPO = os.environ.get("GITHUB_REPOSITORY", "yo666ha-boop/reading-app")
TOKEN = os.environ.get("GITHUB_TOKEN", "")
API = "https://api.github.com"
BRANCH = "math-problem-bank-bootstrap"
EXPECTED_FILENAME = "みかみ塾数学問題バンク_最終完成版_20260820.zip"
EXPECTED_SHA256 = "eb93279a52dd49191612a52ac0df2df2fdd865c8975d815547daa126b4398175"
AUDIT_FILENAME = "MATHBANK_FINAL_AUDIT_V2.json"
HINTS = (
    EXPECTED_FILENAME,
    EXPECTED_SHA256,
    AUDIT_FILENAME,
    "winpass_verified_union570_authoritative_norm_20260820",
    "jitsuren_verified_union225_complete27_20260820",
)
CREATED_SINCE = "2026-08-19T00:00:00Z"
MAX_RUNS = 500
MAX_LOG_ARCHIVE_BYTES = 250 * 1024 * 1024
MAX_TEXT_MEMBER_BYTES = 40 * 1024 * 1024
MAX_CANDIDATE_DOWNLOAD_BYTES = 500 * 1024 * 1024
OUT_REPORT = Path("math-bank/state/actions-log-recovery-latest.json")
OUT_RECOVERY = Path("math-bank/recovered-actions-log")
URL_RE = re.compile(r"https?://[^\s<>\]\[\)\(\"']+")
ALLOWED_DOWNLOAD_HOST_SUFFIXES = (
    "github.com",
    "githubusercontent.com",
    "objects.githubusercontent.com",
)


def curl_bytes(url: str, timeout: int = 120) -> bytes:
    cmd = ["curl", "-fsSL", "--max-time", str(timeout)]
    host = (urlparse(url).hostname or "").lower()
    if TOKEN and (host == "api.github.com" or host.endswith("github.com")):
        cmd += [
            "-H", "Accept: application/vnd.github+json",
            "-H", "X-GitHub-Api-Version: 2022-11-28",
            "-H", f"Authorization: Bearer {TOKEN}",
        ]
    cmd.append(url)
    proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=timeout + 10)
    if proc.returncode:
        raise RuntimeError(proc.stderr.decode("utf-8", "replace")[:500])
    if len(proc.stdout) > MAX_CANDIDATE_DOWNLOAD_BYTES:
        raise RuntimeError(f"download exceeds {MAX_CANDIDATE_DOWNLOAD_BYTES} bytes")
    return proc.stdout


def request_json(url: str) -> dict:
    return json.loads(curl_bytes(url, timeout=90).decode("utf-8"))


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def valid_audit(data: bytes) -> bool:
    try:
        obj = json.loads(data.decode("utf-8"))
    except Exception:
        return False
    return isinstance(obj, dict)


def load_previous() -> dict:
    try:
        obj = json.loads(OUT_REPORT.read_text(encoding="utf-8"))
        return obj if isinstance(obj, dict) else {}
    except Exception:
        return {}


def reusable_run(item: dict) -> bool:
    return bool(item.get("scan_complete") is True and not item.get("errors"))


def run_key(item: dict) -> tuple[int, str]:
    return int(item.get("run_id") or 0), str(item.get("updated_at") or "")


def candidate_urls_from_text(text: str, hint_lines: list[dict]) -> list[str]:
    urls: set[str] = set()
    lines = text.splitlines()
    for idx, line in enumerate(lines):
        lower = line.lower()
        matched = [h for h in HINTS if h.lower() in lower]
        if not matched:
            continue
        hint_lines.append({"line_number": idx + 1, "matched": matched, "text": line[:2000]})
        for near in lines[max(0, idx - 2): min(len(lines), idx + 3)]:
            urls.update(u.rstrip(".,;:") for u in URL_RE.findall(near))
    return sorted(urls)


def downloadable(url: str) -> bool:
    host = (urlparse(url).hostname or "").lower()
    return any(host == suffix or host.endswith("." + suffix) for suffix in ALLOWED_DOWNLOAD_HOST_SUFFIXES)


def main() -> int:
    if not TOKEN:
        print("BLOCKED: GITHUB_TOKEN is required")
        return 2

    runs: list[dict] = []
    page = 1
    while len(runs) < MAX_RUNS and page <= 10:
        payload = request_json(
            f"{API}/repos/{REPO}/actions/runs?branch={BRANCH}&per_page=100&page={page}"
        )
        batch = payload.get("workflow_runs", [])
        if not batch:
            break
        for run in batch:
            if str(run.get("created_at") or "") >= CREATED_SINCE:
                runs.append(run)
        if len(batch) < 100:
            break
        page += 1
    runs = runs[:MAX_RUNS]

    previous = load_previous()
    cached = {
        run_key(item): item
        for item in previous.get("runs", [])
        if isinstance(item, dict) and reusable_run(item)
    }

    report = {
        "scan": "github_actions_workflow_logs_exact_math_canonical_recovery_clues",
        "repo": REPO,
        "branch": BRANCH,
        "created_since": CREATED_SINCE,
        "expected_filename": EXPECTED_FILENAME,
        "expected_sha256": EXPECTED_SHA256,
        "required_paired_audit": AUDIT_FILENAME,
        "runs_seen": len(runs),
        "runs_reused": 0,
        "runs_downloaded_this_run": 0,
        "runs_log_download_failures": 0,
        "log_members_seen": 0,
        "text_members_scanned": 0,
        "hint_lines_seen": 0,
        "candidate_urls_seen": 0,
        "candidate_urls_downloaded": 0,
        "candidate_bytes_hashed": 0,
        "canonical_hits": 0,
        "valid_audit_hits": 0,
        "paired_recovery_hits": 0,
        "runs": [],
        "recovered_files": [],
        "completed_at_utc": None,
        "policy": "Workflow logs are used only as an exact clue surface. No data reconstruction. A recovered BASE still requires the exact canonical SHA plus one valid named audit from the same workflow run clue context.",
    }

    OUT_RECOVERY.mkdir(parents=True, exist_ok=True)
    for p in (OUT_RECOVERY / EXPECTED_FILENAME, OUT_RECOVERY / AUDIT_FILENAME):
        p.unlink(missing_ok=True)

    for run in runs:
        key = (int(run.get("id") or 0), str(run.get("updated_at") or ""))
        if key in cached:
            item = cached[key]
            report["runs_reused"] += 1
            report["runs"].append(item)
            for metric in ("log_members_seen", "text_members_scanned", "hint_lines_seen", "candidate_urls_seen", "candidate_urls_downloaded", "candidate_bytes_hashed", "canonical_hits", "valid_audit_hits"):
                report[metric] += int(item.get(metric) or 0)
            continue

        item = {
            "run_id": run.get("id"),
            "name": run.get("name"),
            "event": run.get("event"),
            "status": run.get("status"),
            "conclusion": run.get("conclusion"),
            "head_sha": run.get("head_sha"),
            "created_at": run.get("created_at"),
            "updated_at": run.get("updated_at"),
            "log_members_seen": 0,
            "text_members_scanned": 0,
            "hint_lines_seen": 0,
            "candidate_urls_seen": 0,
            "candidate_urls_downloaded": 0,
            "candidate_bytes_hashed": 0,
            "canonical_hits": 0,
            "valid_audit_hits": 0,
            "hint_lines": [],
            "candidate_urls": [],
            "downloads": [],
            "scan_complete": False,
            "errors": [],
        }
        report["runs_downloaded_this_run"] += 1
        try:
            payload = curl_bytes(f"{API}/repos/{REPO}/actions/runs/{run['id']}/logs", timeout=180)
            if len(payload) > MAX_LOG_ARCHIVE_BYTES:
                raise RuntimeError(f"log archive exceeds {MAX_LOG_ARCHIVE_BYTES} bytes")
            with zipfile.ZipFile(io.BytesIO(payload)) as zf:
                for info in zf.infolist():
                    if info.is_dir():
                        continue
                    item["log_members_seen"] += 1
                    if info.file_size > MAX_TEXT_MEMBER_BYTES:
                        item["errors"].append(f"oversize log member skipped: {info.filename} {info.file_size}")
                        continue
                    data = zf.read(info)
                    text = data.decode("utf-8", "replace")
                    item["text_members_scanned"] += 1
                    member_hints: list[dict] = []
                    urls = candidate_urls_from_text(text, member_hints)
                    for h in member_hints:
                        h["member"] = info.filename
                    item["hint_lines"].extend(member_hints)
                    item["candidate_urls"].extend(urls)
            item["candidate_urls"] = sorted(set(item["candidate_urls"]))
            item["hint_lines_seen"] = len(item["hint_lines"])
            item["candidate_urls_seen"] = len(item["candidate_urls"])

            canonical_payloads: list[tuple[str, bytes]] = []
            audit_payloads: list[tuple[str, bytes]] = []
            for url in item["candidate_urls"]:
                if not downloadable(url):
                    continue
                try:
                    data = curl_bytes(url, timeout=120)
                except Exception as exc:
                    item["downloads"].append({"url": url, "downloaded": False, "error": str(exc)[:500]})
                    continue
                digest = sha256(data)
                item["candidate_urls_downloaded"] += 1
                item["candidate_bytes_hashed"] += len(data)
                record = {"url": url, "downloaded": True, "bytes": len(data), "sha256": digest}
                if digest == EXPECTED_SHA256:
                    item["canonical_hits"] += 1
                    canonical_payloads.append((url, data))
                    record["canonical_exact_sha"] = True
                if AUDIT_FILENAME.lower() in url.lower() and valid_audit(data):
                    item["valid_audit_hits"] += 1
                    audit_payloads.append((url, data))
                    record["valid_named_audit"] = True
                item["downloads"].append(record)

            if canonical_payloads and len(audit_payloads) == 1:
                canon_url, canon_data = canonical_payloads[0]
                audit_url, audit_data = audit_payloads[0]
                (OUT_RECOVERY / EXPECTED_FILENAME).write_bytes(canon_data)
                (OUT_RECOVERY / AUDIT_FILENAME).write_bytes(audit_data)
                report["paired_recovery_hits"] += 1
                report["recovered_files"].append({
                    "run_id": run.get("id"),
                    "canonical_url": canon_url,
                    "canonical_sha256": sha256(canon_data),
                    "canonical_bytes": len(canon_data),
                    "audit_url": audit_url,
                    "audit_sha256": sha256(audit_data),
                    "audit_bytes": len(audit_data),
                    "same_workflow_run_context": True,
                })
                item["scan_complete"] = True
                report["runs"].append(item)
                for metric in ("log_members_seen", "text_members_scanned", "hint_lines_seen", "candidate_urls_seen", "candidate_urls_downloaded", "candidate_bytes_hashed", "canonical_hits", "valid_audit_hits"):
                    report[metric] += int(item.get(metric) or 0)
                break
            item["scan_complete"] = not item["errors"]
        except Exception as exc:
            item["errors"].append(str(exc)[:1000])
            report["runs_log_download_failures"] += 1

        for metric in ("log_members_seen", "text_members_scanned", "hint_lines_seen", "candidate_urls_seen", "candidate_urls_downloaded", "candidate_bytes_hashed", "canonical_hits", "valid_audit_hits"):
            report[metric] += int(item.get(metric) or 0)
        report["runs"].append(item)

    report["completed_at_utc"] = datetime.now(timezone.utc).isoformat()
    OUT_REPORT.parent.mkdir(parents=True, exist_ok=True)
    OUT_REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
