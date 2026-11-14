#!/usr/bin/env python3
"""Guarded 1323-question isolated math-app exact ID search fix.

Only math-bank/public-origin/index.html is changed. The original
index1323-exact.html, main branch and production deploy are untouched.
"""
from __future__ import annotations

import hashlib
from pathlib import Path

FILE = Path(__file__).resolve().parents[1] / "public-origin" / "index.html"
ORIGINAL_SHA256 = "4c2cfb56763e7cdc27055ddb2e3ab9ee075d9926a8656b18884f82524038aca9"
PATCHED_SHA256 = "8f367f2778b4ce6490fecebd067f82d14d082c7de084ca5061388240b2989cdb"

H0 = "function filtered(){const q=$('search').value.trim().toLowerCase(),kind=$('kind').value;return records.filter("
H1 = "function filtered(){const q=$('search').value.trim().toLowerCase(),kind=$('kind').value,exactId=q?records.find(r=>String(r.id).toLowerCase()===q)?.id:null;return records.filter("
T0 = r"&&(!q||[r.id,r.title,r.question,r.answer,r.explanation,major(r),minor(r),r.skill,parentBook(r),...(r.choices||[])].join('\n').toLowerCase().includes(q)))}"
T1 = r"&&(!q||(exactId!==null?r.id===exactId:[r.id,r.title,r.question,r.answer,r.explanation,major(r),minor(r),r.skill,parentBook(r),...(r.choices||[])].join('\n').toLowerCase().includes(q))))}"


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def main() -> None:
    before = FILE.read_bytes()
    digest = sha256(before)
    if digest == PATCHED_SHA256:
        print("ALREADY_PATCHED", digest)
        return
    if digest != ORIGINAL_SHA256:
        raise RuntimeError(f"Refusing to overwrite unexpected source: {digest}")

    html = before.decode("utf-8", errors="strict")
    for old, new in ((H0, H1), (T0, T1)):
        found = html.count(old)
        if found != 1:
            raise RuntimeError(f"Patch fragment is not unique: {found} occurrence(s)")
        html = html.replace(old, new, 1)

    after = html.encode("utf-8")
    actual = sha256(after)
    if actual != PATCHED_SHA256 or len(after) != 6819915:
        raise RuntimeError(f"Unexpected candidate: sha={actual} bytes={len(after)}")

    FILE.write_bytes(after)
    print("PASS EXACT_ID_SEARCH_PATCH", actual, "bytes", len(after))
    print("Base original exact HTML remains untouched.")


if __name__ == "__main__":
    main()
