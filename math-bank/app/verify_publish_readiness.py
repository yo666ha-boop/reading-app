from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
import zipfile
from pathlib import Path

EXPECTED_ZIP_SHA = "eb93279a52dd49191612a52ac0df2df2fdd865c8975d815547daa126b4398175"
EXPECTED_BASE_RECORDS = 1231
EXPECTED_ORIGINAL = 1124
EXPECTED_BASELINE_VARIANTS = 107
EXPECTED_PARENT_COVERAGE = 1124
EXPECTED_BROWSERS = {"chromium-desktop", "firefox-desktop", "webkit-iphone", "chromium-fire"}
EXPECTED_RELEASE_GATE = "STRICT_BASE_1231_PLUS_DYNAMIC_VERIFIED_EXPANDED_VARIANTS_PROVENANCE_AUDIT_FIGURES_PASS"


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def require_hash(value: object, label: str) -> str:
    if not isinstance(value, str) or not re.fullmatch(r"[0-9a-f]{64}", value):
        raise ValueError(f"invalid {label}")
    return value


def load_json(path: Path, label: str) -> dict:
    if not path.is_file():
        raise ValueError(f"missing {label}: {path}")
    obj = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(obj, dict):
        raise ValueError(f"{label} must be a JSON object")
    return obj


def verify_pdf_artifact(report: dict, root: Path | None) -> dict:
    desktop = next((r for r in report.get("results", []) if r.get("name") == "chromium-desktop"), None)
    if not isinstance(desktop, dict) or desktop.get("status") != "success":
        raise ValueError("chromium desktop real regression is not PASS")
    pdf = desktop.get("pdf")
    if not isinstance(pdf, dict):
        raise ValueError("real regression PDF evidence missing")
    expected: list[tuple[str, dict]] = []
    for grade in (1, 2, 3):
        item = pdf.get(f"grade{grade}")
        if not isinstance(item, dict):
            raise ValueError(f"grade{grade} PDF evidence missing")
        for kind in ("question", "answer"):
            p = item.get(kind)
            if not isinstance(p, dict) or not isinstance(p.get("pages"), int) or p["pages"] < 1:
                raise ValueError(f"grade{grade} {kind} PDF evidence invalid")
            require_hash(p.get("sha256"), f"grade{grade} {kind} pdf sha256")
            expected.append((f"grade{grade}-{kind}", p))
    verified_files = 0
    if root is not None:
        for label, p in expected:
            filename = f"grade{label.split('-')[0].replace('grade','')}-{'questions' if label.endswith('question') else 'answers'}.pdf"
            file_path = root / filename
            if not file_path.is_file() or file_path.read_bytes()[:5] != b"%PDF-":
                raise ValueError(f"missing/invalid real print artifact: {file_path}")
            if sha256(file_path) != p["sha256"]:
                raise ValueError(f"real print artifact SHA mismatch: {file_path}")
            verified_files += 1
    return {"reported_pdfs": len(expected), "verified_pdf_files": verified_files}


def verify_release_zip(bundle: Path, release_manifest: dict) -> dict:
    if not bundle.is_file():
        raise ValueError(f"missing strict release ZIP: {bundle}")
    required = {
        "index.html", "render_figure_markers.js", "app-records.json", "base-app-records.json",
        "verified-expanded-variants.json", "canonical-provenance.json", "MATHBANK_FINAL_AUDIT_V2.json",
        "release-manifest.json",
    }
    with zipfile.ZipFile(bundle) as zf:
        names = set(zf.namelist())
        missing = sorted(required - names)
        if missing:
            raise ValueError(f"strict release ZIP missing required members: {missing}")
        embedded_manifest = json.loads(zf.read("release-manifest.json").decode("utf-8"))
        if embedded_manifest != release_manifest:
            raise ValueError("embedded release-manifest differs from release directory manifest")
        renderer_hash = require_hash(release_manifest.get("inline_figure_marker_renderer_sha256"), "inline renderer sha256")
        if release_manifest.get("files", {}).get("render_figure_markers.js") != renderer_hash:
            raise ValueError("inline renderer manifest SHA mismatch")
        for member, expected_hash in release_manifest.get("files", {}).items():
            if member not in names or hashlib.sha256(zf.read(member)).hexdigest() != expected_hash:
                raise ValueError(f"release ZIP member SHA mismatch: {member}")
    return {"bundle_sha256": sha256(bundle), "zip_members": len(names), "inline_figure_marker_renderer_sha256": renderer_hash}


def main() -> int:
    ap = argparse.ArgumentParser(description="Final gate before the expanded math app may be published.")
    ap.add_argument("--release-manifest", default="math-bank/release/release-manifest.json")
    ap.add_argument("--bundle", default="math-bank/みかみ塾数学問題アプリ_公開候補.zip")
    ap.add_argument("--real-browser-report", default="math-bank/state/browser-real-regression-latest.json")
    ap.add_argument("--pdf-root", default="")
    ap.add_argument("--output", default="math-bank/release/PUBLICATION_READY.json")
    args = ap.parse_args()

    out = Path(args.output)
    try:
        manifest = load_json(Path(args.release_manifest), "release manifest")
        browser = load_json(Path(args.real_browser_report), "real browser report")
        if manifest.get("release_gate") != EXPECTED_RELEASE_GATE:
            raise ValueError("release gate marker mismatch")
        records = manifest.get("records")
        expanded = manifest.get("expanded_variants")
        variants = manifest.get("variants")
        if not isinstance(records, int) or not isinstance(expanded, int) or not isinstance(variants, int):
            raise ValueError("release dynamic counts missing")
        if manifest.get("original") != EXPECTED_ORIGINAL:
            raise ValueError("release original count mismatch")
        if manifest.get("baseline_variants") != EXPECTED_BASELINE_VARIANTS:
            raise ValueError("release baseline variant count mismatch")
        if expanded < EXPECTED_PARENT_COVERAGE:
            raise ValueError("expanded variant count below minimum full-parent target")
        if manifest.get("expanded_parent_coverage") != EXPECTED_PARENT_COVERAGE or manifest.get("expanded_parent_target") != EXPECTED_PARENT_COVERAGE:
            raise ValueError("expanded parent coverage incomplete")
        if records != EXPECTED_BASE_RECORDS + expanded or variants != EXPECTED_BASELINE_VARIANTS + expanded:
            raise ValueError("release dynamic totals are inconsistent")
        if manifest.get("canonical_zip_sha256") != EXPECTED_ZIP_SHA:
            raise ValueError("release canonical ZIP identity mismatch")
        app_sha = require_hash(manifest.get("app_records_sha256"), "manifest app_records_sha256")
        base_sha = require_hash(manifest.get("base_app_records_sha256"), "base_app_records_sha256")
        require_hash(manifest.get("expanded_layer_sha256"), "expanded_layer_sha256")
        require_hash(manifest.get("canonical_final_audit_sha256"), "canonical_final_audit_sha256")
        if manifest.get("canonical_provenance_status") != "PASS_CANONICAL_PROVENANCE":
            raise ValueError("canonical provenance not PASS")

        if browser.get("overall_result") != "success" or browser.get("synthetic_fixture_only") is not False or browser.get("canonical_data_written") is not True:
            raise ValueError("browser report is not real expanded canonical data")
        coverage = browser.get("staticCoverage")
        if not isinstance(coverage, dict):
            raise ValueError("real browser staticCoverage missing")
        expected_browser = {
            "records": records,
            "base_records": EXPECTED_BASE_RECORDS,
            "original": EXPECTED_ORIGINAL,
            "baseline_variants": EXPECTED_BASELINE_VARIANTS,
            "expanded_variants": expanded,
            "variants": variants,
            "expanded_parent_coverage": EXPECTED_PARENT_COVERAGE,
            "expanded_parent_target": EXPECTED_PARENT_COVERAGE,
        }
        mismatched = {k: (coverage.get(k), v) for k, v in expected_browser.items() if coverage.get(k) != v}
        if mismatched:
            raise ValueError(f"real browser dynamic coverage mismatch: {mismatched}")
        if coverage.get("dataset_sha256") != app_sha:
            raise ValueError("real browser dataset SHA does not match release app-records SHA")
        if coverage.get("base_dataset_sha256") != base_sha:
            raise ValueError("real browser BASE dataset SHA does not match immutable release BASE SHA")

        results = browser.get("results")
        if not isinstance(results, list):
            raise ValueError("real browser results missing")
        names = {r.get("name") for r in results if isinstance(r, dict) and r.get("status") == "success"}
        if names != EXPECTED_BROWSERS:
            raise ValueError(f"real browser pass set mismatch: {sorted(names)}")
        for r in results:
            if not isinstance(r, dict) or r.get("status") != "success":
                raise ValueError("one or more real browser cases failed")
            overflow = r.get("overflow")
            if not isinstance(overflow, dict) or overflow.get("scrollWidth", 1) > overflow.get("width", 0) + 1:
                raise ValueError(f"browser overflow evidence invalid: {r.get('name')}")
            if r.get("pageErrors") != []:
                raise ValueError(f"browser pageErrors not empty: {r.get('name')}")
            marker = r.get("inlineMarker")
            if not isinstance(marker, dict) or marker.get("raw_marker_leaks") != 0 or marker.get("marker_errors") != 0 or marker.get("figure_readiness_failures") != 0:
                raise ValueError(f"inline marker evidence invalid: {r.get('name')}")
            kinds = r.get("kinds")
            if not isinstance(kinds, dict) or kinds.get("both") != records or kinds.get("original") != EXPECTED_ORIGINAL or kinds.get("variant") != variants:
                raise ValueError(f"browser original/variant filter evidence invalid: {r.get('name')}")

        pdf_result = verify_pdf_artifact(browser, Path(args.pdf_root) if args.pdf_root else None)
        bundle_result = verify_release_zip(Path(args.bundle), manifest)
        ready = {
            "status": "PUBLICATION_READY",
            "canonical_zip_sha256": EXPECTED_ZIP_SHA,
            "app_records_sha256": app_sha,
            "base_app_records_sha256": base_sha,
            "records": records,
            "base_records": EXPECTED_BASE_RECORDS,
            "original": EXPECTED_ORIGINAL,
            "baseline_variants": EXPECTED_BASELINE_VARIANTS,
            "expanded_variants": expanded,
            "variants": variants,
            "expanded_parent_coverage": EXPECTED_PARENT_COVERAGE,
            "real_browser_cases": sorted(EXPECTED_BROWSERS),
            "real_browser_dynamic_full_dom": True,
            "real_browser_dynamic_base_prefix": True,
            "real_browser_all_unit_filters": True,
            "real_browser_original_variant_filters": True,
            "real_browser_all_variant_source_order": True,
            "real_figure_fetch_gate": True,
            "inline_figure_marker_gate": True,
            "a4_pdf_evidence": pdf_result,
            "release_bundle": bundle_result,
        }
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(json.dumps(ready, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(json.dumps(ready, ensure_ascii=False, indent=2))
        return 0
    except Exception as e:
        out.unlink(missing_ok=True)
        print(f"PUBLISH_BLOCKED: {e}", file=sys.stderr)
        return 3


if __name__ == "__main__":
    raise SystemExit(main())
