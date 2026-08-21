from __future__ import annotations

import hashlib
import io
import json
import os
import re
import subprocess
import zipfile
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

REPO = os.environ.get("GITHUB_REPOSITORY", "yo666ha-boop/reading-app")
TOKEN = os.environ.get("GITHUB_TOKEN", "")
API = "https://api.github.com"
BRANCH = "math-problem-bank-bootstrap"
SELF_WORKFLOW_NAME = "Math Actions Log Recovery"
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
MAX_HINT_SAMPLES = 40
MAX_URL_SAMPLES = 25
OUT_REPORT = Path("math-bank/state/actions-log-recovery-latest.json")
OUT_RECOVERY = Path("math-bank/recovered-actions-log")
URL_RE = re.compile(r"https?://[^\s<>\]\[\)\(\"']+")
ALLOWED_DOWNLOAD_HOST_SUFFIXES = (
    "github.com",
    "githubusercontent.com",
    "objects.githubusercontent.com",
)
INFORMATIONAL_HOSTS = {"github.blog"}


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
        return isinstance(json.loads(data.decode("utf-8")), dict)
    except Exception:
        return False


def host_of(url: str) -> str:
    return (urlparse(url).hostname or "").lower()


def downloadable(url: str) -> bool:
    host = host_of(url)
    return any(host == suffix or host.endswith("." + suffix) for suffix in ALLOWED_DOWNLOAD_HOST_SUFFIXES)


def compact_item(item: dict) -> dict:
    urls = [u for u in (item.get("candidate_urls") or []) if host_of(str(u)) not in INFORMATIONAL_HOSTS]
    downloads = [d for d in (item.get("downloads") or []) if host_of(str(d.get("url") or "")) not in INFORMATIONAL_HOSTS]
    download_errors = [
        d for d in (item.get("candidate_download_errors") or [])
        if host_of(str(d.get("url") or "")) not in INFORMATIONAL_HOSTS
    ]
    return {
        "run_id": item.get("run_id"), "name": item.get("name"), "status": item.get("status"),
        "conclusion": item.get("conclusion"), "head_sha": item.get("head_sha"),
        "updated_at": item.get("updated_at"), "log_members_seen": int(item.get("log_members_seen") or 0),
        "text_members_scanned": int(item.get("text_members_scanned") or 0),
        "hint_lines_seen": int(item.get("hint_lines_seen") or 0),
        "candidate_urls_seen": len(urls),
        "candidate_urls_downloaded": sum(1 for d in downloads if d.get("sha256")),
        "candidate_bytes_hashed": sum(int(d.get("bytes") or 0) for d in downloads if d.get("sha256")),
        "canonical_hits": int(item.get("canonical_hits") or 0),
        "valid_audit_hits": int(item.get("valid_audit_hits") or 0),
        "candidate_urls": urls, "downloads": downloads,
        "candidate_download_errors": download_errors,
        "errors": item.get("errors") or [], "scan_complete": bool(item.get("scan_complete")),
    }


def load_previous_cache() -> dict[tuple[int, str], dict]:
    try:
        previous = json.loads(OUT_REPORT.read_text(encoding="utf-8"))
    except Exception:
        return {}
    out: dict[tuple[int, str], dict] = {}
    for raw in previous.get("run_cache", previous.get("runs", [])):
        if not isinstance(raw, dict):
            continue
        item = compact_item(raw)
        if item.get("scan_complete") is not True or item.get("errors") or item.get("candidate_download_errors"):
            continue
        key = (int(item.get("run_id") or 0), str(item.get("updated_at") or ""))
        out[key] = item
    return out


def scan_text(text: str, member: str, hint_samples: list[dict]) -> tuple[int, set[str], int]:
    lines = text.splitlines()
    hint_count = 0
    urls: set[str] = set()
    informational_ignored = 0
    for idx, line in enumerate(lines):
        lower = line.lower()
        matched = [h for h in HINTS if h.lower() in lower]
        if not matched:
            continue
        hint_count += 1
        if len(hint_samples) < MAX_HINT_SAMPLES:
            hint_samples.append({
                "member": member,
                "line_number": idx + 1,
                "matched": matched,
                "text": line[:1200],
            })
        for near in lines[max(0, idx - 2): min(len(lines), idx + 3)]:
            for raw in URL_RE.findall(near):
                url = raw.rstrip(".,;:")
                if host_of(url) in INFORMATIONAL_HOSTS:
                    informational_ignored += 1
                    continue
                urls.add(url)
    return hint_count, urls, informational_ignored


def new_item(run: dict) -> dict:
    return {
        "run_id": run.get("id"), "name": run.get("name"), "status": run.get("status"),
        "conclusion": run.get("conclusion"), "head_sha": run.get("head_sha"),
        "updated_at": run.get("updated_at"), "log_members_seen": 0,
        "text_members_scanned": 0, "hint_lines_seen": 0, "candidate_urls_seen": 0,
        "candidate_urls_downloaded": 0, "candidate_bytes_hashed": 0,
        "canonical_hits": 0, "valid_audit_hits": 0, "candidate_urls": [],
        "downloads": [], "candidate_download_errors": [], "errors": [], "scan_complete": False,
    }


def add_metrics(report: dict, item: dict) -> None:
    for key in (
        "log_members_seen", "text_members_scanned", "hint_lines_seen",
        "candidate_urls_seen", "candidate_urls_downloaded", "candidate_bytes_hashed",
        "canonical_hits", "valid_audit_hits",
    ):
        report[key] += int(item.get(key) or 0)


def main() -> int:
    if not TOKEN:
        print("BLOCKED: GITHUB_TOKEN is required")
        return 2

    runs: list[dict] = []
    page = 1
    while len(runs) < MAX_RUNS and page <= 10:
        payload = request_json(f"{API}/repos/{REPO}/actions/runs?branch={BRANCH}&per_page=100&page={page}")
        batch = payload.get("workflow_runs", [])
        if not batch:
            break
        runs.extend(r for r in batch if str(r.get("created_at") or "") >= CREATED_SINCE)
        if len(batch) < 100:
            break
        page += 1
    runs = runs[:MAX_RUNS]

    ignored_self = [r for r in runs if r.get("name") == SELF_WORKFLOW_NAME]
    evidence_runs = [r for r in runs if r.get("name") != SELF_WORKFLOW_NAME]
    completed = [r for r in evidence_runs if r.get("status") == "completed"]
    deferred = [r for r in evidence_runs if r.get("status") != "completed"]
    cache = load_previous_cache()

    report = {
        "scan": "github_actions_workflow_logs_exact_math_canonical_recovery_clues",
        "repo": REPO, "branch": BRANCH, "created_since": CREATED_SINCE,
        "expected_filename": EXPECTED_FILENAME, "expected_sha256": EXPECTED_SHA256,
        "required_paired_audit": AUDIT_FILENAME, "runs_seen": len(runs),
        "runs_ignored_self_workflow": len(ignored_self),
        "completed_runs_eligible": len(completed), "runs_deferred_nonterminal": len(deferred),
        "runs_reused": 0, "runs_downloaded_this_run": 0, "runs_log_download_failures": 0,
        "log_members_seen": 0, "text_members_scanned": 0, "hint_lines_seen": 0,
        "informational_urls_ignored": 0, "candidate_urls_seen": 0,
        "candidate_urls_downloaded": 0, "candidate_download_failures": 0,
        "candidate_urls_skipped_untrusted_host": 0, "candidate_bytes_hashed": 0,
        "canonical_hits": 0, "valid_audit_hits": 0, "paired_recovery_hits": 0,
        "exact_log_text_coverage_complete": False,
        "exact_candidate_download_coverage_complete": False,
        "candidate_url_hosts": {}, "candidate_url_samples": [], "hint_samples": [],
        "deferred_nonterminal_runs": [
            {"run_id": r.get("id"), "name": r.get("name"), "head_sha": r.get("head_sha")}
            for r in deferred
        ],
        "run_cache": [], "recovered_files": [], "completed_at_utc": None,
        "policy": (
            "The scanner's own workflow is excluded because it was created after the canonical artifact and only echoes scanner output. "
            "github.blog runner notices are informational noise, not recovery candidates, including when inherited from prior cache. "
            "Only completed non-self runs are absence evidence. All remaining candidate URLs must be safely classifiable/downloadable; no reconstruction."
        ),
    }
    host_counts: Counter[str] = Counter()
    url_samples: list[str] = []

    OUT_RECOVERY.mkdir(parents=True, exist_ok=True)
    for p in (OUT_RECOVERY / EXPECTED_FILENAME, OUT_RECOVERY / AUDIT_FILENAME):
        p.unlink(missing_ok=True)

    for run in completed:
        key = (int(run.get("id") or 0), str(run.get("updated_at") or ""))
        if key in cache:
            item = compact_item(cache[key])
            report["runs_reused"] += 1
        else:
            item = new_item(run)
            report["runs_downloaded_this_run"] += 1
            try:
                payload = curl_bytes(f"{API}/repos/{REPO}/actions/runs/{run['id']}/logs", timeout=180)
                if len(payload) > MAX_LOG_ARCHIVE_BYTES:
                    raise RuntimeError(f"log archive exceeds {MAX_LOG_ARCHIVE_BYTES} bytes")
                found_urls: set[str] = set()
                with zipfile.ZipFile(io.BytesIO(payload)) as zf:
                    for info in zf.infolist():
                        if info.is_dir():
                            continue
                        item["log_members_seen"] += 1
                        if info.file_size > MAX_TEXT_MEMBER_BYTES:
                            item["errors"].append(f"oversize log member skipped: {info.filename} {info.file_size}")
                            continue
                        text = zf.read(info).decode("utf-8", "replace")
                        item["text_members_scanned"] += 1
                        count, urls, ignored = scan_text(text, info.filename, report["hint_samples"])
                        item["hint_lines_seen"] += count
                        report["informational_urls_ignored"] += ignored
                        found_urls.update(urls)
                item["candidate_urls"] = sorted(found_urls)
                item["candidate_urls_seen"] = len(found_urls)

                canonical_payloads: list[tuple[str, bytes]] = []
                audit_payloads: list[tuple[str, bytes]] = []
                for url in item["candidate_urls"]:
                    if not downloadable(url):
                        continue
                    try:
                        data = curl_bytes(url, timeout=120)
                    except Exception as exc:
                        item["candidate_download_errors"].append({"url": url, "error": str(exc)[:500]})
                        continue
                    digest = sha256(data)
                    item["candidate_urls_downloaded"] += 1
                    item["candidate_bytes_hashed"] += len(data)
                    rec = {"url": url, "bytes": len(data), "sha256": digest}
                    if digest == EXPECTED_SHA256:
                        item["canonical_hits"] += 1
                        canonical_payloads.append((url, data))
                        rec["canonical_exact_sha"] = True
                    if AUDIT_FILENAME.lower() in url.lower() and valid_audit(data):
                        item["valid_audit_hits"] += 1
                        audit_payloads.append((url, data))
                        rec["valid_named_audit"] = True
                    item["downloads"].append(rec)

                if canonical_payloads and len(audit_payloads) == 1:
                    canon_url, canon_data = canonical_payloads[0]
                    audit_url, audit_data = audit_payloads[0]
                    (OUT_RECOVERY / EXPECTED_FILENAME).write_bytes(canon_data)
                    (OUT_RECOVERY / AUDIT_FILENAME).write_bytes(audit_data)
                    report["paired_recovery_hits"] += 1
                    report["recovered_files"].append({
                        "run_id": run.get("id"), "canonical_url": canon_url,
                        "canonical_sha256": sha256(canon_data), "canonical_bytes": len(canon_data),
                        "audit_url": audit_url, "audit_sha256": sha256(audit_data),
                        "audit_bytes": len(audit_data), "same_workflow_run_context": True,
                    })
                item["scan_complete"] = not item["errors"] and not item["candidate_download_errors"]
            except Exception as exc:
                item["errors"].append(str(exc)[:1000])
                report["runs_log_download_failures"] += 1

        for url in item.get("candidate_urls", []):
            host_counts[host_of(url) or "<none>"] += 1
            if len(url_samples) < MAX_URL_SAMPLES and url not in url_samples:
                url_samples.append(url)
            if not downloadable(url):
                report["candidate_urls_skipped_untrusted_host"] += 1
        report["candidate_download_failures"] += len(item.get("candidate_download_errors") or [])
        add_metrics(report, item)
        report["run_cache"].append(compact_item(item))
        if report["paired_recovery_hits"]:
            break

    report["candidate_url_hosts"] = dict(sorted(host_counts.items()))
    report["candidate_url_samples"] = url_samples
    report["exact_log_text_coverage_complete"] = bool(
        len(report["run_cache"]) == len(completed)
        and report["runs_log_download_failures"] == 0
        and all(not i.get("errors") for i in report["run_cache"])
    )
    report["exact_candidate_download_coverage_complete"] = bool(
        report["exact_log_text_coverage_complete"]
        and report["candidate_download_failures"] == 0
        and report["candidate_urls_skipped_untrusted_host"] == 0
    )
    report["completed_at_utc"] = datetime.now(timezone.utc).isoformat()
    OUT_REPORT.parent.mkdir(parents=True, exist_ok=True)
    OUT_REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({k: v for k, v in report.items() if k != "run_cache"}, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
