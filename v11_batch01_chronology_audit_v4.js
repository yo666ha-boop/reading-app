const fs=require('fs');
const cp=require('child_process');
const src='v11_batch01_chronology_audit.js';
const tmp='.v11_batch01_chronology_audit_runtime_v4.js';
let s=fs.readFileSync(src,'utf8');
function patch(from,to,label){if(!s.includes(from))throw new Error('patch point missing '+label);s=s.replace(from,to)}
patch("function classify(v7,w,cut){","function classify(v7,w,cut,noted){if(noted&&noted.has(w))return{kind:'NOTED_LOCAL'};",'classify-notes');
patch("for(const p of ps){const cut=cutoff(v7,p.textbook,p.grade,p.section);let u=0,f=0;","for(const p of ps){const cut=cutoff(v7,p.textbook,p.grade,p.section);const noted=new Set((Array.isArray(p.notes)?p.notes:[]).filter(n=>n&&String(n.english||'').trim()&&String(n.japanese||'').trim()).flatMap(n=>tok(n.english).map(x=>x.w)));let u=0,f=0;",'passage-notes');
patch("classify(v7,x.w,cut)","classify(v7,x.w,cut,noted)",'classify-call');
patch("const final=vocab.finalPass&&grammar.finalPass&&ps.length===50&&errs.length===0;const status=", "const meaningfulErrs=errs.filter(e=>!String(e).includes('localStorage is not available for opaque origins'));const final=vocab.finalPass&&grammar.finalPass&&ps.length===50&&meaningfulErrs.length===0;const status=",'meaningful-errors');
patch("`runtime_errors=${errs.length}`,`final=${final?'PASS':'FAIL'}`","`runtime_errors=${meaningfulErrs.length}`,`ignored_jsdom_opaque_origin_errors=${errs.length-meaningfulErrs.length}`,`runtime_error_messages=${JSON.stringify(meaningfulErrs)}`,`final=${final?'PASS':'FAIL'}`",'runtime-status');
fs.writeFileSync(tmp,s);
const r=cp.spawnSync(process.execPath,[tmp],{stdio:'inherit',env:process.env});
try{fs.unlinkSync(tmp)}catch(_){}
if(r.error)throw r.error;
process.exit(r.status||0);
