from __future__ import annotations

import argparse
import hashlib
import importlib.util
import json
from datetime import datetime, timezone
from pathlib import Path

VALIDATOR_PATH = Path(__file__).with_name("validate_rebuilt_originals.py")
spec = importlib.util.spec_from_file_location("validate_rebuilt_originals", VALIDATOR_PATH)
assert spec and spec.loader
_v = importlib.util.module_from_spec(spec)
spec.loader.exec_module(_v)


def file_sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def payload_sha256(obj: object) -> str:
    raw = json.dumps(obj, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(raw).hexdigest()


def freeze(winpass: list[dict], jitsuren: list[dict], standard: list[dict], assets: set[str] | None = None) -> tuple[list[dict], dict]:
    by_source = {"Winpass": winpass, "実力錬成": jitsuren, "Standard": standard}
    validation = _v.validate(by_source, assets)
    if not validation.get("pass"):
        raise ValueError("rebuilt 1124 originals validation did not PASS; refusing to freeze")
    combined: list[dict] = []
    provenance: list[dict] = []
    for source in ("Winpass", "実力錬成", "Standard"):
        for source_index, record in enumerate(by_source[source]):
            fp = _v.fingerprint(record)
            combined.append(record)
            provenance.append({
                "combined_index": len(combined) - 1,
                "source": source,
                "source_index": source_index,
                "record_id": str(record.get("id", "")).strip(),
                "record_fingerprint_sha256": fp,
            })
    if len(combined) != 1124:
        raise AssertionError(f"combined originals drift: {len(combined)}")
    manifest = {
        "workflow": "Math Immutable Rebuilt Originals Freeze",
        "recorded_at_utc": datetime.now(timezone.utc).isoformat(),
        "records": len(combined),
        "source_counts": {k: len(v) for k, v in by_source.items()},
        "combined_payload_sha256": payload_sha256(combined),
        "record_fingerprint_sequence_sha256": payload_sha256([p["record_fingerprint_sha256"] for p in provenance]),
        "policy": {
            "fresh_1124_validation_required_at_freeze_time": True,
            "source_order_fixed": ["Winpass", "実力錬成", "Standard"],
            "source_local_order_preserved": True,
            "record_fingerprint_manifest_required": True,
            "frozen_originals_are_parent_binding_source_for_variants": True,
            "mutation_after_freeze_forbidden": True,
        },
        "provenance": provenance,
    }
    return combined, manifest


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--winpass", type=Path, required=True)
    ap.add_argument("--jitsuren", type=Path, required=True)
    ap.add_argument("--standard", type=Path, required=True)
    ap.add_argument("--asset-manifest", type=Path)
    ap.add_argument("--out-records", type=Path, required=True)
    ap.add_argument("--out-manifest", type=Path, required=True)
    args = ap.parse_args()
    assets = None
    if args.asset_manifest:
        raw_assets = json.loads(args.asset_manifest.read_text(encoding="utf-8"))
        if not isinstance(raw_assets, list):
            raise SystemExit("asset manifest must be a JSON array")
        assets = {_v.norm(x) for x in raw_assets if _v.norm(x)}
    winpass = _v.load_array(args.winpass)
    jitsuren = _v.load_array(args.jitsuren)
    standard = _v.load_array(args.standard)
    try:
        combined, manifest = freeze(winpass, jitsuren, standard, assets)
    except (ValueError, AssertionError) as exc:
        print(f"FAIL_CLOSED: {exc}")
        return 10
    manifest["input_files"] = {
        "Winpass": {"path": str(args.winpass), "sha256": file_sha256(args.winpass)},
        "実力錬成": {"path": str(args.jitsuren), "sha256": file_sha256(args.jitsuren)},
        "Standard": {"path": str(args.standard), "sha256": file_sha256(args.standard)},
    }
    args.out_records.parent.mkdir(parents=True, exist_ok=True)
    args.out_manifest.parent.mkdir(parents=True, exist_ok=True)
    args.out_records.write_text(json.dumps(combined, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    args.out_manifest.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({k: v for k, v in manifest.items() if k != "provenance"}, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
