from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

CANONICAL_ZIP_NAME = "みかみ塾数学問題バンク_最終完成版_20260820.zip"
CANONICAL_ZIP_SHA256 = "eb93279a52dd49191612a52ac0df2df2fdd865c8975d815547daa126b4398175"
AUDIT_NAME = "MATHBANK_FINAL_AUDIT_V2.json"
RECOVERY_HINTS = (
    "winpass_verified_union570_authoritative_norm_20260820",
    "jitsuren_verified_union225_complete27_20260820",
)


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def scan(roots: list[Path], expected_sha256: str = CANONICAL_ZIP_SHA256) -> dict:
    exact: list[dict] = []
    named_mismatch: list[dict] = []
    audit_candidates: list[str] = []
    hint_candidates: list[str] = []
    files_seen = 0

    seen: set[str] = set()
    for root in roots:
        if not root.exists():
            continue
        candidates = [root] if root.is_file() else root.rglob("*")
        for p in candidates:
            if not p.is_file():
                continue
            try:
                rp = str(p.resolve())
            except OSError:
                rp = str(p)
            if rp in seen:
                continue
            seen.add(rp)
            files_seen += 1
            name = p.name
            lower = name.lower()

            if name == AUDIT_NAME:
                audit_candidates.append(rp)
            if any(h.lower() in lower for h in RECOVERY_HINTS):
                hint_candidates.append(rp)

            if p.suffix.lower() != ".zip":
                continue
            digest = sha256_file(p)
            rec = {"path": rp, "name": name, "sha256": digest, "bytes": p.stat().st_size}
            if digest.lower() == expected_sha256.lower():
                exact.append(rec)
            elif name == CANONICAL_ZIP_NAME:
                named_mismatch.append(rec)

    return {
        "status": "EXACT_CANONICAL_ZIP_FOUND" if exact else "EXACT_CANONICAL_ZIP_NOT_FOUND",
        "expected_filename": CANONICAL_ZIP_NAME,
        "expected_sha256": expected_sha256,
        "files_seen": files_seen,
        "exact_zip_candidates": exact,
        "same_name_sha_mismatch": named_mismatch,
        "audit_candidates": sorted(audit_candidates),
        "recovery_hint_candidates": sorted(hint_candidates),
        "policy": "Discovery only. Never promotes, converts, reconstructs, or rewrites canonical data.",
    }


def main() -> int:
    ap = argparse.ArgumentParser(description="Discover the immutable final math ZIP by SHA-256 without promoting or reconstructing data.")
    ap.add_argument("roots", nargs="+", help="Files or directories to scan recursively")
    ap.add_argument("--expected-sha256", default=CANONICAL_ZIP_SHA256, help="Testing/diagnostic override; this scanner never promotes data")
    ap.add_argument("--output", default="", help="Optional JSON report path")
    args = ap.parse_args()

    report = scan([Path(x) for x in args.roots], args.expected_sha256)
    text = json.dumps(report, ensure_ascii=False, indent=2) + "\n"
    if args.output:
        out = Path(args.output)
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(text, encoding="utf-8")
    print(text, end="")
    return 0 if report["exact_zip_candidates"] else 3


if __name__ == "__main__":
    raise SystemExit(main())
