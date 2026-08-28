'use strict';
const fs=require('fs'),vm=require('vm');
const sandbox={window:{},console}; vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('v11_batch07_long_draft_g3.js','utf8'),sandbox,{filename:'v11_batch07_long_draft_g3.js'});
const ps=sandbox.window.V11_BATCH07_LONG_DRAFTS||[];
const expected=['V11-B07-G3-001','V11-B07-G3-004','V11-B07-G3-008','V11-B07-G3-013'];
const errors=[],details=[];
const words=s=>(String(s||'').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]);
for(const id of expected) if(!ps.find(p=>p.id===id)) errors.push(`missing:${id}`);
if(ps.length!==4) errors.push(`count:${ps.length}`);
for(const p of ps){
 const body=(p.sentences||[]).join(' '),jp=(p.slashRows||[]).map(r=>r.jp).join(''),wc=words(body).length;
 const qs=[...(p.questions||[]),...(p.questionSetB||[])], types=[...new Set(qs.map(q=>q.questionType))],bad=[];
 if(wc<240||wc>330) errors.push(`word-band:${p.id}:${wc}`);
 if(p.wordCount!==wc) errors.push(`word-count-field:${p.id}:${p.wordCount}/${wc}`);
 if((p.sentences||[]).length!==(p.slashRows||[]).length||(p.slashRows||[]).some((r,i)=>r.en!==p.sentences[i]||!r.jp)) errors.push(`slash:${p.id}`);
 if(p.fullTranslation!==jp) errors.push(`translation:${p.id}`);
 if((p.questions||[]).length!==5||(p.questionSetB||[]).length!==5) errors.push(`question-count:${p.id}`);
 for(const [i,q] of qs.entries()){
   const ev=Array.isArray(q.evidence)?q.evidence:[q.evidence], ej=Array.isArray(q.evidenceJp)?q.evidenceJp:[q.evidenceJp];
   if(!q.questionType||!q.prompt||!q.answer||!q.reason||ev.length!==ej.length) bad.push(`fields:${i+1}`);
   ev.forEach((e,j)=>{const row=(p.slashRows||[]).find(r=>r.en===e); if(!row) bad.push(`evidence-en:${i+1}:${j+1}`); else if(row.jp!==ej[j]) bad.push(`evidence-jp:${i+1}:${j+1}`);});
   if(q.questionType==='SENTENCE_INSERTION'&&(!Number.isInteger(q.insertAfterSentence)||q.insertAfterSentence<1||q.insertAfterSentence>=p.sentences.length)) bad.push(`insert-index:${i+1}`);
 }
 if(bad.length) errors.push(`questions:${p.id}:${bad.join(',')}`);
 const aTypes=new Set((p.questions||[]).map(q=>q.questionType)),bTypes=new Set((p.questionSetB||[]).map(q=>q.questionType));
 if(!aTypes.has('GIST')||!aTypes.has('DETAIL')||!aTypes.has('REASON')||!aTypes.has('CONTENT_MATCH')) errors.push(`long-A-contract:${p.id}`);
 if(![...bTypes].some(t=>['INFERENCE','SENTENCE_INSERTION','CONTEXT_WORD','PHRASE_FILL','SUMMARY_FILL','MATERIAL_LINK'].includes(t))) errors.push(`long-B-contract:${p.id}`);
 if(!p.materialData||!types.includes('MATERIAL_LINK')) errors.push(`material:${p.id}`);
 if(new Set(qs.map(q=>q.prompt)).size!==qs.length) errors.push(`duplicate-prompt:${p.id}`);
 details.push({id:p.id,wordCount:wc,sentences:p.sentences.length,questions:qs.length,types,bad});
}
const report={pass:errors.length===0,count:ps.length,errors,details};
fs.writeFileSync('V11_BATCH07_LONG_DRAFT_AUDIT.json',JSON.stringify(report,null,2)+'\n');
for(const d of details) console.log(`${d.id} words=${d.wordCount} sentences=${d.sentences} questions=${d.questions} bad=${d.bad.length}`);
console.log(`BATCH07 LONG DRAFT errors=${errors.length} final=${report.pass?'PASS':'FAIL'}`);
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
