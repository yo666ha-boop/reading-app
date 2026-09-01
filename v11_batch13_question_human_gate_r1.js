'use strict';
const fs=require('fs');
const build=require('./v11_batch13_build_body_candidate.js');
const review=JSON.parse(fs.readFileSync('v11_batch13_question_human_review_r1_g1_001_004.json','utf8'));
function norm(s){return String(s||'').replace(/[「」『』]/g,'"').replace(/\s+/g,' ').trim();}
function die(m){throw new Error(m);}
const candidate=build();
if(review.humanReviewed!==true)die('review not humanReviewed');
if(review.registered!==false)die('review must remain unregistered');
const scope=review.scope||[];
if(scope.length!==4||new Set(scope).size!==4)die('scope count/id failure');
let qCount=0;
for(const id of scope){
 const p=candidate.passages.find(x=>x.id===id); if(!p)die(`missing candidate ${id}`);
 const qs=review.questionsByPassage&&review.questionsByPassage[id]; if(!Array.isArray(qs)||qs.length!==10)die(`question count ${id}`);
 const a=qs.filter(q=>q.set==='A'), b=qs.filter(q=>q.set==='B');
 if(a.length!==5||b.length!==5)die(`A/B count ${id}`);
 if(new Set(qs.map(q=>q.prompt)).size!==10)die(`duplicate prompt ${id}`);
 if(new Set(qs.map(q=>q.type)).size<5)die(`type diversity ${id}`);
 for(const q of qs){
  for(const k of ['prompt','answer','evidence','evidenceJp','reason'])if(!String(q[k]||'').trim())die(`blank ${id} ${q.set}${q.no} ${k}`);
  if(!norm(p.body).includes(norm(q.evidence)))die(`English evidence mismatch ${id} ${q.set}${q.no}`);
  if(!norm(p.fullTranslation).includes(norm(q.evidenceJp)))die(`Japanese evidence mismatch ${id} ${q.set}${q.no}`);
  qCount++;
 }
}
if(qCount!==40)die(`question total ${qCount}`);
console.log(JSON.stringify({pass:true,batch:'V11-B13',humanReviewedPassages:scope.length,humanReviewedQuestions:qCount,registered:false,officialTotal:candidate.officialTotal},null,2));
