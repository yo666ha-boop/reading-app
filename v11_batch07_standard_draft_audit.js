'use strict';
const fs=require('fs'),vm=require('vm');
const sandbox={window:{},console};vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('v11_batch07_standard_draft_g3.js','utf8'),sandbox,{filename:'v11_batch07_standard_draft_g3.js'});
const ps=sandbox.window.V11_BATCH07_STANDARD_DRAFTS||[];
const expected=['V11-B07-G3-002','V11-B07-G3-005','V11-B07-G3-007','V11-B07-G3-010','V11-B07-G3-011','V11-B07-G3-012','V11-B07-G3-015','V11-B07-G3-016'];
const errors=[],details=[];const words=s=>(String(s||'').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]);
for(const id of expected) if(!ps.find(p=>p.id===id))errors.push(`missing:${id}`);if(ps.length!==8)errors.push(`count:${ps.length}`);
for(const p of ps){const body=p.sentences.join(' '),jp=p.slashRows.map(r=>r.jp).join(''),wc=words(body).length,qs=[...p.questions,...p.questionSetB],bad=[];
 if(wc<150||wc>230)errors.push(`word-band:${p.id}:${wc}`);if(p.wordCount!==wc)errors.push(`word-field:${p.id}:${p.wordCount}/${wc}`);
 if(p.sentences.length!==p.slashRows.length||p.slashRows.some((r,i)=>r.en!==p.sentences[i]||!r.jp))errors.push(`slash:${p.id}`);if(p.fullTranslation!==jp)errors.push(`translation:${p.id}`);
 if(p.questions.length!==5||p.questionSetB.length!==5)errors.push(`question-count:${p.id}`);
 qs.forEach((q,i)=>{const ev=Array.isArray(q.evidence)?q.evidence:[q.evidence],ej=Array.isArray(q.evidenceJp)?q.evidenceJp:[q.evidenceJp];if(!q.prompt||!q.answer||!q.reason||!q.questionType||ev.length!==ej.length)bad.push(`fields:${i+1}`);ev.forEach((e,j)=>{const r=p.slashRows.find(x=>x.en===e);if(!r)bad.push(`ev-en:${i+1}:${j+1}`);else if(r.jp!==ej[j])bad.push(`ev-jp:${i+1}:${j+1}`);});if(q.questionType==='SENTENCE_INSERTION'&&(!Number.isInteger(q.insertAfterSentence)||q.insertAfterSentence<1||q.insertAfterSentence>=p.sentences.length))bad.push(`insert:${i+1}`);});
 if(bad.length)errors.push(`questions:${p.id}:${bad.join(',')}`);if(new Set(qs.map(q=>q.prompt)).size!==10)errors.push(`duplicate-prompt:${p.id}`);
 const bt=new Set(p.questionSetB.map(q=>q.questionType));if(!bt.has('INFERENCE')||!bt.has('SENTENCE_INSERTION')||![...bt].some(t=>['CONTEXT_WORD','SUMMARY_FILL','PHRASE_FILL'].includes(t)))errors.push(`B-contract:${p.id}`);
 details.push({id:p.id,wordCount:wc,sentences:p.sentences.length,questions:qs.length,bad});}
const report={pass:errors.length===0,count:ps.length,errors,details};fs.writeFileSync('V11_BATCH07_STANDARD_DRAFT_AUDIT.json',JSON.stringify(report,null,2)+'\n');details.forEach(d=>console.log(`${d.id} words=${d.wordCount} sentences=${d.sentences} questions=${d.questions} bad=${d.bad.length}`));console.log(`BATCH07 STANDARD DRAFT errors=${errors.length} final=${report.pass?'PASS':'FAIL'}`);if(errors.length){console.error(errors.join('\n'));process.exit(1);}
