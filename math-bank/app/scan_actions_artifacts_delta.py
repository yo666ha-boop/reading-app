from __future__ import annotations

import json
from datetime import datetime, timezone

import scan_actions_artifacts_full as base


def load_previous() -> dict:
    try:
        obj = json.loads(base.OUT_REPORT.read_text(encoding="utf-8"))
        return obj if isinstance(obj, dict) else {}
    except Exception:
        return {}


def artifact_cache_key(item: dict) -> tuple:
    return (
        int(item.get("artifact_id") or 0),
        int(item.get("size_in_bytes") or 0),
        str(item.get("updated_at") or ""),
    )


def candidate_cache_key(artifact: dict) -> tuple:
    return (
        int(artifact.get("id") or 0),
        int(artifact.get("size_in_bytes") or 0),
        str(artifact.get("updated_at") or ""),
    )


def reusable(item: dict) -> bool:
    return bool(
        item.get("downloaded") is True
        and not item.get("errors")
        and item.get("paired_recovery_eligible") is not True
    )


def _write_incomplete_listing_report(previous: dict, errors: list[str]) -> None:
    """Persist an explicit UNKNOWN result instead of crashing or implying absence.

    A transient GitHub Actions listing error means the prior verified artifact
    coverage is still useful, but no new absence claim is allowed. The report is
    therefore copied forward only as historical coverage and marked incomplete.
    """
    report = dict(previous) if isinstance(previous, dict) else {}
    report.update({
        "scan": "github_actions_artifacts_incremental_content_addressed_for_exact_math_canonical",
        "repo": base.REPO,
        "expected_filename": base.EXPECTED_FILENAME,
        "expected_sha256": base.EXPECTED_SHA256,
        "required_paired_audit": base.AUDIT_HINT,
        "created_since": base.CREATED_SINCE,
        "scan_complete": False,
        "canonical_absence_proven": False,
        "listing_errors": errors,
        "completed_at_utc": datetime.now(timezone.utc).isoformat(),
        "policy": (
            "TRANSIENT/403/timeout/incomplete Actions recovery is UNKNOWN, never absence evidence. "
            "Previous verified coverage may be retained, but no new artifact-absence conclusion is permitted. "
            "Exact immutable SHA plus one unambiguous valid final audit from the same artifact remains required; no reconstruction."
        ),
    })
    report.setdefault("all_artifacts_seen", 0)
    report.setdefault("candidate_artifacts", 0)
    report.setdefault("reused_verified_artifacts", 0)
    report.setdefault("downloaded_artifacts_this_run", 0)
    report.setdefault("canonical_hits", 0)
    report.setdefault("audit_name_hits", 0)
    report.setdefault("valid_audit_hits", 0)
    report.setdefault("paired_recovery_hits", 0)
    report.setdefault("recovery_hint_hits", 0)
    report.setdefault("download_failures", 0)
    report.setdefault("all_members_sha256_checked", 0)
    report.setdefault("all_member_bytes_hashed", 0)
    report.setdefault("zip_signature_members", 0)
    report.setdefault("oversize_members_skipped", 0)
    report.setdefault("artifacts", [])
    report.setdefault("recovered_files", [])
    base.OUT_REPORT.parent.mkdir(parents=True, exist_ok=True)
    base.OUT_REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))


def main() -> int:
    if not base.TOKEN:
        print("BLOCKED: GITHUB_TOKEN is required")
        return 2

    previous = load_previous()
    artifacts: list[dict] = []
    page = 1
    listing_errors: list[str] = []
    while page <= 10:
        try:
            payload = base.request_json(
                f"{base.API}/repos/{base.REPO}/actions/artifacts?per_page=100&page={page}"
            )
        except Exception as exc:
            listing_errors.append(f"actions_artifact_list_page_{page}: {type(exc).__name__}: {exc}")
            break
        batch = payload.get("artifacts", [])
        if not batch:
            break
        artifacts.extend(batch)
        if len(batch) < 100:
            break
        page += 1

    if listing_errors:
        _write_incomplete_listing_report(previous, listing_errors)
        return 0

    candidates = [
        a for a in artifacts
        if not a.get("expired")
        and base.recent_enough(a.get("created_at", ""))
        and int(a.get("size_in_bytes") or 0) <= base.MAX_ARTIFACT_BYTES
    ]
    candidates.sort(key=lambda a: a.get("created_at", ""), reverse=True)

    previous_items = {
        artifact_cache_key(item): item
        for item in previous.get("artifacts", [])
        if isinstance(item, dict) and reusable(item)
    }

    report = {
        "scan": "github_actions_artifacts_incremental_content_addressed_for_exact_math_canonical",
        "repo": base.REPO,
        "expected_filename": base.EXPECTED_FILENAME,
        "expected_sha256": base.EXPECTED_SHA256,
        "required_paired_audit": base.AUDIT_HINT,
        "created_since": base.CREATED_SINCE,
        "all_artifacts_seen": len(artifacts),
        "candidate_artifacts": len(candidates),
        "reused_verified_artifacts": 0,
        "downloaded_artifacts_this_run": 0,
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
        "scan_complete": True,
        "canonical_absence_proven": False,
        "listing_errors": [],
        "artifacts": [],
        "recovered_files": [],
        "completed_at_utc": datetime.now(timezone.utc).isoformat(),
        "policy": (
            "Artifact results are reused only when artifact id, size, and updated_at match exactly, "
            "the previous download completed without errors, and the artifact was not pair-eligible. "
            "New or changed artifacts are downloaded and every member under the size cap is SHA-256 checked. "
            "Any 403/timeout/download/listing failure makes the scan incomplete and is never absence evidence. "
            "Exact immutable SHA plus one unambiguous valid final audit from the same artifact remains required; no reconstruction."
        ),
    }

    base.OUT_RECOVERY.mkdir(parents=True, exist_ok=True)
    for old in (base.OUT_RECOVERY / base.EXPECTED_FILENAME, base.OUT_RECOVERY / base.AUDIT_HINT):
        old.unlink(missing_ok=True)

    for artifact in candidates:
        cache_key = candidate_cache_key(artifact)
        cached = previous_items.get(cache_key)
        canonical_hits = []
        audit_hits = []
        if cached is not None:
            item = cached
            report["reused_verified_artifacts"] += 1
        else:
            item, canonical_hits, audit_hits = base.inspect_artifact(artifact)
            report["downloaded_artifacts_this_run"] += 1

        if not item.get("downloaded"):
            report["download_failures"] += 1
            report["scan_complete"] = False

        metrics = item.get("member_scan_metrics") or {}
        report["all_members_sha256_checked"] += int(metrics.get("members_sha256_checked") or 0)
        report["all_member_bytes_hashed"] += int(metrics.get("member_bytes_hashed") or 0)
        report["zip_signature_members"] += int(metrics.get("zip_signature_members") or 0)
        report["oversize_members_skipped"] += int(metrics.get("oversize_members_skipped") or 0)

        for member in item.get("interesting_members", []):
            low = str(member.get("name") or "").lower()
            if base.AUDIT_HINT.lower() in low:
                report["audit_name_hits"] += 1
            if any(h.lower() in low for h in base.RECOVERY_HINTS):
                report["recovery_hint_hits"] += 1

        report["canonical_hits"] += len(item.get("canonical_sha_hits") or [])
        report["valid_audit_hits"] += len(item.get("valid_final_audit_hits") or [])

        if item.get("paired_recovery_eligible"):
            canonical_by_hash = {base.sha256_bytes(data): (name, data) for name, data in canonical_hits}
            audit_by_hash = {base.sha256_bytes(data): (name, data) for name, data in audit_hits}
            if base.EXPECTED_SHA256 in canonical_by_hash and len(audit_by_hash) == 1:
                canonical_name, canonical_data = canonical_by_hash[base.EXPECTED_SHA256]
                audit_name, audit_data = next(iter(audit_by_hash.values()))
                canonical_out = base.OUT_RECOVERY / base.EXPECTED_FILENAME
                audit_out = base.OUT_RECOVERY / base.AUDIT_HINT
                canonical_out.write_bytes(canonical_data)
                audit_out.write_bytes(audit_data)
                report["paired_recovery_hits"] += 1
                report["recovered_files"].append({
                    "source_artifact_id": artifact.get("id"),
                    "source_artifact_name": artifact.get("name"),
                    "canonical_member": canonical_name,
                    "canonical_path": str(canonical_out),
                    "canonical_bytes": len(canonical_data),
                    "canonical_sha256": base.sha256_bytes(canonical_data),
                    "audit_member": audit_name,
                    "audit_path": str(audit_out),
                    "audit_bytes": len(audit_data),
                    "audit_sha256": base.sha256_bytes(audit_data),
                    "same_artifact_pair": True,
                })
                report["artifacts"].append(item)
                break

        report["artifacts"].append(item)

    report["canonical_absence_proven"] = bool(
        report["scan_complete"]
        and report["paired_recovery_hits"] == 0
    )
    base.OUT_REPORT.parent.mkdir(parents=True, exist_ok=True)
    report["completed_at_utc"] = datetime.now(timezone.utc).isoformat()
    base.OUT_REPORT.write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
