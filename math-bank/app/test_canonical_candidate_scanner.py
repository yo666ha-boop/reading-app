from __future__ import annotations

import hashlib
import tempfile
from pathlib import Path

from scan_canonical_candidates import CANONICAL_ZIP_NAME, AUDIT_NAME, scan


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def main() -> int:
    with tempfile.TemporaryDirectory() as td:
        root = Path(td)
        fake_same_name = root / CANONICAL_ZIP_NAME
        fake_same_name.write_bytes(b"not the canonical zip")
        (root / AUDIT_NAME).write_text("{}\n", encoding="utf-8")
        (root / "winpass_verified_union570_authoritative_norm_20260820.json").write_text("[]\n", encoding="utf-8")

        report = scan([root])
        assert report["status"] == "EXACT_CANONICAL_ZIP_NOT_FOUND"
        assert report["exact_zip_candidates"] == []
        assert len(report["same_name_sha_mismatch"]) == 1
        assert len(report["audit_candidates"]) == 1
        assert len(report["recovery_hint_candidates"]) == 1

        exact_bytes = b"diagnostic exact bytes"
        exact = root / "renamed-candidate.zip"
        exact.write_bytes(exact_bytes)
        expected = sha256_bytes(exact_bytes)
        report2 = scan([root], expected)
        assert report2["status"] == "EXACT_CANONICAL_ZIP_FOUND"
        assert len(report2["exact_zip_candidates"]) == 1
        assert report2["exact_zip_candidates"][0]["path"] == str(exact.resolve())
        assert report2["exact_zip_candidates"][0]["sha256"] == expected

        standalone = root / "1231.json"
        standalone.write_text("[]\n", encoding="utf-8")
        report3 = scan([standalone], expected)
        assert report3["exact_zip_candidates"] == []

    print("PASS_CANONICAL_CANDIDATE_SCANNER")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
