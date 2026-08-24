from __future__ import annotations
import argparse,json
from pathlib import Path
from validate_app_records import load_records
import validate_rebuilt_expanded_variant_layer as rebuilt

def initialize(base_path:Path,manifest_path:Path)->dict:
    base=load_records(base_path); manifest=json.loads(manifest_path.read_text(encoding="utf-8"))
    if not isinstance(manifest,dict): raise ValueError("freeze manifest must be object")
    anchor=rebuilt.configure_rebuilt_mode(base,manifest)
    return {"schema_version":"1.0","base_canonical_sha256":anchor,"variants":[],"provenance":[]}

def main()->int:
    ap=argparse.ArgumentParser(); ap.add_argument("base"); ap.add_argument("freeze_manifest"); ap.add_argument("output"); ns=ap.parse_args()
    try: obj=initialize(Path(ns.base),Path(ns.freeze_manifest))
    except Exception as exc: print(f"FAIL_CLOSED: {exc}"); return 14
    Path(ns.output).parent.mkdir(parents=True,exist_ok=True); Path(ns.output).write_text(json.dumps(obj,ensure_ascii=False,indent=2)+"\n",encoding="utf-8"); print(json.dumps({"status":"PASS","base_canonical_sha256":obj["base_canonical_sha256"],"variants":0},ensure_ascii=False)); return 0
if __name__=="__main__": raise SystemExit(main())
