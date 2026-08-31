const fs=require('fs');
const plan=require('./v11_batch12_authoring_plan.json');
const g1=require('./v11_batch12_g1_body_draft.json');
const g2=require('./v11_batch12_g2_body_draft.json');
const g3=require('./v11_batch12_g3_body_draft.json');
const repair=require('./v11_batch12_body_semantic_repair_r1.json');

const anchors={
  G1:[
    {textbook:'Sunshine',grade:1,unit:'PROGRAM 10-2'},
    {textbook:'New Horizon',grade:1,unit:'Unit 10-2'}
  ],
  G2:[
    {textbook:'Sunshine',grade:2,unit:'PROGRAM 8-3'},
    {textbook:'New Horizon',grade:2,unit:'Unit 7-4'}
  ],
  G3:[
    {textbook:'Sunshine',grade:3,unit:'PROGRAM 7-3'},
    {textbook:'New Horizon',grade:3,unit:'Unit 6-4'}
  ]
};
function rows(x){return Array.isArray(x.passages)?x.passages:[]}
const all=[...rows(g1),...rows(g2),...rows(g3)].map(x=>JSON.parse(JSON.stringify(x)));
const byId=new Map(all.map(x=>[x.id,x]));
for(const r of repair.replacements||[]){
  const p=byId.get(r.id); if(!p) throw new Error('repair id missing '+r.id);
  if(r.body) p.body=r.body;
  if(r.fullTranslation) p.fullTranslation=r.fullTranslation;
  if(r.bodyReplace){ if(!p.body.includes(r.bodyReplace.from)) throw new Error('bodyReplace source missing '+r.id); p.body=p.body.replace(r.bodyReplace.from,r.bodyReplace.to); }
  if(r.translationReplace){ if(!p.fullTranslation.includes(r.translationReplace.from)) throw new Error('translationReplace source missing '+r.id); p.fullTranslation=p.fullTranslation.replace(r.translationReplace.from,r.translationReplace.to); }
  if(r.materialsPatch) p.materials=Object.assign({},p.materials||{},r.materialsPatch);
  if(r.freeWriteTask) p.freeWriteTask=r.freeWriteTask;
  p.semanticRepair='R1_APPLIED';
}
if(all.length!==50||new Set(all.map(x=>x.id)).size!==50) throw new Error('Batch12 must contain 50 unique passages');
const planById=new Map(plan.passages.map(x=>[x.id,x]));
for(const p of all){
  const m=/V11-B12-(G[123])-(\d+)/.exec(p.id); if(!m) throw new Error('bad id '+p.id);
  const group=m[1], n=Number(m[2]); const pp=planById.get(p.id); if(!pp) throw new Error('plan missing '+p.id);
  if(pp.title!==p.title) throw new Error('title mismatch '+p.id);
  p.level=p.level||pp.level||'STANDARD';
  p.focus=pp.focus;
  p.anchor=anchors[group][(n-1)%2];
  p.registered=false;
  p.humanSemanticReview='PENDING_FINAL_50_REVIEW';
  p.slashRows=[];
  p.questions=[];
  p.questionSetB=[];
}
const repaired=(repair.replacements||[]).map(x=>x.id);
if(repaired.length!==4||repaired.some(id=>!byId.get(id)?.semanticRepair)) throw new Error('semantic R1 not fully applied');
const out={batch:'V11-B12',registered:false,status:'ASSEMBLED_AFTER_SEMANTIC_R1_HUMAN_REVIEW_REQUIRED',officialTotal:718,targetAfterFullGates:768,anchors,semanticRepairIds:repaired,passages:all};
fs.writeFileSync('v11_batch12_assembled_draft.json',JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify({passages:all.length,uniqueIds:new Set(all.map(x=>x.id)).size,repaired,anchors:[...new Set(all.map(x=>`${x.anchor.textbook}|${x.anchor.grade}|${x.anchor.unit}`))],registered:false},null,2));
