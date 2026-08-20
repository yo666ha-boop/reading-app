from __future__ import annotations

import argparse
import hashlib
import json
import shutil
import tempfile
import zipfile
from pathlib import Path, PurePosixPath
from urllib.parse import unquote, urlsplit

from validate_app_records import main as validate_main

EXPECTED = 1231
CANONICAL_ZIP_SHA256 = "eb93279a52dd49191612a52ac0df2df2fdd865c8975d815547daa126b4398175"
EXTERNAL_SCHEMES = {"http", "https", "data", "blob"}
ALLOWED_LOCAL_FIGURE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".avif"}


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


def local_figure_ref(ref: str) -> PurePosixPath | None:
    ref = ref.strip()
    parts = urlsplit(ref)
    scheme = parts.scheme.lower()
    if scheme in EXTERNAL_SCHEMES:
        return None
    if scheme:
        raise ValueError(f"unsupported figure URL scheme: {ref}")
    if parts.netloc:
        return None
    raw = unquote(parts.path)
    if not raw or raw.startswith("/") or "\\" in raw:
        raise ValueError(f"unsafe/absolute figure ref: {ref}")
    rel = PurePosixPath(raw)
    if any(part in {"", ".", ".."} for part in rel.parts):
        raise ValueError(f"unsafe figure ref path: {ref}")
    if rel.suffix.lower() not in ALLOWED_LOCAL_FIGURE_EXTENSIONS:
        raise ValueError(f"unsupported local figure file type: {ref}")
    return rel


def figure_refs(rows: list[dict]) -> tuple[list[PurePosixPath], int]:
    local: dict[str, PurePosixPath] = {}
    external = 0
    for r in rows:
        for ref in r.get("figure_refs", []):
            rel = local_figure_ref(ref)
            if rel is None:
                external += 1
            else:
                local[rel.as_posix()] = rel
    return [local[k] for k in sorted(local)], external


def resolve_asset(rel: PurePosixPath, candidate: Path, extracted_root: Path | None, source: Path) -> Path | None:
    direct: list[Path] = []
    roots = [candidate.parent]
    if extracted_root is not None:
        roots.append(extracted_root)
    if source.suffix.lower() != ".zip":
        roots.append(source.parent)
    for root in roots:
        p = root.joinpath(*rel.parts)
        if p.is_file():
            direct.append(p.resolve())
    unique_direct = list(dict.fromkeys(direct))
    if unique_direct:
        hashes = {sha256_file(p) for p in unique_direct}
        if len(hashes) == 1:
            return unique_direct[0]
        raise ValueError(f"ambiguous figure asset with different contents: {rel.as_posix()}")

    if extracted_root is None:
        return None
    suffix = rel.as_posix()
    matches = []
    for p in extracted_root.rglob(rel.name):
        if not p.is_file():
            continue
        rp = p.relative_to(extracted_root).as_posix()
        if rp == suffix or rp.endswith("/" + suffix):
            matches.append(p.resolve())
    matches = list(dict.fromkeys(matches))
    if not matches:
        return None
    hashes = {sha256_file(p) for p in matches}
    if len(hashes) != 1:
        raise ValueError(f"ambiguous figure asset suffix with different contents: {suffix}")
    return matches[0]


def resolve_all_assets(rows: list[dict], candidate: Path, extracted_root: Path | None, source: Path) -> tuple[dict[PurePosixPath, Path], int]:
    refs, external_count = figure_refs(rows)
    resolved: dict[PurePosixPath, Path] = {}
    missing: list[str] = []
    for rel in refs:
        p = resolve_asset(rel, candidate, extracted_root, source)
        if p is None:
            missing.append(rel.as_posix())
        else:
            resolved[rel] = p
    if missing:
        sample = ", ".join(missing[:10])
        raise ValueError(f"missing local figure assets {len(missing)}: {sample}")
    return resolved, external_count


def promote(rows: list[dict], assets: dict[PurePosixPath, Path], out: Path) -> None:
    out.parent.mkdir(parents=True, exist_ok=True)
    for rel, src in assets.items():
        dest = out.parent.joinpath(*rel.parts)
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dest)
    out.write_text(json.dumps(rows, ensure_ascii=False, indent=2), encoding="utf-8")
    validate_main(str(out), strict=True)


def main() -> int:
    ap = argparse.ArgumentParser(description="Recover only the already-verified canonical 1231-record math app dataset.")
    ap.add_argument("source", help="Canonical ZIP, or separately verified JSON/JSONL")
    ap.add_argument("--output", default=str(Path(__file__).with_name("app-records.json")))
    args = ap.parse_args()

    source = Path(args.source)
    if not source.is_file():
        raise SystemExit(f"BLOCKED: source not found: {source}")

    source_sha256 = sha256_file(source)
    if source.suffix.lower() == ".zip" and source_sha256.lower() != CANONICAL_ZIP_SHA256:
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
        extracted_root = Path(td) if source.suffix.lower() == ".zip" else None
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
            if not ok:
                report["result"] = reason
                reports.append(report)
                continue
            try:
                assets, external_count = resolve_all_assets(rows, p, extracted_root, source)
            except Exception as e:
                report["result"] = f"FIGURE_ASSET_GATE_FAIL: {e}"
                reports.append(report)
                continue
            report["result"] = "PASS_STRICT_1231_AND_FIGURE_ASSETS"
            report["local_figure_assets"] = len(assets)
            report["external_figure_refs"] = external_count
            reports.append(report)
            promote(rows, assets, out)
            print(json.dumps({
                "status": "PASS",
                "source": str(source),
                "source_sha256": source_sha256,
                "canonical_zip_sha256_verified": source.suffix.lower() != ".zip" or source_sha256.lower() == CANONICAL_ZIP_SHA256,
                "promoted_candidate": str(p),
                "output": str(out),
                "output_sha256": sha256_file(out),
                "records": EXPECTED,
                "local_figure_assets_copied": len(assets),
                "external_figure_refs": external_count,
                "policy": "no transformation/no invented records; strict app-schema pass-through plus exact safe figure-asset preservation"
            }, ensure_ascii=False, indent=2))
            return 0

    print(json.dumps({
        "status": "BLOCKED",
        "source": str(source),
        "source_sha256": source_sha256,
        "reason": "No exact 1231-record candidate passed strict data + figure-asset gates. No output was promoted.",
        "candidates": reports
    }, ensure_ascii=False, indent=2))
    return 3


if __name__ == "__main__":
    raise SystemExit(main())
