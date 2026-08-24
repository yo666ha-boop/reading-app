from __future__ import annotations

import hashlib
import importlib.util
import tempfile
import zipfile
from pathlib import Path

MODULE_PATH = Path(__file__).with_name("profile_source_archives.py")
spec = importlib.util.spec_from_file_location("profile_source_archives", MODULE_PATH)
assert spec and spec.loader
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)


def make_source(path: Path, doc_count: int) -> str:
    with zipfile.ZipFile(path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        for i in range(doc_count):
            zf.writestr(f"doc{i:03d}/MATH.json", '{"grade":1,"unit":"u","items":[]}')
        zf.writestr("assets/figure.png", b"png")
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> None:
    with tempfile.TemporaryDirectory() as td:
        root = Path(td)
        a = root / "aデータ(1).zip"
        b = root / "bデータ.zip"
        a_sha = make_source(a, 2)
        b_sha = make_source(b, 1)
        specs = {
            "a": {"canonical_name":"aデータ.zip","sha256":a_sha,"historical_original_records":2,"historical_raw_diagnostic_records":2},
            "b": {"canonical_name":"bデータ.zip","sha256":b_sha,"historical_original_records":1,"historical_raw_diagnostic_records":1},
        }
        report = m.build_profile(root, specs, {"a":2,"b":1})
        assert report["source_identity"]["ready_for_rebuild_pipeline"] is True
        assert report["math_json_documents_total"] == 3
        assert report["all_source_document_counts_match"] is True
        assert report["all_math_json_parse_clean"] is True
        assert report["ready_for_record_extraction"] is True
        assert report["source_profiles"]["a"]["math_json_documents"] == 2
        assert report["source_profiles"]["a"]["image_asset_members"] == 1

        # A historical document-count mismatch must block record extraction rather than being count-forced.
        mismatch = m.build_profile(root, specs, {"a":3,"b":1})
        assert mismatch["ready_for_record_extraction"] is False
        assert mismatch["source_profiles"]["a"]["historical_document_count_match"] is False

    print("PASS_MATH_SOURCE_STRUCTURE_PROFILE_EXACT_DOC_COUNT_AND_JSON_PARSE_GATES")


if __name__ == "__main__":
    main()
