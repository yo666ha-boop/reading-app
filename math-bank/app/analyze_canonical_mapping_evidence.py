from __future__ import annotations

import argparse
import hashlib
import json
import re
import zipfile
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

CANONICAL_ZIP_SHA256 = "eb93279a52dd49191612a52ac0df2df2fdd865c8975d815547daa126b4398175"
EXPECTED = 1231
CORE = ("id", "stage", "unit", "title", "q", "choices", "ans", "explanation")
IMAGE_MARKER_RE = re.compile(r"\[\[IMAGE:([^\]\r\n]+)\]\]")
ID_TOKEN_RE = re.compile(r"[A-Za-z]+|\d+|[^A-Za-z\d]+")
TEXT_EXTS = {".txt", ".md", ".html", ".htm", ".js", ".json", ".jsonl", ".csv"}


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def load_json_records_bytes(name: str, data: bytes) -> list[dict] | None:
    try:
        text = data.decode("utf-8")
        if name.lower().endswith(".jsonl"):
            rows = [json.loads(line) for line in text.splitlines() if line.strip()]
            return rows if isinstance(rows, list) else None
        obj = json.loads(text)
    except Exception:
        return None
    if isinstance(obj, list):
        return obj
    if isinstance(obj, dict) and isinstance(obj.get("records"), list):
        return obj["records"]
    return None


def scalar_token(value: Any) -> str | None:
    if value is None:
        return "<null>"
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, (str, int, float)):
        return str(value)
    return None


def shape_signature(rid: str) -> str:
    parts = ID_TOKEN_RE.findall(rid)
    return "".join("{N}" if p.isdigit() else ("{A}" if p.isalpha() else p) for p in parts)


def prefix_signature(rid: str) -> str:
    m = re.match(r"([^0-9]*?)\d", rid)
    if m:
        return m.group(1) or "<starts-with-number>"
    return rid[:32] if rid else "<blank>"


def collect_marker_refs(value: Any) -> list[str]:
    refs: list[str] = []
    if isinstance(value, str):
        refs.extend(x.strip() for x in IMAGE_MARKER_RE.findall(value) if x.strip())
    elif isinstance(value, list):
        for item in value:
            refs.extend(collect_marker_refs(item))
    elif isinstance(value, dict):
        for item in value.values():
            refs.extend(collect_marker_refs(item))
    return refs


def record_evidence(rows: list[dict]) -> dict:
    key_presence = Counter()
    key_types: dict[str, Counter[str]] = defaultdict(Counter)
    scalar_values: dict[str, Counter[str]] = defaultdict(Counter)
    id_shapes = Counter()
    id_prefixes = Counter()
    stages = Counter()
    units = Counter()
    titles = Counter()
    choice_lengths = Counter()
    marker_fields = Counter()
    marker_refs = Counter()
    extra_keys = Counter()
    malformed = 0

    for row in rows:
        if not isinstance(row, dict):
            malformed += 1
            continue
        rid = row.get("id")
        if isinstance(rid, str):
            id_shapes[shape_signature(rid)] += 1
            id_prefixes[prefix_signature(rid)] += 1
        for key, value in row.items():
            key_presence[key] += 1
            key_types[key][type(value).__name__] += 1
            token = scalar_token(value)
            if token is not None:
                scalar_values[key][token] += 1
            if key not in CORE:
                extra_keys[key] += 1
            refs = collect_marker_refs(value)
            if refs:
                marker_fields[key] += len(refs)
                marker_refs.update(refs)
        if isinstance(row.get("stage"), (str, int, float, bool)) or row.get("stage") is None:
            stages[str(row.get("stage"))] += 1
        if isinstance(row.get("unit"), (str, int, float, bool)) or row.get("unit") is None:
            units[str(row.get("unit"))] += 1
        if isinstance(row.get("title"), str):
            titles[row["title"]] += 1
        choices = row.get("choices")
        if choices is None:
            choice_lengths["null"] += 1
        elif isinstance(choices, list):
            choice_lengths[str(len(choices))] += 1
        else:
            choice_lengths[f"type:{type(choices).__name__}"] += 1

    common_keys = sorted(k for k, n in key_presence.items() if n == len(rows))
    core_present_all = all(key_presence.get(k, 0) == len(rows) for k in CORE)

    source_value_hits = {}
    for key, counts in scalar_values.items():
        hits = {name: counts.get(name, 0) for name in ("Winpass", "実力錬成", "Standard", "generated") if counts.get(name, 0)}
        if hits:
            source_value_hits[key] = hits

    variant_key_candidates = sorted(
        key for key in key_presence
        if re.search(r"variant|parent|generated|original|source|book|教材|出典|親|類題", key, re.I)
    )

    return {
        "records": len(rows),
        "malformed_non_object_records": malformed,
        "recorded_core_present_all": core_present_all,
        "common_keys": common_keys,
        "key_presence": dict(key_presence.most_common()),
        "key_types": {k: dict(v.most_common()) for k, v in sorted(key_types.items())},
        "extra_keys_beyond_recorded_core": dict(extra_keys.most_common()),
        "stage_values": dict(stages.most_common()),
        "unit_values_top100": dict(units.most_common(100)),
        "distinct_unit_values": len(units),
        "title_values_top50": dict(titles.most_common(50)),
        "distinct_title_values": len(titles),
        "choice_lengths": dict(choice_lengths.most_common()),
        "id_shape_signatures": dict(id_shapes.most_common(100)),
        "id_prefix_signatures": dict(id_prefixes.most_common(100)),
        "source_literal_hits_by_field": source_value_hits,
        "variant_or_source_key_candidates": variant_key_candidates,
        "image_marker_fields": dict(marker_fields.most_common()),
        "image_marker_refs": dict(marker_refs.most_common()),
        "distinct_image_marker_refs": len(marker_refs),
        "policy": "Evidence only. Counts, keys, exact scalar values, ID signatures, and image markers are reported; no grade/source/variant/skill/difficulty/format mapping is inferred.",
    }


def text_reference_evidence(zf: zipfile.ZipFile, member_names: list[str], candidate_keys: set[str]) -> dict:
    interesting_terms = set(CORE) | candidate_keys | {
        "grade", "skill", "difficulty", "question_format", "source", "book",
        "parent_id", "figure_refs", "variant_group", "prerequisites",
        "Winpass", "実力錬成", "Standard", "generated", "[[IMAGE:",
    }
    evidence: dict[str, list[dict]] = defaultdict(list)
    for name in member_names:
        suffix = Path(name).suffix.lower()
        if suffix not in TEXT_EXTS:
            continue
        try:
            text = zf.read(name).decode("utf-8")
        except Exception:
            continue
        lines = text.splitlines()
        for line_no, line in enumerate(lines, 1):
            if len(line) > 2000:
                continue
            for term in sorted(interesting_terms, key=len, reverse=True):
                if term not in line:
                    continue
                bucket = evidence[term]
                if len(bucket) >= 20:
                    continue
                snippet = line.strip()
                if len(snippet) > 400:
                    snippet = snippet[:400] + "…"
                bucket.append({"member": name, "line": line_no, "snippet": snippet})
    return dict(evidence)


def main() -> int:
    ap = argparse.ArgumentParser(description="Analyze only mapping evidence inside the immutable final canonical ZIP. No transformation or inference.")
    ap.add_argument("source")
    ap.add_argument("--output", default="")
    args = ap.parse_args()
    source = Path(args.source)
    if not source.is_file():
        raise SystemExit(f"BLOCKED source not found: {source}")
    if source.suffix.lower() != ".zip":
        raise SystemExit("BLOCKED exact canonical ZIP required")

    actual_hash = sha256_file(source)
    if actual_hash != CANONICAL_ZIP_SHA256:
        report = {
            "status": "BLOCKED_ZIP_SHA256_MISMATCH",
            "source": str(source),
            "actual_sha256": actual_hash,
            "expected_sha256": CANONICAL_ZIP_SHA256,
        }
        print(json.dumps(report, ensure_ascii=False, indent=2))
        return 4

    candidates = []
    with zipfile.ZipFile(source) as zf:
        names = [i.filename for i in zf.infolist() if not i.is_dir()]
        for name in names:
            if Path(name).suffix.lower() not in {".json", ".jsonl"}:
                continue
            try:
                data = zf.read(name)
            except Exception:
                continue
            rows = load_json_records_bytes(name, data)
            if rows is None:
                continue
            evidence = record_evidence(rows)
            candidate = {
                "member": name,
                "member_sha256": hashlib.sha256(data).hexdigest(),
                **evidence,
                "exact_1231": len(rows) == EXPECTED,
            }
            candidate["classification"] = (
                "EXACT_1231_MAPPING_EVIDENCE_TARGET" if len(rows) == EXPECTED else "NON_1231_JSON"
            )
            candidates.append(candidate)

        exact_candidates = [c for c in candidates if c["exact_1231"]]
        candidate_keys = set()
        for c in exact_candidates:
            candidate_keys.update(c["common_keys"])
            candidate_keys.update(c["variant_or_source_key_candidates"])
        text_evidence = text_reference_evidence(zf, names, candidate_keys)

    report = {
        "status": "PASS_MAPPING_EVIDENCE_INSPECTION",
        "source": str(source),
        "canonical_zip_sha256": actual_hash,
        "exact_1231_candidates": len([c for c in candidates if c["exact_1231"]]),
        "json_candidates": candidates,
        "loader_audit_text_references": text_evidence,
        "decision_rule": (
            "Use only exact fields, scalar values, ID patterns, image markers, and loader/audit references shown here to define a deterministic mapping. "
            "Absence of evidence is not permission to invent metadata."
        ),
    }
    output = json.dumps(report, ensure_ascii=False, indent=2) + "\n"
    if args.output:
        out = Path(args.output)
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(output, encoding="utf-8")
    print(output, end="")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
