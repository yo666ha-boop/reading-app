from __future__ import annotations

import importlib.util
from pathlib import Path

MODULE_PATH = Path(__file__).with_name("freeze_rebuilt_originals.py")
spec = importlib.util.spec_from_file_location("freeze_rebuilt_originals", MODULE_PATH)
assert spec and spec.loader
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)


def rows(source: str, count: int) -> list[dict]:
    return [
        {"id": f"{source}-{i}", "source": source, "question": f"q-{source}-{i}", "answer": f"a-{source}-{i}", "figure_refs": []}
        for i in range(count)
    ]


def main() -> None:
    w = rows("Winpass", 570); j = rows("実力錬成", 237); s = rows("Standard", 317)
    combined, manifest = m.freeze(w, j, s, set())
    assert len(combined) == 1124 and manifest["records"] == 1124
    assert combined[0]["id"] == "Winpass-0" and combined[569]["id"] == "Winpass-569"
    assert combined[570]["id"] == "実力錬成-0" and combined[806]["id"] == "実力錬成-236"
    assert combined[807]["id"] == "Standard-0" and combined[-1]["id"] == "Standard-316"
    assert len(manifest["provenance"]) == 1124
    assert len(manifest["combined_payload_sha256"]) == 64
    assert manifest["policy"]["frozen_originals_are_parent_binding_source_for_variants"] is True

    changed = [dict(x) for x in w]
    changed[0]["is_generated_variant"] = True
    try:
        m.freeze(changed, j, s, set())
    except ValueError:
        pass
    else:
        raise AssertionError("generated contamination must block freeze")

    missing = w[:-1]
    try:
        m.freeze(missing, j, s, set())
    except ValueError:
        pass
    else:
        raise AssertionError("wrong count must block freeze")

    print("PASS_IMMUTABLE_REBUILT_ORIGINALS_FREEZE_SHA_FINGERPRINT_ORDER_GATES")


if __name__ == "__main__":
    main()
