'use strict';
const fs=require('fs');
const p9=JSON.parse(fs.readFileSync('v11_batch09_authoring_plan.json','utf8'));
const p10=JSON.parse(fs.readFileSync('v11_batch10_authoring_plan.json','utf8'));
const p11=JSON.parse(fs.readFileSync('v11_batch11_authoring_plan.json','utf8'));
function assert(c,m){if(!c)throw Error(m)}
function toks(s){return new Set(String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').split(/\s+/).filter(x=>x.length>2&&!['the','and','with','that','after','before','one','two','three','from','into','near'].includes(x)))}
function jac(a,b){a=toks(a);b=toks(b);let n=0;for(const x of a)if(b.has(x))n++;return n/(a.size+b.size-n||1)}
const rows=p11.passages||[], old=[...(p9.passages||[]),...(p10.passages||[])];
assert(p11.registered===false,'Batch11 must remain unregistered');
assert(p11.currentOfficialTotal===668&&p11.targetAfterFullGates===718,'official/target mismatch');
assert(rows.length===50,'rows '+rows.length);
const ids=new Set(rows.map(x=>x.id)),titles=new Set(rows.map(x=>x.title));assert(ids.size===50,'duplicate ids');assert(titles.size===50,'duplicate titles');
const g1=rows.filter(x=>x.id.includes('-G1-')),g2=rows.filter(x=>x.id.includes('-G2-')),g3=rows.filter(x=>x.id.includes('-G3-'));assert(g1.length===17&&g2.length===17&&g3.length===16,'grade distribution');
const tiers={STANDARD:0,LONG:0,YAMAGUCHI_EXAM:0};for(const x of g3){assert(tiers[x.level]!==undefined,'bad G3 level '+x.id);tiers[x.level]++}assert(tiers.STANDARD===8&&tiers.LONG===4&&tiers.YAMAGUCHI_EXAM===4,'G3 tiers '+JSON.stringify(tiers));
assert(rows.every(x=>x.title&&x.focus),'missing title/focus');
const oldIds=new Set(old.map(x=>x.id)),oldTitles=new Set(old.map(x=>x.title));assert(!rows.some(x=>oldIds.has(x.id)),'ID reused from prior plan');assert(!rows.some(x=>oldTitles.has(x.title)),'title reused from prior plan');
const near=[];for(const a of rows)for(const b of old){const score=jac(a.title+' '+a.focus,b.title+' '+b.focus);if(score>=0.55)near.push({a:a.id,b:b.id,score:+score.toFixed(3)})}
assert(!near.length,'Batch09/10 frame similarity '+JSON.stringify(near.slice(0,12)));
const within=[];for(let i=0;i<rows.length;i++)for(let j=i+1;j<rows.length;j++){const score=jac(rows[i].title+' '+rows[i].focus,rows[j].title+' '+rows[j].focus);if(score>=0.62)within.push({a:rows[i].id,b:rows[j].id,score:+score.toFixed(3)})}
assert(!within.length,'Batch11 internal frame similarity '+JSON.stringify(within.slice(0,12)));
const exam=g3.filter(x=>x.level==='YAMAGUCHI_EXAM');assert(exam.every(x=>/integration|integrat/i.test(x.focus)),'Yamaguchi item missing material integration focus');assert(exam.some(x=>/20-30 word response/i.test(x.focus)),'Yamaguchi profile needs 20-30 word response');
const out={batch:p11.batch,registered:false,currentOfficialTotal:668,targetAfterFullGates:718,passages:50,g1:17,g2:17,g3:16,g3Tiers:tiers,uniqueIds:ids.size,uniqueTitles:titles.size,priorNearFrames:near.length,internalNearFrames:within.length,yamaguchiMaterialItems:exam.length,pass:true};
fs.writeFileSync('V11_BATCH11_PLAN_AUDIT.json',JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify(out,null,2));console.log('V11_BATCH11_PLAN_PASS');
