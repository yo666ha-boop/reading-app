from __future__ import annotations

import argparse
import json
import re
import zipfile
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from xml.etree import ElementTree as ET

import rebuild_source_doc_manifest as doc_manifest
import verify_source_archives as verifier

W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
R_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
REL_NS = "http://schemas.openxmlformats.org/package/2006/relationships"
A_NS = "http://schemas.openxmlformats.org/drawingml/2006/main"
V_NS = "urn:schemas-microsoft-com:vml"


def local(tag: str) -> str:
    return tag.rsplit("}", 1)[-1] if "}" in tag else tag


def qn(ns: str, name: str) -> str:
    return f"{{{ns}}}{name}"


def paragraph_text(p: ET.Element) -> str:
    out: list[str] = []
    for node in p.iter():
        name = local(node.tag)
        if name in {"t", "instrText", "delText"} and node.text:
            out.append(node.text)
        elif name == "tab":
            out.append("\t")
        elif name in {"br", "cr"}:
            out.append("\n")
        elif name == "noBreakHyphen":
            out.append("‑")
        elif name == "softHyphen":
            out.append("\u00ad")
    return "".join(out)


def paragraph_style(p: ET.Element) -> str | None:
    ppr = p.find(qn(W_NS, "pPr"))
    if ppr is None:
        return None
    style = ppr.find(qn(W_NS, "pStyle"))
    return style.get(qn(W_NS, "val")) if style is not None else None


def paragraph_numbering(p: ET.Element) -> dict | None:
    ppr = p.find(qn(W_NS, "pPr"))
    if ppr is None:
        return None
    numpr = ppr.find(qn(W_NS, "numPr"))
    if numpr is None:
        return None
    ilvl = numpr.find(qn(W_NS, "ilvl"))
    numid = numpr.find(qn(W_NS, "numId"))
    return {
        "ilvl": ilvl.get(qn(W_NS, "val")) if ilvl is not None else None,
        "num_id": numid.get(qn(W_NS, "val")) if numid is not None else None,
    }


def relationships(zf: zipfile.ZipFile) -> dict[str, str]:
    path = "word/_rels/document.xml.rels"
    if path not in zf.namelist():
        return {}
    root = ET.fromstring(zf.read(path))
    out = {}
    for rel in root:
        rid = rel.get("Id")
        target = rel.get("Target")
        if rid and target:
            if target.startswith("/"):
                normalized = target.lstrip("/")
            else:
                normalized = str(Path("word") / target).replace("\\", "/")
            # Collapse word/../foo style paths without filesystem access.
            parts: list[str] = []
            for part in normalized.split("/"):
                if part in {"", "."}:
                    continue
                if part == "..":
                    if parts:
                        parts.pop()
                    continue
                parts.append(part)
            out[rid] = "/".join(parts)
    return out


def paragraph_images(p: ET.Element, rels: dict[str, str]) -> list[dict]:
    found: list[dict] = []
    seen: set[tuple[str | None, str | None]] = set()
    for node in p.iter():
        name = local(node.tag)
        rid = None
        if name == "blip":
            rid = node.get(qn(R_NS, "embed")) or node.get(qn(R_NS, "link"))
        elif name == "imagedata":
            rid = node.get(qn(R_NS, "id"))
        if rid:
            target = rels.get(rid)
            key = (rid, target)
            if key not in seen:
                seen.add(key)
                found.append({"relationship_id": rid, "target": target})
    return found


def contains_math(p: ET.Element) -> bool:
    return any(local(node.tag) in {"oMath", "oMathPara", "f", "rad", "sSub", "sSup", "sSubSup"} for node in p.iter())


def contains_textbox(p: ET.Element) -> bool:
    return any(local(node.tag) in {"txbxContent", "textbox"} for node in p.iter())


def emit_paragraph(p: ET.Element, path: str, rels: dict[str, str], out: list[dict]) -> None:
    text = paragraph_text(p)
    out.append({
        "path": path,
        "paragraph_index": len(out),
        "text": text,
        "text_stripped": text.strip(),
        "style": paragraph_style(p),
        "numbering": paragraph_numbering(p),
        "has_math": contains_math(p),
        "has_textbox": contains_textbox(p),
        "images": paragraph_images(p, rels),
    })


def walk_blocks(parent: ET.Element, base: str, rels: dict[str, str], out: list[dict]) -> None:
    p_i = 0
    tbl_i = 0
    other_i = 0
    for child in list(parent):
        name = local(child.tag)
        if name == "p":
            emit_paragraph(child, f"{base}/p[{p_i}]", rels, out)
            p_i += 1
        elif name == "tbl":
            table_path = f"{base}/tbl[{tbl_i}]"
            tbl_i += 1
            tr_i = 0
            for tr in [x for x in list(child) if local(x.tag) == "tr"]:
                tc_i = 0
                for tc in [x for x in list(tr) if local(x.tag) == "tc"]:
                    walk_blocks(tc, f"{table_path}/tr[{tr_i}]/tc[{tc_i}]", rels, out)
                    tc_i += 1
                tr_i += 1
        else:
            # Preserve block-level paragraphs nested under content controls/custom XML.
            nested = [x for x in list(child) if local(x.tag) in {"p", "tbl", "sdt", "customXml"}]
            if nested:
                walk_blocks(child, f"{base}/{name}[{other_i}]", rels, out)
            other_i += 1


def extract_docx_bytes(data: bytes, *, source: str, basename: str, document_sha256: str) -> dict:
    from io import BytesIO

    with zipfile.ZipFile(BytesIO(data)) as zf:
        if "word/document.xml" not in zf.namelist():
            raise ValueError("DOCX_MISSING_WORD_DOCUMENT_XML")
        rels = relationships(zf)
        root = ET.fromstring(zf.read("word/document.xml"))
        body = next((x for x in root.iter() if local(x.tag) == "body"), None)
        if body is None:
            raise ValueError("DOCX_MISSING_BODY")
        paragraphs: list[dict] = []
        walk_blocks(body, "body", rels, paragraphs)
        media_members = sorted(name for name in zf.namelist() if name.startswith("word/media/") and not name.endswith("/"))
        referenced = sorted({img["target"] for p in paragraphs for img in p["images"] if img.get("target")})
        missing_image_targets = sorted(t for t in referenced if t not in zf.namelist())
        return {
            "source": source,
            "document": basename,
            "document_sha256": document_sha256,
            "paragraph_count": len(paragraphs),
            "nonblank_paragraph_count": sum(bool(p["text_stripped"]) for p in paragraphs),
            "math_paragraph_count": sum(bool(p["has_math"]) for p in paragraphs),
            "textbox_paragraph_count": sum(bool(p["has_textbox"]) for p in paragraphs),
            "image_reference_count": sum(len(p["images"]) for p in paragraphs),
            "media_member_count": len(media_members),
            "media_members": media_members,
            "missing_image_targets": missing_image_targets,
            "paragraphs": paragraphs,
        }


def locate_document_bytes(source_dir: Path, source_identity: dict, doc: dict) -> bytes:
    archive_name = doc["archive_name"]
    member = doc["member"]
    selected_paths = {
        Path(item["selected"]["path"]).name: Path(item["selected"]["path"])
        for item in source_identity["archives"].values()
        if item.get("selected")
    }
    archive_path = selected_paths.get(archive_name)
    if archive_path is None:
        raise FileNotFoundError(f"ARCHIVE_NOT_SELECTED:{archive_name}")
    with zipfile.ZipFile(archive_path) as zf:
        return zf.read(member)


def build_report(source_dir: Path) -> dict:
    manifest = doc_manifest.build_report(source_dir)
    if not manifest.get("ready_for_ooxml_extraction"):
        return {
            "workflow": "Math OOXML Structure Extraction",
            "recorded_at_utc": datetime.now(timezone.utc).isoformat(),
            "source_doc_manifest": manifest,
            "ready": False,
            "documents": [],
            "errors": ["SOURCE_DOC_MANIFEST_GATE_FAILED"],
        }
    documents = []
    errors = []
    for doc in manifest["documents"]:
        try:
            data = locate_document_bytes(source_dir, manifest["source_identity"], doc)
            if doc_manifest.sha256_bytes(data) != doc["sha256"]:
                raise ValueError("DOCX_SHA_CHANGED_AFTER_MANIFEST")
            documents.append(extract_docx_bytes(data, source=doc["source"], basename=doc["basename"], document_sha256=doc["sha256"]))
        except Exception as exc:
            errors.append({"document": doc["basename"], "source": doc["source"], "error": f"{type(exc).__name__}: {exc}"})
    source_counts = Counter(d["source"] for d in documents)
    totals = {
        "documents": len(documents),
        "paragraphs": sum(d["paragraph_count"] for d in documents),
        "nonblank_paragraphs": sum(d["nonblank_paragraph_count"] for d in documents),
        "math_paragraphs": sum(d["math_paragraph_count"] for d in documents),
        "textbox_paragraphs": sum(d["textbox_paragraph_count"] for d in documents),
        "image_references": sum(d["image_reference_count"] for d in documents),
        "media_members": sum(d["media_member_count"] for d in documents),
        "missing_image_targets": sum(len(d["missing_image_targets"]) for d in documents),
    }
    ready = not errors and len(documents) == 140 and dict(source_counts) == doc_manifest.EXPECTED_UNIQUE_BY_SOURCE and totals["missing_image_targets"] == 0
    return {
        "workflow": "Math OOXML Structure Extraction",
        "recorded_at_utc": datetime.now(timezone.utc).isoformat(),
        "source_doc_manifest_summary": {
            "raw_docx_count": manifest["raw_docx_count"],
            "unique_docx_count": manifest["unique_docx_count"],
            "unique_docx_by_source": manifest["unique_docx_by_source"],
            "gates": manifest["gates"],
        },
        "documents_by_source": dict(sorted(source_counts.items())),
        "totals": totals,
        "errors": errors,
        "ready_for_problem_answer_segmentation": ready,
        "documents": documents,
        "policy": "Every w:p is kept as its own ordered paragraph. w:t and m:t are both retained; tables, nested content controls, textboxes, and image relationship targets are preserved before problem/answer segmentation.",
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--source-dir", type=Path, default=Path("math-bank/source"))
    ap.add_argument("--report", type=Path, default=Path("math-bank/state/source-ooxml-structure-latest.json"))
    ap.add_argument("--strict", action="store_true")
    args = ap.parse_args()
    report = build_report(args.source_dir)
    args.report.parent.mkdir(parents=True, exist_ok=True)
    args.report.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    summary = {k: report.get(k) for k in ["documents_by_source", "totals", "errors", "ready_for_problem_answer_segmentation"]}
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    return 0 if (not args.strict or report.get("ready_for_problem_answer_segmentation")) else 7


if __name__ == "__main__":
    raise SystemExit(main())
