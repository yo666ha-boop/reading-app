'use strict';
const fs=require('fs');
function read(p){return JSON.parse(fs.readFileSync(p,'utf8'))}
function clone(x){return JSON.parse(JSON.stringify(x))}
function build(){
  const scaffold=read('v11_batch12_slash_question_scaffold.json');
  if(scaffold.registered!==false||scaffold.officialTotal!==718)throw Error('Batch12 scaffold state');
  if(!Array.isArray(scaffold.passages)||scaffold.passages.length!==50)throw Error('Batch12 scaffold passage count');
  const r4=read('v11_batch12_human_review_layer_r4.json');
  const sync={
    R7:require('./v11_batch12_question_human_review_r7_semantic_sync.js'),
    R8:require('./v11_batch12_question_human_review_r8_semantic_sync.js'),
    R11:require('./v11_batch12_question_human_review_r11_semantic_sync.js'),
    R12:require('./v11_batch12_question_human_review_r12_semantic_sync.js'),
    R13:require('./v11_batch12_question_human_review_r13_semantic_sync.js'),
    R14:require('./v11_batch12_question_human_review_r14_semantic_sync.js')
  };
  const stages=[
    ['R5','v11_batch12_question_human_review_r5_g1_002_005.json'],
    ['R6','v11_batch12_question_human_review_r6_g1_006_010.json'],
    ['R7','v11_batch12_question_human_review_r7_g1_011_017.json'],
    ['R8','v11_batch12_question_human_review_r8_g2_001_007.json'],
    ['R9','v11_batch12_question_human_review_r9_g2_008_013.json'],
    ['R10','v11_batch12_question_human_review_r10_g2_014_017.json'],
    ['R11','v11_batch12_question_human_review_r11_g3_001_004.json'],
    ['R12','v11_batch12_question_human_review_r12_g3_005_008.json'],
    ['R13','v11_batch12_question_human_review_r13_g3_009_012.json'],
    ['R14','v11_batch12_question_human_review_r14_g3_013_016.json']
  ];
  const overlays=new Map();
  for(const [id,v] of Object.entries(r4.questionRewrites||{}))overlays.set(id,{stage:'R4',questions:clone(v.A),questionSetB:clone(v.B)});
  for(const [stage,path] of stages){
    let x=read(path);if(x.registered!==false||x.officialTotal!==718)throw Error(stage+' state');if(sync[stage])x=sync[stage](x);
    for(const p of x.passages||[])overlays.set(p.id,{stage,questions:clone(p.questions),questionSetB:clone(p.questionSetB),freeWriteTask:p.freeWriteTask?clone(p.freeWriteTask):undefined});
  }
  let out=clone(scaffold);
  out.status='B12_FINAL_HUMAN_QUESTION_CANDIDATE_UNREGISTERED';
  out.finalQuestionHumanReview=true;
  out.questionHumanReviewedPassages=50;
  out.questionHumanReviewedQuestions=500;
  out.questionHumanPending=0;
  out.registered=false;
  for(const p of out.passages){
    const o=overlays.get(p.id);if(!o)throw Error('missing human question overlay '+p.id);
    if(!Array.isArray(o.questions)||!Array.isArray(o.questionSetB)||o.questions.length!==5||o.questionSetB.length!==5)throw Error('A/B '+p.id);
    p.questions=o.questions;p.questionSetB=o.questionSetB;p.questionStage='B12_QUESTION_HUMAN_FINAL_'+o.stage;
    if(o.freeWriteTask)p.freeWriteTask=o.freeWriteTask;
  }
  out=require('./v11_batch12_final_semantic_repair_r6.js')(out);
  out=require('./v11_batch12_grammar_repair_r1.js')(out);
  const ids=new Set(out.passages.map(p=>p.id));if(ids.size!==50)throw Error('candidate unique IDs');
  let qn=0;for(const p of out.passages)qn+=(p.questions||[]).length+(p.questionSetB||[]).length;if(qn!==500)throw Error('candidate question total '+qn);
  return out;
}
if(require.main===module){const out=build();fs.writeFileSync('v11_batch12_final_candidate.json',JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify({passages:out.passages.length,questions:500,registered:out.registered,status:out.status,finalSemanticRepairs:out.finalSemanticRepairs||[],grammarRepair:out.grammarRepair||null},null,2));}
module.exports=build;
