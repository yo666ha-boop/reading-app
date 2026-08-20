from __future__ import annotations

import copy
import json
import tempfile
from pathlib import Path

from validate_expanded_variant_layer import BASE_CANONICAL_SHA256, parent_record_sha256, validate_layer


def rec(rid: str, book: str, *, generated: bool = False, parent: str | None = None, question: str | None = None) -> dict:
    return {
        "id": rid,
        "grade": 1,
        "unit": {"major": "数と式", "minor": "正負の数", "tags": []},
        "title": "正負の数",
        "skill": "計算",
        "question_format": "短答",
        "difficulty": "basic",
        "source": {
            "book": "generated" if generated else book,
            "document": "fixture",
            "original_no": None if generated else rid,
            "is_generated_variant": generated,
            "parent_id": parent,
        },
        "question": question or f"{rid} の計算をしなさい。",
        "choices": None,
        "answer": "1",
        "explanation": "検算済み。",
        "figure_refs": [],
        "variant_group": parent if generated else None,
        "audit": {
            "problem_answer_verified": True,
            "structure_verified": True,
            "figure_refs_verified": True,
            "notes": [],
        },
    }


def make_base() -> list[dict]:
    originals = []
    seq = 0
    for book, count in (("Winpass", 570), ("実力錬成", 237), ("Standard", 317)):
        for _ in range(count):
            seq += 1
            originals.append(rec(f"O{seq:04d}", book))
    originals[0]["question"] = "(-8)+13 を計算しなさい。"
    originals[0]["answer"] = "5"
    variants = []
    for i in range(107):
        p = originals[i]
        variants.append(rec(f"B{i+1:04d}", "generated", generated=True, parent=p["id"], question=f"既存類題 {i+1} を計算しなさい。"))
    return originals + variants


def provenance(vid: str, parent: dict) -> dict:
    return {
        "variant_id": vid,
        "parent_id": parent["id"],
        "parent_record_sha256": parent_record_sha256(parent),
        "generator": "fixture",
        "generation_method": "parent-preserving deterministic substitution",
        "verification_method": "independent recalculation",
        "verified_at": "2026-08-20T00:00:00Z",
        "independent_recalculation": True,
        "verification_evidence": "fixture independent answer check PASS",
    }


def expect_fail(fn, needle: str) -> None:
    try:
        fn()
    except Exception as e:
        if needle not in str(e):
            raise AssertionError(f"expected {needle!r}, got {e!r}")
        return
    raise AssertionError(f"expected failure containing {needle!r}")


def main() -> None:
    base = make_base()
    parent = base[0]
    good = rec("X0001", "generated", generated=True, parent=parent["id"], question="(-7)+15 を計算しなさい。")
    good["answer"] = "8"
    p = provenance(good["id"], parent)

    report = validate_layer(base, [good], [p])
    assert report["expanded_verified_variants"] == 1
    assert report["expanded_parent_coverage"] == 1
    assert report["composed_total"] == 1232
    assert report["wording_only_pseudo_variants"] == 0
    assert report["parent_fingerprint_mismatches"] == 0

    bad = copy.deepcopy(good); bad["id"] = "X0002"; bad["audit"]["problem_answer_verified"] = False
    expect_fail(lambda: validate_layer(base, [bad], [provenance("X0002", parent)]), "unverified audit gate")

    bad = copy.deepcopy(good); bad["id"] = "X0003"; bad["source"]["parent_id"] = "NO-SUCH"; bad["variant_group"] = "NO-SUCH"
    badp = provenance("X0003", parent); badp["parent_id"] = "NO-SUCH"
    expect_fail(lambda: validate_layer(base, [bad], [badp]), "parent_id must point")

    bad = copy.deepcopy(good); bad["id"] = "X0004"; bad["unit"]["minor"] = "文字式"
    expect_fail(lambda: validate_layer(base, [bad], [provenance("X0004", parent)]), "taxonomy differs")

    bad = copy.deepcopy(good); bad["id"] = "X0005"; bad["question"] = parent["question"]
    expect_fail(lambda: validate_layer(base, [bad], [provenance("X0005", parent)]), "duplicates base data")

    pseudo = copy.deepcopy(good)
    pseudo["id"] = "X0006"
    pseudo["question"] = "計算して答えなさい：(-8)+13"
    pseudo["answer"] = "5"
    expect_fail(
        lambda: validate_layer(base, [pseudo], [provenance("X0006", parent)]),
        "wording-only pseudo variant",
    )

    badp = provenance(good["id"], parent); badp["independent_recalculation"] = False
    expect_fail(lambda: validate_layer(base, [good], [badp]), "independent_recalculation must be true")

    stale_parent = copy.deepcopy(parent)
    stale_parent["question"] = "(-9)+13 を計算しなさい。"
    badp = provenance(good["id"], stale_parent)
    badp["parent_id"] = parent["id"]
    expect_fail(lambda: validate_layer(base, [good], [badp]), "parent_record_sha256 mismatch")

    missingp = provenance(good["id"], parent); missingp.pop("parent_record_sha256")
    expect_fail(lambda: validate_layer(base, [good], [missingp]), "missing ['parent_record_sha256']")

    expect_fail(lambda: validate_layer(base, [good], [p], require_full_parent_coverage=True), "coverage incomplete")

    with tempfile.TemporaryDirectory() as td:
        layer = {
            "schema_version": "1.0",
            "base_canonical_sha256": BASE_CANONICAL_SHA256,
            "variants": [good],
            "provenance": [p],
        }
        path = Path(td) / "layer.json"
        path.write_text(json.dumps(layer, ensure_ascii=False), encoding="utf-8")
        assert json.loads(path.read_text(encoding="utf-8"))["variants"][0]["id"] == "X0001"

    print("PASS_EXPANDED_VARIANT_LAYER_STRICT_PARENT_TAXONOMY_RECALC_DUPLICATE_SURFACE_CHANGE_GATES")
    print("PASS_EXPANDED_VARIANT_PARENT_RECORD_SHA256_BINDING_GATE")


if __name__ == "__main__":
    main()
