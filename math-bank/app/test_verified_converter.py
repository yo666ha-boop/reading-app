from __future__ import annotations

import json
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CONVERTER = ROOT / "convert_verified_canonical_to_app.py"
VALIDATOR = ROOT / "validate_app_records.py"


def run(*args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run([sys.executable, *args], text=True, capture_output=True)


def canonical_row(rid: str, i: int) -> dict:
    choices = ["選択肢A", "選択肢B", "選択肢C"] if i % 10 == 0 else None
    return {
        "id": rid,
        "stage": "中1" if i <= 411 else ("中2" if i <= 821 else "中3"),
        "unit": "変換テスト単元",
        "title": f"変換テスト {i}",
        "q": f"テスト専用問題 {i}",
        "choices": choices,
        "ans": "選択肢B" if choices else str(i),
        "explanation": f"テスト専用解説 {i}",
    }


def metadata_row(rid: str, i: int, book: str, original_no: str | None, variant: bool, parent_id: str | None) -> dict:
    return {
        "id": rid,
        "grade": 1 if i <= 411 else (2 if i <= 821 else 3),
        "unit": {"major": "テスト", "minor": "変換", "tags": ["converter-test"]},
        "skill": "検証",
        "question_format": "選択" if i % 10 == 0 else "記述",
        "difficulty": "standard",
        "source": {
            "book": book,
            "document": "TEST_ONLY_NOT_CANONICAL",
            "original_no": original_no,
            "is_generated_variant": variant,
            "parent_id": parent_id,
        },
        "figure_refs": [],
        "variant_group": parent_id if variant else None,
        "prerequisites": [],
        "audit": {
            "problem_answer_verified": True,
            "structure_verified": True,
            "figure_refs_verified": True,
            "notes": ["synthetic regression fixture only"],
        },
    }


def build_fixture() -> tuple[list[dict], list[dict]]:
    canonical: list[dict] = []
    metadata: list[dict] = []
    original_ids: list[str] = []
    i = 0
    for book, count in (("Winpass", 570), ("実力錬成", 237), ("Standard", 317)):
        for n in range(1, count + 1):
            i += 1
            rid = f"TEST-ORIG-{i:04d}"
            original_ids.append(rid)
            canonical.append(canonical_row(rid, i))
            metadata.append(metadata_row(rid, i, book, str(n), False, None))
    for n in range(1, 108):
        i += 1
        rid = f"TEST-VAR-{n:03d}"
        parent_id = original_ids[n - 1]
        canonical.append(canonical_row(rid, i))
        metadata.append(metadata_row(rid, i, "generated", None, True, parent_id))
    assert i == 1231
    return canonical, metadata


with tempfile.TemporaryDirectory() as td_raw:
    td = Path(td_raw)
    canonical, metadata = build_fixture()
    canonical_path = td / "canonical.json"
    metadata_path = td / "verified_metadata.json"
    output_path = td / "app-records.json"
    canonical_path.write_text(json.dumps(canonical, ensure_ascii=False), encoding="utf-8")
    metadata_path.write_text(json.dumps(metadata, ensure_ascii=False), encoding="utf-8")

    p = run(str(CONVERTER), str(canonical_path), str(metadata_path), "--output", str(output_path))
    combined = p.stdout + p.stderr
    if p.returncode != 0 or "PASS_VERIFIED_DETERMINISTIC_MAPPING" not in combined or not output_path.is_file():
        raise SystemExit(f"FAIL converter positive case rc={p.returncode}\n{p.stdout}\n{p.stderr}")

    p2 = run(str(VALIDATOR), str(output_path))
    if p2.returncode != 0 or '"status": "PASS"' not in p2.stdout:
        raise SystemExit(f"FAIL converted strict validator rc={p2.returncode}\n{p2.stdout}\n{p2.stderr}")

    app = json.loads(output_path.read_text(encoding="utf-8"))
    for src, dst in zip(canonical, app):
        expected = (src["id"], src["title"], src["q"], src["choices"], src["ans"], src["explanation"])
        actual = (dst["id"], dst["title"], dst["question"], dst["choices"], dst["answer"], dst["explanation"])
        if expected != actual:
            raise SystemExit(f"FAIL content preservation mismatch: {src['id']}")

    bad_metadata_path = td / "missing_metadata.json"
    bad_metadata_path.write_text(json.dumps(metadata[:-1], ensure_ascii=False), encoding="utf-8")
    blocked_out = td / "must_not_exist.json"
    p3 = run(str(CONVERTER), str(canonical_path), str(bad_metadata_path), "--output", str(blocked_out))
    if p3.returncode != 3 or "BLOCKED_NO_GUESS_MAPPING" not in (p3.stdout + p3.stderr) or blocked_out.exists():
        raise SystemExit(f"FAIL missing metadata gate rc={p3.returncode}\n{p3.stdout}\n{p3.stderr}")

print("PASS_VERIFIED_CONVERTER_TEST")
print("synthetic_fixture_only=1231")
print("strict_counts=1124_original+107_variant")
print("source_counts=570+237+317")
print("content_preserved=id,title,q,choices,ans,explanation")
print("missing_per_id_metadata=REJECTED")
