'use strict';
// 2026-09-11 gate refresh: rerun R8 after current Batch15 question completion.
const fs=require('fs');
const targets={
  'v11_batch15_g1_body_draft.json':{'V11-B15-G1-003':{thanked:'感謝した'}},
  'v11_batch15_g2_body_draft.json':{'V11-B15-G2-016':{tweak:'微調整'}}
};
let added=0;
for(const [file,byId] of Object.entries(targets)){
  const j=JSON.parse(fs.readFileSync(file,'utf8'));
  for(const p of j.passages||[]){const m=byId[p.id];if(!m)continue;p.notes=p.notes||[];const have=new Set(p.notes.filter(n=>n&&n.kind==='unlearned_local_required').map(n=>String(n.english||'').toLowerCase()));for(const [english,japanese] of Object.entries(m)){if(have.has(english))continue;p.notes.push({kind:'unlearned_local_required',english,japanese,scope:'passage-only-unlearned',basis:'Batch15 chronology R8: final future-vocab repair with explicit Japanese passage-local gloss.'});added++;}}
  j.status=String(j.status||'')+'_VOCAB_FINAL_R8';fs.writeFileSync(file,JSON.stringify(j,null,2)+'\n');
}
fs.writeFileSync('V11_BATCH15_VOCAB_FINAL_R8_REPORT.json',JSON.stringify({generatedAt:new Date().toISOString(),notesAdded:added,targets:['thanked','tweak']},null,2)+'\n');
console.log(`R8 notesAdded=${added}`);
