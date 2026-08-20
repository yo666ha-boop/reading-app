from __future__ import annotations

import argparse
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path

from validate_app_records import load_records
from validate_expanded_variant_layer import load_layer, validate_layer


def sha256_path(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def atomic_json(path: Path, obj: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(path.suffix + ".tmp")
    tmp.write_text(json.dumps(obj, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    tmp.replace(path)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("base")
    ap.add_argument("expanded")
    ap.add_argument("output")
    ap.add_argument("--report", default="math-bank/state/variant-expansion-latest.json")
    ap.add_argument("--base-snapshot", default="math-bank/app/base-app-records.json")
    ap.add_argument("--require-full-parent-coverage", action="store_true")
    ns = ap.parse_args()

    base_path = Path(ns.base)
    layer_path = Path(ns.expanded)
    out_path = Path(ns.output)
    snapshot_path = Path(ns.base_snapshot)
    base = load_records(base_path)
    variants, provenance, base_sha = load_layer(layer_path)
    validation = validate_layer(base, variants, provenance, require_full_parent_coverage=ns.require_full_parent_coverage)

    # Preserve the exact 1231-record canonical app conversion separately from the
    # dynamically composed app dataset. Canonical provenance is verified against
    # this immutable snapshot; expanded provenance is verified independently.
    atomic_json(snapshot_path, base)
    composed = base + variants
    atomic_json(out_path, composed)

    report = {
        "status": "PASS",
        "mode": "BASE_CANONICAL_PLUS_VERIFIED_EXPANDED_VARIANTS",
        "recorded_at_utc": datetime.now(timezone.utc).isoformat(),
        "base_file": str(base_path),
        "base_file_sha256": sha256_path(base_path),
        "base_snapshot_file": str(snapshot_path),
        "base_snapshot_sha256": sha256_path(snapshot_path),
        "base_canonical_zip_sha256_anchor": base_sha,
        "expanded_layer_file": str(layer_path),
        "expanded_layer_sha256": sha256_path(layer_path),
        "output_file": str(out_path),
        "output_sha256": sha256_path(out_path),
        "base_records": validation["base_records"],
        "base_originals": validation["base_originals"],
        "baseline_verified_variants": validation["baseline_verified_variants"],
        "expanded_verified_variants": validation["expanded_verified_variants"],
        "final_total": validation["composed_total"],
        "expanded_parent_coverage": validation["expanded_parent_coverage"],
        "expanded_parent_target": validation["expanded_parent_target"],
        "expanded_parent_coverage_percent": validation["expanded_parent_coverage_percent"],
        "uncovered_parent_count": validation["uncovered_parent_count"],
        "uncovered_parent_ids": validation["uncovered_parent_ids"],
        "require_full_parent_coverage": ns.require_full_parent_coverage,
        "publication_expansion_ready": bool(validation["uncovered_parent_count"] == 0 and validation["expanded_verified_variants"] >= 1124),
        "policy": "Canonical BASE is preserved separately. Only independently recalculated, audited, parent-linked expanded variants are appended to the runtime dataset.",
    }
    report_path = Path(ns.report)
    atomic_json(report_path, report)
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as e:
        print(f"FAIL: {e}")
        raise SystemExit(1)
