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


def scan_nested_zip(data: bytes, prefix: str = "", depth: int = 0) -> tuple[list[dict], list[tuple[str, bytes]], list[tuple[str, bytes]]]:
    entries: list[dict] = []
    zip_hits: list[tuple[str, bytes]] = []
    audit_hits: list[tuple[str, bytes]] = []
    if depth > MAX_NESTED_DEPTH:
        return entries, zip_hits, audit_hits
    try:
        with zipfile.ZipFile(io.BytesIO(data)) as zf:
            for info in zf.infolist():
                if info.is_dir():
                    continue
                name = f"{prefix}{info.filename}"
                basename = Path(info.filename).name
                is_zip = info.filename.lower().endswith(".zip")
                if not is_zip and basename != AUDIT_FILENAME:
                    continue
                payload = zf.read(info)
                digest = sha256_bytes(payload)
                entries.append({"name": name, "bytes": len(payload), "sha256": digest, "depth": depth})
                if is_zip and digest == EXPECTED_SHA256:
                    zip_hits.append((name, payload))
                if basename == AUDIT_FILENAME and valid_audit(payload):
                    audit_hits.append((name, payload))
                if is_zip and depth < MAX_NESTED_DEPTH and len(payload) <= MAX_ASSET_BYTES:
                    child_entries, child_zips, child_audits = scan_nested_zip(payload, name + "!/", depth + 1)
                    entries.extend(child_entries)
                    zip_hits.extend(child_zips)
                    audit_hits.extend(child_audits)
    except zipfile.BadZipFile:
        pass
    return entries, zip_hits, audit_hits


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
        "scan": "github_release_assets_for_exact_math_canonical",
        "repo": REPO,
        "expected_sha256": EXPECTED_SHA256,
        "required_paired_audit": AUDIT_FILENAME,
        "releases_seen": len(releases),
        "assets_seen": 0,
        "assets_downloaded": 0,
        "download_failures": 0,
        "canonical_hits": 0,
        "valid_audit_hits": 0,
        "paired_recovery_hits": [],
        "releases": [],
        "completed_at_utc": datetime.now(timezone.utc).isoformat(),
        "policy": "Release recovery only. Exact canonical ZIP requires immutable SHA-256; automatic completion requires one unambiguous valid final audit in the same release. No reconstruction.",
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
                digest = sha256_bytes(payload)
                item["sha256"] = digest
                if digest == EXPECTED_SHA256:
                    name = str(asset.get("name") or f"asset-{asset.get('id')}")
                    release_zips[digest] = (name, payload)
                    release_item["canonical_hits"].append({"name": name, "sha256": digest, "bytes": len(payload)})
                if Path(str(asset.get("name") or "")).name == AUDIT_FILENAME and valid_audit(payload):
                    release_audits[digest] = (str(asset.get("name")), payload)
                    release_item["audit_hits"].append({"name": asset.get("name"), "sha256": digest, "bytes": len(payload)})
                nested, zip_hits, audit_hits = scan_nested_zip(payload, f"{asset.get('name')}!/")
                item["nested_interesting"] = nested
                for name, data in zip_hits:
                    d = sha256_bytes(data)
                    release_zips[d] = (name, data)
                    release_item["canonical_hits"].append({"name": name, "sha256": d, "bytes": len(data)})
                for name, data in audit_hits:
                    d = sha256_bytes(data)
                    release_audits[d] = (name, data)
                    release_item["audit_hits"].append({"name": name, "sha256": d, "bytes": len(data)})
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
    OUT_REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
