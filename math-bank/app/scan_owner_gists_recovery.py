from __future__ import annotations

import hashlib, json, os, re, subprocess, sys, urllib.parse, urllib.request
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

OWNER = os.environ.get("MATH_GIST_OWNER", "yo666ha-boop")
TOKEN = os.environ.get("GITHUB_TOKEN", "")
API = "https://api.github.com"
EXPECTED_SHA256 = "eb93279a52dd49191612a52ac0df2df2fdd865c8975d815547daa126b4398175"
EXPECTED_FILENAME = "みかみ塾数学問題バンク_最終完成版_20260820.zip"
AUDIT_FILENAME = "MATHBANK_FINAL_AUDIT_V2.json"
OUT_REPORT = Path("math-bank/state/github-gist-recovery-latest.json")
OUT_RECOVERY = Path("math-bank/recovered-gist")
MAX_DOWNLOAD_BYTES = 500 * 1024 * 1024
URL_RE = re.compile(r"https?://[^\s)>\]}]+")
ALLOWED_HOST_SUFFIXES = ("github.com", "githubusercontent.com", "githubassets.com")


def request_json(url: str):
    req = urllib.request.Request(url)
    req.add_header("Accept", "application/vnd.github+json")
    req.add_header("X-GitHub-Api-Version", "2022-11-28")
    req.add_header("User-Agent", "math-canonical-recovery")
    # GITHUB_TOKEN is repository-scoped and can return 403 for the public Gist API.
    # Public Gists are intentionally enumerated anonymously; exact downloaded bytes are still SHA-256 checked.
    with urllib.request.urlopen(req, timeout=60) as resp: return json.load(resp)


def paged(url: str) -> list[dict]:
    out=[]; page=1; sep='&' if '?' in url else '?'
    while page <= 20:
        batch=request_json(f"{url}{sep}per_page=100&page={page}")
        if not isinstance(batch,list) or not batch: break
        out.extend(x for x in batch if isinstance(x,dict))
        if len(batch)<100: break
        page+=1
    return out


def host_allowed(url: str) -> bool:
    host=(urllib.parse.urlsplit(url).hostname or '').lower()
    return any(host==s or host.endswith('.'+s) for s in ALLOWED_HOST_SUFFIXES)


def download(url: str) -> bytes:
    cmd=['curl','-fsSL','--max-filesize',str(MAX_DOWNLOAD_BYTES),'-H','User-Agent: math-canonical-recovery']
    cmd.append(url)
    p=subprocess.run(cmd,stdout=subprocess.PIPE,stderr=subprocess.PIPE,timeout=180)
    if p.returncode: raise RuntimeError(p.stderr.decode('utf-8','replace')[:500])
    if len(p.stdout)>MAX_DOWNLOAD_BYTES: raise RuntimeError('download exceeded size cap')
    return p.stdout


def sha256(data: bytes) -> str: return hashlib.sha256(data).hexdigest()

def valid_audit(data: bytes) -> bool:
    try: return isinstance(json.loads(data.decode('utf-8')),dict)
    except Exception: return False


def main() -> int:
    report={
      'scan':'owner_public_gists_exact_math_canonical_recovery','owner':OWNER,
      'expected_filename':EXPECTED_FILENAME,'expected_sha256':EXPECTED_SHA256,'required_audit':AUDIT_FILENAME,
      'gists_seen':0,'files_seen':0,'file_bytes_hashed':0,'text_surfaces_seen':0,'candidate_urls_seen':0,
      'candidate_urls_downloaded':0,'candidate_bytes_hashed':0,'canonical_hits':[],'valid_audit_hits':[],
      'paired_recovery_hits':[],'text_exact_filename_mentions':0,'text_audit_mentions':0,'text_expected_sha_mentions':0,
      'errors':[],'exact_coverage_complete':False,'recorded_at_utc':None,
      'policy':'Public Gists are enumerated anonymously because the repository-scoped Actions token is not a Gist credential. Every public gist file is fetched and SHA-256 checked; GitHub-hosted URLs near canonical/audit/SHA mentions are also hashed. Pairing requires exact canonical SHA plus one valid named audit within the same gist. No reconstruction.'}
    try:
      gists=paged(f'{API}/users/{OWNER}/gists')
      report['gists_seen']=len(gists)
      by_gist_c=defaultdict(list); by_gist_a=defaultdict(list); seen_urls=set()
      for summary in gists:
        gid=str(summary.get('id') or '')
        full=request_json(f'{API}/gists/{gid}')
        files=full.get('files') or {}
        for name,meta in files.items():
          report['files_seen']+=1
          raw=str(meta.get('raw_url') or '')
          try:
            data=download(raw) if raw else str(meta.get('content') or '').encode()
          except Exception as exc:
            report['errors'].append({'gist_id':gid,'file':name,'error':str(exc)}); continue
          report['file_bytes_hashed']+=len(data)
          digest=sha256(data)
          item={'gist_id':gid,'file':name,'bytes':len(data),'sha256':digest,'raw_url':raw}
          if digest==EXPECTED_SHA256:
            report['canonical_hits'].append(item); by_gist_c[gid].append((item,data))
          if name==AUDIT_FILENAME and valid_audit(data):
            report['valid_audit_hits'].append(item); by_gist_a[gid].append((item,data))
          text=data.decode('utf-8','replace')
          report['text_surfaces_seen']+=1
          low=text.lower(); matched=(EXPECTED_FILENAME.lower() in low or AUDIT_FILENAME.lower() in low or EXPECTED_SHA256 in low)
          report['text_exact_filename_mentions'] += int(EXPECTED_FILENAME.lower() in low)
          report['text_audit_mentions'] += int(AUDIT_FILENAME.lower() in low)
          report['text_expected_sha_mentions'] += int(EXPECTED_SHA256 in low)
          if matched:
            for url in URL_RE.findall(text):
              url=url.rstrip(".,;:'\"")
              if not host_allowed(url) or (gid,url) in seen_urls: continue
              seen_urls.add((gid,url)); report['candidate_urls_seen']+=1
              try: payload=download(url)
              except Exception as exc:
                report['errors'].append({'gist_id':gid,'url':url,'error':str(exc)}); continue
              report['candidate_urls_downloaded']+=1; report['candidate_bytes_hashed']+=len(payload)
              dg=sha256(payload); meta2={'gist_id':gid,'url':url,'bytes':len(payload),'sha256':dg}
              if dg==EXPECTED_SHA256:
                report['canonical_hits'].append(meta2); by_gist_c[gid].append((meta2,payload))
              if AUDIT_FILENAME.lower() in url.lower() and valid_audit(payload):
                report['valid_audit_hits'].append(meta2); by_gist_a[gid].append((meta2,payload))
      OUT_RECOVERY.mkdir(parents=True,exist_ok=True)
      for gid,cs in by_gist_c.items():
        audits={sha256(d):(m,d) for m,d in by_gist_a.get(gid,[])}
        if not cs or len(audits)!=1: continue
        cm,cd=cs[0]; am,ad=next(iter(audits.values()))
        report['paired_recovery_hits'].append({'gist_id':gid,'canonical':cm,'audit':am})
        (OUT_RECOVERY/EXPECTED_FILENAME).write_bytes(cd); (OUT_RECOVERY/AUDIT_FILENAME).write_bytes(ad); break
      report['exact_coverage_complete']=not report['errors']
    except Exception as exc:
      report['errors'].append({'scope':'gist_enumeration','error':str(exc)[:1000]})
    report['recorded_at_utc']=datetime.now(timezone.utc).isoformat()
    OUT_REPORT.parent.mkdir(parents=True,exist_ok=True)
    OUT_REPORT.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,ensure_ascii=False,indent=2))
    return 0 if report['exact_coverage_complete'] else 3

if __name__=='__main__': raise SystemExit(main())
