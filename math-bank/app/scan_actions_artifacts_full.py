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
MAX_MEMBER_BYTES = 500 * 1024 * 1024
MAX_NESTED_ZIP_BYTES = 250 * 1024 * 1024
MAX_NESTED_DEPTH = 3
MAX_UNCOMPRESSED_BYTES_PER_ARCHIVE = 2 * 1024 * 1024 * 1024
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


def valid_audit_bytes(data: bytes) -> bool:
    try:
        obj = json.loads(data.decode("utf-8"))
    except Exception:
        return False
    return isinstance(obj, dict)


def is_zip_payload(data: bytes) -> bool:
    if len(data) < 4 or data[:2] != b"PK":
        return False
    try:
        return zipfile.is_zipfile(io.BytesIO(data))
    except Exception:
        return False


def scan_zip_payload(
    payload: bytes,
    prefix: str = "",
    depth: int = 0,
) -> tuple[list[dict], list[tuple[str, bytes]], list[tuple[str, bytes]], list[str], dict]:
    entries: list[dict] = []
    canonical_hits: list[tuple[str, bytes]] = []
    audit_hits: list[tuple[str, bytes]] = []
    errors: list[str] = []
    metrics = {
        "members_seen": 0,
        "members_sha256_checked": 0,
        "member_bytes_hashed": 0,
        "zip_signature_members": 0,
        "oversize_members_skipped": 0,
    }
    if depth > MAX_NESTED_DEPTH:
        return entries, canonical_hits, audit_hits, errors, metrics
    try:
        with zipfile.ZipFile(io.BytesIO(payload)) as zf:
            declared_total = sum(i.file_size for i in zf.infolist() if not i.is_dir())
            if declared_total > MAX_UNCOMPRESSED_BYTES_PER_ARCHIVE:
                errors.append(
                    f"archive declared uncompressed bytes {declared_total} exceeds cap {MAX_UNCOMPRESSED_BYTES_PER_ARCHIVE}: {prefix or '<artifact>'}"
                )
            for info in zf.infolist():
                if info.is_dir():
                    continue
                metrics["members_seen"] += 1
                full_name = f"{prefix}{info.filename}"
                basename = Path(info.filename).name
                if info.file_size > MAX_MEMBER_BYTES:
                    metrics["oversize_members_skipped"] += 1
                    if member_interest(info.filename):
                        entries.append({
                            "name": full_name,
                            "bytes": info.file_size,
                            "depth": depth,
                            "skipped": "member exceeds scan size cap",
                        })
                    continue
                try:
                    data = zf.read(info)
                except Exception as e:
                    errors.append(f"read {full_name}: {e}")
                    continue
                digest = sha256_bytes(data)
                metrics["members_sha256_checked"] += 1
                metrics["member_bytes_hashed"] += len(data)
                zip_signature = is_zip_payload(data)
                if zip_signature:
                    metrics["zip_signature_members"] += 1
                interesting = member_interest(info.filename) or digest == EXPECTED_SHA256 or zip_signature
                if interesting:
                    entries.append({
                        "name": full_name,
                        "bytes": len(data),
                        "sha256": digest,
                        "depth": depth,
                        "zip_signature": zip_signature,
                    })
                # Canonical identity is content-addressed. Filename and extension are irrelevant.
                if digest == EXPECTED_SHA256:
                    canonical_hits.append((full_name, data))
                if basename == AUDIT_HINT and valid_audit_bytes(data):
                    audit_hits.append((full_name, data))
                if zip_signature and depth < MAX_NESTED_DEPTH and len(data) <= MAX_NESTED_ZIP_BYTES:
                    child_entries, child_canonical, child_audits, child_errors, child_metrics = scan_zip_payload(
                        data, prefix=full_name + "!/", depth=depth + 1
                    )
                    entries.extend(child_entries)
                    canonical_hits.extend(child_canonical)
                    audit_hits.extend(child_audits)
                    errors.extend(child_errors)
                    for k in metrics:
                        metrics[k] += child_metrics[k]
    except zipfile.BadZipFile as e:
        errors.append(f"bad zip {prefix or '<artifact>'}: {e}")
    return entries, canonical_hits, audit_hits, errors, metrics


def inspect_artifact(artifact: dict) -> tuple[dict, list[tuple[str, bytes]], list[tuple[str, bytes]]]:
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
        "valid_final_audit_hits": [],
        "paired_recovery_eligible": False,
        "member_scan_metrics": {},
        "errors": [],
    }
    canonical_hits: list[tuple[str, bytes]] = []
    audit_hits: list[tuple[str, bytes]] = []
    try:
        raw = request_bytes(artifact["archive_download_url"])
        result["downloaded"] = True
        result["archive_download_bytes"] = len(raw)
        entries, canonical_hits, audit_hits, errors, metrics = scan_zip_payload(raw)
        result["interesting_members"] = entries
        result["member_scan_metrics"] = metrics
        result["canonical_sha_hits"] = [
            {"name": name, "bytes": len(data), "sha256": sha256_bytes(data)}
            for name, data in canonical_hits
        ]
        result["valid_final_audit_hits"] = [
            {"name": name, "bytes": len(data), "sha256": sha256_bytes(data)}
            for name, data in audit_hits
        ]
        canonical_unique = {sha256_bytes(data) for _, data in canonical_hits}
        audit_unique = {sha256_bytes(data) for _, data in audit_hits}
        result["paired_recovery_eligible"] = (
            canonical_unique == {EXPECTED_SHA256} and len(audit_unique) == 1
        )
        if canonical_hits and len(audit_unique) > 1:
            result["errors"].append("ambiguous final audit candidates with different SHA-256 values")
        result["errors"].extend(errors)
    except Exception as e:
        result["errors"].append(str(e))
    return result, canonical_hits, audit_hits


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
        "scan": "github_actions_artifacts_all_members_content_addressed_for_exact_math_canonical",
        "repo": REPO,
        "expected_filename": EXPECTED_FILENAME,
        "expected_sha256": EXPECTED_SHA256,
        "required_paired_audit": AUDIT_HINT,
        "created_since": CREATED_SINCE,
        "all_artifacts_seen": len(artifacts),
        "candidate_artifacts": len(candidates),
        "canonical_hits": 0,
        "audit_name_hits": 0,
        "valid_audit_hits": 0,
        "paired_recovery_hits": 0,
        "recovery_hint_hits": 0,
        "download_failures": 0,
        "all_members_sha256_checked": 0,
        "all_member_bytes_hashed": 0,
        "zip_signature_members": 0,
        "oversize_members_skipped": 0,
        "artifacts": [],
        "recovered_files": [],
        "completed_at_utc": datetime.now(timezone.utc).isoformat(),
        "policy": "Every member under the size cap is SHA-256 checked regardless of filename/extension. Nested archives are detected by ZIP signature. Exact immutable SHA plus one unambiguous valid final audit from the same Actions artifact is required; no reconstruction.",
    }

    OUT_RECOVERY.mkdir(parents=True, exist_ok=True)
    for old in (OUT_RECOVERY / EXPECTED_FILENAME, OUT_RECOVERY / AUDIT_HINT):
        old.unlink(missing_ok=True)

    for artifact in candidates:
        item, canonical_hits, audit_hits = inspect_artifact(artifact)
        if not item["downloaded"]:
            report["download_failures"] += 1
        metrics = item.get("member_scan_metrics") or {}
        report["all_members_sha256_checked"] += int(metrics.get("members_sha256_checked") or 0)
        report["all_member_bytes_hashed"] += int(metrics.get("member_bytes_hashed") or 0)
        report["zip_signature_members"] += int(metrics.get("zip_signature_members") or 0)
        report["oversize_members_skipped"] += int(metrics.get("oversize_members_skipped") or 0)
        for member in item["interesting_members"]:
            low = member["name"].lower()
            if AUDIT_HINT.lower() in low:
                report["audit_name_hits"] += 1
            if any(h.lower() in low for h in RECOVERY_HINTS):
                report["recovery_hint_hits"] += 1
        report["canonical_hits"] += len(canonical_hits)
        report["valid_audit_hits"] += len(audit_hits)

        if item["paired_recovery_eligible"]:
            canonical_by_hash = {sha256_bytes(data): (name, data) for name, data in canonical_hits}
            audit_by_hash = {sha256_bytes(data): (name, data) for name, data in audit_hits}
            canonical_name, canonical_data = canonical_by_hash[EXPECTED_SHA256]
            audit_name, audit_data = next(iter(audit_by_hash.values()))
            canonical_out = OUT_RECOVERY / EXPECTED_FILENAME
            audit_out = OUT_RECOVERY / AUDIT_HINT
            canonical_out.write_bytes(canonical_data)
            audit_out.write_bytes(audit_data)
            report["paired_recovery_hits"] += 1
            report["recovered_files"].append({
                "source_artifact_id": artifact.get("id"),
                "source_artifact_name": artifact.get("name"),
                "canonical_member": canonical_name,
                "canonical_path": str(canonical_out),
                "canonical_bytes": len(canonical_data),
                "canonical_sha256": sha256_bytes(canonical_data),
                "audit_member": audit_name,
                "audit_path": str(audit_out),
                "audit_bytes": len(audit_data),
                "audit_sha256": sha256_bytes(audit_data),
                "same_artifact_pair": True,
            })
            report["artifacts"].append(item)
            break

        report["artifacts"].append(item)

    OUT_REPORT.parent.mkdir(parents=True, exist_ok=True)
    report["completed_at_utc"] = datetime.now(timezone.utc).isoformat()
    OUT_REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
