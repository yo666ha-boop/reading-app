from __future__ import annotations

"""Unified fail-closed driver for all proven safe math variant engines.

This driver only operates on actual BASE records loaded from disk.  It never
constructs a parent record and never promotes a candidate unless the repository
strict expanded-layer validator accepts the resulting full layer.
"""

import argparse
import json
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path

from generate_safe_verified_variants import (
    generate_parent as generate_legacy_exact,
    make_variant_base,
    variant_id,
)
from safe_affine_variant_engine import generate as generate_affine
from safe_average_variant_engine import generate as generate_average
from safe_percentage_variant_engine import generate as generate_percentage
from safe_proportion_variant_engine import generate as generate_proportion
from safe_single_draw_probability_variant_engine import generate as generate_probability
from validate_app_records import load_records
from validate_expanded_variant_layer import (
    BASE_CANONICAL_SHA256,
    base_gate,
    load_layer,
    numeric_tokens,
    parent_record_sha256,
    validate_layer,
)


SPECIALIZED_ENGINES = (
    ("affine", generate_affine),
    ("single_draw_probability", generate_probability),
    ("proportion", generate_proportion),
    ("percentage", generate_percentage),
    ("simple_average", generate_average),
)


def _verification_evidence(engine_name: str, evidence: dict) -> str:
    return f"engine={engine_name}; " + json.dumps(evidence, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def _adapt_specialized(parent: dict, count: int, now: str) -> tuple[list[dict], list[dict], str]:
    reasons: list[str] = []
    for engine_name, engine in SPECIALIZED_ENGINES:
        rows, evidence_rows, reason = engine(parent, count)
        if not rows:
            reasons.append(f"{engine_name}:{reason}")
            continue
        if len(rows) != count or len(evidence_rows) != count:
            raise AssertionError(f"{engine_name} returned incomplete sibling set")

        parent_sig = tuple(numeric_tokens(str(parent.get("question") or "")))
        sibling_sigs: set[tuple[str, ...]] = set()
        variants: list[dict] = []
        provenance: list[dict] = []
        for index, (row, evidence) in enumerate(zip(rows, evidence_rows), start=1):
            question = str(row.get("question") or "")
            answer = row.get("answer")
            if not question or answer in (None, ""):
                raise AssertionError(f"{engine_name} returned blank question/answer")
            sig = tuple(numeric_tokens(question))
            if sig == parent_sig or sig in sibling_sigs:
                raise AssertionError(f"{engine_name} numeric surface collision")
            sibling_sigs.add(sig)

            method = f"specialized-{engine_name}-{reason}"
            vid = variant_id(parent, method, index)
            full = make_variant_base(parent, vid)
            full["question"] = question
            full["answer"] = answer
            full["explanation"] = str(row.get("explanation") or "")
            variants.append(full)
            provenance.append({
                "variant_id": vid,
                "parent_id": parent["id"],
                "parent_record_sha256": parent_record_sha256(parent),
                "generator": "generate_all_safe_verified_variants.py",
                "generation_method": method,
                "verification_method": "specialized fail-closed exact parent recalculation plus independent engine identity check",
                "verified_at": now,
                "independent_recalculation": True,
                "verification_evidence": _verification_evidence(engine_name, evidence),
            })
        return variants, provenance, f"specialized:{engine_name}:{reason}"

    legacy_variants, legacy_prov, legacy_reason = generate_legacy_exact(parent, count, now)
    if legacy_variants:
        # Rewrite generator attribution so the final evidence identifies the
        # actual unified execution path while preserving all exact proof text.
        for p in legacy_prov:
            p["generator"] = "generate_all_safe_verified_variants.py"
            p["generation_method"] = "legacy_exact_adapter:" + str(p.get("generation_method") or legacy_reason)
        return legacy_variants, legacy_prov, f"legacy:{legacy_reason}"

    reasons.append(f"legacy:{legacy_reason}")
    return [], [], "unsupported_all_safe_engines:" + "|".join(reasons)


def generate_parent(parent: dict, count: int, now: str) -> tuple[list[dict], list[dict], str]:
    if count not in (1, 2, 3):
        raise ValueError("count must be 1, 2, or 3")
    return _adapt_specialized(parent, count, now)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("base")
    ap.add_argument("expanded")
    ap.add_argument("output")
    ap.add_argument("--target-per-parent", type=int, default=1, choices=(1, 2, 3))
    ap.add_argument("--report")
    ns = ap.parse_args()

    base = load_records(Path(ns.base))
    _, originals, _ = base_gate(base)
    variants, provenance_rows, _ = load_layer(Path(ns.expanded))
    validate_layer(base, variants, provenance_rows, require_full_parent_coverage=False)

    counts = defaultdict(int)
    for row in variants:
        counts[row["source"]["parent_id"]] += 1

    now = datetime.now(timezone.utc).isoformat()
    generated: list[dict] = []
    generated_provenance: list[dict] = []
    reasons = Counter()
    for parent in originals:
        need = max(0, ns.target_per_parent - counts[parent["id"]])
        if need == 0:
            reasons["already_at_target"] += 1
            continue
        new_rows, new_prov, reason = generate_parent(parent, need, now)
        reasons[reason] += 1
        generated.extend(new_rows)
        generated_provenance.extend(new_prov)

    out_layer = {
        "schema_version": "1.0",
        "base_canonical_sha256": BASE_CANONICAL_SHA256,
        "variants": variants + generated,
        "provenance": provenance_rows + generated_provenance,
    }
    final_report = validate_layer(
        base,
        out_layer["variants"],
        out_layer["provenance"],
        require_full_parent_coverage=False,
    )

    Path(ns.output).write_text(json.dumps(out_layer, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    report = {
        "status": "PASS",
        "recorded_at_utc": now,
        "policy": "Actual BASE parents only. Specialized exact engines first, exact arithmetic/linear fallback second, unsupported structures remain manual. Strict expanded validator is the promotion gate.",
        "base_originals": len(originals),
        "existing_expanded_variants": len(variants),
        "newly_generated_verified_variants": len(generated),
        "expanded_total": len(out_layer["variants"]),
        "expanded_parent_coverage": final_report["expanded_parent_coverage"],
        "target_per_parent": ns.target_per_parent,
        "generation_reason_counts": dict(sorted(reasons.items())),
    }
    if ns.report:
        Path(ns.report).write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"FAIL: {exc}")
        raise SystemExit(1)
