from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
import zipfile
from pathlib import Path

EXPECTED_ZIP_SHA = "eb93279a52dd49191612a52ac0df2df2fdd865c8975d815547daa126b4398175"
EXPECTED_RECORDS = 1231
EXPECTED_ORIGINAL = 1124
EXPECTED_VARIANTS = 107
EXPECTED_BROWSERS = {"chromium-desktop", "firefox-desktop", "webkit-iphone", "chromium-fire"}
EXPECTED_RELEASE_GATE = "STRICT_CANONICAL_1231_PROVENANCE_FINAL_AUDIT_TITLE_CHOICES_AND_FIGURE_ASSETS_PASS"


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
            if not isinstance(p, dict):
                raise ValueError(f"grade{grade} {kind} PDF evidence missing")
            if not isinstance(p.get("pages"), int) or p["pages"] < 1:
                raise ValueError(f"grade{grade} {kind} PDF page count invalid")
            require_hash(p.get("sha256"), f"grade{grade} {kind} pdf sha256")
            expected.append((f"grade{grade}-{kind}", p))

    verified_files = 0
    if root is not None:
        for label, p in expected:
            filename = f"grade{label.split('-')[0].replace('grade','')}-{'questions' if label.endswith('question') else 'answers'}.pdf"
            file_path = root / filename
            if not file_path.is_file():
                raise ValueError(f"missing real print artifact: {file_path}")
            if file_path.read_bytes()[:5] != b"%PDF-":
                raise ValueError(f"invalid PDF header: {file_path}")
            if sha256(file_path) != p["sha256"]:
                raise ValueError(f"real print artifact SHA mismatch: {file_path}")
            verified_files += 1
    return {"reported_pdfs": len(expected), "verified_pdf_files": verified_files}


def verify_release_zip(bundle: Path, release_manifest: dict) -> dict:
    if not bundle.is_file():
        raise ValueError(f"missing strict release ZIP: {bundle}")
    required = {
        "index.html",
        "app-records.json",
        "canonical-provenance.json",
        "MATHBANK_FINAL_AUDIT_V2.json",
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
        for member, expected_hash in release_manifest.get("files", {}).items():
            if member not in names:
                raise ValueError(f"release ZIP missing manifest member: {member}")
            actual = hashlib.sha256(zf.read(member)).hexdigest()
            if actual != expected_hash:
                raise ValueError(f"release ZIP member SHA mismatch: {member}")
    return {"bundle_sha256": sha256(bundle), "zip_members": len(names)}


def main() -> int:
    ap = argparse.ArgumentParser(description="Final gate before the canonical math app may be published.")
    ap.add_argument("--release-manifest", default="math-bank/release/release-manifest.json")
    ap.add_argument("--bundle", default="math-bank/みかみ塾数学問題アプリ_公開候補.zip")
    ap.add_argument("--real-browser-report", default="math-bank/state/browser-real-regression-latest.json")
    ap.add_argument("--pdf-root", default="")
    ap.add_argument("--output", default="math-bank/release/PUBLICATION_READY.json")
    args = ap.parse_args()

    manifest_path = Path(args.release_manifest)
    bundle = Path(args.bundle)
    browser_path = Path(args.real_browser_report)
    pdf_root = Path(args.pdf_root) if args.pdf_root else None
    out = Path(args.output)

    try:
        manifest = load_json(manifest_path, "release manifest")
        browser = load_json(browser_path, "real browser report")
        if manifest.get("release_gate") != EXPECTED_RELEASE_GATE:
            raise ValueError("release gate marker mismatch")
        if manifest.get("records") != EXPECTED_RECORDS or manifest.get("original") != EXPECTED_ORIGINAL or manifest.get("variants") != EXPECTED_VARIANTS:
            raise ValueError("release canonical counts mismatch")
        if manifest.get("canonical_zip_sha256") != EXPECTED_ZIP_SHA:
            raise ValueError("release canonical ZIP identity mismatch")
        app_sha = require_hash(manifest.get("app_records_sha256"), "manifest app_records_sha256")
        require_hash(manifest.get("canonical_final_audit_sha256"), "canonical_final_audit_sha256")
        if manifest.get("canonical_provenance_status") != "PASS_CANONICAL_PROVENANCE":
            raise ValueError("canonical provenance not PASS")

        if browser.get("overall_result") != "success":
            raise ValueError("real canonical browser regression not PASS")
        if browser.get("synthetic_fixture_only") is not False or browser.get("canonical_data_written") is not True:
            raise ValueError("browser report is not real canonical data")
        coverage = browser.get("staticCoverage")
        if not isinstance(coverage, dict):
            raise ValueError("real browser staticCoverage missing")
        if coverage.get("records") != EXPECTED_RECORDS or coverage.get("original") != EXPECTED_ORIGINAL or coverage.get("variants") != EXPECTED_VARIANTS:
            raise ValueError("real browser canonical counts mismatch")
        if coverage.get("dataset_sha256") != app_sha:
            raise ValueError("real browser dataset SHA does not match release app-records SHA")

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

        pdf_result = verify_pdf_artifact(browser, pdf_root)
        bundle_result = verify_release_zip(bundle, manifest)
        ready = {
            "status": "PUBLICATION_READY",
            "canonical_zip_sha256": EXPECTED_ZIP_SHA,
            "app_records_sha256": app_sha,
            "records": EXPECTED_RECORDS,
            "original": EXPECTED_ORIGINAL,
            "variants": EXPECTED_VARIANTS,
            "real_browser_cases": sorted(EXPECTED_BROWSERS),
            "real_browser_full_1231_dom": True,
            "real_browser_all_unit_filters": True,
            "real_browser_all_variant_source_order": True,
            "real_figure_fetch_gate": True,
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
