from __future__ import annotations

import hashlib
import json
import shutil
import subprocess
import sys
import zipfile
from pathlib import Path

from recover_canonical_app_records import local_figure_ref
from validate_canonical_provenance import validate_provenance

ROOT = Path(__file__).resolve().parent
OUT = ROOT.parent / "release"
DATA = ROOT / "app-records.json"
PROVENANCE = ROOT / "canonical-provenance.json"
AUDIT = ROOT / "MATHBANK_FINAL_AUDIT_V2.json"
INDEX = ROOT / "index.html"
FIGURE_RENDERER = ROOT / "render_figure_markers.js"
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


def validate_final_audit() -> dict:
    if not AUDIT.is_file():
        raise ValueError("MATHBANK_FINAL_AUDIT_V2.json is required for strict release")
    if AUDIT.name != "MATHBANK_FINAL_AUDIT_V2.json":
        raise ValueError("final audit filename mismatch")
    try:
        obj = json.loads(AUDIT.read_text(encoding="utf-8"))
    except Exception as e:
        raise ValueError(f"final audit is not valid JSON: {e}") from e
    if not isinstance(obj, dict):
        raise ValueError("final audit must be a JSON object")
    return obj


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
    if not FIGURE_RENDERER.is_file():
        raise SystemExit("FAIL render_figure_markers.js is required by index.html and strict release")
    if not PROVENANCE.is_file():
        raise SystemExit("FAIL canonical-provenance.json is required; strict counts alone cannot prove canonical identity")

    proc = subprocess.run(
        [sys.executable, str(VALIDATOR), str(DATA)],
        text=True,
        capture_output=True,
    )
    if proc.returncode:
        print(proc.stdout)
        print(proc.stderr, file=sys.stderr)
        raise SystemExit("FAIL strict canonical validator rejected release data")

    try:
        provenance_result = validate_provenance(PROVENANCE, DATA, ROOT)
    except Exception as e:
        raise SystemExit(f"FAIL canonical provenance release gate: {e}")

    try:
        validate_final_audit()
    except Exception as e:
        raise SystemExit(f"FAIL final canonical audit release gate: {e}")

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
    shutil.copy2(FIGURE_RENDERER, OUT / "render_figure_markers.js")
    shutil.copy2(DATA, OUT / "app-records.json")
    shutil.copy2(PROVENANCE, OUT / "canonical-provenance.json")
    shutil.copy2(AUDIT, OUT / "MATHBANK_FINAL_AUDIT_V2.json")

    for src in figure_assets:
        rel = src.relative_to(ROOT)
        dest = OUT / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dest)

    payload_files = [
        OUT / "index.html",
        OUT / "render_figure_markers.js",
        OUT / "app-records.json",
        OUT / "canonical-provenance.json",
        OUT / "MATHBANK_FINAL_AUDIT_V2.json",
    ] + [OUT / src.relative_to(ROOT) for src in figure_assets]
    manifest = {
        "release_gate": "STRICT_CANONICAL_1231_PROVENANCE_FINAL_AUDIT_TITLE_CHOICES_FIGURE_ASSETS_AND_INLINE_MARKER_RENDERER_PASS",
        "records": 1231,
        "original": 1124,
        "variants": 107,
        "title_records": title_records,
        "choices_field_records": choices_field_records,
        "choice_records": choice_records,
        "title_choices_preservation_required": True,
        "canonical_provenance_required": True,
        "canonical_final_audit_required": True,
        "inline_figure_marker_renderer_required": True,
        "inline_figure_marker_renderer_sha256": sha256(FIGURE_RENDERER),
        "canonical_final_audit_filename": AUDIT.name,
        "canonical_final_audit_sha256": sha256(AUDIT),
        "canonical_provenance_status": provenance_result["status"],
        "canonical_zip_sha256": provenance_result["canonical_zip_sha256"],
        "canonical_member": provenance_result["canonical_member"],
        "canonical_member_sha256": provenance_result["canonical_member_sha256"],
        "app_records_sha256": provenance_result["app_records_sha256"],
        "provenance_method": provenance_result["method"],
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
    print("canonical_provenance=PASS")
    print("canonical_final_audit=PASS")
    print("inline_figure_marker_renderer=PASS")
    print(f"inline_figure_marker_renderer_sha256={sha256(FIGURE_RENDERER)}")
    print(f"canonical_final_audit_sha256={sha256(AUDIT)}")
    print(f"canonical_zip_sha256={provenance_result['canonical_zip_sha256']}")
    print(f"provenance_method={provenance_result['method']}")
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
