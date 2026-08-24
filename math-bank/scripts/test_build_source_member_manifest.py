from __future__ import annotations

import hashlib
import tempfile
import zipfile
from pathlib import Path

import build_source_member_manifest as m


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
        targets={'winpass':2,'jitsuren':1,'standard':1}
        report=m.build(root,specs,targets,total_doc_target=4)
        assert report['ready_for_raw_extraction'] is True
        assert report['math_json_documents_total']==4
        assert report['all_document_targets_match'] is True
        assert report['sources']['winpass']['math_json_documents']==2
        assert report['sources']['winpass']['figure_members']==1
        assert all(r['sha256'] for r in report['sources']['winpass']['members'])
        assert report['manifest_sha256']

        report2=m.build(root,specs,targets,total_doc_target=4)
        assert report2['manifest_sha256']==report['manifest_sha256']

        # Historical document mismatch must block before record extraction.
        bad=m.build(root,specs,{'winpass':3,'jitsuren':1,'standard':1},total_doc_target=5)
        assert bad['ready_for_raw_extraction'] is False
        assert bad['sources']['winpass']['historical_document_count_match'] is False

    print('PASS_MATH_SOURCE_MEMBER_SHA256_MANIFEST_DETERMINISM_AND_DOC_GATE_TEST')

if __name__=='__main__':
    main()
