'use strict';
const fs=require('fs'),vm=require('vm');
const sandbox={window:{},console}; vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('v11_batch08_passages_draft_g1.js','utf8'),sandbox,{filename:'v11_batch08_passages_draft_g1.js'});
const ps=sandbox.window.V11_BATCH08_G1_DRAFTS||[], meta=sandbox.window.V11_BATCH08_G1_DRAFT_META||{}, errors=[], details=[];
const words=s=>(String(s||'').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]);
const expected=Array.from({length:17},(_,i)=>`V11-B08-G1-${String(i+1).padStart(3,'0')}`);
const longIds=new Set(['V11-B08-G1-002','V11-B08-G1-005','V11-B08-G1-008','V11-B08-G1-011','V11-B08-G1-015']);
if(ps.length!==17)errors.push(`count:${ps.length}`);
if(meta.count!==17||meta.registered!==false)errors.push('meta-registration-lock');
if(new Set(ps.map(p=>p.id)).size!==ps.length)errors.push('duplicate-id');
for(const id of expected)if(!ps.some(p=>p.id===id))errors.push(`missing-id:${id}`);
const bodies=new Map();
function setJaccard(a,b){const A=new Set(a),B=new Set(b);let inter=0;for(const x of A)if(B.has(x))inter++;return inter/(A.size+B.size-inter||1);}
for(const p of ps){
  const body=p.sentences.join(' '), wc=words(body).length, qs=[...(p.questions||[]),...(p.questionSetB||[])], bad=[];
  const [lo,hi]=p.targetWordBand||[];
  if(!(Number.isInteger(lo)&&Number.isInteger(hi)&&wc>=lo&&wc<=hi))errors.push(`word-band:${p.id}:${wc}:${lo}-${hi}`);
  if(p.wordCount!==wc)errors.push(`word-field:${p.id}:${p.wordCount}:${wc}`);
  if(longIds.has(p.id)!==(p.level==='LONG'))errors.push(`level:${p.id}:${p.level}`);
  if(p.registered!==false)errors.push(`registered:${p.id}`);
  if(!p.authorReview||!['reviewed','timelineCoherent','actorPerspectiveClear','causalLogicCoherent','translationNatural'].every(k=>p.authorReview[k]===true))errors.push(`author-review:${p.id}`);
  if(p.sentences.length!==p.slashRows.length||p.slashRows.some((r,i)=>r.en!==p.sentences[i]||!r.jp))errors.push(`slash:${p.id}`);
  const jp=p.slashRows.map(r=>r.jp).join(''); if(p.fullTranslation!==jp)errors.push(`translation:${p.id}`);
  if((p.questions||[]).length!==5||(p.questionSetB||[]).length!==5)errors.push(`qcount:${p.id}`);
  if(qs.length===10&&new Set(qs.map(q=>q.prompt)).size!==10)errors.push(`duplicate-prompt:${p.id}`);
  qs.forEach((q,i)=>{
    const ev=Array.isArray(q.evidence)?q.evidence:[q.evidence], ej=Array.isArray(q.evidenceJp)?q.evidenceJp:[q.evidenceJp];
    if(!q.questionType||!q.prompt||!q.answer||!q.reason||ev.length!==ej.length)bad.push(`field:${i+1}`);
    ev.forEach((e,j)=>{const row=p.slashRows.find(r=>r.en===e);if(!row)bad.push(`evidence-en:${i+1}:${j+1}`);else if(row.jp!==ej[j])bad.push(`evidence-jp:${i+1}:${j+1}`);});
    if(q.questionType==='SENTENCE_INSERTION'&&(!Number.isInteger(q.insertAfterSentence)||q.insertAfterSentence<1||q.insertAfterSentence>=p.sentences.length))bad.push(`insert:${i+1}`);
    if(['CONTEXT_WORD','PHRASE_FILL','SUMMARY_FILL'].includes(q.questionType)&&!(q.prompt.includes('_____')||q.prompt.includes('空所')))bad.push(`fill:${i+1}`);
  });
  if(bad.length)errors.push(`questions:${p.id}:${bad.join(',')}`);
  const key=body.trim().toLowerCase(); if(bodies.has(key))errors.push(`duplicate-body:${p.id}:${bodies.get(key)}`);else bodies.set(key,p.id);
  details.push({id:p.id,title:p.title,words:wc,band:[lo,hi],sentences:p.sentences.length,questions:qs.length,bad,registered:p.registered});
}
const near=[];
for(let i=0;i<ps.length;i++)for(let j=i+1;j<ps.length;j++){
 const a=ps[i].sentences.map(s=>s.toLowerCase().replace(/[^a-z0-9 ]/g,'').trim()),b=ps[j].sentences.map(s=>s.toLowerCase().replace(/[^a-z0-9 ]/g,'').trim());
 const jac=setJaccard(a,b); if(jac>=0.55)near.push({a:ps[i].id,b:ps[j].id,jaccard:+jac.toFixed(3)});
}
if(near.length)errors.push(`near-shared:${near.length}`);
const report={generatedAt:new Date().toISOString(),pass:errors.length===0,count:ps.length,longCount:ps.filter(p=>p.level==='LONG').length,registered:false,questionStage:[...new Set(ps.map(p=>p.questionStage))],nearShared:near,errors,details};
fs.writeFileSync('V11_BATCH08_G1_DRAFT_AUDIT.json',JSON.stringify(report,null,2)+'\n');
details.forEach(d=>console.log(`${d.id} words=${d.words} band=${d.band.join('-')} q=${d.questions} bad=${d.bad.length}`));
console.log(`BATCH08 G1 DRAFT count=${ps.length} long=${report.longCount} near=${near.length} errors=${errors.length} final=${report.pass?'PASS':'FAIL'}`);
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
