from __future__ import annotations

import json
import tempfile
from pathlib import Path

import advance_exact_base_to_expanded_ready as gate
from test_expanded_variant_layer import make_base
from validate_expanded_variant_layer import BASE_CANONICAL_SHA256


def main() -> None:
    with tempfile.TemporaryDirectory() as td_raw:
        td = Path(td_raw)
        app = td / "app"
        state = td / "state"
        app.mkdir()
        state.mkdir()
        base = app / "app-records.json"
        snapshot = app / "base-app-records.json"
        expanded = app / "verified-expanded-variants.json"
        manual = state / "manual-variant-generation-queue.json"
        gen_report = state / "auto-variant-generation-latest.json"
        final_report = state / "variant-expansion-latest.json"
        status = state / "post-canonical-expansion-latest.json"

        rows = make_base()
        base.write_text(json.dumps(rows, ensure_ascii=False, indent=2), encoding="utf-8")
        expanded.write_text(json.dumps({
            "schema_version": "1.0",
            "base_canonical_sha256": BASE_CANONICAL_SHA256,
            "variants": [],
            "provenance": [],
        }, ensure_ascii=False, indent=2), encoding="utf-8")
        original_base_text = base.read_text(encoding="utf-8")

        gate.STATE = state
        gate.BASE = base
        gate.BASE_SNAPSHOT = snapshot
        gate.EXPANDED = expanded
        gate.MANUAL_QUEUE = manual
        gate.GEN_REPORT = gen_report
        gate.FINAL_REPORT = final_report
        gate.STATUS_REPORT = status

        rc = gate.main()
        assert rc == 3
        payload = json.loads(status.read_text(encoding="utf-8"))
        queue = json.loads(manual.read_text(encoding="utf-8"))
        generated_layer = json.loads(expanded.read_text(encoding="utf-8"))

        assert payload["status"] == "BLOCKED_MANUAL_PARENT_VARIANTS_REQUIRED"
        assert payload["runtime_composed"] is False
        assert payload["publication_ready"] is False
        assert payload["manual_parent_count"] > 0
        assert queue["manual_parent_count"] == payload["manual_parent_count"]
        assert all("question" not in task and "answer" not in task for task in queue["tasks"])
        assert snapshot.is_file()
        assert base.read_text(encoding="utf-8") == original_base_text
        assert len(generated_layer["variants"]) >= 1
        assert len(generated_layer["variants"]) == len(generated_layer["provenance"])
        assert all(p.get("parent_record_sha256") for p in generated_layer["provenance"])
        assert not final_report.exists()

    print("PASS_POST_CANONICAL_EXPANSION_GENERATES_SAFE_PROGRESS_AND_BLOCKS_RELEASE_FOR_MANUAL_PARENTS")


if __name__ == "__main__":
    main()
