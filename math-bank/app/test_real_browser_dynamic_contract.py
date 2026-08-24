from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parent
BROWSER = ROOT / "browser_real_regression.mjs"
PUBLISH = ROOT / "verify_publish_readiness.py"


def require(text: str, fragments: tuple[str, ...], label: str) -> None:
    missing = [f for f in fragments if f not in text]
    if missing:
        raise AssertionError(f"{label} missing dynamic contract fragments: {missing}")


def main() -> None:
    browser = BROWSER.read_text(encoding="utf-8")
    publish = PUBLISH.read_text(encoding="utf-8")

    require(
        browser,
        (
            "base-app-records.json",
            "baseTotal: 1231",
            "baselineVariant: 107",
            "minExpandedVariant: 1124",
            "expandedParentTarget: 1124",
            "runtime dataset does not preserve immutable BASE 1231 as exact ordered prefix",
            "expanded_parent_coverage",
            "expanded_parent_target",
            "testKindFilters",
            "original-variant-kind-filters",
            "search-samples-base-and-expanded",
            "variants_grouped_after_parent",
        ),
        "browser_real_regression.mjs",
    )
    for forbidden in (
        "total: 1231, original: 1124, variant: 107",
        "rows.length !== EXPECTED.total",
        "variants.length !== EXPECTED.variant",
        "候補 1231問",
        "既存類題 107問",
    ):
        if forbidden in browser:
            raise AssertionError(f"real browser frozen BASE-only contract returned: {forbidden}")

    require(
        publish,
        (
            "EXPECTED_BASE_RECORDS = 1231",
            '"base_records": EXPECTED_BASE_RECORDS',
            '"baseline_variants": EXPECTED_BASELINE_VARIANTS',
            '"expanded_variants": expanded',
            '"expanded_parent_coverage": EXPECTED_PARENT_COVERAGE',
            '"expanded_parent_target": EXPECTED_PARENT_COVERAGE',
            'coverage.get("base_dataset_sha256") != base_sha',
            'r.get("kinds")',
            '"real_browser_dynamic_base_prefix": True',
            '"real_browser_original_variant_filters": True',
        ),
        "verify_publish_readiness.py",
    )

    print("PASS_REAL_BROWSER_DYNAMIC_EXPANDED_CONTRACT")
    print("base=1231 originals=1124 baseline_variants=107 expanded>=1124 parent_coverage=1124")


if __name__ == "__main__":
    main()
