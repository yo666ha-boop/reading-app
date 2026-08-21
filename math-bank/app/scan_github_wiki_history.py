from __future__ import annotations

import hashlib
import json
import os
import shutil
import subprocess
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path, PurePosixPath

REPO = os.environ.get("GITHUB_REPOSITORY", "yo666ha-boop/reading-app")
EXPECTED_SHA256 = "eb93279a52dd49191612a52ac0df2df2fdd865c8975d815547daa126b4398175"
EXPECTED_FILENAME = "みかみ塾数学問題バンク_最終完成版_20260820.zip"
AUDIT_FILENAME = "MATHBANK_FINAL_AUDIT_V2.json"
OUT_REPORT = Path("math-bank/state/github-wiki-history-scan-latest.json")
OUT_RECOVERY = Path("math-bank/recovered-wiki")
MAX_BLOB_BYTES = 500 * 1024 * 1024


def run(*args: str, cwd: str | None = None, check: bool = True) -> subprocess.CompletedProcess:
    p = subprocess.run(args, cwd=cwd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=300)
    if check and p.returncode:
        raise RuntimeError(f"{' '.join(args)} rc={p.returncode}: {p.stderr.decode('utf-8','replace')[:1000]}")
    return p


def git_bytes(repo: str, *args: str) -> bytes:
    return run("git", "-C", repo, *args).stdout


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def valid_audit(data: bytes) -> bool:
    try:
        return isinstance(json.loads(data.decode("utf-8")), dict)
    except Exception:
        return False


def main() -> int:
    owner, name = REPO.split("/", 1)
    remote = f"https://github.com/{owner}/{name}.wiki.git"
    report = {
        "scan": "github_wiki_all_refs_all_reachable_blobs_exact_math_canonical",
        "repo": REPO,
        "wiki_remote": remote,
        "expected_filename": EXPECTED_FILENAME,
        "expected_sha256": EXPECTED_SHA256,
        "required_audit": AUDIT_FILENAME,
        "wiki_remote_exists": False,
        "refs_seen": 0,
        "commits_seen": 0,
        "reachable_blobs_seen": 0,
        "blobs_sha256_checked": 0,
        "blob_bytes_hashed": 0,
        "canonical_hits": [],
        "lfs_pointer_hits": [],
        "valid_named_audit_blobs": [],
        "paired_recovery_hits": [],
        "exact_coverage_complete": False,
        "errors": [],
        "recorded_at_utc": None,
        "policy": "All refs and all reachable wiki blobs are content-addressed. Pairing requires the exact canonical SHA and one valid named audit visible in the same wiki commit tree. No reconstruction.",
    }
    OUT_RECOVERY.mkdir(parents=True, exist_ok=True)
    for p in (OUT_RECOVERY / EXPECTED_FILENAME, OUT_RECOVERY / AUDIT_FILENAME):
        p.unlink(missing_ok=True)

    probe = run("git", "ls-remote", remote, check=False)
    if probe.returncode != 0:
        stderr = probe.stderr.decode("utf-8", "replace")
        if "Repository not found" in stderr or "not found" in stderr.lower() or "404" in stderr:
            report["exact_coverage_complete"] = True
            report["recorded_at_utc"] = datetime.now(timezone.utc).isoformat()
            OUT_REPORT.parent.mkdir(parents=True, exist_ok=True)
            OUT_REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
            print(json.dumps(report, ensure_ascii=False, indent=2))
            return 0
        report["errors"].append(stderr[:1000] or f"ls-remote rc={probe.returncode}")
        report["recorded_at_utc"] = datetime.now(timezone.utc).isoformat()
        OUT_REPORT.parent.mkdir(parents=True, exist_ok=True)
        OUT_REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(json.dumps(report, ensure_ascii=False, indent=2))
        return 3

    report["wiki_remote_exists"] = True
    ref_lines = [ln for ln in probe.stdout.decode("utf-8", "replace").splitlines() if ln.strip()]
    report["refs_seen"] = len(ref_lines)
    if not ref_lines:
        report["exact_coverage_complete"] = True
        report["recorded_at_utc"] = datetime.now(timezone.utc).isoformat()
        OUT_REPORT.parent.mkdir(parents=True, exist_ok=True)
        OUT_REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(json.dumps(report, ensure_ascii=False, indent=2))
        return 0

    with tempfile.TemporaryDirectory(prefix="math-wiki-") as td:
        mirror = Path(td) / "wiki.git"
        try:
            run("git", "clone", "--mirror", remote, str(mirror))
            run("git", "-C", str(mirror), "fsck", "--full", "--strict")
            commits = [x for x in git_bytes(str(mirror), "rev-list", "--all").decode().splitlines() if x]
            report["commits_seen"] = len(commits)
            object_lines = git_bytes(str(mirror), "rev-list", "--objects", "--all").decode("utf-8", "replace").splitlines()
            seen_oids: set[str] = set()
            canonical_oids: set[str] = set()
            audit_oids: set[str] = set()
            for line in object_lines:
                parts = line.split(" ", 1)
                oid = parts[0]
                if oid in seen_oids:
                    continue
                if git_bytes(str(mirror), "cat-file", "-t", oid).strip() != b"blob":
                    continue
                seen_oids.add(oid)
                size = int(git_bytes(str(mirror), "cat-file", "-s", oid).strip())
                if size > MAX_BLOB_BYTES:
                    raise RuntimeError(f"oversize reachable wiki blob {oid}: {size}")
                data = git_bytes(str(mirror), "cat-file", "blob", oid)
                report["reachable_blobs_seen"] += 1
                report["blobs_sha256_checked"] += 1
                report["blob_bytes_hashed"] += len(data)
                digest = sha256(data)
                path = parts[1] if len(parts) > 1 else ""
                if digest == EXPECTED_SHA256:
                    canonical_oids.add(oid)
                    report["canonical_hits"].append({"oid": oid, "path_hint": path, "bytes": len(data), "sha256": digest})
                if data.startswith(b"version https://git-lfs.github.com/spec/v1") and EXPECTED_SHA256.encode() in data:
                    report["lfs_pointer_hits"].append({"oid": oid, "path_hint": path, "bytes": len(data)})
                if PurePosixPath(path).name == AUDIT_FILENAME and valid_audit(data):
                    audit_oids.add(oid)
                    report["valid_named_audit_blobs"].append({"oid": oid, "path_hint": path, "bytes": len(data), "sha256": digest})

            if canonical_oids and audit_oids:
                for commit in commits:
                    tree_lines = git_bytes(str(mirror), "ls-tree", "-r", commit).decode("utf-8", "replace").splitlines()
                    canonical_paths: list[tuple[str, str]] = []
                    audit_paths: list[tuple[str, str]] = []
                    for line in tree_lines:
                        try:
                            left, path = line.split("\t", 1)
                            oid = left.split()[2]
                        except Exception:
                            continue
                        if oid in canonical_oids:
                            canonical_paths.append((oid, path))
                        if oid in audit_oids and PurePosixPath(path).name == AUDIT_FILENAME:
                            audit_paths.append((oid, path))
                    unique_audit_oids = {oid for oid, _ in audit_paths}
                    if not canonical_paths or len(unique_audit_oids) != 1:
                        continue
                    coid, cpath = canonical_paths[0]
                    aoid, apath = audit_paths[0]
                    cdata = git_bytes(str(mirror), "show", f"{commit}:{cpath}")
                    adata = git_bytes(str(mirror), "show", f"{commit}:{apath}")
                    if sha256(cdata) != EXPECTED_SHA256 or not valid_audit(adata):
                        continue
                    report["paired_recovery_hits"].append({
                        "commit": commit, "canonical_oid": coid, "canonical_path": cpath,
                        "audit_oid": aoid, "audit_path": apath,
                    })
                    (OUT_RECOVERY / EXPECTED_FILENAME).write_bytes(cdata)
                    (OUT_RECOVERY / AUDIT_FILENAME).write_bytes(adata)
                    break
            report["exact_coverage_complete"] = True
        except Exception as exc:
            report["errors"].append(str(exc)[:2000])
            report["exact_coverage_complete"] = False

    report["recorded_at_utc"] = datetime.now(timezone.utc).isoformat()
    OUT_REPORT.parent.mkdir(parents=True, exist_ok=True)
    OUT_REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0 if report["exact_coverage_complete"] else 3


if __name__ == "__main__":
    raise SystemExit(main())
