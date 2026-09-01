from __future__ import annotations
import argparse, hashlib, json, os, shutil, tempfile, zipfile
from collections import Counter
from pathlib import Path, PurePosixPath

EXPECTED_SOURCE = {"Standard": 317, "実力錬成": 237, "Winpass": 717}
EXPECTED_TOTAL = 1271
EXPECTED_ASSETS = 282
VALID_GRADES = {1, 2, 3}
VALID_DIFFICULTY = {"basic", "standard", "advanced", "unknown"}
VALID_BOOKS = set(EXPECTED_SOURCE)


def sha256_bytes(b: bytes) -> str:
    return hashlib.sha256(b).hexdigest()


def sha256_file(p: Path) -> str:
    h = hashlib.sha256()
    with p.open("rb") as f:
        for c in iter(lambda: f.read(1024 * 1024), b""):
            h.update(c)
    return h.hexdigest()


def safe_local_path(s: str) -> bool:
    if not isinstance(s, str) or not s or s.startswith("/") or "\\" in s or "://" in s:
        return False
    p = PurePosixPath(s)
    return all(x not in ("", ".", "..") for x in p.parts)


def validate_record(r: dict, i: int, asset_paths: set[str]) -> list[str]:
    errors: list[str] = []
    prefix = f"record {i}"
    required = ["id", "grade", "unit", "title", "skill", "question_format", "difficulty", "source", "question", "choices", "answer", "explanation", "figure_refs", "variant_group", "audit"]
    for key in required:
        if key not in r:
            errors.append(f"{prefix}: missing {key}")
    rid = r.get("id")
    src = r.get("source") or {}
    unit = r.get("unit") or {}
    audit = r.get("audit") or {}
    if not isinstance(rid, str) or not rid.strip(): errors.append(f"{prefix}: invalid id")
    if r.get("grade") not in VALID_GRADES: errors.append(f"{prefix}: invalid grade")
    if not isinstance(unit, dict) or not isinstance(unit.get("major"), str) or not unit.get("major") or not isinstance(unit.get("minor"), str) or not unit.get("minor"): errors.append(f"{prefix}: invalid unit")
    if not isinstance(r.get("title"), str): errors.append(f"{prefix}: invalid title")
    if not isinstance(r.get("skill"), str) or not r.get("skill").strip(): errors.append(f"{prefix}: invalid skill")
    if not isinstance(r.get("question_format"), str) or not r.get("question_format").strip(): errors.append(f"{prefix}: invalid question_format")
    if r.get("difficulty") not in VALID_DIFFICULTY: errors.append(f"{prefix}: invalid difficulty")
    if not isinstance(src, dict) or src.get("book") not in VALID_BOOKS or src.get("is_generated_variant") is not False: errors.append(f"{prefix}: invalid original source")
    if not isinstance(src.get("document"), str): errors.append(f"{prefix}: invalid source.document")
    if not isinstance(r.get("question"), str) or not r.get("question").strip(): errors.append(f"{prefix}: blank question")
    if not isinstance(r.get("answer"), str) or not r.get("answer").strip(): errors.append(f"{prefix}: blank answer")
    if not isinstance(r.get("explanation"), str): errors.append(f"{prefix}: invalid explanation")
    choices = r.get("choices")
    if choices is not None and (not isinstance(choices, list) or any(not isinstance(x, str) or not x.strip() for x in choices)): errors.append(f"{prefix}: invalid choices")
    refs = r.get("figure_refs")
    if not isinstance(refs, list) or len(refs) != len(set(refs)):
        errors.append(f"{prefix}: invalid/duplicate figure_refs")
    elif any(not safe_local_path(x) or x not in asset_paths for x in refs):
        errors.append(f"{prefix}: unresolved figure ref")
    if r.get("variant_group") is not None: errors.append(f"{prefix}: original variant_group must be null")
    if not isinstance(audit, dict) or any(audit.get(k) is not True for k in ("problem_answer_verified", "structure_verified", "figure_refs_verified")): errors.append(f"{prefix}: audit flags not all true")
    return errors


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("frozen")
    ap.add_argument("asset_zip")
    ap.add_argument("output_dir")
    ap.add_argument("--report", required=True)
    ns = ap.parse_args()
    frozen, asset_zip, out, report_path = Path(ns.frozen), Path(ns.asset_zip), Path(ns.output_dir), Path(ns.report)
    errors: list[str] = []
    obj = json.loads(frozen.read_text(encoding="utf-8"))
    rows = obj.get("records", obj) if isinstance(obj, dict) else obj
    if not isinstance(rows, list): raise ValueError("frozen records must be list")
    with zipfile.ZipFile(asset_zip) as zf:
        bad = zf.testzip()
        if bad: errors.append(f"asset ZIP CRC failed at {bad}")
        manifest = json.loads(zf.read("asset-binding-manifest.json"))
        if not isinstance(manifest, list): errors.append("asset manifest not list"); manifest = []
        public_paths = [x.get("public_path") for x in manifest if isinstance(x, dict)]
        if len(manifest) != EXPECTED_ASSETS: errors.append(f"manifest count {len(manifest)} != {EXPECTED_ASSETS}")
        if len(set(public_paths)) != len(public_paths): errors.append("manifest public_path duplicate")
        for item in manifest:
            if not isinstance(item, dict): continue
            path = item.get("public_path")
            member = "public/" + str(path)
            if not safe_local_path(path or "") or member not in zf.namelist(): errors.append(f"manifest asset missing: {path}"); continue
            if sha256_bytes(zf.read(member)) != item.get("public_asset_sha256"): errors.append(f"manifest asset sha mismatch: {path}")
        asset_paths = set(public_paths)
        if len(rows) != EXPECTED_TOTAL: errors.append(f"record count {len(rows)} != {EXPECTED_TOTAL}")
        ids: list[str] = []
        counts: Counter[str] = Counter()
        figure_entries = 0
        for i, row in enumerate(rows, 1):
            if not isinstance(row, dict): errors.append(f"record {i}: not object"); continue
            ids.append(row.get("id")); counts[(row.get("source") or {}).get("book")] += 1
            if isinstance(row.get("figure_refs"), list): figure_entries += len(row["figure_refs"])
            errors.extend(validate_record(row, i, asset_paths))
        if len(set(ids)) != len(ids): errors.append("record ids duplicate")
        for source, expected in EXPECTED_SOURCE.items():
            if counts.get(source, 0) != expected: errors.append(f"{source} count {counts.get(source, 0)} != {expected}")
        required = {p for row in rows if isinstance(row, dict) for p in (row.get("figure_refs") or [])}
        missing = sorted(required - asset_paths)
        if missing: errors.append(f"{len(missing)} unique figure paths unresolved")
        report = {"workflow":"validated1271 runtime parent promotion","pass":not errors,"frozen_file":frozen.name,"frozen_bytes":frozen.stat().st_size,"frozen_sha256":sha256_file(frozen),"asset_zip":asset_zip.name,"asset_zip_bytes":asset_zip.stat().st_size,"asset_zip_sha256":sha256_file(asset_zip),"asset_zip_crc":"PASS" if bad is None else "FAIL","record_count":len(rows),"source_counts":dict(counts),"unique_record_ids":len(set(ids)),"figure_ref_entries":figure_entries,"unique_required_figure_paths":len(required),"asset_manifest_entries":len(manifest),"resolved_unique_figure_paths":len(required)-len(missing),"errors":errors,"publication_ready":False,"main_touched":False,"policy":"This promotes only validated original runtime parents plus exact public assets. Variants/UI/browser/release gates remain separate."}
        report_path.parent.mkdir(parents=True, exist_ok=True)
        report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        if errors:
            print(json.dumps(report, ensure_ascii=False, indent=2)); return 9
        temp = Path(tempfile.mkdtemp(prefix="math1271-runtime-", dir=str(out.parent if out.parent.exists() else Path.cwd())))
        try:
            (temp / "app-records.json").write_text(json.dumps(rows, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
            (temp / "runtime-parent-promotion-report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
            for item in manifest:
                path = item["public_path"]
                dest = temp.joinpath(*PurePosixPath(path).parts)
                dest.parent.mkdir(parents=True, exist_ok=True)
                dest.write_bytes(zf.read("public/" + path))
            (temp / "asset-binding-manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
            if out.exists(): shutil.rmtree(out)
            os.replace(temp, out); temp = None
        finally:
            if temp and temp.exists(): shutil.rmtree(temp, ignore_errors=True)
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
