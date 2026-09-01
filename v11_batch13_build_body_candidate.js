'use strict';
const fs=require('fs');
function read(f){return JSON.parse(fs.readFileSync(f,'utf8'));}
function splitSentences(text){const seg=new Intl.Segmenter('en',{granularity:'sentence'});return [...seg.segment(String(text||''))].map(x=>x.segment.trim()).filter(Boolean);}
function replaceExact(p,field,find,repl,id){if(!String(p[field]||'').includes(find))throw Error(`semantic repair text missing ${id} ${field}`);p[field]=String(p[field]).replace(find,repl);}
function applyRepairDoc(passages,file,marker){const d=read(file);for(const r of d.repairs||[]){const p=passages.find(x=>x.id===r.id);if(!p)throw Error(`semantic target missing ${r.id}`);if(r.humanReviewed!==true&&d.humanReviewed!==true)throw Error(`unreviewed semantic repair ${r.id}`);replaceExact(p,'body',r.findBody,r.replaceBody,r.id);replaceExact(p,'fullTranslation',r.findTranslation,r.replaceTranslation,r.id);p.humanSemanticReview=marker;}}
module.exports=function build(){
 const files=['v11_batch13_g1_body_draft.json','v11_batch13_g2_body_draft.json','v11_batch13_g3_standard_long_draft.json','v11_batch13_g3_yamaguchi_exam_draft.json'];
 const passages=files.flatMap(f=>read(f).passages||[]).map(p=>JSON.parse(JSON.stringify(p)));
 const repair=read('v11_batch13_g3_length_repair_r1.json');
 for(const r of repair.repairs||[]){const p=passages.find(x=>x.id===r.id);if(!p)throw Error(`missing repair target ${r.id}`);if(r.humanReviewed!==true)throw Error(`unreviewed repair ${r.id}`);p.body+=r.bodyAppend||'';p.fullTranslation+=r.translationAppend||'';}
 applyRepairDoc(passages,'v11_batch13_semantic_repair_r2.json','B13_HUMAN_REVIEW_COMPLETE_R2');
 applyRepairDoc(passages,'v11_batch13_semantic_repair_r3_grammar.json','B13_HUMAN_REVIEW_COMPLETE_R3');
 applyRepairDoc(passages,'v11_batch13_semantic_repair_r4_residual.json','B13_HUMAN_REVIEW_COMPLETE_R4');
 applyRepairDoc(passages,'v11_batch13_semantic_repair_r5_final_vocab.json','B13_HUMAN_REVIEW_COMPLETE_R5');
 if(passages.length!==50||new Set(passages.map(p=>p.id)).size!==50)throw Error('Batch13 candidate count/id failure');
 for(const p of passages){p.registered=false;p.sentences=splitSentences(p.body);if(!p.sentences.length)throw Error(`no chronology sentences ${p.id}`);p.slashRows=[];p.questions=[];p.questionSetB=[];}
 return {batch:'V11-B13',registered:false,officialTotal:768,targetAfterFullGates:818,status:'BODY_TRANSLATION_CANDIDATE_QUESTIONS_SLASH_PENDING',passages};
};
if(require.main===module)console.log(JSON.stringify(module.exports(),null,2));
