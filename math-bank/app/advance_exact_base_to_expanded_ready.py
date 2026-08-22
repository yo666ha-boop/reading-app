from __future__ import annotations

"""Advance a verified canonical BASE into the expanded runtime, fail-closed.

The canonical 1231-record app dataset must already have been atomically wired by
complete_from_exact_canonical.py. This script snapshots that BASE, runs only the
verified safe generators against actual parent records, writes a fingerprint-
bound manual queue for unsupported parents, and composes the dynamic runtime
only when full 1124/1124 expanded parent coverage is already achieved.
"""

import argparse
import json
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent
STATE = ROOT.parent / "state"
BASE = ROOT / "app-records.json"
BASE_SNAPSHOT = ROOT / "base-app-records.json"
EXPANDED = ROOT / "verified-expanded-variants.json"
GENERATOR = ROOT / "generate_all_safe_verified_variants.py"
COMPOSER = ROOT / "compose_expanded_app_records.py"
MANUAL_QUEUE = STATE / "manual-variant-generation-queue.json"
GEN_REPORT = STATE / "auto-variant-generation-latest.json"
FINAL_REPORT = STATE / "variant-expansion-latest.json"
STATUS_REPORT = STATE / "post-canonical-expansion-latest.json"


def run(args: list[str]) -> None:
    proc = subprocess.run(args, text=True, capture_output=True)
    if proc.returncode:
        raise RuntimeError(
            f"command failed rc={proc.returncode}: {' '.join(args)}\nSTDOUT:\n{proc.stdout}\nSTDERR:\n{proc.stderr}"
        )


def load_json(path: Path) -> dict:
    obj = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(obj, dict):
        raise ValueError(f"expected object JSON: {path}")
    return obj


def write_status(payload: dict) -> None:
    STATE.mkdir(parents=True, exist_ok=True)
    tmp = STATUS_REPORT.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    tmp.replace(STATUS_REPORT)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--minimum-per-parent", type=int, default=1, choices=(1, 2, 3))
    ap.add_argument("--safe-target-per-parent", type=int, default=3, choices=(1, 2, 3))
    ns = ap.parse_args()
    STATE.mkdir(parents=True, exist_ok=True)

    try:
        if not BASE.is_file():
            raise ValueError("canonical app-records.json is not wired")
        if not EXPANDED.is_file():
            raise ValueError("verified-expanded-variants.json is missing")
        if ns.safe_target_per_parent < ns.minimum_per_parent:
            raise ValueError("safe target must be >= minimum target")

        # Freeze the exact canonical 1231 records before any dynamic composition.
        shutil.copy2(BASE, BASE_SNAPSHOT)

        temp_expanded = EXPANDED.with_suffix(".generated.json")
        run([
            sys.executable,
            str(GENERATOR),
            str(BASE_SNAPSHOT),
            str(EXPANDED),
            str(temp_expanded),
            "--target-per-parent",
            str(ns.minimum_per_parent),
            "--safe-target-per-parent",
            str(ns.safe_target_per_parent),
            "--report",
            str(GEN_REPORT),
            "--manual-queue",
            str(MANUAL_QUEUE),
        ])
        gen = load_json(GEN_REPORT)
        queue = load_json(MANUAL_QUEUE)
        manual_count = int(queue.get("manual_parent_count") or 0)
        coverage = int(gen.get("expanded_parent_coverage") or 0)
        expanded_total = int(gen.get("expanded_total") or 0)

        # The generated layer was already strict-validated by the generator. Promote
        # it atomically even when manual work remains, so subsequent runs resume from
        # verified progress rather than regenerating accepted siblings.
        temp_expanded.replace(EXPANDED)

        if manual_count:
            payload = {
                "status": "BLOCKED_MANUAL_PARENT_VARIANTS_REQUIRED",
                "recorded_at_utc": datetime.now(timezone.utc).isoformat(),
                "base_snapshot": str(BASE_SNAPSHOT),
                "expanded_layer": str(EXPANDED),
                "expanded_verified_variants": expanded_total,
                "expanded_parent_coverage": coverage,
                "expanded_parent_target": 1124,
                "manual_parent_count": manual_count,
                "manual_missing_variant_count": int(queue.get("manual_missing_variant_count") or sum(int(t.get("missing_verified_variants") or 0) for t in queue.get("tasks", []))),
                "manual_queue": str(MANUAL_QUEUE),
                "runtime_composed": False,
                "publication_ready": False,
                "policy": "Do not publish. Read each fingerprint-bound actual parent and referenced figures/choices, add verified manual variants, then rerun this gate.",
            }
            write_status(payload)
            print(json.dumps(payload, ensure_ascii=False, indent=2))
            return 3

        if coverage != 1124:
            raise ValueError(f"manual queue is empty but parent coverage is {coverage}/1124")

        run([
            sys.executable,
            str(COMPOSER),
            str(BASE_SNAPSHOT),
            str(EXPANDED),
            str(BASE),
            "--report",
            str(FINAL_REPORT),
            "--base-snapshot",
            str(BASE_SNAPSHOT),
            "--require-full-parent-coverage",
        ])
        final = load_json(FINAL_REPORT)
        if not final.get("publication_expansion_ready"):
            raise ValueError("strict full-coverage composer did not mark publication expansion ready")
        payload = {
            "status": "PASS_EXPANDED_RUNTIME_READY",
            "recorded_at_utc": datetime.now(timezone.utc).isoformat(),
            "base_snapshot": str(BASE_SNAPSHOT),
            "expanded_layer": str(EXPANDED),
            "expanded_verified_variants": final.get("expanded_verified_variants"),
            "expanded_parent_coverage": final.get("expanded_parent_coverage"),
            "expanded_parent_target": final.get("expanded_parent_target"),
            "manual_parent_count": 0,
            "manual_queue": str(MANUAL_QUEUE),
            "runtime_composed": True,
            "runtime_records": final.get("final_total"),
            "publication_expansion_ready": True,
        }
        write_status(payload)
        print(json.dumps(payload, ensure_ascii=False, indent=2))
        return 0
    except Exception as exc:
        payload = {
            "status": "BLOCKED_POST_CANONICAL_EXPANSION",
            "recorded_at_utc": datetime.now(timezone.utc).isoformat(),
            "error": str(exc),
            "publication_ready": False,
            "policy": "No guessed parent content and no release on incomplete expanded coverage.",
        }
        write_status(payload)
        print(json.dumps(payload, ensure_ascii=False, indent=2), file=sys.stderr)
        return 4


if __name__ == "__main__":
    raise SystemExit(main())
