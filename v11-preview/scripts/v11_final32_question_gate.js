const fs=require('fs');
const bodyFiles=[
'V11_FINAL32_BODY_TRANSLATION_DRAFT_G1_001_008.json',
'V11_FINAL32_BODY_TRANSLATION_DRAFT_G1_009_011.json',
'V11_FINAL32_BODY_TRANSLATION_DRAFT_G2_001_008.json',
'V11_FINAL32_BODY_TRANSLATION_DRAFT_G2_009_011.json',
'V11_FINAL32_BODY_TRANSLATION_DRAFT_G3_001_010.json'];
const qFiles=[
'V11_FINAL32_QUESTIONS_HUMAN_G1_001_005.json',
'V11_FINAL32_QUESTIONS_HUMAN_G1_006_011.json',
'V11_FINAL32_QUESTIONS_HUMAN_G2_001_006.json',
'V11_FINAL32_QUESTIONS_HUMAN_G2_007_011.json',
'V11_FINAL32_QUESTIONS_HUMAN_G3_001_005.json',
'V11_FINAL32_QUESTIONS_HUMAN_G3_006_010.json'];
const bodies=bodyFiles.flatMap(f=>JSON.parse(fs.readFileSync(f,'utf8')).items||[]);
const items=qFiles.flatMap(f=>JSON.parse(fs.readFileSync(f,'utf8')).items||[]);
const bodyMap=new Map(bodies.map(x=>[x.id,x]));
const allowedTypes=new Set(['GIST','REASON','INFERENCE','CONTENT_MATCH','SENTENCE_INSERTION','CONTEXT_WORD','PHRASE_FILL','SUMMARY_FILL','MATERIAL_LINK']);
const failures=[],typeCounts={}; let questions=0;
if(bodies.length!==32||new Set(bodies.map(x=>x.id)).size!==32)failures.push('body coverage must be 32 unique');
if(items.length!==32||new Set(items.map(x=>x.id)).size!==32)failures.push('question coverage must be 32 unique');
for(const it of items){
 const b=bodyMap.get(it.id); if(!b){failures.push(it.id+' missing body');continue;}
 for(const setName of ['questionsA','questionsB']){
  const qs=it[setName]||[];
  if(qs.length!==5)failures.push(it.id+' '+setName+' count '+qs.length);
  const prompts=new Set();
  qs.forEach((q,i)=>{
   questions++;
   const p=String(q.question||q.prompt||'').trim();
   for(const k of ['answer','evidence','evidenceJp','reason'])if(!String(q[k]||'').trim())failures.push(`${it.id} ${setName}#${i+1} missing ${k}`);
   if(!p)failures.push(`${it.id} ${setName}#${i+1} missing question`);
   if(prompts.has(p))failures.push(`${it.id} ${setName} duplicate prompt`); prompts.add(p);
   if(!allowedTypes.has(q.type))failures.push(`${it.id} ${setName}#${i+1} unsupported type ${q.type}`);
   typeCounts[q.type]=(typeCounts[q.type]||0)+1;
   const ev=String(q.evidence||'').trim();
   if(ev&&!String(b.body||'').includes(ev))failures.push(`${it.id} ${setName}#${i+1} evidence not exact body substring: ${ev}`);
   if(/write (?:an?|your)|compose|essay|英作文/i.test(p))failures.push(`${it.id} ${setName}#${i+1} composition-style prompt`);
  });
 }
 const types=[...(it.questionsA||[]),...(it.questionsB||[])].map(q=>q.type);
 if(new Set(types).size<6)failures.push(it.id+' type diversity <6');
 const detailLike=types.filter(x=>x==='CONTENT_MATCH'||x==='PHRASE_FILL').length;
 if(detailLike>4)failures.push(it.id+' DETAIL-like overload '+detailLike);
}
const report={generatedAt:new Date().toISOString(),batch:'V11-FINAL32',registered:false,officialTotal:968,passages:items.length,questions,expectedQuestions:320,typeCounts,failures,finalPass:failures.length===0&&questions===320};
fs.writeFileSync('V11_FINAL32_320_QUESTION_FINAL_GATE.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2)); if(!report.finalPass)process.exit(2);