from __future__ import annotations

import hashlib
import io
import zipfile
import unittest

import build_ooxml_asset_manifest as assets


REL_XML = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId5" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/image1.png"/>
  <Relationship Id="rId7" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../word/media/image2.svg"/>
</Relationships>
"""


def docx_bytes(*, include_second: bool = True) -> bytes:
    out = io.BytesIO()
    with zipfile.ZipFile(out, "w") as zf:
        zf.writestr("word/document.xml", "<document/>")
        zf.writestr("word/_rels/document.xml.rels", REL_XML)
        zf.writestr("word/media/image1.png", b"PNGDATA")
        if include_second:
            zf.writestr("word/media/image2.svg", b"<svg/>")
        zf.writestr("word/media/unreferenced.bin", b"EXTRA")
    return out.getvalue()


class AssetIdentityTest(unittest.TestCase):
    def test_asset_hashes_and_relationship_ids_are_bound(self):
        report = assets.extract_asset_identity(
            docx_bytes(),
            source="Standard",
            document="doc.docx",
            document_sha256="a" * 64,
        )
        by_target = {row["target"]: row for row in report["assets"]}
        self.assertEqual(
            by_target["word/media/image1.png"]["asset_sha256"],
            hashlib.sha256(b"PNGDATA").hexdigest(),
        )
        self.assertEqual(by_target["word/media/image1.png"]["relationship_ids"], ["rId5"])
        self.assertEqual(by_target["word/media/image2.svg"]["relationship_ids"], ["rId7"])
        self.assertEqual(report["missing_targets"], [])
        self.assertEqual(report["unreferenced_media"], ["word/media/unreferenced.bin"])

    def test_missing_relationship_target_is_reported(self):
        report = assets.extract_asset_identity(
            docx_bytes(include_second=False),
            source="Standard",
            document="doc.docx",
            document_sha256="a" * 64,
        )
        self.assertEqual(report["missing_targets"], ["word/media/image2.svg"])

    def test_no_relationship_file_keeps_asset_identity(self):
        out = io.BytesIO()
        with zipfile.ZipFile(out, "w") as zf:
            zf.writestr("word/document.xml", "<document/>")
            zf.writestr("word/media/image1.png", b"PNGDATA")
        report = assets.extract_asset_identity(
            out.getvalue(),
            source="Standard",
            document="doc.docx",
            document_sha256="a" * 64,
        )
        self.assertEqual(len(report["assets"]), 1)
        self.assertEqual(report["assets"][0]["relationship_ids"], [])
        self.assertEqual(report["missing_targets"], [])


if __name__ == "__main__":
    unittest.main()
