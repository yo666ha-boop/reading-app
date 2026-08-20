from __future__ import annotations

import hashlib
import json
import shutil
import subprocess
import sys
import zipfile
from pathlib import Path

from recover_canonical_app_records import local_figure_ref

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


def load_records() -> list[dict]:
    obj = json.loads(DATA.read_text(encoding="utf-8"))
    rows = obj if isinstance(obj, list) else obj.get("records", [])
    if not isinstance(rows, list):
        raise ValueError("app-records.json does not contain a records list")
    return rows


def collect_figure_assets(records: list[dict]) -> tuple[list[Path], int]:
    local: dict[str, Path] = {}
    external_count = 0
    for r in records:
        for ref in r.get("figure_refs", []):
            rel = local_figure_ref(ref)
            if rel is None:
                external_count += 1
                continue
            key = rel.as_posix()
            src = ROOT.joinpath(*rel.parts)
            if not src.is_file():
                raise ValueError(f"missing local figure asset: {key}")
            local[key] = src
    return [local[k] for k in sorted(local)], external_count


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

    records = load_records()
    choice_records = sum(1 for r in records if isinstance(r.get("choices"), list) and len(r["choices"]) > 0)
    title_records = sum(1 for r in records if isinstance(r.get("title"), str))
    choices_field_records = sum(1 for r in records if "choices" in r)
    if title_records != len(records) or choices_field_records != len(records):
        raise SystemExit("FAIL release title/choices preservation gate")

    try:
        figure_assets, external_figure_refs = collect_figure_assets(records)
    except Exception as e:
        raise SystemExit(f"FAIL figure asset release gate: {e}")

    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir(parents=True)
    shutil.copy2(INDEX, OUT / "index.html")
    shutil.copy2(DATA, OUT / "app-records.json")

    for src in figure_assets:
        rel = src.relative_to(ROOT)
        dest = OUT / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dest)

    payload_files = [OUT / "index.html", OUT / "app-records.json"] + [OUT / src.relative_to(ROOT) for src in figure_assets]
    manifest = {
        "release_gate": "STRICT_CANONICAL_1231_TITLE_CHOICES_AND_FIGURE_ASSETS_PASS",
        "records": 1231,
        "original": 1124,
        "variants": 107,
        "title_records": title_records,
        "choices_field_records": choices_field_records,
        "choice_records": choice_records,
        "title_choices_preservation_required": True,
        "local_figure_assets": len(figure_assets),
        "external_figure_refs": external_figure_refs,
        "files": {
            p.relative_to(OUT).as_posix(): sha256(p)
            for p in sorted(payload_files, key=lambda x: x.relative_to(OUT).as_posix())
        },
    }
    manifest_path = OUT / "release-manifest.json"
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    zip_path = ROOT.parent / "みかみ塾数学問題アプリ_公開候補.zip"
    if zip_path.exists():
        zip_path.unlink()
    with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        for p in sorted((p for p in OUT.rglob("*") if p.is_file()), key=lambda x: x.relative_to(OUT).as_posix()):
            zf.write(p, arcname=p.relative_to(OUT).as_posix())

    print("PASS_RELEASE_BUNDLE")
    print(f"records={len(records)}")
    print(f"title_records={title_records}")
    print(f"choices_field_records={choices_field_records}")
    print(f"choice_records={choice_records}")
    print(f"local_figure_assets={len(figure_assets)}")
    print(f"external_figure_refs={external_figure_refs}")
    print(f"bundle={zip_path}")
    print(f"bundle_sha256={sha256(zip_path)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
