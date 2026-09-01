'use strict';
const fs=require('fs');
const build=require('./v11_batch12_build_final_candidate.js');
const review=JSON.parse(fs.readFileSync('v11_batch12_final_slash_human_review_r7.json','utf8'));
const x=build();
const fail=[];
if(x.registered!==false)fail.push('candidate must remain unregistered');
if(x.officialTotal!==718)fail.push('official total must remain 718');
if(!Array.isArray(x.passages)||x.passages.length!==50)fail.push('passage count');
if(review.registered!==false||review.officialTotal!==718)fail.push('review state');
if(review.reviewedPassageCount!==50)fail.push('reviewed passage count');
if(review.reviewedRowCount!==449)fail.push('reviewed row count');
const actualIds=(x.passages||[]).map(p=>p.id).sort();
const reviewedIds=[...(review.reviewedIds||[])].sort();
if(new Set(reviewedIds).size!==50||JSON.stringify(actualIds)!==JSON.stringify(reviewedIds))fail.push('reviewed ID set mismatch');
let rows=0;
for(const p of x.passages||[]){
  if(!Array.isArray(p.slashRows)||p.slashRows.length===0){fail.push(p.id+': no slashRows');continue;}
  rows+=p.slashRows.length;
  for(let i=0;i<p.slashRows.length;i++){
    const r=p.slashRows[i]||{};
    if(!String(r.en||'').trim()||!String(r.jp||'').trim())fail.push(`${p.id}: blank slash row ${i+1}`);
  }
}
if(rows!==449)fail.push('candidate row total '+rows);
for(const id of ['V11-B12-G1-011','V11-B12-G1-014']){
  if(!(x.finalSemanticRepairs||[]).includes(id))fail.push(id+': R7 repair not present');
}
const g1011=(x.passages||[]).find(p=>p.id==='V11-B12-G1-011');
if(g1011){
  if(g1011.slashRows[3].jp!=='そこで司書の先生に正しい置き場所を尋ねました。')fail.push('G1-011 row4');
  if(g1011.slashRows[4].jp!=='一緒に返却カウンターの横へ移すと、本棚も通路もふさぎませんでした。')fail.push('G1-011 row5');
}
const g1014=(x.passages||[]).find(p=>p.id==='V11-B12-G1-014');
if(g1014){
  if(!g1014.slashRows[3].jp.includes('両方の上履き')||!g1014.slashRows[4].jp.includes('片方だけ')||!g1014.slashRows[5].jp.includes('もう片方の上履き'))fail.push('G1-014 individual-shoe meaning');
}
const out={batch:'V11-B12',registered:x.registered,officialTotal:x.officialTotal,passages:(x.passages||[]).length,slashRows:rows,reviewedPassages:reviewedIds.length,repairs:x.finalSemanticRepairs||[],failures:fail,finalPass:fail.length===0};
fs.writeFileSync('V11_BATCH12_FINAL_SLASH_HUMAN_GATE.json',JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(out,null,2));
if(fail.length)process.exit(1);
