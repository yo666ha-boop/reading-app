from __future__ import annotations

import importlib.util
from pathlib import Path

MODULE_PATH = Path(__file__).with_name("validate_frozen_rebuilt_originals.py")
spec = importlib.util.spec_from_file_location("validate_frozen_rebuilt_originals", MODULE_PATH)
assert spec and spec.loader
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)


def rows(source: str, count: int) -> list[dict]:
    return [{"id":f"{source}-{i}","source":source,"question":f"q-{source}-{i}","answer":f"a-{source}-{i}","figure_refs":[]} for i in range(count)]


def main() -> None:
    w=rows("Winpass",570); j=rows("実力錬成",237); s=rows("Standard",317)
    frozen, manifest = m._f.freeze(w,j,s,set())
    ok=m.validate(frozen,manifest)
    assert ok["pass"] is True and ok["records"]==1124

    changed=[dict(x) for x in frozen]
    changed[10]["answer"]="changed"
    report=m.validate(changed,manifest)
    assert report["pass"] is False
    assert any(x["issue"]=="combined_payload_sha256_mismatch" for x in report["issues"])
    assert any(x.get("issue")=="record_fingerprint_mismatch" for x in report["issues"])

    bad_manifest=dict(manifest); bad_manifest["record_fingerprint_sequence_sha256"]="0"*64
    report=m.validate(frozen,bad_manifest)
    assert report["pass"] is False
    assert any(x["issue"]=="record_fingerprint_sequence_sha256_mismatch" for x in report["issues"])

    bad_prov=dict(manifest); bad_prov["provenance"]=[dict(x) for x in manifest["provenance"]]
    bad_prov["provenance"][570]["source"]="Winpass"
    report=m.validate(frozen,bad_prov)
    assert report["pass"] is False
    assert any(x.get("issue")=="source_order_mismatch" for x in report["issues"])

    print("PASS_FROZEN_REBUILT_ORIGINALS_EXACT_MANIFEST_PARENT_BINDING_GATES")

if __name__=="__main__": main()
