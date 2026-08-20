from __future__ import annotations

import copy
import json
import tempfile
from pathlib import Path

from validate_expanded_variant_layer import BASE_CANONICAL_SHA256, validate_layer


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
    variants = []
    for i in range(107):
        p = originals[i]
        variants.append(rec(f"B{i+1:04d}", "generated", generated=True, parent=p["id"], question=f"既存類題 {i+1} を計算しなさい。"))
    return originals + variants


def provenance(vid: str, pid: str) -> dict:
    return {
        "variant_id": vid,
        "parent_id": pid,
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
    good = rec("X0001", "generated", generated=True, parent=parent["id"], question="(-8)+13 を計算しなさい。")
    p = provenance(good["id"], parent["id"])

    report = validate_layer(base, [good], [p])
    assert report["expanded_verified_variants"] == 1
    assert report["expanded_parent_coverage"] == 1
    assert report["composed_total"] == 1232

    bad = copy.deepcopy(good); bad["id"] = "X0002"; bad["audit"]["problem_answer_verified"] = False
    expect_fail(lambda: validate_layer(base, [bad], [provenance("X0002", parent["id"])]), "unverified audit gate")

    bad = copy.deepcopy(good); bad["id"] = "X0003"; bad["source"]["parent_id"] = "NO-SUCH"; bad["variant_group"] = "NO-SUCH"
    expect_fail(lambda: validate_layer(base, [bad], [provenance("X0003", "NO-SUCH")]), "parent_id must point")

    bad = copy.deepcopy(good); bad["id"] = "X0004"; bad["unit"]["minor"] = "文字式"
    expect_fail(lambda: validate_layer(base, [bad], [provenance("X0004", parent["id"])]), "taxonomy differs")

    bad = copy.deepcopy(good); bad["id"] = "X0005"; bad["question"] = parent["question"]
    expect_fail(lambda: validate_layer(base, [bad], [provenance("X0005", parent["id"])]), "duplicates base data")

    badp = provenance(good["id"], parent["id"]); badp["independent_recalculation"] = False
    expect_fail(lambda: validate_layer(base, [good], [badp]), "independent_recalculation must be true")

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

    print("PASS_EXPANDED_VARIANT_LAYER_STRICT_PARENT_TAXONOMY_RECALC_DUPLICATE_GATES")


if __name__ == "__main__":
    main()
