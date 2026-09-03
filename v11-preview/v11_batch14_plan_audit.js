const fs = require('fs');
const plan = JSON.parse(fs.readFileSync('v11_batch14_authoring_plan.json','utf8'));
const prior = JSON.parse(fs.readFileSync('v11_batch13_final_candidate.json','utf8'));
const out = {batch:plan.batch, registered:plan.registered, passages:plan.passages.length, failures:[]};
const fail = x => out.failures.push(x);
if (plan.officialBefore !== 818 || plan.targetAfterFullGates !== 868) fail('bad totals');
if (plan.registered !== false) fail('plan must remain unregistered');
if (plan.passages.length !== 50) fail('passage count != 50');
const ids = plan.passages.map(x=>x.id), titles=plan.passages.map(x=>x.title);
if (new Set(ids).size !== 50) fail('duplicate ids');
if (new Set(titles).size !== 50) fail('duplicate titles');
const gs = g => plan.passages.filter(x=>x.grade===g);
if (gs(1).length!==17 || gs(2).length!==17 || gs(3).length!==16) fail('grade split');
const g3=gs(3), tier={}; for(const p of g3) tier[p.tier]=(tier[p.tier]||0)+1;
if (tier.STANDARD!==8 || tier.LONG!==4 || tier.YAMAGUCHI_EXAM!==4) fail('G3 tier split');
for(const p of g3.filter(x=>x.tier==='YAMAGUCHI_EXAM')) {
  if(!p.material) fail(`${p.id}: no material`);
  if(!p.freeWrite) fail(`${p.id}: no freeWrite`);
  const req=new Set(p.requiredQuestionTypes||[]);
  if(!req.has('CONTENT_MATCH')||!req.has('MATERIAL_LINK')) fail(`${p.id}: missing material/content type`);
  if(![...req].some(x=>x==='SENTENCE_INSERTION'||x==='SUMMARY_FILL')) fail(`${p.id}: missing insertion/summary`);
  if(![...req].some(x=>x==='CONTEXT_WORD'||x==='PHRASE_FILL')) fail(`${p.id}: missing context/phrase`);
  if(![...req].some(x=>x==='REASON'||x==='INFERENCE')) fail(`${p.id}: missing reason/inference`);
}
const tok=s=>new Set(String(s).toLowerCase().replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(Boolean));
const jac=(a,b)=>{a=tok(a);b=tok(b);let i=0;for(const x of a)if(b.has(x))i++;return i/(a.size+b.size-i||1)};
for(let i=0;i<plan.passages.length;i++) for(let j=i+1;j<plan.passages.length;j++) {
  const a=plan.passages[i],b=plan.passages[j], score=jac(a.title+' '+a.focus,b.title+' '+b.focus);
  if(score>=0.62) fail(`internal near frame ${a.id}/${b.id}=${score.toFixed(3)}`);
}
for(const p of plan.passages) for(const q of prior.passages||[]) {
  const score=jac(p.title+' '+p.focus, (q.title||'')+' '+(q.body||''));
  if(score>=0.55) fail(`prior near frame ${p.id}/${q.id}=${score.toFixed(3)}`);
}
out.g1=gs(1).length; out.g2=gs(2).length; out.g3=gs(3).length; out.g3Tiers=tier;
out.uniqueIds=new Set(ids).size; out.uniqueTitles=new Set(titles).size;
out.finalPass=out.failures.length===0;
fs.writeFileSync('V11_BATCH14_PLAN_AUDIT.json',JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(out,null,2));
if(!out.finalPass) process.exit(1);
