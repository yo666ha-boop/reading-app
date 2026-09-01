const fs=require('fs');
const files=['v11_batch13_g1_body_draft.json','v11_batch13_g2_body_draft.json','v11_batch13_g3_standard_long_draft.json','v11_batch13_g3_yamaguchi_exam_draft.json'];
const docs=files.map(f=>JSON.parse(fs.readFileSync(f,'utf8')));
const passages=docs.flatMap(d=>d.passages||[]).map(p=>({...p}));
const issues=[];
const repairDoc=JSON.parse(fs.readFileSync('v11_batch13_g3_length_repair_r1.json','utf8'));
const repairMap=new Map((repairDoc.repairs||[]).map(r=>[r.id,r]));
for(const [id,r] of repairMap){
 const p=passages.find(x=>x.id===id);
 if(!p){issues.push(`repair target missing ${id}`);continue;}
 if(r.humanReviewed!==true)issues.push(`repair not human reviewed ${id}`);
 p.body=(p.body||'')+(r.bodyAppend||'');
 p.fullTranslation=(p.fullTranslation||'')+(r.translationAppend||'');
}
const wc=s=>(s.match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g)||[]).length;
const sent=s=>s.split(/(?<=[.!?])\s+/).map(x=>x.trim()).filter(Boolean);
const ids=new Set(), titles=new Set();
if(passages.length!==50)issues.push(`passageCount=${passages.length}`);
for(const p of passages){
 if(ids.has(p.id))issues.push(`duplicate id ${p.id}`); ids.add(p.id);
 if(titles.has(p.title))issues.push(`duplicate title ${p.title}`); titles.add(p.title);
 if(p.registered===true)issues.push(`registered true ${p.id}`);
 if(!p.body||!p.fullTranslation)issues.push(`missing body/translation ${p.id}`);
 if(!String(p.humanSemanticReview||'').includes('HUMAN_REVIEW_COMPLETE'))issues.push(`human review missing ${p.id}`);
 if(!p.anchor?.textbook||!p.anchor?.unit)issues.push(`anchor missing ${p.id}`);
 const n=wc(p.body||'');
 const g=Number((p.id.match(/-G([123])-/)||[])[1]);
 const level=p.level||'STANDARD';
 let lo,hi;
 if(g===1){lo=90;hi=level==='LONG'?165:125; if(level==='LONG')lo=135;}
 else if(g===2){lo=115;hi=level==='LONG'?210:155; if(level==='LONG')lo=170;}
 else if(level==='YAMAGUCHI_EXAM'){lo=330;hi=450;} else if(level==='LONG'){lo=240;hi=330;} else {lo=150;hi=230;}
 if(n<lo||n>hi)issues.push(`word band ${p.id} ${n} not ${lo}-${hi}`);
 if(g===3&&level==='YAMAGUCHI_EXAM'&&!p.materials)issues.push(`materials missing ${p.id}`);
}
const gradeCounts={G1:0,G2:0,G3:0}; for(const p of passages){const m=p.id.match(/-G([123])-/); if(m)gradeCounts['G'+m[1]]++;}
if(gradeCounts.G1!==17||gradeCounts.G2!==17||gradeCounts.G3!==16)issues.push(`grade split ${JSON.stringify(gradeCounts)}`);
const g3=passages.filter(p=>p.id.includes('-G3-'));
const tiers=g3.reduce((a,p)=>(a[p.level]=(a[p.level]||0)+1,a),{});
if((tiers.STANDARD||0)!==8||(tiers.LONG||0)!==4||(tiers.YAMAGUCHI_EXAM||0)!==4)issues.push(`g3 tiers ${JSON.stringify(tiers)}`);
const sentenceOwners=new Map();
for(const p of passages) for(const s of sent(p.body||'')){const k=s.toLowerCase().replace(/[^a-z0-9 ]/g,'').replace(/\s+/g,' ').trim(); if(k.split(' ').length<7)continue; const arr=sentenceOwners.get(k)||[]; arr.push(p.id); sentenceOwners.set(k,arr);}
for(const [s,owners] of sentenceOwners) if(new Set(owners).size>1)issues.push(`shared sentence ${owners.join(',')} :: ${s.slice(0,80)}`);
const wordCounts=Object.fromEntries(passages.map(p=>[p.id,wc(p.body||'')]));
const report={batch:'V11-B13',passageCount:passages.length,uniqueIds:ids.size,uniqueTitles:titles.size,gradeCounts,g3Tiers:tiers,lengthRepairCount:repairMap.size,wordCounts,issues,registered:false,officialBefore:768,targetAfterFullGates:818,finalPass:issues.length===0};
fs.writeFileSync('V11_BATCH13_BODY_AUTHORING_AUDIT.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
if(issues.length)process.exit(1);
