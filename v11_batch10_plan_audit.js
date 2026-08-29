const fs=require('fs');
const p9=JSON.parse(fs.readFileSync('v11_batch09_authoring_plan.json','utf8'));
const p10=JSON.parse(fs.readFileSync('v11_batch10_authoring_plan.json','utf8'));
function assert(c,m){if(!c)throw new Error(m)}
function toks(s){return new Set(String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,' ').split(/\s+/).filter(x=>x.length>2&&!['the','and','with','that','after','before','one','two','three'].includes(x)))}
function jac(a,b){a=toks(a);b=toks(b);let n=0;for(const x of a)if(b.has(x))n++;return n/(a.size+b.size-n||1)}
const rows=p10.passages||[], old=p9.passages||[];
assert(p10.registered===false,'Batch10 must remain unregistered');
assert(p10.currentOfficialTotal===618&&p10.targetAfterFullGates===668,'official/target mismatch');
assert(rows.length===50,'rows '+rows.length);
const ids=new Set(rows.map(x=>x.id)),titles=new Set(rows.map(x=>x.title));
assert(ids.size===50,'duplicate ids');assert(titles.size===50,'duplicate titles');
const g1=rows.filter(x=>x.id.includes('-G1-')),g2=rows.filter(x=>x.id.includes('-G2-')),g3=rows.filter(x=>x.id.includes('-G3-'));
assert(g1.length===17&&g2.length===17&&g3.length===16,'grade distribution');
const tiers={STANDARD:0,LONG:0,YAMAGUCHI_EXAM:0};for(const x of g3){assert(tiers[x.level]!==undefined,'bad G3 level '+x.id);tiers[x.level]++}assert(tiers.STANDARD===8&&tiers.LONG===4&&tiers.YAMAGUCHI_EXAM===4,'G3 tiers '+JSON.stringify(tiers));
assert(rows.every(x=>x.title&&x.focus),'missing title/focus');
const oldIds=new Set(old.map(x=>x.id)),oldTitles=new Set(old.map(x=>x.title));assert(!rows.some(x=>oldIds.has(x.id)),'ID reused from Batch09');assert(!rows.some(x=>oldTitles.has(x.title)),'title reused from Batch09');
const near=[];for(const a of rows)for(const b of old){const score=jac(a.title+' '+a.focus,b.title+' '+b.focus);if(score>=0.55)near.push({a:a.id,b:b.id,score:+score.toFixed(3)})}
assert(!near.length,'Batch09 frame similarity '+JSON.stringify(near.slice(0,10)));
const within=[];for(let i=0;i<rows.length;i++)for(let j=i+1;j<rows.length;j++){const score=jac(rows[i].title+' '+rows[i].focus,rows[j].title+' '+rows[j].focus);if(score>=0.62)within.push({a:rows[i].id,b:rows[j].id,score:+score.toFixed(3)})}
assert(!within.length,'Batch10 internal frame similarity '+JSON.stringify(within.slice(0,10)));
const out={batch:p10.batch,registered:false,currentOfficialTotal:618,targetAfterFullGates:668,passages:50,g1:17,g2:17,g3:16,g3Tiers:tiers,uniqueIds:ids.size,uniqueTitles:titles.size,batch09NearFrames:near.length,internalNearFrames:within.length,pass:true};
fs.writeFileSync('V11_BATCH10_PLAN_AUDIT.json',JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify(out,null,2));console.log('V11_BATCH10_PLAN_PASS');
