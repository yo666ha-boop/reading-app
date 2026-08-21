from __future__ import annotations

import hashlib
import json
import os
import re
import subprocess
import sys
import urllib.parse
import urllib.request
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

REPO = os.environ.get("GITHUB_REPOSITORY", "yo666ha-boop/reading-app")
TOKEN = os.environ.get("GITHUB_TOKEN", "")
API = "https://api.github.com"
EXPECTED_SHA256 = "eb93279a52dd49191612a52ac0df2df2fdd865c8975d815547daa126b4398175"
EXPECTED_FILENAME = "みかみ塾数学問題バンク_最終完成版_20260820.zip"
AUDIT_HINT = "MATHBANK_FINAL_AUDIT_V2.json"
OUT_REPORT = Path("math-bank/state/github-issue-pr-attachment-scan-latest.json")
OUT_RECOVERY = Path("math-bank/recovered-issue-pr")
MAX_DOWNLOAD_BYTES = 500 * 1024 * 1024
URL_RE = re.compile(r"https?://[^\s)>\]}]+")
MARKDOWN_LINK_RE = re.compile(r"\[([^\]]+)\]\((https?://[^)]+)\)")
ALLOWED_HOST_SUFFIXES = (
    "github.com",
    "githubusercontent.com",
    "githubassets.com",
)


def request_json(url: str):
    req = urllib.request.Request(url)
    req.add_header("Accept", "application/vnd.github+json")
    req.add_header("X-GitHub-Api-Version", "2022-11-28")
    if TOKEN:
        req.add_header("Authorization", f"Bearer {TOKEN}")
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.load(resp)


def paged(url: str) -> list[dict]:
    out: list[dict] = []
    page = 1
    sep = "&" if "?" in url else "?"
    while page <= 50:
        batch = request_json(f"{url}{sep}per_page=100&page={page}")
        if not isinstance(batch, list) or not batch:
            break
        out.extend(x for x in batch if isinstance(x, dict))
        if len(batch) < 100:
            break
        page += 1
    return out


def allowed_url(url: str) -> bool:
    try:
        host = (urllib.parse.urlsplit(url).hostname or "").lower()
    except Exception:
        return False
    return any(host == s or host.endswith("." + s) for s in ALLOWED_HOST_SUFFIXES)


def candidate_url(url: str, label: str, context: str) -> bool:
    if not allowed_url(url):
        return False
    hay = " ".join((url, label, context)).lower()
    return (
        EXPECTED_FILENAME.lower() in hay
        or AUDIT_HINT.lower() in hay
        or ".zip" in hay
        or ".json" in hay
        or "/user-attachments/" in url
        or "private-user-images" in url
    )


def extract_links(text: str) -> list[tuple[str, str]]:
    if not text:
        return []
    links: list[tuple[str, str]] = []
    seen: set[str] = set()
    for m in MARKDOWN_LINK_RE.finditer(text):
        label, url = m.group(1), m.group(2)
        if url not in seen:
            seen.add(url)
            links.append((label, url))
    for url in URL_RE.findall(text):
        url = url.rstrip(".,;:'\"")
        if url not in seen:
            seen.add(url)
            links.append(("", url))
    return links


def download(url: str) -> bytes:
    cmd = ["curl", "-fsSL", "--max-filesize", str(MAX_DOWNLOAD_BYTES)]
    if TOKEN:
        cmd += ["-H", f"Authorization: Bearer {TOKEN}"]
    cmd.append(url)
    proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=180)
    if proc.returncode:
        raise RuntimeError(f"curl rc={proc.returncode}: {proc.stderr.decode('utf-8', 'replace')[:300]}")
    if len(proc.stdout) > MAX_DOWNLOAD_BYTES:
        raise RuntimeError("download exceeded size cap")
    return proc.stdout


def valid_audit(data: bytes) -> bool:
    try:
        obj = json.loads(data.decode("utf-8"))
    except Exception:
        return False
    return isinstance(obj, dict)


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def add_surface(surfaces: list[dict], kind: str, number: int, source_id: str, body: str):
    surfaces.append({
        "kind": kind,
        "number": number,
        "source_id": source_id,
        "body": body or "",
    })


def main() -> int:
    if not TOKEN:
        print("BLOCKED: GITHUB_TOKEN is required", file=sys.stderr)
        return 2

    issues = paged(f"{API}/repos/{REPO}/issues?state=all")
    surfaces: list[dict] = []
    for item in issues:
        number = int(item.get("number") or 0)
        kind = "pull_request" if item.get("pull_request") else "issue"
        add_surface(surfaces, kind, number, f"{kind}:{number}:body", item.get("body") or "")
        try:
            for c in paged(f"{API}/repos/{REPO}/issues/{number}/comments"):
                add_surface(surfaces, kind, number, f"{kind}:{number}:issue_comment:{c.get('id')}", c.get("body") or "")
        except Exception as e:
            add_surface(surfaces, "scan_error", number, f"{kind}:{number}:issue_comments_error", str(e))
        if kind == "pull_request":
            try:
                for c in paged(f"{API}/repos/{REPO}/pulls/{number}/comments"):
                    add_surface(surfaces, kind, number, f"pull_request:{number}:review_comment:{c.get('id')}", c.get("body") or "")
            except Exception as e:
                add_surface(surfaces, "scan_error", number, f"pull_request:{number}:review_comments_error", str(e))

    report = {
        "scan": "github_issue_pr_bodies_comments_and_attachment_links_for_exact_math_canonical",
        "repo": REPO,
        "expected_filename": EXPECTED_FILENAME,
        "expected_sha256": EXPECTED_SHA256,
        "required_audit": AUDIT_HINT,
        "issues_and_pulls_seen": len(issues),
        "text_surfaces_seen": len(surfaces),
        "candidate_links_seen": 0,
        "candidate_links_downloaded": 0,
        "candidate_bytes_hashed": 0,
        "canonical_hits": [],
        "valid_audit_hits": [],
        "paired_recovery_hits": [],
        "text_exact_filename_mentions": 0,
        "text_audit_mentions": 0,
        "text_expected_sha_mentions": 0,
        "errors": [],
        "recorded_at_utc": datetime.now(timezone.utc).isoformat(),
    }

    by_item_canonical: dict[tuple[str, int], list[tuple[dict, bytes]]] = defaultdict(list)
    by_item_audit: dict[tuple[str, int], list[tuple[dict, bytes]]] = defaultdict(list)
    seen_urls: set[tuple[str, int, str]] = set()

    for surface in surfaces:
        body = surface["body"]
        if surface["kind"] == "scan_error":
            report["errors"].append({"source_id": surface["source_id"], "error": body})
            continue
        low = body.lower()
        report["text_exact_filename_mentions"] += int(EXPECTED_FILENAME.lower() in low)
        report["text_audit_mentions"] += int(AUDIT_HINT.lower() in low)
        report["text_expected_sha_mentions"] += int(EXPECTED_SHA256 in low)
        key = (surface["kind"], surface["number"])
        for label, url in extract_links(body):
            uniq = (key[0], key[1], url)
            if uniq in seen_urls or not candidate_url(url, label, body[:1000]):
                continue
            seen_urls.add(uniq)
            report["candidate_links_seen"] += 1
            try:
                data = download(url)
                report["candidate_links_downloaded"] += 1
                report["candidate_bytes_hashed"] += len(data)
                digest = sha256(data)
                meta = {
                    "kind": key[0], "number": key[1], "source_id": surface["source_id"],
                    "label": label, "url": url, "bytes": len(data), "sha256": digest,
                }
                if digest == EXPECTED_SHA256:
                    report["canonical_hits"].append(meta)
                    by_item_canonical[key].append((meta, data))
                audit_named = AUDIT_HINT.lower() in (label + " " + url).lower()
                if audit_named and valid_audit(data):
                    report["valid_audit_hits"].append(meta)
                    by_item_audit[key].append((meta, data))
            except Exception as e:
                report["errors"].append({"source_id": surface["source_id"], "url": url, "error": str(e)})

    OUT_RECOVERY.mkdir(parents=True, exist_ok=True)
    for key, canonical in by_item_canonical.items():
        audits = by_item_audit.get(key, [])
        audit_by_sha = {sha256(data): (meta, data) for meta, data in audits}
        if not canonical or len(audit_by_sha) != 1:
            continue
        cmeta, cdata = canonical[0]
        ameta, adata = next(iter(audit_by_sha.values()))
        pair = {"kind": key[0], "number": key[1], "canonical": cmeta, "audit": ameta}
        report["paired_recovery_hits"].append(pair)
        (OUT_RECOVERY / EXPECTED_FILENAME).write_bytes(cdata)
        (OUT_RECOVERY / AUDIT_HINT).write_bytes(adata)
        break

    OUT_REPORT.parent.mkdir(parents=True, exist_ok=True)
    OUT_REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
