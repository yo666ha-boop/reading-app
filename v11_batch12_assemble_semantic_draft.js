const fs=require('fs');
const plan=require('./v11_batch12_authoring_plan.json');
const g1=require('./v11_batch12_g1_body_draft.json');
const g2=require('./v11_batch12_g2_body_draft.json');
const g3=require('./v11_batch12_g3_body_draft.json');
const r1=require('./v11_batch12_body_semantic_repair_r1.json');
const r2=require('./v11_batch12_body_semantic_repair_r2.json');
const anchors={G1:[{textbook:'Sunshine',grade:1,unit:'PROGRAM 10-2'},{textbook:'New Horizon',grade:1,unit:'Unit 10-2'}],G2:[{textbook:'Sunshine',grade:2,unit:'PROGRAM 8-3'},{textbook:'New Horizon',grade:2,unit:'Unit 7-4'}],G3:[{textbook:'Sunshine',grade:3,unit:'PROGRAM 7-3'},{textbook:'New Horizon',grade:3,unit:'Unit 6-4'}]};
function rows(x){return Array.isArray(x.passages)?x.passages:[]}
const all=[...rows(g1),...rows(g2),...rows(g3)].map(x=>JSON.parse(JSON.stringify(x)));
const byId=new Map(all.map(x=>[x.id,x]));
function applyRepair(pack,stage){for(const r of pack.replacements||[]){const p=byId.get(r.id);if(!p)throw new Error(stage+' repair id missing '+r.id);if(r.body)p.body=r.body;if(r.fullTranslation)p.fullTranslation=r.fullTranslation;const br=[...(r.bodyReplace?[r.bodyReplace]:[]),...(r.bodyReplaces||[])];for(const x of br){if(!p.body.includes(x.from))throw new Error(stage+' bodyReplace source missing '+r.id);p.body=p.body.replace(x.from,x.to)}const tr=[...(r.translationReplace?[r.translationReplace]:[]),...(r.translationReplaces||[])];for(const x of tr){if(!p.fullTranslation.includes(x.from))throw new Error(stage+' translationReplace source missing '+r.id);p.fullTranslation=p.fullTranslation.replace(x.from,x.to)}if(r.materialsPatch)p.materials=Object.assign({},p.materials||{},r.materialsPatch);if(r.freeWriteTask)p.freeWriteTask=r.freeWriteTask;p.semanticRepair=[p.semanticRepair,stage].filter(Boolean).join('+')}}
applyRepair(r1,'R1_APPLIED');
applyRepair(r2,'R2_HUMAN_APPLIED');
if(all.length!==50||new Set(all.map(x=>x.id)).size!==50)throw new Error('Batch12 must contain 50 unique passages');
const reviewed=new Set(r2.reviewedIds||[]);if(reviewed.size!==35)throw new Error('R2 reviewed IDs must be exactly 35 in this checkpoint');
const dist={G1:0,G2:0,G3:0};const planById=new Map(plan.passages.map(x=>[x.id,x]));
for(const p of all){const m=/V11-B12-(G[123])-(\d+)/.exec(p.id);if(!m)throw new Error('bad id '+p.id);const group=m[1],n=Number(m[2]),pp=planById.get(p.id);if(!pp)throw new Error('plan missing '+p.id);if(pp.title!==p.title)throw new Error('title mismatch '+p.id);dist[group]++;p.level=p.level||pp.level||'STANDARD';p.focus=pp.focus;p.anchor=anchors[group][(n-1)%2];p.registered=false;p.humanSemanticReview=reviewed.has(p.id)?'B12_HUMAN_REVIEW_R2_COMPLETE':'PENDING_FINAL_50_REVIEW';p.slashRows=[];p.questions=[];p.questionSetB=[]}
if(dist.G1!==17||dist.G2!==17||dist.G3!==16)throw new Error('grade distribution mismatch '+JSON.stringify(dist));
const r1ids=(r1.replacements||[]).map(x=>x.id);if(r1ids.length!==4||r1ids.some(id=>!byId.get(id)?.semanticRepair))throw new Error('semantic R1 not fully applied');
const y=all.filter(x=>x.id.startsWith('V11-B12-G3-')&&x.level==='YAMAGUCHI_EXAM');if(y.length!==4||y.some(x=>!x.materials))throw new Error('Yamaguchi material integration must be 4/4');
const out={batch:'V11-B12',registered:false,status:'ASSEMBLED_AFTER_SEMANTIC_R2_PARTIAL_HUMAN_REVIEW',officialTotal:718,targetAfterFullGates:768,anchors,semanticRepairIds:[...new Set([...r1ids,...(r2.replacements||[]).map(x=>x.id)])],humanReviewedCount:reviewed.size,humanReviewPendingCount:50-reviewed.size,passages:all};
fs.writeFileSync('v11_batch12_assembled_draft.json',JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify({passages:all.length,uniqueIds:new Set(all.map(x=>x.id)).size,distribution:dist,r1:r1ids.length,r2:(r2.replacements||[]).length,humanReviewed:reviewed.size,humanPending:50-reviewed.size,yamaguchiWithMaterials:y.length,registered:false},null,2));