from __future__ import annotations

import hashlib
import json
import shutil
import subprocess
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
OUT = ROOT.parent / "release"
DATA = ROOT / "app-records.json"
INDEX = ROOT / "index.html"
VALIDATOR = ROOT / "validate_app_records.py"


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def main() -> int:
    if not DATA.is_file():
        print("RELEASE_BLOCKED_EXPECTED: exact canonical app-records.json is not wired")
        return 3
    if not INDEX.is_file():
        raise SystemExit("FAIL missing index.html")

    proc = subprocess.run(
        [sys.executable, str(VALIDATOR), str(DATA)],
        text=True,
        capture_output=True,
    )
    if proc.returncode:
        print(proc.stdout)
        print(proc.stderr, file=sys.stderr)
        raise SystemExit("FAIL strict canonical validator rejected release data")

    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir(parents=True)
    shutil.copy2(INDEX, OUT / "index.html")
    shutil.copy2(DATA, OUT / "app-records.json")

    manifest = {
        "release_gate": "STRICT_CANONICAL_1231_PASS",
        "records": 1231,
        "original": 1124,
        "variants": 107,
        "files": {
            "index.html": sha256(OUT / "index.html"),
            "app-records.json": sha256(OUT / "app-records.json"),
        },
    }
    manifest_path = OUT / "release-manifest.json"
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    zip_path = ROOT.parent / "みかみ塾数学問題アプリ_公開候補.zip"
    if zip_path.exists():
        zip_path.unlink()
    with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        for name in ("index.html", "app-records.json", "release-manifest.json"):
            zf.write(OUT / name, arcname=name)

    print("PASS_RELEASE_BUNDLE")
    print(f"bundle={zip_path}")
    print(f"bundle_sha256={sha256(zip_path)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
