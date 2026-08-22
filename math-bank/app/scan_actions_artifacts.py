from __future__ import annotations

"""Compatibility facade plus race-safe persistence for Actions recovery scans.

The historical full-scanner API stays importable, while CLI execution uses the
verified incremental scanner. In GitHub Actions, the scanner also persists its
report itself. If another workflow advances the shared math branch before our
push, we reset to the new branch tip, recompute the delta from that newer state,
and retry. This prevents a stale report from winning a concurrent state-file
race and turns the following legacy workflow persist step into a no-op.
"""

import os
import subprocess
import time

from scan_actions_artifacts_full import *  # noqa: F401,F403
from scan_actions_artifacts_delta import main as incremental_main

BRANCH = "math-problem-bank-bootstrap"
REPORT_PATH = "math-bank/state/actions-artifact-scan-latest.json"


def _run(*args: str, check: bool = True) -> subprocess.CompletedProcess[str]:
    return subprocess.run(args, check=check, text=True, capture_output=True)


def _persist_in_actions(max_attempts: int = 6) -> int:
    if os.environ.get("GITHUB_ACTIONS") != "true":
        return 0

    _run("git", "config", "user.name", "github-actions[bot]")
    _run("git", "config", "user.email", "41898282+github-actions[bot]@users.noreply.github.com")

    for attempt in range(1, max_attempts + 1):
        # Always start the persist attempt from the newest shared truth. If the
        # branch moved, rerun the incremental scan so counts/cache decisions are
        # computed from that newest state rather than replaying a stale JSON.
        _run("git", "fetch", "origin", BRANCH)
        _run("git", "reset", "--hard", f"origin/{BRANCH}")
        rc = incremental_main()
        if rc != 0:
            return rc

        _run("git", "add", "--", REPORT_PATH)
        diff = _run("git", "diff", "--cached", "--quiet", check=False)
        if diff.returncode == 0:
            return 0

        _run("git", "commit", "-m", "record math Actions artifact recovery scan")
        pushed = _run("git", "push", "origin", f"HEAD:{BRANCH}", check=False)
        if pushed.returncode == 0:
            return 0

        time.sleep(attempt * 4)

    print("FAIL: could not persist Actions recovery scan after concurrent-push retries")
    return 1


def main() -> int:
    rc = incremental_main()
    if rc != 0:
        return rc
    return _persist_in_actions()


if __name__ == "__main__":
    raise SystemExit(main())
