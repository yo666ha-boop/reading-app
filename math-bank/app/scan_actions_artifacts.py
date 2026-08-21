from __future__ import annotations

# Compatibility facade: keep the original full scanner API importable for tools/tests,
# but execute the verified incremental scanner when this historical entry point is run.
from scan_actions_artifacts_full import *  # noqa: F401,F403
from scan_actions_artifacts_delta import main as incremental_main


if __name__ == "__main__":
    raise SystemExit(incremental_main())
