from __future__ import annotations

import hashlib
import importlib.util
import tempfile
import zipfile
from pathlib import Path

MODULE_PATH = Path(__file__).with_name("verify_source_archives.py")
spec = importlib.util.spec_from_file_location("verify_source_archives", MODULE_PATH)
assert spec and spec.loader
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)


def make_zip(path: Path, members: dict[str, bytes]) -> str:
    with zipfile.ZipFile(path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        for name, data in members.items():
            zf.writestr(name, data)
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> None:
    assert m.normalized_zip_name("winpassデータ.zip") == "winpassデータ.zip"
    assert m.normalized_zip_name("winpassデータ(1).zip") == "winpassデータ.zip"
    assert m.normalized_zip_name("スタンダードデータ (12).zip") == "スタンダードデータ.zip"

    with tempfile.TemporaryDirectory() as td:
        root = Path(td)
        a = root / "alphaデータ(1).zip"
        b = root / "betaデータ.zip"
        a_sha = make_zip(a, {"A/MATH.json": b"{}", "A/figure.png": b"png"})
        b_sha = make_zip(b, {"B/MATH.json": b"{}"})
        specs = {
            "alpha": {
                "canonical_name": "alphaデータ.zip",
                "sha256": a_sha,
                "historical_original_records": 10,
                "historical_raw_diagnostic_records": 12,
            },
            "beta": {
                "canonical_name": "betaデータ.zip",
                "sha256": b_sha,
                "historical_original_records": 20,
                "historical_raw_diagnostic_records": 20,
            },
        }
        report = m.build_report(root, specs)
        assert report["ready_for_real_rebuild"] is True
        assert report["archives"]["alpha"]["selected"]["name"] == "alphaデータ(1).zip"
        assert report["archives"]["alpha"]["zip_inspection"]["file_members"] == 2
        assert report["archives"]["alpha"]["zip_inspection"]["extension_counts"] == {".json": 1, ".png": 1}

        # Same filename family but changed bytes must never be promoted.
        make_zip(a, {"A/MATH.json": b'{"changed":true}'})
        mismatch = m.build_report(root, specs)
        assert mismatch["ready_for_real_rebuild"] is False
        assert mismatch["archives"]["alpha"]["status"] == "HASH_MISMATCH"

        # Missing required source also fails closed.
        b.unlink()
        missing = m.build_report(root, specs)
        assert missing["ready_for_real_rebuild"] is False
        assert missing["archives"]["beta"]["status"] == "MISSING"

    print("PASS_MATH_SOURCE_ARCHIVE_EXACT_SHA_RENAMED_COPY_AND_FAIL_CLOSED_TESTS")


if __name__ == "__main__":
    main()
