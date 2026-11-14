#!/usr/bin/env python3
"""Build a nonpublished 1323 runtime candidate with a minimal settings-restore fix.

The immutable exact original is read-only. Only the specific restore() logic
may change; all 1323 questions, 282 embedded images and source provenance
remain byte-identical within the resulting file.
"""
from __future__ import annotations

import argparse
import hashlib
import re
from pathlib import Path

SOURCE_SHA256 = "47893e010514fffa44d45dac3832cf502aee075345b1ecdf378f69d764b32521"
SOURCE_BYTES = 6_819_806
SOURCE = Path("math-bank/public-origin/index1323-exact.html")
CANDIDATE = Path("math-bank/qa-candidate/index.html")

ORIGINAL = (
    b"function restore(){let s={};"
    b"try{s=JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}')}"
    b"catch{};for(const id of IDS)"
)
FIXED = ORIGINAL.replace(b"catch{};for(", b"catch{};cascade();for(")


def build(source: Path = SOURCE, destination: Path = CANDIDATE) -> dict:
    data = source.read_bytes()
    assert len(data) == SOURCE_BYTES, f"unexpected original byte length: {len(data)}"
    assert hashlib.sha256(data).hexdigest() == SOURCE_SHA256, "unexpected original SHA256"
    assert data.count(ORIGINAL) == 1, f"restore function contract unexpected ({data.count(ORIGINAL)})"
    assert data.count(FIXED) == 0, "restore function already patched"
    fixed = data.replace(ORIGINAL, FIXED, 1)
    assert fixed.replace(FIXED, ORIGINAL, 1) == data, "unexpected mutation outside restore()"
    assert len(re.findall(rb"data:image/[^;]+;base64,", fixed)) == 282, "embedded image count changed"
    assert b"const EMBEDDED_RECORDS=" in fixed
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_bytes(fixed)
    result = {
        "source": str(source),
        "candidate": str(destination),
        "source_sha256": SOURCE_SHA256,
        "candidate_sha256": hashlib.sha256(fixed).hexdigest(),
        "candidate_bytes": len(fixed),
        "patch": "restore() preload dropdown options before restoring saved values",
        "original_preserved": True,
        "embedded_images": 282,
        "publication_ready": False,
    }
    print(result)
    return result


if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--source", type=Path, default=SOURCE)
    p.add_argument("--output", type=Path, default=CANDIDATE)
    a = p.parse_args()
    build(a.source, a.output)
