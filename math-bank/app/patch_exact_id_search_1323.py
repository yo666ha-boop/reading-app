#!/usr/bin/env python3
"""Deterministic 1323-question exact-ID + keyword search fix.

Only the isolated math-bank/public-origin/index.html file is modified.
The original index1323-exact.html and main branch must remain untouched.
"""
from __future__ import annotations

import hashlib
from pathlib import Path

FILE = Path(__file__).resolve().parents[1] / "public-origin" / "index.html"
ORIGINAL_SHA256 = "4c2cfb56763e7cdc27055ddb2e3ab9ee075d9926a8656b18884f82524038aca9"
INTERMEDIATE_SHA256 = "8f367f2778b4ce6490fecebd067f82d14d082c7de084ca5061388240b2989cdb"
FINAL_SHA256 = "64f4f2294c373b19922da7ec470a16860ccd4e8db854cbab15fb5122c53e09a6"

H0 = "function filtered(){const q=$('search').value.trim().toLowerCase(),kind=$('kind').value;return records.filter("
H1 = "function filtered(){const q=$('search').value.trim().toLowerCase(),kind=$('kind').value,exactId=q?records.find(r=>String(r.id).toLowerCase()===q)?.id:null;return records.filter("
T0 = r"&&(!q||[r.id,r.title,r.question,r.answer,r.explanation,major(r),minor(r),r.skill,parentBook(r),...(r.choices||[])].join('\n').toLowerCase().includes(q)))}"
T1 = r"&&(!q||(exactId!==null?r.id===exactId:[r.id,r.title,r.question,r.answer,r.explanation,major(r),minor(r),r.skill,parentBook(r),...(r.choices||[])].join('\n').toLowerCase().includes(q))))}"


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def replace_unique(html: str, old: str, new: str) -> str:
    count = html.count(old)
    if count != 1:
        raise RuntimeError(f"Refusing nonunique patch ({count} matches): {old[:40]}")
    return html.replace(old, new, 1)


def main() -> None:
    original = FILE.read_bytes()
    data = original
    digest = sha256(data)
    if digest not in {ORIGINAL_SHA256, INTERMEDIATE_SHA256, FINAL_SHA256}:
        raise RuntimeError("Refusing to overwrite unexpected source SHA256: " + digest)

    if digest == ORIGINAL_SHA256:
        text = data.decode("utf-8", errors="strict")
        text = replace_unique(text, H0, H1)
        text = replace_unique(text, T0, T1)
        data = text.encode("utf-8")
        assert sha256(data) == INTERMEDIATE_SHA256
        digest = INTERMEDIATE_SHA256

    if digest == INTERMEDIATE_SHA256:
        text = data.decode("utf-8", errors="strict")
        text = replace_unique(text, "exactId!==null?r.id===exactId",
                              "exactId!=null?r.id===exactId")
        data = text.encode("utf-8")
        digest = sha256(data)

    if digest != FINAL_SHA256 or len(data) != 6819914:
        raise RuntimeError(f"Candidate drift: {digest} bytes {len(data)}")

    if original != data:
        FILE.write_bytes(data)
        print("PATCHED exact-ID and keyword fallback safely")
    else:
        print("ALREADY_PATCHED")
    print("PASS final SHA256", digest, "bytes", len(data))
    print("Immutable source and main branch not touched.")


if __name__ == "__main__":
    main()
