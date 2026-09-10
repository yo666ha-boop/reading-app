'use strict';
const fs=require('fs');
const report=JSON.parse(fs.readFileSync('V11_BATCH15_VOCAB_CHRONOLOGY_REPORT.json','utf8'));
const prior=JSON.parse(fs.readFileSync('v11_batch14_assembled_draft.json','utf8'));
const files=['v11_batch15_g1_body_draft.json','v11_batch15_g2_body_draft.json','v11_batch15_g3_body_draft.json'];
const canon=new Map();
function goodJp(s){return /[ぁ-んァ-ヶ一-龠]/.test(String(s||''));}
function norm(s){return String(s||'').trim().toLowerCase();}
for(const p of (prior.passages||prior||[]))for(const n of (p.notes||[])){
  if(!n||n.kind!=='unlearned_local_required'||!goodJp(n.japanese))continue;
  const e=norm(n.english); if(e&&!canon.has(e))canon.set(e,String(n.japanese).trim());
}
function bases(w){const o=[w];if(w.endsWith('ies'))o.push(w.slice(0,-3)+'y');if(w.endsWith('ied'))o.push(w.slice(0,-3)+'y');if(w.endsWith('es'))o.push(w.slice(0,-2),w.slice(0,-1));if(w.endsWith('s')&&w.length>3)o.push(w.slice(0,-1));for(const suf of ['ing','ed','er','est'])if(w.endsWith(suf)&&w.length>suf.length+2){const b=w.slice(0,-suf.length);o.push(b,b+'e');if(b.endsWith('i'))o.push(b.slice(0,-1)+'y');if(b.length>2&&b.at(-1)===b.at(-2))o.push(b.slice(0,-1));}return [...new Set(o)];}
const need=new Map();
for(const x of [...(report.unresolved||[]),...(report.future||[])]){const k=x.id+'|'+x.word;if(!need.has(k))need.set(k,x);}
let added=0,matched=0;const residual=[];
for(const file of files){const j=JSON.parse(fs.readFileSync(file,'utf8'));for(const p of (j.passages||[])){
  p.notes=p.notes||[];const have=new Set(p.notes.filter(n=>n&&n.kind==='unlearned_local_required').map(n=>norm(n.english)));
  for(const [k,x] of need){if(x.id!==p.id||have.has(x.word))continue;let jp=null,src=null;for(const b of bases(x.word)){if(canon.has(b)){jp=canon.get(b);src=b;break;}}if(jp){matched++;p.notes.push({kind:'unlearned_local_required',english:x.word,japanese:jp,scope:'passage-only-unlearned',basis:`Batch15 chronology repair: reused verified canonical Japanese gloss from v11_batch14_assembled_draft.json${src!==x.word?' via base '+src:''}; retained because necessary for passage meaning.`});have.add(x.word);added++;}else residual.push({id:p.id,word:x.word,kind:(report.future||[]).some(y=>y.id===p.id&&y.word===x.word)?'FUTURE_V7':'UNREGISTERED'});
  }
}j.status=String(j.status||'')+'_VERIFIED_GLOSS_REPAIR';fs.writeFileSync(file,JSON.stringify(j,null,2)+'\n');}
const uniqueResidual=[...new Map(residual.map(x=>[x.id+'|'+x.word,x])).values()];
fs.writeFileSync('V11_BATCH15_VERIFIED_GLOSS_REPAIR.json',JSON.stringify({generatedAt:new Date().toISOString(),canonicalEntries:canon.size,violationPairs:need.size,added,matched,residualPairs:uniqueResidual.length,residual:uniqueResidual},null,2)+'\n');
console.log(`Batch15 verified gloss repair canonical=${canon.size} need=${need.size} added=${added} residual=${uniqueResidual.length}`);
