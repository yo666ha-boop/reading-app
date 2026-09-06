'use strict';
const fs=require('fs');
const plan=JSON.parse(fs.readFileSync('v11_batch14_authoring_plan.json','utf8'));
const draft=JSON.parse(fs.readFileSync('v11_batch14_g3_body_draft.json','utf8'));
const failures=[]; const rows=[];
const wc=s=>(String(s).match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g)||[]).length;
if(draft.registered!==false) failures.push('draft registered');
if(draft.officialTotal!==818) failures.push('officialTotal');
if(draft.passages.length!==16) failures.push('count');
if(new Set(draft.passages.map(p=>p.id)).size!==16) failures.push('duplicate ids');
for(const p of draft.passages){
 const spec=plan.passages.find(x=>x.id===p.id);
 if(!spec){failures.push(`${p.id}: absent from plan`);continue;}
 if(p.title!==spec.title||p.anchor!==spec.anchor||p.tier!==spec.tier) failures.push(`${p.id}: plan mismatch`);
 const words=wc(p.body); let lo=150,hi=230;if(p.tier==='LONG'){lo=240;hi=330}else if(p.tier==='YAMAGUCHI_EXAM'){lo=330;hi=450}
 if(words<lo||words>hi) failures.push(`${p.id}: words=${words} expected ${lo}-${hi}`);
 if(!p.fullTranslation||p.fullTranslation.length<120) failures.push(`${p.id}: translation missing/short`);
 if(!String(p.humanSemanticReview||'').startsWith('B14_G3_HUMAN_REVIEW_')) failures.push(`${p.id}: semantic review marker`);
 if(p.tier==='YAMAGUCHI_EXAM'){
   if(!p.material) failures.push(`${p.id}: material missing`);
   if(!Array.isArray(p.requiredQuestionTypes)||p.requiredQuestionTypes.length<6) failures.push(`${p.id}: question types missing`);
   if(p.freeWrite===true||spec.freeWrite===true) failures.push(`${p.id}: freeWrite prohibited`);
 }
 rows.push({id:p.id,tier:p.tier,words,review:p.humanSemanticReview});
}
const out={batch:'V11-B14',grade:3,passages:draft.passages.length,registered:false,officialTotal:818,wordCountPolicy:{STANDARD:'150-230',LONG:'240-330',YAMAGUCHI_EXAM:'330-450'},englishCompositionAllowed:false,rows,failures,finalPass:failures.length===0};
fs.writeFileSync('V11_BATCH14_G3_DRAFT_AUDIT.json',JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(out,null,2));
if(!out.finalPass)process.exit(1);
