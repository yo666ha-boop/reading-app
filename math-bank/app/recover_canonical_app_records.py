from __future__ import annotations

import argparse
import hashlib
import json
import tempfile
import zipfile
from pathlib import Path

from validate_app_records import main as validate_main

EXPECTED = 1231
CANONICAL_ZIP_SHA256 = "eb93279a52dd49191612a52ac0df2df2fdd865c8975d815547daa126b4398175"


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def load_json_records(path: Path) -> list[dict] | None:
    try:
        if path.suffix.lower() == ".jsonl":
            rows = [json.loads(x) for x in path.read_text(encoding="utf-8").splitlines() if x.strip()]
            return rows if isinstance(rows, list) else None
        obj = json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return None
    if isinstance(obj, list):
        return obj
    if isinstance(obj, dict) and isinstance(obj.get("records"), list):
        return obj["records"]
    return None


def candidate_files(source: Path, temp_dir: Path) -> list[Path]:
    if source.suffix.lower() != ".zip":
        return [source]
    with zipfile.ZipFile(source) as zf:
        zf.extractall(temp_dir)
    return sorted(
        p for p in temp_dir.rglob("*")
        if p.is_file() and p.suffix.lower() in {".json", ".jsonl"}
    )


def shape_hint(rows: list[dict]) -> str:
    if not rows:
        return "empty"
    first = rows[0] if isinstance(rows[0], dict) else {}
    return ",".join(sorted(first.keys())[:30])


def strict_validate_rows(rows: list[dict]) -> tuple[bool, str]:
    with tempfile.NamedTemporaryFile("w", suffix=".json", encoding="utf-8", delete=False) as f:
        json.dump(rows, f, ensure_ascii=False)
        tmp = Path(f.name)
    try:
        validate_main(str(tmp), strict=True)
        return True, "PASS_STRICT_1231"
    except Exception as e:
        return False, str(e)
    finally:
        tmp.unlink(missing_ok=True)


def main() -> int:
    ap = argparse.ArgumentParser(description="Recover only the already-verified canonical 1231-record math app dataset.")
    ap.add_argument("source", help="Canonical ZIP, or separately verified JSON/JSONL")
    ap.add_argument("--output", default=str(Path(__file__).with_name("app-records.json")))
    args = ap.parse_args()

    source = Path(args.source)
    if not source.is_file():
        raise SystemExit(f"BLOCKED: source not found: {source}")

    source_sha256 = sha256_file(source)
    if source.suffix.lower() == ".zip":
        # ZIP identity is immutable. There is intentionally no CLI override for this value.
        if source_sha256.lower() != CANONICAL_ZIP_SHA256:
            print(json.dumps({
                "status": "BLOCKED",
                "source": str(source),
                "reason": "ZIP_SHA256_MISMATCH",
                "actual_sha256": source_sha256,
                "expected_sha256": CANONICAL_ZIP_SHA256,
                "policy": "ZIP input must be the recorded final canonical artifact; hash bypass is not allowed"
            }, ensure_ascii=False, indent=2))
            return 4

    out = Path(args.output)
    reports: list[dict] = []
    with tempfile.TemporaryDirectory() as td:
        try:
            candidates = candidate_files(source, Path(td))
        except zipfile.BadZipFile as e:
            print(json.dumps({
                "status": "BLOCKED",
                "source": str(source),
                "reason": f"BAD_ZIP: {e}",
                "source_sha256": source_sha256,
            }, ensure_ascii=False, indent=2))
            return 5

        for p in candidates:
            rows = load_json_records(p)
            if rows is None:
                continue
            report = {"candidate": str(p), "records": len(rows), "shape": shape_hint(rows)}
            if len(rows) != EXPECTED:
                report["result"] = f"REJECT_COUNT_{len(rows)}"
                reports.append(report)
                continue
            ok, reason = strict_validate_rows(rows)
            report["result"] = reason
            reports.append(report)
            if ok:
                out.parent.mkdir(parents=True, exist_ok=True)
                out.write_text(json.dumps(rows, ensure_ascii=False, indent=2), encoding="utf-8")
                validate_main(str(out), strict=True)
                print(json.dumps({
                    "status": "PASS",
                    "source": str(source),
                    "source_sha256": source_sha256,
                    "canonical_zip_sha256_verified": source.suffix.lower() != ".zip" or source_sha256.lower() == CANONICAL_ZIP_SHA256,
                    "promoted_candidate": str(p),
                    "output": str(out),
                    "output_sha256": sha256_file(out),
                    "records": EXPECTED,
                    "policy": "no transformation/no invented records; exact strict app-schema pass-through only"
                }, ensure_ascii=False, indent=2))
                return 0

    print(json.dumps({
        "status": "BLOCKED",
        "source": str(source),
        "source_sha256": source_sha256,
        "reason": "No exact 1231-record candidate passed the strict app validator. No output was promoted.",
        "candidates": reports
    }, ensure_ascii=False, indent=2))
    return 3


if __name__ == "__main__":
    raise SystemExit(main())
