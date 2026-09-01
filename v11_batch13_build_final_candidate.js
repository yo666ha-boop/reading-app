'use strict';
const fs=require('fs');
const buildBody=require('./v11_batch13_build_body_candidate.js');
function read(f){return JSON.parse(fs.readFileSync(f,'utf8'));}
function clone(x){return JSON.parse(JSON.stringify(x));}
function die(m){throw new Error(m);}
function norm(s){return String(s||'').replace(/[「」『』]/g,'"').replace(/\s+/g,' ').trim();}
function applyCorrections(doc,file){if(!file)return;const c=read(file);if(c.humanReviewed!==true||c.registered!==false)die(`correction metadata ${file}`);for(const x of c.corrections||[]){const qs=doc.questionsByPassage&&doc.questionsByPassage[x.id];const q=qs&&qs.find(v=>v.set===x.set&&v.no===x.no);if(!q)die(`correction target ${x.id} ${x.set}${x.no}`);for(const k of ['prompt','answer','evidence','evidenceJp','reason','type'])if(x[k])q[k]=x[k];}}
module.exports=function build(){
 const candidate=buildBody();
 const boundary=read('v11_batch13_question_boundary_corrections.json');
 if(boundary.humanReviewed!==true||boundary.registered!==false)die('boundary correction metadata');
 const boundaryMap=new Map();for(const x of boundary.corrections||[]){const k=`${x.id}|${x.set}|${x.no}`;if(boundaryMap.has(k))die(`duplicate boundary correction ${k}`);boundaryMap.set(k,x);}
 const applied=new Set();
 const layers=[
  ['v11_batch13_question_human_review_r1_g1_001_004.json','v11_batch13_question_human_corrections_r1.json'],
  ['v11_batch13_question_human_review_r2_g1_005_010.json',null],
  ['v11_batch13_question_human_review_r3_g1_011_017.json',null],
  ['v11_batch13_question_human_review_r4_g2_001_004.json',null],
  ['v11_batch13_question_human_review_r5_g2_005_017.json','v11_batch13_question_human_corrections_r5_g2_017.json'],
  ['v11_batch13_question_human_review_r6_g3_001_004.json',null],
  ['v11_batch13_question_human_review_r7_g3_005_008.json','v11_batch13_question_human_corrections_r7_g3_008.json'],
  ['v11_batch13_question_human_review_r8_g3_009_012.json','v11_batch13_question_human_corrections_r8_g3_009.json'],
  ['v11_batch13_question_human_review_r9_g3_013_016.json',null]
 ];
 const seen=new Set();let qCount=0;
 for(const [file,corr] of layers){const d=read(file);if(d.humanReviewed!==true||d.registered!==false)die(`review metadata ${file}`);applyCorrections(d,corr);for(const id of d.scope||[]){if(seen.has(id))die(`duplicate review scope ${id}`);seen.add(id);const p=candidate.passages.find(x=>x.id===id);if(!p)die(`missing passage ${id}`);const qs=clone(d.questionsByPassage&&d.questionsByPassage[id]);if(!Array.isArray(qs)||qs.length!==10)die(`question count ${id}`);
   for(const q of qs){const k=`${id}|${q.set}|${q.no}`;const x=boundaryMap.get(k);if(x){for(const f of ['prompt','answer','evidence','evidenceJp','reason','type'])if(x[f])q[f]=x[f];applied.add(k);}}
   const a=qs.filter(q=>q.set==='A'),b=qs.filter(q=>q.set==='B');if(a.length!==5||b.length!==5)die(`A/B ${id}`);if(new Set(qs.map(q=>q.prompt)).size!==10)die(`duplicate prompt ${id}`);if(new Set(qs.map(q=>q.type)).size<5)die(`type diversity ${id}`);for(const q of qs){for(const k of ['prompt','answer','evidence','evidenceJp','reason'])if(!String(q[k]||'').trim())die(`blank ${id} ${q.set}${q.no} ${k}`);if(!norm(p.body).includes(norm(q.evidence)))die(`English evidence mismatch ${id} ${q.set}${q.no}`);if(!norm(p.fullTranslation).includes(norm(q.evidenceJp)))die(`Japanese evidence mismatch ${id} ${q.set}${q.no}`);}p.questions=a;p.questionSetB=b;qCount+=10;}}
 if(applied.size!==boundaryMap.size)die(`unused boundary corrections ${boundaryMap.size-applied.size}`);
 if(seen.size!==50||qCount!==500)die(`coverage ${seen.size}/${qCount}`);
 for(const p of candidate.passages){if(!seen.has(p.id))die(`unreviewed ${p.id}`);p.questionHumanReview='B13_500Q_HUMAN_PASS';p.registered=false;}
 candidate.status='BODY_TRANSLATION_QUESTIONS_FINAL_SLASH_PENDING';candidate.humanQuestionReview={passages:50,questions:500,registered:false};
 return candidate;
};
if(require.main===module)console.log(JSON.stringify(module.exports(),null,2));
