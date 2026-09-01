'use strict';
const fs=require('fs');
const build=require('./v11_batch13_build_body_candidate.js');
const d=JSON.parse(fs.readFileSync('v11_batch13_question_human_review_r5_g2_005_017.json','utf8'));
function norm(s){return String(s||'').replace(/[「」『』]/g,'"').replace(/\s+/g,' ').trim();}
function die(m){throw new Error(m);}
if(d.humanReviewed!==true||d.registered!==false)die('metadata');
const candidate=build();let count=0;
if((d.scope||[]).length!==13||new Set(d.scope).size!==13)die('scope');
for(const id of d.scope){
 const p=candidate.passages.find(x=>x.id===id);if(!p)die(`missing ${id}`);
 const qs=d.questionsByPassage&&d.questionsByPassage[id];if(!Array.isArray(qs)||qs.length!==10)die(`count ${id}`);
 if(qs.filter(q=>q.set==='A').length!==5||qs.filter(q=>q.set==='B').length!==5)die(`AB ${id}`);
 if(new Set(qs.map(q=>q.prompt)).size!==10)die(`duplicate prompt ${id}`);
 if(new Set(qs.map(q=>q.type)).size<5)die(`types ${id}`);
 for(const q of qs){
  for(const k of ['prompt','answer','evidence','evidenceJp','reason'])if(!String(q[k]||'').trim())die(`blank ${id} ${q.set}${q.no} ${k}`);
  if(!norm(p.body).includes(norm(q.evidence)))die(`English evidence mismatch ${id} ${q.set}${q.no}: ${q.evidence}`);
  if(!norm(p.fullTranslation).includes(norm(q.evidenceJp)))die(`Japanese evidence mismatch ${id} ${q.set}${q.no}: ${q.evidenceJp}`);
  count++;
 }
}
if(count!==130)die(`question total ${count}`);
console.log(JSON.stringify({pass:true,batch:'V11-B13',grade:2,humanReviewedPassages:13,humanReviewedQuestions:130,registered:false,officialTotal:candidate.officialTotal},null,2));
