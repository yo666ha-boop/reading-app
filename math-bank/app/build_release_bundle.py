from __future__ import annotations

import hashlib
import json
import shutil
import sys
import zipfile
from pathlib import Path

from recover_canonical_app_records import local_figure_ref
from validate_app_records import load_records
from validate_canonical_provenance import validate_provenance
from validate_expanded_variant_layer import load_layer, validate_layer

ROOT = Path(__file__).resolve().parent
OUT = ROOT.parent / "release"
DATA = ROOT / "app-records.json"
BASE_DATA = ROOT / "base-app-records.json"
EXPANDED = ROOT / "verified-expanded-variants.json"
PROVENANCE = ROOT / "canonical-provenance.json"
AUDIT = ROOT / "MATHBANK_FINAL_AUDIT_V2.json"
INDEX = ROOT / "index.html"
FIGURE_RENDERER = ROOT / "render_figure_markers.js"
RELEASE_GATE = "STRICT_BASE_1231_PLUS_DYNAMIC_VERIFIED_EXPANDED_VARIANTS_PROVENANCE_AUDIT_FIGURES_PASS"


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def validate_final_audit() -> dict:
    if not AUDIT.is_file():
        raise ValueError("MATHBANK_FINAL_AUDIT_V2.json is required for strict release")
    obj = json.loads(AUDIT.read_text(encoding="utf-8"))
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
    required = [DATA, BASE_DATA, EXPANDED, INDEX, FIGURE_RENDERER, PROVENANCE, AUDIT]
    missing = [p.name for p in required if not p.is_file()]
    if missing:
        print(f"RELEASE_BLOCKED_EXPECTED: missing {missing}")
        return 3

    try:
        provenance_result = validate_provenance(PROVENANCE, BASE_DATA, ROOT)
        validate_final_audit()
        base = load_records(BASE_DATA)
        variants, expanded_provenance, _ = load_layer(EXPANDED)
        expansion = validate_layer(base, variants, expanded_provenance, require_full_parent_coverage=True)
    except Exception as e:
        raise SystemExit(f"FAIL strict provenance/expanded release gate: {e}")

    records = load_records(DATA)
    expected_total = expansion["composed_total"]
    if len(records) != expected_total:
        raise SystemExit(f"FAIL composed app count {len(records)} != {expected_total}")
    if records != base + variants:
        raise SystemExit("FAIL app-records.json is not exact BASE + verified expanded layer composition")

    originals = [r for r in records if not r["source"]["is_generated_variant"]]
    generated = [r for r in records if r["source"]["is_generated_variant"]]
    expanded_count = len(variants)
    baseline_variants = expansion["baseline_verified_variants"]
    if len(originals) != 1124 or expanded_count < 1124 or expansion["expanded_parent_coverage"] != 1124:
        raise SystemExit("FAIL dynamic expansion completion gate")

    title_records = sum(1 for r in records if isinstance(r.get("title"), str))
    choices_field_records = sum(1 for r in records if "choices" in r)
    choice_records = sum(1 for r in records if isinstance(r.get("choices"), list) and r["choices"])
    if title_records != len(records) or choices_field_records != len(records):
        raise SystemExit("FAIL release title/choices preservation gate")

    try:
        figure_assets, external_figure_refs = collect_figure_assets(records)
    except Exception as e:
        raise SystemExit(f"FAIL figure asset release gate: {e}")

    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir(parents=True)
    payload = {
        "index.html": INDEX,
        "render_figure_markers.js": FIGURE_RENDERER,
        "app-records.json": DATA,
        "base-app-records.json": BASE_DATA,
        "verified-expanded-variants.json": EXPANDED,
        "canonical-provenance.json": PROVENANCE,
        "MATHBANK_FINAL_AUDIT_V2.json": AUDIT,
    }
    for name, src in payload.items():
        shutil.copy2(src, OUT / name)
    for src in figure_assets:
        rel = src.relative_to(ROOT)
        dest = OUT / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dest)

    payload_files = [OUT / name for name in payload] + [OUT / src.relative_to(ROOT) for src in figure_assets]
    manifest = {
        "release_gate": RELEASE_GATE,
        "records": len(records),
        "original": len(originals),
        "baseline_variants": baseline_variants,
        "expanded_variants": expanded_count,
        "variants": len(generated),
        "expanded_parent_coverage": expansion["expanded_parent_coverage"],
        "expanded_parent_target": expansion["expanded_parent_target"],
        "full_parent_coverage_required": True,
        "title_records": title_records,
        "choices_field_records": choices_field_records,
        "choice_records": choice_records,
        "canonical_provenance_required": True,
        "expanded_provenance_required": True,
        "canonical_final_audit_required": True,
        "inline_figure_marker_renderer_required": True,
        "inline_figure_marker_renderer_sha256": sha256(FIGURE_RENDERER),
        "canonical_final_audit_sha256": sha256(AUDIT),
        "canonical_provenance_status": provenance_result["status"],
        "canonical_zip_sha256": provenance_result["canonical_zip_sha256"],
        "canonical_member": provenance_result["canonical_member"],
        "canonical_member_sha256": provenance_result["canonical_member_sha256"],
        "base_app_records_sha256": sha256(BASE_DATA),
        "expanded_layer_sha256": sha256(EXPANDED),
        "app_records_sha256": sha256(DATA),
        "local_figure_assets": len(figure_assets),
        "external_figure_refs": external_figure_refs,
        "files": {p.relative_to(OUT).as_posix(): sha256(p) for p in sorted(payload_files, key=lambda x: x.relative_to(OUT).as_posix())},
    }
    manifest_path = OUT / "release-manifest.json"
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    zip_path = ROOT.parent / "みかみ塾数学問題アプリ_公開候補.zip"
    zip_path.unlink(missing_ok=True)
    with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        for p in sorted((p for p in OUT.rglob("*") if p.is_file()), key=lambda x: x.relative_to(OUT).as_posix()):
            zf.write(p, arcname=p.relative_to(OUT).as_posix())

    print("PASS_DYNAMIC_EXPANDED_RELEASE_BUNDLE")
    print(f"records={len(records)} originals={len(originals)} baseline_variants={baseline_variants} expanded_variants={expanded_count}")
    print(f"expanded_parent_coverage={expansion['expanded_parent_coverage']}/{expansion['expanded_parent_target']}")
    print(f"bundle={zip_path}")
    print(f"bundle_sha256={sha256(zip_path)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
