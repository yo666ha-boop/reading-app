from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import generate_all_safe_verified_variants as unified
import validate_rebuilt_expanded_variant_layer as rebuilt
from validate_app_records import load_records


def configure(base_path: Path, manifest_path: Path) -> str:
    base=load_records(base_path)
    manifest=json.loads(manifest_path.read_text(encoding="utf-8"))
    if not isinstance(manifest,dict): raise ValueError("freeze manifest must be object")
    anchor=rebuilt.configure_rebuilt_mode(base,manifest)
    unified.BASE_CANONICAL_SHA256=anchor
    return anchor


def main()->int:
    ap=argparse.ArgumentParser()
    ap.add_argument("base")
    ap.add_argument("freeze_manifest")
    ap.add_argument("expanded")
    ap.add_argument("output")
    ap.add_argument("--target-per-parent",type=int,default=1,choices=(1,2,3))
    ap.add_argument("--safe-target-per-parent",type=int,default=3,choices=(1,2,3))
    ap.add_argument("--report")
    ap.add_argument("--manual-queue")
    ns=ap.parse_args()
    try:
        configure(Path(ns.base),Path(ns.freeze_manifest))
        # Verify the pre-existing layer is anchored to the same immutable rebuilt base before generation.
        rebuilt.load_and_validate(Path(ns.base),Path(ns.freeze_manifest),Path(ns.expanded),require_full_parent_coverage=False)
    except Exception as exc:
        print(f"FAIL_CLOSED: {exc}")
        return 15
    argv=["generate_all_safe_verified_variants.py",ns.base,ns.expanded,ns.output,"--target-per-parent",str(ns.target_per_parent),"--safe-target-per-parent",str(ns.safe_target_per_parent)]
    if ns.report: argv += ["--report",ns.report]
    if ns.manual_queue: argv += ["--manual-queue",ns.manual_queue]
    old=sys.argv
    try:
        sys.argv=argv
        unified.main()
    except Exception as exc:
        print(f"FAIL_CLOSED: {exc}")
        return 16
    finally:
        sys.argv=old
    return 0

if __name__=="__main__": raise SystemExit(main())
