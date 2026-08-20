from __future__ import annotations

import argparse
import json
import shutil
import tempfile
import zipfile
from pathlib import Path

from validate_app_records import main as validate_main

EXPECTED = 1231


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
    ap = argparse.ArgumentParser(description="Recover only an exact already-verified 1231-record math app dataset.")
    ap.add_argument("source", help="Canonical ZIP, JSON, or JSONL")
    ap.add_argument("--output", default=str(Path(__file__).with_name("app-records.json")))
    args = ap.parse_args()

    source = Path(args.source)
    if not source.is_file():
        raise SystemExit(f"BLOCKED: source not found: {source}")

    out = Path(args.output)
    reports: list[dict] = []
    with tempfile.TemporaryDirectory() as td:
        for p in candidate_files(source, Path(td)):
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
                # Re-run against the actual promoted path; promotion is complete only after this succeeds.
                validate_main(str(out), strict=True)
                print(json.dumps({
                    "status": "PASS",
                    "source": str(source),
                    "promoted_candidate": str(p),
                    "output": str(out),
                    "records": EXPECTED,
                    "policy": "no transformation/no invented records; exact strict app-schema pass-through only"
                }, ensure_ascii=False, indent=2))
                return 0

    print(json.dumps({
        "status": "BLOCKED",
        "source": str(source),
        "reason": "No exact 1231-record candidate passed the strict app validator. No output was promoted.",
        "candidates": reports
    }, ensure_ascii=False, indent=2))
    return 3


if __name__ == "__main__":
    raise SystemExit(main())
