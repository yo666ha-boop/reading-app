'use strict';
const fs=require('fs');
const build=require('./v11_batch12_build_final_candidate.js');
const applyGloss=require('./v11_batch12_apply_verified_gloss.js');
function norm(s){return String(s||'').normalize('NFKC').replace(/[『』]/g,m=>m==='『'?'「':'」').replace(/[“”]/g,'"').replace(/[’‘]/g,"'").replace(/\s+/g,' ').trim();}
function words(s){return (String(s||'').match(/[A-Za-z]+(?:'[A-Za-z]+)*/g)||[]).length;}
function has(h,n){return norm(h).includes(norm(n));}
let x=applyGloss(build());const failures=[];let questions=0,freeWrites=0,notes=0;
if(x.registered!==false||x.officialTotal!==718||x.passages.length!==50)failures.push('state');
for(const p of x.passages){
  const body=String(p.body||((p.sentences||[]).join(' '))), jp=String(p.fullTranslation||'');
  if(!body||!jp)failures.push(p.id+' missing body/translation');
  if(!p.humanSemanticReview)failures.push(p.id+' missing human semantic marker');
  if(!Array.isArray(p.slashRows)||!p.slashRows.length)failures.push(p.id+' missing slash');
  if((p.questions||[]).length!==5||(p.questionSetB||[]).length!==5)failures.push(p.id+' A/B count');
  for(const q of [...(p.questions||[]),...(p.questionSetB||[])]){
    questions++;
    if(!q.prompt||q.answer==null||!q.evidence||!q.evidenceJp||!q.reason)failures.push(p.id+' '+q.id+' required fields');
    const ev=Array.isArray(q.evidence)?q.evidence:[q.evidence];for(const e of ev)if(!has(body,e))failures.push(p.id+' '+q.id+' evidence not body: '+e);
    const ej=Array.isArray(q.evidenceJp)?q.evidenceJp:[q.evidenceJp];for(const e of ej)if(!has(jp,e)&&!(p.slashRows||[]).some(r=>has(r.jp,e)))failures.push(p.id+' '+q.id+' evidenceJp not translation/slash: '+e);
    if(/第\s*\d+\s*(?:段階|文)|generic|scaffold|本文のどの部分/i.test(q.prompt))failures.push(p.id+' '+q.id+' mechanical prompt');
    if(/one might simply have been moved/i.test(q.prompt)||/one might simply have been moved/i.test(String(q.evidence)))failures.push(p.id+' '+q.id+' stale grammar text');
  }
  if(p.freeWriteTask){freeWrites++;const fw=p.freeWriteTask,model=fw.modelAnswer||fw.model||fw.sampleAnswer||'';if(model){const wc=words(model);if(wc<20||wc>30)failures.push(p.id+' freeWrite model words '+wc);}if(!fw.prompt)failures.push(p.id+' freeWrite prompt missing');}
  const seen=new Set();for(const n of p.notes||[]){notes++;const en=String(n&&n.english||'').trim(),ja=String(n&&n.japanese||'').trim();if(!en||!ja)failures.push(p.id+' empty note');if(norm(en).toLowerCase()===norm(ja).toLowerCase()||/placeholder|temporary|最終注整理対象|本文で使用/i.test(ja))failures.push(p.id+' invalid gloss '+en+'='+ja);const k=norm(en).toLowerCase();if(seen.has(k))failures.push(p.id+' duplicate note '+en);seen.add(k);}
  if(p.tier==='YAMAGUCHI_EXAM'&&!p.materials)failures.push(p.id+' Yamaguchi materials missing');
}
if(questions!==500)failures.push('question total '+questions);
const out={batch:'V11-B12',registered:false,officialTotal:718,passages:x.passages.length,questions,freeWrites,notes,verifiedGlossReuse:x.verifiedGlossReuse,failures,finalPass:failures.length===0};
fs.writeFileSync('V11_BATCH12_FINAL_CONTENT_INTEGRITY.json',JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify(out,null,2));if(failures.length)process.exit(1);
