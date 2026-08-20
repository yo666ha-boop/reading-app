from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path

from validate_app_records import main as validate_main

CONTENT_FIELDS = ("id", "title", "q", "choices", "ans", "explanation")
REQUIRED_META_FIELDS = (
    "grade", "unit", "skill", "question_format", "difficulty", "source",
    "figure_refs", "variant_group", "audit",
)
EXPECTED = 1231


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def load_records(path: Path) -> list[dict]:
    obj = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(obj, list):
        rows = obj
    elif isinstance(obj, dict) and isinstance(obj.get("records"), list):
        rows = obj["records"]
    else:
        raise ValueError("canonical input must be an array or object with records array")
    if len(rows) != EXPECTED:
        raise ValueError(f"canonical record count {len(rows)} != {EXPECTED}")
    return rows


def load_metadata(path: Path) -> dict[str, dict]:
    obj = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(obj, dict) and isinstance(obj.get("records"), list):
        rows = obj["records"]
    elif isinstance(obj, list):
        rows = obj
    else:
        raise ValueError("metadata must be an array or object with records array")
    result: dict[str, dict] = {}
    for row in rows:
        if not isinstance(row, dict) or not isinstance(row.get("id"), str) or not row["id"].strip():
            raise ValueError("metadata row without nonblank id")
        rid = row["id"].strip()
        if rid in result:
            raise ValueError(f"duplicate metadata id: {rid}")
        result[rid] = row
    return result


def validate_legacy_content(row: dict, seen: set[str]) -> str:
    if not isinstance(row, dict):
        raise ValueError("canonical row must be object")
    missing = [k for k in CONTENT_FIELDS if k not in row]
    if missing:
        raise ValueError(f"canonical row missing content fields: {missing}")
    rid = row["id"]
    if not isinstance(rid, str) or not rid.strip():
        raise ValueError("canonical row blank id")
    rid = rid.strip()
    if rid in seen:
        raise ValueError(f"duplicate canonical id: {rid}")
    seen.add(rid)
    if not isinstance(row["title"], str):
        raise ValueError(f"{rid}: title must be string")
    if not isinstance(row["q"], str) or not row["q"].strip():
        raise ValueError(f"{rid}: q must be nonblank string")
    if row["choices"] is not None:
        if not isinstance(row["choices"], list) or any(not isinstance(x, str) or not x.strip() for x in row["choices"]):
            raise ValueError(f"{rid}: choices must be null or list of nonblank strings")
    if not isinstance(row["ans"], str) or not row["ans"].strip():
        raise ValueError(f"{rid}: ans must be nonblank string")
    if not isinstance(row["explanation"], str):
        raise ValueError(f"{rid}: explanation must be string")
    return rid


def build_app_records(canonical: list[dict], metadata: dict[str, dict]) -> list[dict]:
    seen: set[str] = set()
    canonical_ids = [validate_legacy_content(row, seen) for row in canonical]
    canonical_id_set = set(canonical_ids)
    metadata_id_set = set(metadata)
    missing_meta = sorted(canonical_id_set - metadata_id_set)
    extra_meta = sorted(metadata_id_set - canonical_id_set)
    if missing_meta or extra_meta:
        raise ValueError(
            f"metadata id set mismatch: missing={len(missing_meta)} extra={len(extra_meta)} "
            f"missing_sample={missing_meta[:5]} extra_sample={extra_meta[:5]}"
        )

    out: list[dict] = []
    for row, rid in zip(canonical, canonical_ids):
        meta = metadata[rid]
        missing = [k for k in REQUIRED_META_FIELDS if k not in meta]
        if missing:
            raise ValueError(f"{rid}: verified metadata missing {missing}")
        app = {
            "id": rid,
            "grade": meta["grade"],
            "unit": meta["unit"],
            "title": row["title"],
            "skill": meta["skill"],
            "question_format": meta["question_format"],
            "difficulty": meta["difficulty"],
            "source": meta["source"],
            "question": row["q"],
            "choices": row["choices"],
            "answer": row["ans"],
            "explanation": row["explanation"],
            "figure_refs": meta["figure_refs"],
            "variant_group": meta["variant_group"],
            "audit": meta["audit"],
        }
        if "prerequisites" in meta:
            app["prerequisites"] = meta["prerequisites"]
        out.append(app)
    return out


def assert_content_preserved(canonical: list[dict], app: list[dict]) -> None:
    if len(canonical) != len(app):
        raise ValueError("content preservation length mismatch")
    for src, dst in zip(canonical, app):
        checks = {
            "id": (src["id"].strip(), dst["id"]),
            "title": (src["title"], dst["title"]),
            "q/question": (src["q"], dst["question"]),
            "choices": (src["choices"], dst["choices"]),
            "ans/answer": (src["ans"], dst["answer"]),
            "explanation": (src["explanation"], dst["explanation"]),
        }
        for label, (a, b) in checks.items():
            if a != b:
                raise ValueError(f"{dst.get('id')}: content changed during mapping: {label}")


def main() -> int:
    ap = argparse.ArgumentParser(
        description="Convert verified legacy canonical q/choices/ans records only when complete per-ID app metadata already exists. No defaults or inference."
    )
    ap.add_argument("canonical")
    ap.add_argument("verified_metadata")
    ap.add_argument("--output", required=True)
    args = ap.parse_args()

    canonical_path = Path(args.canonical)
    metadata_path = Path(args.verified_metadata)
    out = Path(args.output)
    if not canonical_path.is_file() or not metadata_path.is_file():
        raise SystemExit("BLOCKED: canonical and verified metadata files must both exist")

    try:
        canonical = load_records(canonical_path)
        metadata = load_metadata(metadata_path)
        app = build_app_records(canonical, metadata)
        assert_content_preserved(canonical, app)
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(json.dumps(app, ensure_ascii=False, indent=2), encoding="utf-8")
        validate_main(str(out), strict=True)
        assert_content_preserved(canonical, json.loads(out.read_text(encoding="utf-8")))
    except Exception as e:
        out.unlink(missing_ok=True)
        print(f"BLOCKED_NO_GUESS_MAPPING: {e}", file=sys.stderr)
        return 3

    print("PASS_VERIFIED_DETERMINISTIC_MAPPING")
    print(f"records={len(app)}")
    print("content_preserved=id,title,q,choices,ans,explanation")
    print("metadata_source=explicit_per_id_verified_metadata_only")
    print(f"canonical_sha256={sha256(canonical_path)}")
    print(f"metadata_sha256={sha256(metadata_path)}")
    print(f"output_sha256={sha256(out)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
