'use strict';
const fs=require('fs');
const build=require('./v11_batch13_build_body_candidate.js');
const files=['v11_batch13_question_human_review_r2_g1_005_010.json','v11_batch13_question_human_review_r3_g1_011_017.json'];
function norm(s){return String(s||'').replace(/[「」『』]/g,'"').replace(/\s+/g,' ').trim();}
function die(m){throw new Error(m);}
const candidate=build();
let ids=[],count=0;
for(const f of files){const d=JSON.parse(fs.readFileSync(f,'utf8'));if(d.humanReviewed!==true||d.registered!==false)die(`metadata ${f}`);for(const id of d.scope||[]){if(ids.includes(id))die(`duplicate scope ${id}`);ids.push(id);const p=candidate.passages.find(x=>x.id===id);if(!p)die(`missing passage ${id}`);const qs=d.questionsByPassage&&d.questionsByPassage[id];if(!Array.isArray(qs)||qs.length!==10)die(`question count ${id}`);if(qs.filter(q=>q.set==='A').length!==5||qs.filter(q=>q.set==='B').length!==5)die(`A/B count ${id}`);if(new Set(qs.map(q=>q.prompt)).size!==10)die(`duplicate prompt ${id}`);if(new Set(qs.map(q=>q.type)).size<5)die(`type diversity ${id}`);for(const q of qs){for(const k of ['prompt','answer','evidence','evidenceJp','reason'])if(!String(q[k]||'').trim())die(`blank ${id} ${q.set}${q.no} ${k}`);if(!norm(p.body).includes(norm(q.evidence)))die(`English evidence mismatch ${id} ${q.set}${q.no}`);if(!norm(p.fullTranslation).includes(norm(q.evidenceJp)))die(`Japanese evidence mismatch ${id} ${q.set}${q.no}`);count++;}}}
if(ids.length!==13||count!==130)die(`coverage ${ids.length}/${count}`);
const expected=Array.from({length:13},(_,i)=>`V11-B13-G1-${String(i+5).padStart(3,'0')}`);if(expected.some(x=>!ids.includes(x)))die('G1-005..017 coverage failure');
console.log(JSON.stringify({pass:true,batch:'V11-B13',grade:1,humanReviewedPassages:13,humanReviewedQuestions:130,registered:false,officialTotal:candidate.officialTotal},null,2));
