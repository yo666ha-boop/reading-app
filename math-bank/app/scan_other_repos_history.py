from __future__ import annotations

import hashlib
import json
import re
import shutil
import subprocess
import tempfile
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

EXPECTED_SHA256 = "eb93279a52dd49191612a52ac0df2df2fdd865c8975d815547daa126b4398175"
EXPECTED_FILENAME = "みかみ塾数学問題バンク_最終完成版_20260820.zip"
AUDIT_FILENAME = "MATHBANK_FINAL_AUDIT_V2.json"
OTHER_REPOS = ("yo666ha-boop/-", "yo666ha-boop/english-vocab-app")
MAX_BLOB_BYTES = 500 * 1024 * 1024
LFS_PREFIX = b"version https://git-lfs.github.com/spec/v1\n"
OUT_REPORT = Path("math-bank/state/other-repos-history-scan-latest.json")
OUT_DIR = Path("math-bank/recovered-other-repos")


def run(cmd: list[str], *, check: bool = True, text: bool = True, cwd: Path | None = None) -> subprocess.CompletedProcess:
    return subprocess.run(cmd, cwd=cwd, text=text, stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=check)


def git(work: Path, *args: str, text: bool = True, check: bool = True) -> subprocess.CompletedProcess:
    return run(["git", "-C", str(work), *args], text=text, check=check)


def git_bytes(work: Path, *args: str) -> bytes:
    return git(work, *args, text=False).stdout


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def valid_audit(data: bytes) -> bool:
    try:
        return isinstance(json.loads(data.decode("utf-8")), dict)
    except Exception:
        return False


def parse_lfs_pointer(data: bytes) -> tuple[str, int | None] | None:
    if not data.startswith(LFS_PREFIX) or len(data) > 4096:
        return None
    text = data.decode("utf-8", "replace")
    m = re.search(r"^oid sha256:([0-9a-f]{64})$", text, flags=re.M)
    if not m:
        return None
    s = re.search(r"^size (\d+)$", text, flags=re.M)
    return m.group(1), int(s.group(1)) if s else None


def rev_objects(work: Path) -> dict[str, set[str]]:
    proc = git(work, "rev-list", "--objects", "--all")
    out: dict[str, set[str]] = defaultdict(set)
    for line in proc.stdout.splitlines():
        if not line.strip():
            continue
        parts = line.split(" ", 1)
        oid = parts[0]
        if len(parts) == 2 and parts[1]:
            out[oid].add(parts[1])
        else:
            out.setdefault(oid, set())
    return out


def batch_meta(work: Path, oids: list[str]) -> dict[str, tuple[str, int]]:
    if not oids:
        return {}
    proc = subprocess.Popen(
        ["git", "-C", str(work), "cat-file", "--batch-check=%(objectname) %(objecttype) %(objectsize)"],
        stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True,
    )
    assert proc.stdin is not None and proc.stdout is not None
    proc.stdin.write("\n".join(oids) + "\n")
    proc.stdin.close()
    meta: dict[str, tuple[str, int]] = {}
    for line in proc.stdout:
        parts = line.strip().split()
        if len(parts) == 3:
            try:
                meta[parts[0]] = (parts[1], int(parts[2]))
            except ValueError:
                pass
    stderr = proc.stderr.read() if proc.stderr is not None else ""
    rc = proc.wait()
    if rc:
        raise RuntimeError(f"cat-file batch-check rc={rc}: {stderr[:500]}")
    return meta


def tree_entries(work: Path, commit: str) -> list[tuple[str, str]]:
    raw = git_bytes(work, "ls-tree", "-r", "-z", commit)
    entries: list[tuple[str, str]] = []
    for item in raw.split(b"\0"):
        if not item:
            continue
        try:
            head, path_b = item.split(b"\t", 1)
            _, typ, oid_b = head.split(b" ", 2)
        except ValueError:
            continue
        if typ == b"blob":
            entries.append((oid_b.decode("ascii"), path_b.decode("utf-8", "replace")))
    return entries


def find_pair(work: Path, zip_oid: str, zip_data: bytes, lfs_pointer: bool = False) -> dict | None:
    commits = [x.strip() for x in git(work, "rev-list", "--all").stdout.splitlines() if x.strip()]
    for commit in commits:
        entries = tree_entries(work, commit)
        if not any(oid == zip_oid for oid, _ in entries):
            continue
        audits: dict[str, tuple[str, bytes]] = {}
        for oid, path in entries:
            if Path(path).name != AUDIT_FILENAME:
                continue
            try:
                data = git_bytes(work, "cat-file", "blob", oid)
            except Exception:
                continue
            if valid_audit(data):
                audits[sha256_bytes(data)] = (path, data)
        if len(audits) != 1:
            continue
        audit_sha, (audit_path, audit_data) = next(iter(audits.items()))
        return {
            "commit": commit,
            "canonical_blob_oid": ("LFS_POINTER:" if lfs_pointer else "") + zip_oid,
            "canonical_sha256": EXPECTED_SHA256,
            "canonical_bytes": len(zip_data),
            "audit_path": audit_path,
            "audit_sha256": audit_sha,
            "audit_bytes": len(audit_data),
            "zip_data": zip_data,
            "audit_data": audit_data,
        }
    return None


def recover_lfs(work: Path) -> bytes | None:
    if git(work, "lfs", "version", check=False).returncode != 0:
        return None
    git(work, "lfs", "fetch", "--all", check=False)
    root = work / ".git" / "lfs" / "objects"
    if not root.is_dir():
        return None
    candidates = [root / EXPECTED_SHA256[:2] / EXPECTED_SHA256[2:4] / EXPECTED_SHA256]
    candidates.extend(root.rglob(EXPECTED_SHA256))
    for p in candidates:
        if p.is_file():
            data = p.read_bytes()
            if sha256_bytes(data) == EXPECTED_SHA256:
                return data
    return None


def scan_repo(repo: str, temp_root: Path) -> tuple[dict, dict | None]:
    work = temp_root / repo.split("/", 1)[1].replace("-", "dash")
    url = f"https://github.com/{repo}.git"
    clone = run(["git", "clone", "--no-checkout", url, str(work)], check=False)
    item = {
        "repo": repo,
        "clone_rc": clone.returncode,
        "remote_branches": 0,
        "tags": 0,
        "reachable_objects": 0,
        "reachable_blobs": 0,
        "sha256_checked": 0,
        "bytes_hashed": 0,
        "oversize_skipped": 0,
        "canonical_hits": [],
        "lfs_pointer_hits": [],
        "audit_blob_candidates": [],
        "errors": [],
    }
    if clone.returncode:
        item["errors"].append(clone.stderr[-1000:])
        return item, None

    git(work, "fetch", "origin", "+refs/heads/*:refs/remotes/origin/*", "--force", "--prune", check=False)
    git(work, "fetch", "origin", "+refs/tags/*:refs/tags/*", "--force", check=False)
    item["remote_branches"] = len([x for x in git(work, "for-each-ref", "--format=%(refname)", "refs/remotes/origin/").stdout.splitlines() if x.strip()])
    item["tags"] = len([x for x in git(work, "tag", "--list").stdout.splitlines() if x.strip()])
    paths = rev_objects(work)
    oids = sorted(paths)
    meta = batch_meta(work, oids)
    blobs = [oid for oid in oids if meta.get(oid, (None, 0))[0] == "blob"]
    item["reachable_objects"] = len(oids)
    item["reachable_blobs"] = len(blobs)

    exact: list[tuple[str, bytes]] = []
    lfs_oids: list[str] = []
    for oid in blobs:
        size = meta[oid][1]
        if size > MAX_BLOB_BYTES:
            item["oversize_skipped"] += 1
            continue
        data = git_bytes(work, "cat-file", "blob", oid)
        item["sha256_checked"] += 1
        item["bytes_hashed"] += len(data)
        digest = sha256_bytes(data)
        if digest == EXPECTED_SHA256:
            item["canonical_hits"].append({"oid": oid, "paths": sorted(paths.get(oid, set())), "bytes": len(data)})
            exact.append((oid, data))
        pointer = parse_lfs_pointer(data)
        if pointer and pointer[0] == EXPECTED_SHA256:
            item["lfs_pointer_hits"].append({"oid": oid, "paths": sorted(paths.get(oid, set())), "lfs_size": pointer[1]})
            lfs_oids.append(oid)
        if any(Path(p).name == AUDIT_FILENAME for p in paths.get(oid, set())) and valid_audit(data):
            item["audit_blob_candidates"].append({"oid": oid, "paths": sorted(paths.get(oid, set())), "sha256": digest, "bytes": len(data)})

    for oid, data in exact:
        pair = find_pair(work, oid, data)
        if pair:
            pair["repo"] = repo
            return item, pair

    if lfs_oids:
        lfs_data = recover_lfs(work)
        if lfs_data is not None:
            for pointer_oid in lfs_oids:
                pair = find_pair(work, pointer_oid, lfs_data, lfs_pointer=True)
                if pair:
                    pair["repo"] = repo
                    return item, pair
    return item, None


def main() -> int:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for p in (OUT_DIR / EXPECTED_FILENAME, OUT_DIR / AUDIT_FILENAME):
        p.unlink(missing_ok=True)
    report = {
        "scan": "all_other_owned_repo_histories_for_exact_math_canonical",
        "expected_sha256": EXPECTED_SHA256,
        "required_paired_audit": AUDIT_FILENAME,
        "repos": [],
        "paired_recovery_hits": [],
        "completed_at_utc": None,
        "policy": "Existing immutable artifact recovery only. Every reachable blob under the cap in the two other owned repositories is SHA-256 checked; no reconstruction or guessed mapping.",
    }
    with tempfile.TemporaryDirectory() as td:
        root = Path(td)
        for repo in OTHER_REPOS:
            item, pair = scan_repo(repo, root)
            report["repos"].append(item)
            if pair:
                zip_data = pair.pop("zip_data")
                audit_data = pair.pop("audit_data")
                (OUT_DIR / EXPECTED_FILENAME).write_bytes(zip_data)
                (OUT_DIR / AUDIT_FILENAME).write_bytes(audit_data)
                pair["canonical_output"] = str(OUT_DIR / EXPECTED_FILENAME)
                pair["audit_output"] = str(OUT_DIR / AUDIT_FILENAME)
                report["paired_recovery_hits"].append(pair)
                break
    report["completed_at_utc"] = datetime.now(timezone.utc).isoformat()
    OUT_REPORT.parent.mkdir(parents=True, exist_ok=True)
    OUT_REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
