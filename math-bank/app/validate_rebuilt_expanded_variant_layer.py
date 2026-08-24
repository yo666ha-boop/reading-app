from __future__ import annotations

import argparse
import importlib.util
import json
from pathlib import Path

import validate_expanded_variant_layer as legacy
from validate_app_records import load_records

FROZEN_VALIDATOR = Path(__file__).parents[1] / "scripts" / "validate_frozen_rebuilt_originals.py"
spec = importlib.util.spec_from_file_location("validate_frozen_rebuilt_originals", FROZEN_VALIDATOR)
assert spec and spec.loader
_frozen = importlib.util.module_from_spec(spec)
spec.loader.exec_module(_frozen)


def configure_rebuilt_mode(base_records: list[dict], freeze_manifest: dict) -> str:
    frozen = _frozen.validate(base_records, freeze_manifest)
    if not frozen.get("pass"):
        raise ValueError("immutable rebuilt originals manifest validation did not PASS")
    anchor = str(freeze_manifest.get("combined_payload_sha256", "")).strip().lower()
    if len(anchor) != 64:
        raise ValueError("rebuilt combined payload SHA-256 missing/invalid")
    legacy.BASE_CANONICAL_SHA256 = anchor
    legacy.EXPECTED_BASE_TOTAL = 1124
    legacy.EXPECTED_ORIGINALS = 1124
    legacy.EXPECTED_BASELINE_VARIANTS = 0
    legacy.EXPECTED_ORIGINAL_BY_SOURCE = {"Winpass":570,"実力錬成":237,"Standard":317}
    return anchor


def load_and_validate(base_path: Path, freeze_manifest_path: Path, layer_path: Path, *, require_full_parent_coverage: bool=False) -> dict:
    base=load_records(base_path)
    manifest=json.loads(freeze_manifest_path.read_text(encoding="utf-8"))
    if not isinstance(manifest,dict): raise ValueError("freeze manifest must be object")
    anchor=configure_rebuilt_mode(base,manifest)
    variants,provenance,layer_anchor=legacy.load_layer(layer_path)
    if layer_anchor!=anchor: raise ValueError("expanded layer anchor differs from immutable rebuilt originals SHA")
    result=legacy.validate_layer(base,variants,provenance,require_full_parent_coverage=require_full_parent_coverage)
    result["mode"]="REBUILT_1124_DYNAMIC_IMMUTABLE_BASE"
    result["rebuilt_base_sha256"]=anchor
    result["legacy_baseline_variants_expected"]=0
    return result


def main()->int:
    ap=argparse.ArgumentParser(); ap.add_argument("base"); ap.add_argument("freeze_manifest"); ap.add_argument("layer"); ap.add_argument("--require-full-parent-coverage",action="store_true"); ap.add_argument("--report"); ns=ap.parse_args()
    try: result=load_and_validate(Path(ns.base),Path(ns.freeze_manifest),Path(ns.layer),require_full_parent_coverage=ns.require_full_parent_coverage)
    except Exception as exc:
        print(f"FAIL_CLOSED: {exc}"); return 13
    print(json.dumps(result,ensure_ascii=False,indent=2))
    if ns.report:
        Path(ns.report).parent.mkdir(parents=True,exist_ok=True); Path(ns.report).write_text(json.dumps(result,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    return 0
if __name__=="__main__": raise SystemExit(main())
