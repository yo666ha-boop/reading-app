const fs=require('fs');
const plan=JSON.parse(fs.readFileSync('v11_batch14_authoring_plan.json','utf8'));
const draft=JSON.parse(fs.readFileSync('v11_batch14_g1_body_draft.json','utf8'));
const failures=[]; const rows=[];
const wc=s=>(String(s).match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g)||[]).length;
if(draft.registered!==false) failures.push('draft registered');
if(draft.officialTotal!==818) failures.push('officialTotal');
if(draft.passages.length!==17) failures.push('count');
if(new Set(draft.passages.map(p=>p.id)).size!==17) failures.push('duplicate ids');
for(const p of draft.passages){
  const spec=plan.passages.find(x=>x.id===p.id);
  if(!spec){failures.push(`${p.id}: absent from plan`);continue;}
  if(p.title!==spec.title||p.anchor!==spec.anchor||p.tier!==spec.tier) failures.push(`${p.id}: plan mismatch`);
  const words=wc(p.body); const lo=p.tier==='LONG'?135:90, hi=p.tier==='LONG'?165:125;
  if(words<lo||words>hi) failures.push(`${p.id}: words=${words} expected ${lo}-${hi}`);
  if(!p.fullTranslation||p.fullTranslation.length<80) failures.push(`${p.id}: translation missing/short`);
  if(p.humanSemanticReview!=='B14_G1_HUMAN_REVIEW_R1') failures.push(`${p.id}: semantic review marker`);
  const sent=(p.body.match(/[.!?](?:[”’'"])?(?:\s|$)/g)||[]).length;
  if(sent<6) failures.push(`${p.id}: too few sentences ${sent}`);
  rows.push({id:p.id,tier:p.tier,words,sentences:sent});
}
const out={batch:'V11-B14',grade:1,passages:draft.passages.length,registered:false,officialTotal:818,rows,failures,finalPass:failures.length===0};
fs.writeFileSync('V11_BATCH14_G1_DRAFT_AUDIT.json',JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(out,null,2));
if(!out.finalPass) process.exit(1);
