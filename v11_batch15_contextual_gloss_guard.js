const fs=require('fs');
const FILES=['v11_batch15_g1_body_draft.json','v11_batch15_g2_body_draft.json','v11_batch15_g3_body_draft.json'];
const OVERRIDES={
  'V11-B15-G1-001|case':'筆箱'
};
function norm(s){return String(s||'').trim().toLowerCase()}
function jp(s){return /[ぁ-んァ-ヶ一-龠々]/.test(String(s||''))}
let fixed=0,total=0,badEnglishGloss=0,empty=0,contextWarnings=[];
for(const file of FILES){
 const d=JSON.parse(fs.readFileSync(file,'utf8'));
 for(const p of d.passages||[]){
   for(const n of p.notes||[]){
     if(!/unlearned_local_required/i.test(String(n.kind||''))) continue;
     total++;
     const key=`${p.id}|${norm(n.english)}`;
     if(OVERRIDES[key]){n.japanese=OVERRIDES[key];n.basis=String(n.basis||'')+' Contextual gloss corrected against Batch15 fullTranslation.';fixed++;}
     const j=String(n.japanese||'').trim(),e=String(n.english||'').trim();
     if(!j){empty++;continue}
     if(!jp(j)||norm(j)===norm(e)) badEnglishGloss++;
     // Warning only: a short Japanese gloss need not literally occur in the full translation,
     // but exact presence is strong evidence and absence must not be silently called verified.
     const alts=j.split(/[・／/]/).map(x=>x.trim()).filter(x=>x.length>=1);
     if(alts.length && !alts.some(x=>String(p.fullTranslation||'').includes(x))) contextWarnings.push({id:p.id,english:e,japanese:j});
   }
 }
 fs.writeFileSync(file,JSON.stringify(d,null,2)+'\n');
}
const out={passages:50,requiredLocalNotes:total,contextualOverridesApplied:fixed,emptyGloss:empty,englishOnlyOrNonJapaneseGloss:badEnglishGloss,contextWarnings:contextWarnings.length,warningSample:contextWarnings.slice(0,100),rule:'Warnings are review queue, not automatic failures; English-only/non-Japanese/empty glosses are failures.'};
fs.writeFileSync('v11_batch15_contextual_gloss_guard_report.json',JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify({...out,warningSample:undefined},null,2));
if(empty||badEnglishGloss)process.exit(2);
