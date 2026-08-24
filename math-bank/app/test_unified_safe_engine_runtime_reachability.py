from __future__ import annotations

"""Prove every safe_* variant engine is reachable from Unified runtime routes.

A specialized engine may be registered directly in SPECIALIZED_ENGINES or be a
fail-closed delegate imported by a registered wrapper.  This regression walks
that import graph and fails if a safe engine module becomes orphaned.
"""

import ast
from pathlib import Path

import generate_all_safe_verified_variants as unified

APP_DIR = Path(__file__).resolve().parent
PREFIX = "safe_"
SUFFIX = "_variant_engine"


def safe_modules() -> set[str]:
    return {p.stem for p in APP_DIR.glob("safe_*_variant_engine.py")}


def safe_imports(module_name: str, known: set[str]) -> set[str]:
    path = APP_DIR / f"{module_name}.py"
    tree = ast.parse(path.read_text(encoding="utf-8"), filename=str(path))
    found: set[str] = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.ImportFrom) and node.module in known:
            found.add(node.module)
        elif isinstance(node, ast.Import):
            for alias in node.names:
                if alias.name in known:
                    found.add(alias.name)
    return found


def main() -> None:
    known = safe_modules()
    assert known, "no safe engine modules discovered"

    roots: set[str] = set()
    for route_name, generator in unified.SPECIALIZED_ENGINES:
        module_name = getattr(generator, "__module__", "")
        assert module_name in known, f"runtime route {route_name} points outside safe engine modules: {module_name}"
        roots.add(module_name)

    reachable = set(roots)
    pending = list(roots)
    while pending:
        current = pending.pop()
        for child in safe_imports(current, known):
            if child not in reachable:
                reachable.add(child)
                pending.append(child)

    orphaned = sorted(known - reachable)
    assert not orphaned, "orphan safe engine modules not reachable from Unified runtime: " + ", ".join(orphaned)

    print(f"PASS_UNIFIED_SAFE_ENGINE_RUNTIME_REACHABILITY modules={len(known)} roots={len(roots)} reachable={len(reachable)}")


if __name__ == "__main__":
    main()
