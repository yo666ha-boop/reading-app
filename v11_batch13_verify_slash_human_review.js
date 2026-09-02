'use strict';
const fs=require('fs');
const crypto=require('crypto');
const cp=require('child_process');
function die(m){throw new Error(m)}
function stable(x){if(Array.isArray(x))return '['+x.map(stable).join(',')+']';if(x&&typeof x==='object')return '{'+Object.keys(x).sort().map(k=>JSON.stringify(k)+':'+stable(x[k])).join(',')+'}';return JSON.stringify(x)}
const r=cp.spawnSync(process.execPath,['v11_batch13_build_slash_review_packet.js'],{encoding:'utf8'});
if(r.status!==0)die(`packet rebuild failed\n${r.stderr||r.stdout}`);
const p=JSON.parse(fs.readFileSync('v11_batch13_slash_review_packet.json','utf8'));
const m=JSON.parse(fs.readFileSync('v11_batch13_slash_human_review_manifest.json','utf8'));
if(m.batch!=='V11-B13'||m.registered!==false||m.humanReviewed!==true||m.qualityDecision!=='PASS')die('manifest metadata');
if(p.registered!==false||p.batch!=='V11-B13')die('packet metadata');
const s=p.summary||{};
for(const k of ['passages','rows','groups11','groups12','groups21'])if(s[k]!==m[k])die(`summary mismatch ${k}: packet=${s[k]} manifest=${m[k]}`);
const proj={batch:p.batch,passages:p.passages.map(x=>({id:x.id,rows:x.rows.map(r=>({en:r.en,jp:r.jp,enSentenceCount:r.enSentenceCount,jpSentenceCount:r.jpSentenceCount,suggestedEn:r.suggestedEn,suggestedJp:r.suggestedJp}))}))};
const digest=crypto.createHash('sha256').update(stable(proj)).digest('hex');
if(digest!==m.packetProjectionSha256)die(`human-reviewed packet digest mismatch ${digest}`);
let rows=0,illegal=0;for(const x of p.passages||[])for(const r of x.rows||[]){rows++;if(![[1,1],[1,2],[2,1]].some(([a,b])=>r.enSentenceCount===a&&r.jpSentenceCount===b))illegal++;}
if(rows!==558||illegal)die(`slash rows illegal rows=${rows} illegal=${illegal}`);
const out={batch:'V11-B13',registered:false,gate:'SLASH_HUMAN_REVIEW',status:'PASS',humanReviewed:true,passages:s.passages,rows:s.rows,groups11:s.groups11,groups12:s.groups12,groups21:s.groups21,packetProjectionSha256:digest,manifestStage:m.reviewStage};
fs.writeFileSync('v11_batch13_slash_human_gate.json',JSON.stringify(out,null,2));
console.log(JSON.stringify(out));
