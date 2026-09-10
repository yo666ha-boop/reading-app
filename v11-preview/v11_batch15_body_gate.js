'use strict';
const fs=require('fs');
const plan=JSON.parse(fs.readFileSync('v11_batch15_authoring_plan.json','utf8'));
const files=['v11_batch15_g1_body_draft.json','v11_batch15_g2_body_draft.json','v11_batch15_g3_body_draft.json'];
const drafts=files.flatMap(f=>JSON.parse(fs.readFileSync(f,'utf8')).passages||[]);
const failures=[]; const rows=[];
const wc=s=>(String(s).match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g)||[]).length;
if(plan.registered!==false||plan.officialBefore!==868||plan.targetAfterFullGates!==918) failures.push('plan registration/count contract mismatch');
if(plan.rules?.englishCompositionAllowed!==false||plan.rules?.yamaguchiReadingOnly!==true) failures.push('Yamaguchi reading-only contract mismatch');
if(drafts.length!==50) failures.push(`passage count ${drafts.length}`);
if(new Set(drafts.map(p=>p.id)).size!==50) failures.push('duplicate passage ids');
if(new Set(drafts.map(p=>p.title)).size!==50) failures.push('duplicate titles');
for(const p of drafts){
 const spec=plan.passages.find(x=>x.id===p.id);
 if(!spec){failures.push(`${p.id}: absent from plan`);continue;}
 if(p.title!==spec.title||p.anchor!==spec.anchor||p.tier!==spec.tier) failures.push(`${p.id}: plan mismatch`);
 const g=Number(String(p.id).match(/-G([123])-/)?.[1]||0); const words=wc(p.body);
 let lo,hi;
 if(g===1){lo=p.tier==='LONG'?135:90;hi=p.tier==='LONG'?165:125;}
 else if(g===2){lo=p.tier==='LONG'?170:115;hi=p.tier==='LONG'?210:155;}
 else {lo=150;hi=230;if(p.tier==='LONG'){lo=240;hi=330;}else if(p.tier==='YAMAGUCHI_EXAM'){lo=330;hi=450;}}
 if(words<lo||words>hi) failures.push(`${p.id}: words=${words} expected ${lo}-${hi}`);
 if(!p.fullTranslation||p.fullTranslation.length<(g===3?120:80)) failures.push(`${p.id}: translation missing/short`);
 if(!String(p.humanSemanticReview||'').startsWith(`B15_G${g}_HUMAN_DRAFT_`)) failures.push(`${p.id}: draft semantic marker missing`);
 if(/freeWrite|englishComposition/i.test(JSON.stringify(p))) failures.push(`${p.id}: English composition field prohibited`);
 if(p.tier==='YAMAGUCHI_EXAM' && (!p.materials || Object.keys(p.materials).length<3)) failures.push(`${p.id}: integrated materials missing`);
 const sent=(p.body.match(/[.!?](?:[”’'\"])?(?:\s|$)/g)||[]).length;
 if(sent<6) failures.push(`${p.id}: too few sentences ${sent}`);
 rows.push({id:p.id,grade:g,tier:p.tier,words,sentences:sent});
}
const split={G1:rows.filter(r=>r.grade===1).length,G2:rows.filter(r=>r.grade===2).length,G3:rows.filter(r=>r.grade===3).length};
if(split.G1!==17||split.G2!==17||split.G3!==16) failures.push(`grade split ${JSON.stringify(split)}`);
const tiers3=rows.filter(r=>r.grade===3).reduce((a,r)=>(a[r.tier]=(a[r.tier]||0)+1,a),{});
if(tiers3.STANDARD!==8||tiers3.LONG!==4||tiers3.YAMAGUCHI_EXAM!==4) failures.push(`G3 tier split ${JSON.stringify(tiers3)}`);
const out={batch:'V11-B15',officialTotal:868,targetAfterFullGates:918,registered:false,passages:drafts.length,gradeSplit:split,g3TierSplit:tiers3,englishCompositionAllowed:false,rows,failures,finalPass:failures.length===0};
fs.writeFileSync('V11_BATCH15_BODY_GATE.json',JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(out,null,2));
if(!out.finalPass) process.exit(1);
