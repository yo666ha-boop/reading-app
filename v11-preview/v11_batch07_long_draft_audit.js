'use strict';
const fs=require('fs'),vm=require('vm');
const sandbox={window:{},console}; vm.createContext(sandbox);
for(const f of ['v11_batch07_long_draft_g3.js','v11_batch07_long_semantic_repair.js']) vm.runInContext(fs.readFileSync(f,'utf8'),sandbox,{filename:f});
const ps=sandbox.window.V11_BATCH07_LONG_DRAFTS||[];
const repair=sandbox.window.V11_BATCH07_LONG_SEMANTIC_REPAIR_STATE||{};
const expected=['V11-B07-G3-001','V11-B07-G3-004','V11-B07-G3-008','V11-B07-G3-013'];
const errors=[],details=[];
const words=s=>(String(s||'').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]);
const find=id=>ps.find(p=>p.id===id);
for(const id of expected) if(!find(id)) errors.push(`missing:${id}`);
if(ps.length!==4) errors.push(`count:${ps.length}`);
if(repair.reviewed!==4) errors.push(`human-reviewed:${repair.reviewed||0}`);
for(const p of ps){
 const body=(p.sentences||[]).join(' '),jp=(p.slashRows||[]).map(r=>r.jp).join(''),wc=words(body).length;
 const qs=[...(p.questions||[]),...(p.questionSetB||[])], types=[...new Set(qs.map(q=>q.questionType))],bad=[];
 const review=p.semanticHumanReview||{};
 for(const k of ['reviewed','timelineCoherent','materialBodyConsistent','questionAnswerLogical','insertionNatural']) if(review[k]!==true) errors.push(`human-review:${p.id}:${k}`);
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
   if(['CONTEXT_WORD','PHRASE_FILL','SUMMARY_FILL'].includes(q.questionType)&&!(String(q.prompt).includes('_____')||String(q.prompt).includes('空所'))) bad.push(`fill-prompt:${i+1}`);
 }
 if(bad.length) errors.push(`questions:${p.id}:${bad.join(',')}`);
 const aTypes=new Set((p.questions||[]).map(q=>q.questionType)),bTypes=new Set((p.questionSetB||[]).map(q=>q.questionType));
 if(!aTypes.has('GIST')||!aTypes.has('DETAIL')||!aTypes.has('REASON')||!aTypes.has('CONTENT_MATCH')) errors.push(`long-A-contract:${p.id}`);
 if(![...bTypes].some(t=>['INFERENCE','SENTENCE_INSERTION','CONTEXT_WORD','PHRASE_FILL','SUMMARY_FILL','MATERIAL_LINK'].includes(t))) errors.push(`long-B-contract:${p.id}`);
 if(!p.materialData||!types.includes('MATERIAL_LINK')) errors.push(`material:${p.id}`);
 if(new Set(qs.map(q=>q.prompt)).size!==qs.length) errors.push(`duplicate-prompt:${p.id}`);
 details.push({id:p.id,wordCount:wc,sentences:p.sentences.length,questions:qs.length,types,bad,humanReview:review});
}
const p001=find('V11-B07-G3-001');
if(p001){
 const body=p001.sentences.join(' '),m=p001.materialData.items||[];
 if(body.includes('club booklet written by students in 1985')||body.includes('kept the 1985 booklet')) errors.push('G3-001-stale-1985-booklet');
 if(!body.includes('club booklet written by students in 1987')) errors.push('G3-001-booklet-1987');
 if(!body.includes('continuing through March 1986')) errors.push('G3-001-market-1986');
 if(!m.some(x=>x[0]==='1987 club booklet')) errors.push('G3-001-material-1987');
}
const p004=find('V11-B07-G3-004');
if(p004){const r=p004.slashRows.find(x=>x.en.startsWith('Some needed only ten minutes')); if(!r||!r.jp.includes('10分だけ')) errors.push('G3-004-ten-minute-translation');}
const p008=find('V11-B07-G3-008'); if(p008&&p008.wordCount!==330) errors.push(`G3-008-trimmed-wordcount:${p008.wordCount}`);
const p013=find('V11-B07-G3-013'); if(p013&&!(p013.materialData.items||[]).some(x=>x[0]==='16:00–17:00'&&x[1].includes('3.0 kWh'))) errors.push('G3-013-peak-material');
const report={pass:errors.length===0,count:ps.length,semanticRepair:repair,errors,details};
fs.writeFileSync('V11_BATCH07_LONG_DRAFT_AUDIT.json',JSON.stringify(report,null,2)+'\n');
for(const d of details) console.log(`${d.id} words=${d.wordCount} sentences=${d.sentences} questions=${d.questions} bad=${d.bad.length} human=${d.humanReview.reviewed?'PASS':'FAIL'}`);
console.log(`BATCH07 LONG DRAFT errors=${errors.length} final=${report.pass?'PASS':'FAIL'}`);
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
