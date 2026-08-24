from __future__ import annotations

import hashlib
import importlib.util
import tempfile
import zipfile
from pathlib import Path

MODULE_PATH=Path(__file__).with_name('build_source_member_manifest.py')
spec=importlib.util.spec_from_file_location('build_source_member_manifest',MODULE_PATH)
assert spec and spec.loader
m=importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)


def make_zip(path:Path, docs:int)->str:
    with zipfile.ZipFile(path,'w',compression=zipfile.ZIP_DEFLATED) as zf:
        for i in range(docs):
            zf.writestr(f'd{i}/MATH.json','{"items":[]}')
        zf.writestr('assets/a.png',b'abc')
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main()->None:
    with tempfile.TemporaryDirectory() as td:
        root=Path(td)
        names=[('winpass',2),('jitsuren',1),('standard',1)]
        specs={}
        for logical,n in names:
            p=root/f'{logical}データ(1).zip'
            sha=make_zip(p,n)
            specs[logical]={'canonical_name':f'{logical}データ.zip','sha256':sha,'historical_original_records':n,'historical_raw_diagnostic_records':n}
        old_specs=m.v.EXPECTED_ARCHIVES
        old_targets=m.DOC_TARGET.copy()
        try:
            m.v.EXPECTED_ARCHIVES=specs
            m.DOC_TARGET={'winpass':2,'jitsuren':1,'standard':1}
            report=m.build(root)
        finally:
            m.v.EXPECTED_ARCHIVES=old_specs
            m.DOC_TARGET=old_targets
        assert report['ready_for_raw_extraction'] is False  # historical 140 is intentionally not count-forced in fixture
        assert report['math_json_documents_total']==4
        assert report['sources']['winpass']['math_json_documents']==2
        assert report['sources']['winpass']['figure_members']==1
        assert all(r['sha256'] for r in report['sources']['winpass']['members'])
        assert report['manifest_sha256']

        # Verify deterministic manifest fingerprint for the same bytes/order.
        try:
            m.v.EXPECTED_ARCHIVES=specs
            m.DOC_TARGET={'winpass':2,'jitsuren':1,'standard':1}
            report2=m.build(root)
        finally:
            m.v.EXPECTED_ARCHIVES=old_specs
            m.DOC_TARGET=old_targets
        assert report2['manifest_sha256']==report['manifest_sha256']

    print('PASS_MATH_SOURCE_MEMBER_SHA256_MANIFEST_DETERMINISM_TEST')

if __name__=='__main__':
    main()
