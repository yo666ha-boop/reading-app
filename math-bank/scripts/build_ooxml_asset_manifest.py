from __future__ import annotations

import argparse
import hashlib
import json
import zipfile
from collections import Counter
from io import BytesIO
from pathlib import Path
from xml.etree import ElementTree as ET

import extract_ooxml_structure as ooxml
import rebuild_source_doc_manifest as doc_manifest


def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def relationship_rows(zf: zipfile.ZipFile) -> list[dict]:
    path = "word/_rels/document.xml.rels"
    if path not in zf.namelist():
        return []
    root = ET.fromstring(zf.read(path))
    rows: list[dict] = []
    for rel in root:
        rid = rel.get("Id")
        target = rel.get("Target")
        rel_type = rel.get("Type")
        if not rid or not target:
            continue
        if target.startswith("/"):
            normalized = target.lstrip("/")
        else:
            normalized = str(Path("word") / target).replace("\\", "/")
        parts: list[str] = []
        for part in normalized.split("/"):
            if part in {"", "."}:
                continue
            if part == "..":
                if parts:
                    parts.pop()
                continue
            parts.append(part)
        rows.append({
            "relationship_id": rid,
            "target": "/".join(parts),
            "relationship_type": rel_type,
        })
    return rows


def extract_asset_identity(data: bytes, *, source: str, document: str, document_sha256: str) -> dict:
    with zipfile.ZipFile(BytesIO(data)) as zf:
        names = set(zf.namelist())
        rels = relationship_rows(zf)
        media_members = sorted(
            name for name in names if name.startswith("word/media/") and not name.endswith("/")
        )
        assets: list[dict] = []
        rels_by_target: dict[str, list[str]] = {}
        for rel in rels:
            rels_by_target.setdefault(rel["target"], []).append(rel["relationship_id"])
        for target in media_members:
            blob = zf.read(target)
            assets.append({
                "target": target,
                "asset_sha256": sha256_bytes(blob),
                "bytes": len(blob),
                "relationship_ids": sorted(rels_by_target.get(target, [])),
            })
        referenced_media = sorted({
            rel["target"] for rel in rels if rel["target"].startswith("word/media/")
        })
        missing_targets = sorted(target for target in referenced_media if target not in names)
        unreferenced_media = sorted(target for target in media_members if target not in referenced_media)
        return {
            "source": source,
            "document": document,
            "document_sha256": document_sha256,
            "assets": assets,
            "media_member_count": len(media_members),
            "referenced_media_count": len(referenced_media),
            "missing_targets": missing_targets,
            "unreferenced_media": unreferenced_media,
        }


def build_report(source_dir: Path) -> dict:
    manifest = doc_manifest.build_report(source_dir)
    if not manifest.get("ready_for_ooxml_extraction"):
        return {
            "workflow": "Math OOXML asset identity manifest",
            "ready": False,
            "documents": [],
            "errors": ["SOURCE_DOC_MANIFEST_GATE_FAILED"],
        }

    documents: list[dict] = []
    errors: list[dict] = []
    for doc in manifest["documents"]:
        try:
            data = ooxml.locate_document_bytes(source_dir, manifest["source_identity"], doc)
            actual_doc_sha = sha256_bytes(data)
            if actual_doc_sha != doc["sha256"]:
                raise ValueError(
                    f"DOCX_SHA_CHANGED_AFTER_MANIFEST:{actual_doc_sha}!={doc['sha256']}"
                )
            documents.append(extract_asset_identity(
                data,
                source=doc["source"],
                document=doc["basename"],
                document_sha256=doc["sha256"],
            ))
        except Exception as exc:
            errors.append({
                "source": doc.get("source"),
                "document": doc.get("basename"),
                "error": f"{type(exc).__name__}: {exc}",
            })

    source_counts = Counter(d["source"] for d in documents)
    assets_total = sum(len(d["assets"]) for d in documents)
    missing_total = sum(len(d["missing_targets"]) for d in documents)
    asset_hashes = [
        asset["asset_sha256"]
        for document in documents
        for asset in document["assets"]
    ]
    ready = (
        not errors
        and len(documents) == 140
        and dict(source_counts) == doc_manifest.EXPECTED_UNIQUE_BY_SOURCE
        and missing_total == 0
        and len(asset_hashes) == assets_total
    )
    return {
        "workflow": "Math OOXML asset identity manifest",
        "ready": ready,
        "documents_by_source": dict(sorted(source_counts.items())),
        "document_count": len(documents),
        "asset_count": assets_total,
        "unique_asset_hashes": len(set(asset_hashes)),
        "missing_relationship_targets": missing_total,
        "errors": errors,
        "documents": documents,
        "policy": (
            "Every embedded word/media asset is identified by SHA-256 and byte length and "
            "cross-linked to exact document relationship IDs/targets. Missing relationship "
            "targets block readiness; graphical answers and figures must use these identities "
            "rather than non-empty placeholders."
        ),
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--source-dir", type=Path, default=Path("math-bank/source"))
    ap.add_argument(
        "--report",
        type=Path,
        default=Path("math-bank/state/source-ooxml-asset-identity-latest.json"),
    )
    ap.add_argument("--strict", action="store_true")
    args = ap.parse_args()
    report = build_report(args.source_dir)
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    summary = {
        key: report.get(key)
        for key in (
            "ready",
            "documents_by_source",
            "document_count",
            "asset_count",
            "unique_asset_hashes",
            "missing_relationship_targets",
            "errors",
        )
    }
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    return 0 if (not args.strict or report.get("ready")) else 8


if __name__ == "__main__":
    raise SystemExit(main())
