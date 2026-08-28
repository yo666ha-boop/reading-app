'use strict';
const fs=require('fs'),vm=require('vm');
const sandbox={window:{},console}; vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('v11_batch07_yamaguchi_exam_draft_g3.js','utf8'),sandbox,{filename:'v11_batch07_yamaguchi_exam_draft_g3.js'});
const ps=sandbox.window.V11_BATCH07_YAMAGUCHI_EXAM_DRAFTS||[];
const expected=['V11-B07-G3-003','V11-B07-G3-006','V11-B07-G3-009','V11-B07-G3-014'];
const errors=[]; const details=[];
for(const id of expected) if(!ps.find(p=>p.id===id)) errors.push(`missing:${id}`);
if(ps.length!==4) errors.push(`count:${ps.length}`);
for(const p of ps){
 const body=(p.sentences||[]).join(' '); const wc=(body.match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;
 const qs=[...(p.questions||[]),...(p.questionSetB||[])]; const types=[...new Set(qs.map(x=>x.questionType))];
 const rowOk=(p.sentences||[]).length===(p.slashRows||[]).length && (p.slashRows||[]).every((r,i)=>r.en===p.sentences[i] && r.jp);
 const jpJoin=(p.slashRows||[]).map(r=>r.jp).join('');
 const badEvidence=[];
 qs.forEach((q,i)=>{
   const ev=Array.isArray(q.evidence)?q.evidence:[q.evidence];
   const jp=Array.isArray(q.evidenceJp)?q.evidenceJp:[q.evidenceJp];
   const enMissing=ev.filter(Boolean).filter(x=>!body.includes(x));
   const jpMissing=jp.filter(Boolean).filter(x=>!jpJoin.includes(x));
   if(!q.answer||!q.reason||enMissing.length||jpMissing.length) badEvidence.push({index:i+1,type:q.questionType,enMissing,jpMissing,hasAnswer:!!q.answer,hasReason:!!q.reason});
 });
 const evidenceOk=badEvidence.length===0;
 const translationOk=jpJoin===p.fullTranslation;
 const required=[types.includes('CONTENT_MATCH'),types.includes('REASON')||types.includes('INFERENCE'),types.includes('SENTENCE_INSERTION')||types.includes('SUMMARY_FILL'),types.includes('CONTEXT_WORD')||types.includes('PHRASE_FILL')];
 if(wc<330||wc>450) errors.push(`word-band:${p.id}:${wc}`);
 if(p.wordCount!==wc) errors.push(`wordCount-field:${p.id}:${p.wordCount}/${wc}`);
 if(!rowOk) errors.push(`slash-rows:${p.id}`);
 if(!translationOk) errors.push(`translation:${p.id}`);
 if((p.questions||[]).length!==5||(p.questionSetB||[]).length!==5) errors.push(`questions:${p.id}`);
 if(types.length<6) errors.push(`type-diversity:${p.id}:${types.length}`);
 if(required.some(x=>!x)) errors.push(`required-types:${p.id}:${types.join(',')}`);
 if(!evidenceOk) errors.push(`evidence:${p.id}`);
 if(!p.materialData||!types.includes('MATERIAL_LINK')) errors.push(`material-link:${p.id}`);
 const fw=p.freeWriteTask||{}; if(fw.questionType!=='FREE_WRITE_20_30'||!fw.modelAnswer||!Array.isArray(fw.wordRange)||fw.wordRange[0]!==20||fw.wordRange[1]!==30) errors.push(`free-write:${p.id}`);
 details.push({id:p.id,wordCount:wc,questionTypes:types,typeCount:types.length,questions:qs.length,translationOk,evidenceOk,badEvidence});
}
const report={pass:errors.length===0,count:ps.length,errors,details};
fs.writeFileSync('V11_BATCH07_YAMAGUCHI_EXAM_DRAFT_AUDIT.json',JSON.stringify(report,null,2)+'\n');
for(const d of details){ console.log(`${d.id} words=${d.wordCount} questions=${d.questions} types=${d.typeCount} translation=${d.translationOk?'PASS':'FAIL'} evidence=${d.evidenceOk?'PASS':'FAIL'}`); if(d.badEvidence.length) console.log(JSON.stringify(d.badEvidence)); }
console.log(`BATCH07 YAMAGUCHI EXAM DRAFT GATE count=${ps.length}/4 errors=${errors.length} final=${report.pass?'PASS':'FAIL'}`);
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
