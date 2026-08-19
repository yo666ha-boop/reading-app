from __future__ import annotations

import json
import sys
import zipfile
from pathlib import Path
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "source"
STATE_DIR = ROOT / "state"
OUT_DIR = ROOT / "out"
CHECKPOINT = STATE_DIR / "checkpoint.json"
MANIFEST = OUT_DIR / "archive_manifest.json"

EXPECTED = [
    "中学実力錬成データ.zip",
    "スタンダードデータ.zip",
    "winpassデータ.zip",
]


def load_checkpoint() -> dict:
    if CHECKPOINT.exists():
        return json.loads(CHECKPOINT.read_text(encoding="utf-8"))
    return {}


def save_checkpoint(cp: dict) -> None:
    STATE_DIR.mkdir(parents=True, exist_ok=True)
    CHECKPOINT.write_text(json.dumps(cp, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> int:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    cp = load_checkpoint()
    manifest = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "archives": [],
        "total_files": 0,
    }

    missing = []
    for name in EXPECTED:
        path = SOURCE_DIR / name
        if not path.exists():
            missing.append(name)
            manifest["archives"].append({"name": name, "status": "MISSING", "files": []})
            continue

        try:
            with zipfile.ZipFile(path) as zf:
                files = []
                for info in zf.infolist():
                    if info.is_dir():
                        continue
                    files.append({
                        "path": info.filename,
                        "size": info.file_size,
                        "compressed_size": info.compress_size,
                        "crc": f"{info.CRC:08x}",
                    })
                manifest["archives"].append({"name": name, "status": "OK", "files": files})
                manifest["total_files"] += len(files)
        except zipfile.BadZipFile:
            manifest["archives"].append({"name": name, "status": "BAD_ZIP", "files": []})

    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    cp["counts"] = cp.get("counts", {})
    cp["counts"]["files_discovered"] = manifest["total_files"]
    if missing:
        cp["status"] = "WAITING_FOR_SOURCE_ARCHIVES"
        cp["current_stage"] = "ZIP_INVENTORY"
        cp["next_batch"] = "inventory-all-archives"
        cp["blocking_issue"] = "Missing source archives: " + ", ".join(missing)
        save_checkpoint(cp)
        print(cp["blocking_issue"], file=sys.stderr)
        return 2

    cp["status"] = "RUNNING"
    cp["current_stage"] = "FILE_CLASSIFICATION"
    cp["last_completed_batch"] = "inventory-all-archives"
    cp["next_batch"] = "classify-files"
    cp["blocking_issue"] = None
    save_checkpoint(cp)
    print(f"Inventory complete: {manifest['total_files']} files")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
