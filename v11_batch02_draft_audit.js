const fs=require('fs');const vm=require('vm');
const src=fs.readFileSync('v11_batch02_passages_draft.js','utf8');
const sandbox={window:{},console};vm.createContext(sandbox);vm.runInContext(src,sandbox,{filename:'v11_batch02_passages_draft.js'});
const ps=sandbox.window.V11_BATCH02_DRAFT_PASSAGES||[];const errs=[];
if(ps.length!==50)errs.push('count='+ps.length);
if(new Set(ps.map(p=>p.id)).size!==50)errs.push('duplicate ids');
for(const p of ps){
 const [lo,hi]=p.targetWordBand||[];
 if(!(p.wordCount>=lo&&p.wordCount<=hi))errs.push(`${p.id} wordCount ${p.wordCount} outside ${lo}-${hi}`);
 if(!Array.isArray(p.sentences)||p.sentences.length<10)errs.push(`${p.id} sentences`);
 if(!Array.isArray(p.slashRows)||p.slashRows.length!==p.sentences.length)errs.push(`${p.id} slashRows`);
 if(!p.fullTranslation||p.fullTranslation.length<20)errs.push(`${p.id} translation`);
 if(!Array.isArray(p.questions)||p.questions.length!==5)errs.push(`${p.id} A questions`);
 if(!Array.isArray(p.questionSetB)||p.questionSetB.length!==5)errs.push(`${p.id} B questions`);
 const qs=[...(p.questions||[]),...(p.questionSetB||[])];
 for(const q of qs){if(!q.evidence||!p.sentences.includes(q.evidence))errs.push(`${p.id} evidence mismatch`);if(!q.evidenceJp||!q.reason)errs.push(`${p.id} evidence jp/reason`);}
 if(p.vocabAudit!==false||p.manualSlashAudit!==false||p.manualMeaningAudit!==false||p.manualQuestionAudit!==false)errs.push(`${p.id} draft audit flags must remain false`);
}
const longPs=ps.filter(p=>p.targetWordBand&&p.targetWordBand[0]>=135);const max=Math.max(...ps.map(p=>p.wordCount));const min=Math.min(...ps.map(p=>p.wordCount));
const status=[`phase=V11_BATCH02_DRAFT`,`count=${ps.length}`,`registered=false`,`runtime_total=218`,`long_designated=${longPs.length}`,`word_count_min=${min}`,`word_count_max=${max}`,`errors=${errs.length}`,`final=${errs.length?'FAIL':'PASS'}`].join('\n')+'\n';
fs.writeFileSync('V11_BATCH02_DRAFT_AUDIT_STATUS.txt',status);fs.writeFileSync('V11_BATCH02_DRAFT_WORDCOUNTS.json',JSON.stringify(ps.map(p=>({id:p.id,textbook:p.textbook,grade:p.grade,section:p.section,wordCount:p.wordCount,target:p.targetWordBand})),null,2));
console.log(status);if(errs.length){console.error(errs.join('\n'));process.exit(1);}