from __future__ import annotations

import hashlib
import io
import json
import os
import subprocess
import sys
import zipfile
from datetime import datetime, timezone
from pathlib import Path

REPO = os.environ.get("GITHUB_REPOSITORY", "yo666ha-boop/reading-app")
TOKEN = os.environ.get("GITHUB_TOKEN", "")
API = "https://api.github.com"
EXPECTED_SHA256 = "eb93279a52dd49191612a52ac0df2df2fdd865c8975d815547daa126b4398175"
EXPECTED_FILENAME = "みかみ塾数学問題バンク_最終完成版_20260820.zip"
AUDIT_FILENAME = "MATHBANK_FINAL_AUDIT_V2.json"
MAX_ASSET_BYTES = 500 * 1024 * 1024
MAX_MEMBER_BYTES = 500 * 1024 * 1024
MAX_NESTED_ZIP_BYTES = 250 * 1024 * 1024
MAX_NESTED_DEPTH = 3
OUT_REPORT = Path("math-bank/state/github-release-scan-latest.json")
OUT_DIR = Path("math-bank/recovered-release")


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def curl_bytes(url: str, accept: str = "application/vnd.github+json") -> bytes:
    cmd = [
        "curl", "-fsSL",
        "-H", f"Accept: {accept}",
        "-H", "X-GitHub-Api-Version: 2022-11-28",
    ]
    if TOKEN:
        cmd += ["-H", f"Authorization: Bearer {TOKEN}"]
    cmd.append(url)
    proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=180)
    if proc.returncode:
        raise RuntimeError(f"curl rc={proc.returncode}: {proc.stderr.decode('utf-8','replace')[:500]}")
    return proc.stdout


def get_json(url: str) -> object:
    return json.loads(curl_bytes(url).decode("utf-8"))


def valid_audit(data: bytes) -> bool:
    try:
        return isinstance(json.loads(data.decode("utf-8")), dict)
    except Exception:
        return False


def is_zip_payload(data: bytes) -> bool:
    if len(data) < 4 or data[:2] != b"PK":
        return False
    try:
        return zipfile.is_zipfile(io.BytesIO(data))
    except Exception:
        return False


def scan_nested_zip(data: bytes, prefix: str = "", depth: int = 0) -> tuple[list[dict], list[tuple[str, bytes]], list[tuple[str, bytes]], dict]:
    entries: list[dict] = []
    zip_hits: list[tuple[str, bytes]] = []
    audit_hits: list[tuple[str, bytes]] = []
    metrics = {"members_seen": 0, "members_sha256_checked": 0, "member_bytes_hashed": 0, "zip_signature_members": 0, "oversize_members_skipped": 0}
    if depth > MAX_NESTED_DEPTH:
        return entries, zip_hits, audit_hits, metrics
    try:
        with zipfile.ZipFile(io.BytesIO(data)) as zf:
            for info in zf.infolist():
                if info.is_dir():
                    continue
                metrics["members_seen"] += 1
                name = f"{prefix}{info.filename}"
                basename = Path(info.filename).name
                if info.file_size > MAX_MEMBER_BYTES:
                    metrics["oversize_members_skipped"] += 1
                    continue
                payload = zf.read(info)
                digest = sha256_bytes(payload)
                metrics["members_sha256_checked"] += 1
                metrics["member_bytes_hashed"] += len(payload)
                zip_signature = is_zip_payload(payload)
                if zip_signature:
                    metrics["zip_signature_members"] += 1
                if digest == EXPECTED_SHA256 or basename == AUDIT_FILENAME or zip_signature:
                    entries.append({"name": name, "bytes": len(payload), "sha256": digest, "depth": depth, "zip_signature": zip_signature})
                # Exact identity is content-addressed; a renamed or extensionless ZIP is still recoverable.
                if digest == EXPECTED_SHA256:
                    zip_hits.append((name, payload))
                if basename == AUDIT_FILENAME and valid_audit(payload):
                    audit_hits.append((name, payload))
                if zip_signature and depth < MAX_NESTED_DEPTH and len(payload) <= MAX_NESTED_ZIP_BYTES:
                    child_entries, child_zips, child_audits, child_metrics = scan_nested_zip(payload, name + "!/", depth + 1)
                    entries.extend(child_entries)
                    zip_hits.extend(child_zips)
                    audit_hits.extend(child_audits)
                    for k in metrics:
                        metrics[k] += child_metrics[k]
    except zipfile.BadZipFile:
        pass
    return entries, zip_hits, audit_hits, metrics


def list_releases() -> list[dict]:
    releases: list[dict] = []
    for page in range(1, 11):
        obj = get_json(f"{API}/repos/{REPO}/releases?per_page=100&page={page}")
        if not isinstance(obj, list) or not obj:
            break
        releases.extend(x for x in obj if isinstance(x, dict))
        if len(obj) < 100:
            break
    return releases


def main() -> int:
    if not TOKEN:
        print("BLOCKED: GITHUB_TOKEN is required", file=sys.stderr)
        return 2

    releases = list_releases()
    report = {
        "scan": "github_release_assets_all_members_content_addressed_for_exact_math_canonical",
        "repo": REPO,
        "expected_sha256": EXPECTED_SHA256,
        "required_paired_audit": AUDIT_FILENAME,
        "releases_seen": len(releases),
        "assets_seen": 0,
        "assets_downloaded": 0,
        "download_failures": 0,
        "asset_sha256_checked": 0,
        "nested_members_sha256_checked": 0,
        "nested_member_bytes_hashed": 0,
        "zip_signature_members": 0,
        "oversize_members_skipped": 0,
        "canonical_hits": 0,
        "valid_audit_hits": 0,
        "paired_recovery_hits": [],
        "releases": [],
        "completed_at_utc": datetime.now(timezone.utc).isoformat(),
        "policy": "Every release asset and nested member under the cap is SHA-256 checked regardless of filename/extension; nested archives are detected by ZIP signature. Pairing still requires exact immutable SHA plus one unambiguous valid final audit in the same release. No reconstruction.",
    }

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for stale in (OUT_DIR / EXPECTED_FILENAME, OUT_DIR / AUDIT_FILENAME):
        stale.unlink(missing_ok=True)

    for release in releases:
        release_item = {
            "id": release.get("id"),
            "tag_name": release.get("tag_name"),
            "name": release.get("name"),
            "draft": release.get("draft"),
            "prerelease": release.get("prerelease"),
            "created_at": release.get("created_at"),
            "published_at": release.get("published_at"),
            "assets": [],
            "canonical_hits": [],
            "audit_hits": [],
        }
        release_zips: dict[str, tuple[str, bytes]] = {}
        release_audits: dict[str, tuple[str, bytes]] = {}
        for asset in release.get("assets") or []:
            if not isinstance(asset, dict):
                continue
            report["assets_seen"] += 1
            item = {
                "id": asset.get("id"),
                "name": asset.get("name"),
                "size": asset.get("size"),
                "created_at": asset.get("created_at"),
                "updated_at": asset.get("updated_at"),
                "downloaded": False,
                "errors": [],
                "nested_interesting": [],
                "nested_scan_metrics": {},
            }
            size = int(asset.get("size") or 0)
            if size > MAX_ASSET_BYTES:
                item["errors"].append("asset exceeds scan size cap")
                release_item["assets"].append(item)
                continue
            try:
                payload = curl_bytes(asset["url"], "application/octet-stream")
                item["downloaded"] = True
                item["downloaded_bytes"] = len(payload)
                report["assets_downloaded"] += 1
                report["asset_sha256_checked"] += 1
                digest = sha256_bytes(payload)
                item["sha256"] = digest
                if digest == EXPECTED_SHA256:
                    name = str(asset.get("name") or f"asset-{asset.get('id')}")
                    release_zips[digest] = (name, payload)
                    release_item["canonical_hits"].append({"name": name, "sha256": digest, "bytes": len(payload)})
                if Path(str(asset.get("name") or "")).name == AUDIT_FILENAME and valid_audit(payload):
                    release_audits[digest] = (str(asset.get("name")), payload)
                    release_item["audit_hits"].append({"name": asset.get("name"), "sha256": digest, "bytes": len(payload)})
                if is_zip_payload(payload):
                    nested, zip_hits, audit_hits, metrics = scan_nested_zip(payload, f"{asset.get('name')}!/")
                    item["nested_interesting"] = nested
                    item["nested_scan_metrics"] = metrics
                    report["nested_members_sha256_checked"] += metrics["members_sha256_checked"]
                    report["nested_member_bytes_hashed"] += metrics["member_bytes_hashed"]
                    report["zip_signature_members"] += metrics["zip_signature_members"]
                    report["oversize_members_skipped"] += metrics["oversize_members_skipped"]
                    for name, nested_data in zip_hits:
                        d = sha256_bytes(nested_data)
                        release_zips[d] = (name, nested_data)
                        release_item["canonical_hits"].append({"name": name, "sha256": d, "bytes": len(nested_data)})
                    for name, audit_data in audit_hits:
                        d = sha256_bytes(audit_data)
                        release_audits[d] = (name, audit_data)
                        release_item["audit_hits"].append({"name": name, "sha256": d, "bytes": len(audit_data)})
            except Exception as e:
                report["download_failures"] += 1
                item["errors"].append(str(e))
            release_item["assets"].append(item)

        report["canonical_hits"] += len(release_zips)
        report["valid_audit_hits"] += len(release_audits)
        if set(release_zips) == {EXPECTED_SHA256} and len(release_audits) == 1:
            zip_name, zip_data = release_zips[EXPECTED_SHA256]
            audit_sha, (audit_name, audit_data) = next(iter(release_audits.items()))
            zip_out = OUT_DIR / EXPECTED_FILENAME
            audit_out = OUT_DIR / AUDIT_FILENAME
            zip_out.write_bytes(zip_data)
            audit_out.write_bytes(audit_data)
            pair = {
                "release_id": release.get("id"),
                "tag_name": release.get("tag_name"),
                "canonical_member": zip_name,
                "canonical_sha256": EXPECTED_SHA256,
                "canonical_bytes": len(zip_data),
                "audit_member": audit_name,
                "audit_sha256": audit_sha,
                "audit_bytes": len(audit_data),
                "canonical_output": str(zip_out),
                "audit_output": str(audit_out),
            }
            report["paired_recovery_hits"].append(pair)
            report["releases"].append(release_item)
            break
        report["releases"].append(release_item)

    OUT_REPORT.parent.mkdir(parents=True, exist_ok=True)
    report["completed_at_utc"] = datetime.now(timezone.utc).isoformat()
    OUT_REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
