'use strict';
const fs=require('fs');
const build=require('./v11_batch12_build_final_candidate.js');
const x=build();
if(x.registered!==false||x.officialTotal!==718||!Array.isArray(x.passages)||x.passages.length!==50)throw Error('Batch12 runtime bundle source state');
const textbookRuntimeName=s=>{
  const v=String(s||'').trim().toLowerCase();
  if(v==='sunshine'||v==='サンシャイン'||v==='ss')return 'サンシャイン';
  if(v==='new horizon'||v==='newhorizon'||v==='ニューホライズン'||v==='nh')return 'ニューホライズン';
  throw Error('unknown runtime textbook anchor '+s);
};
const ps=x.passages.map(p=>{
  const q=JSON.parse(JSON.stringify(p));
  if(!q.anchor||!q.anchor.textbook||!q.anchor.grade||!q.anchor.unit)throw Error('anchor '+q.id);
  q.textbook=textbookRuntimeName(q.anchor.textbook);q.grade=String(q.anchor.grade);q.section=q.anchor.unit;
  q.sentences=(q.slashRows||[]).map(r=>r.en);
  q.registered=false;
  q.batch='V11-B12';
  q.finalHumanQuestionReview=true;
  q.finalSlashHumanReview=x.finalSlashHumanReview;
  return q;
});
if(new Set(ps.map(p=>p.id)).size!==50)throw Error('Batch12 runtime bundle IDs');
if(new Set(ps.map(p=>p.textbook)).size!==2||!ps.every(p=>['サンシャイン','ニューホライズン'].includes(p.textbook)))throw Error('Batch12 runtime textbook mapping');
const payload={batch:'V11-B12',officialBefore:718,targetAfterFullGates:768,registered:false,passages:ps,finalSemanticRepairs:x.finalSemanticRepairs||[],finalSlashHumanReview:x.finalSlashHumanReview,lengthRepairR8:x.lengthRepairR8||null,easySupport:x.easySupport,verifiedGlossReuse:x.verifiedGlossReuse};
fs.writeFileSync('v11_batch12_runtime_bundle.js',`(function(){'use strict';window.V11_BATCH12_FINAL_BUNDLE=${JSON.stringify(payload)};window.V11_BATCH12_FINAL_PASSAGES=window.V11_BATCH12_FINAL_BUNDLE.passages;})();\n`);
fs.writeFileSync('V11_BATCH12_RUNTIME_BUNDLE_STATUS.json',JSON.stringify({passages:ps.length,questions:ps.reduce((n,p)=>n+(p.questions||[]).length+(p.questionSetB||[]).length,0),supportNotes:ps.reduce((n,p)=>n+(p.supportNotes||[]).length,0),normalNotes:ps.reduce((n,p)=>n+(p.notes||[]).length,0),runtimeTextbooks:[...new Set(ps.map(p=>p.textbook))],registered:false,officialBefore:718,target:768,finalSlashHumanReview:x.finalSlashHumanReview,lengthRepairR8:x.lengthRepairR8||null,finalSemanticRepairs:x.finalSemanticRepairs||[],pass:true},null,2)+'\n');
console.log(JSON.stringify({passages:50,runtimeTextbooks:[...new Set(ps.map(p=>p.textbook))],registered:false,target:768,finalSlashHumanReview:x.finalSlashHumanReview,lengthRepairR8:x.lengthRepairR8||null,pass:true},null,2));
