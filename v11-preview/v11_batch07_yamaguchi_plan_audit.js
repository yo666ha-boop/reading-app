'use strict';
const fs=require('fs');
const plan=fs.readFileSync('V11_BATCH07_50_PASSAGE_PLAN.md','utf8');
const spec=fs.readFileSync('V11_YAMAGUCHI_ENTRANCE_EXAM_READING_SPEC.md','utf8');
const errors=[];
const examIds=['V11-B07-G3-003','V11-B07-G3-006','V11-B07-G3-009','V11-B07-G3-014'];
const longIds=['V11-B07-G3-001','V11-B07-G3-004','V11-B07-G3-008','V11-B07-G3-013'];
const types=['DETAIL','GIST','REASON','INFERENCE','SENTENCE_INSERTION','CONTENT_MATCH','CONTEXT_WORD','PHRASE_FILL','SUMMARY_FILL','MATERIAL_LINK','FREE_WRITE_20_30'];
if(!plan.includes('Target after Batch06 finalization: 468 -> 518 passages')) errors.push('target');
if(!plan.includes('Distribution: Grade 1 = 17, Grade 2 = 17, Grade 3 = 16')) errors.push('distribution');
if(!plan.includes('Yamaguchi entrance-exam spec')) errors.push('spec-link');
for(const id of examIds){
  const line=plan.split('\n').find(x=>x.includes('`'+id+'`'))||'';
  if(!line.includes('YAMAGUCHI_EXAM 330–450')) errors.push('exam-tier:'+id);
}
for(const id of longIds){
  const line=plan.split('\n').find(x=>x.includes('`'+id+'`'))||'';
  if(!line.includes('LONG 240–330')) errors.push('long-tier:'+id);
}
const g3Lines=plan.split('\n').filter(x=>/`V11-B07-G3-\d{3}`/.test(x));
if(g3Lines.length!==16) errors.push('g3-count:'+g3Lines.length);
if(g3Lines.filter(x=>x.includes('YAMAGUCHI_EXAM')).length!==4) errors.push('exam-count');
if(g3Lines.filter(x=>x.includes('LONG 240–330')).length!==4) errors.push('long-count');
if(g3Lines.filter(x=>x.includes('STANDARD 150–230')).length!==8) errors.push('standard-count');
for(const t of types){ if(!spec.includes(t)) errors.push('taxonomy:'+t); }
for(const required of ['at least 6 distinct `questionType`','CONTENT_MATCH','SENTENCE_INSERTION or SUMMARY_FILL','CONTEXT_WORD or PHRASE_FILL','20–30 word `freeWriteTask`']){
  if(!plan.includes(required)) errors.push('question-contract:'+required);
}
if(!plan.includes('registered=false')) errors.push('registration-lock');
const report={pass:errors.length===0,errors,g3:g3Lines.length,examTier:4,longTier:4,standardTier:8,examIds,longIds};
fs.writeFileSync('V11_BATCH07_YAMAGUCHI_PLAN_AUDIT.json',JSON.stringify(report,null,2)+'\n');
console.log(`BATCH07 YAMAGUCHI PLAN GATE g3=${g3Lines.length} exam=4 long=4 standard=8 errors=${errors.length} final=${report.pass?'PASS':'FAIL'}`);
if(errors.length){ console.error(errors.join('\n')); process.exit(1); }
