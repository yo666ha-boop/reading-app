'use strict';
const fs=require('fs');
const r=JSON.parse(fs.readFileSync('V11_BATCH10_VOCAB_CHRONOLOGY_REPORT.json','utf8'));
const norm=w=>String(w||'').toLowerCase().replace(/[’‘]/g,"'").trim();
function uniq(rows){const m=new Map();for(const x of rows||[]){const w=norm(x.word);if(!w)continue;const y=m.get(w)||{word:w,occurrences:0,ids:new Set(),intros:new Set()};y.occurrences++;y.ids.add(x.id);if(x.intro)y.intros.add(JSON.stringify(x.intro));m.set(w,y)}return [...m.values()].map(x=>({word:x.word,occurrences:x.occurrences,ids:[...x.ids],intros:[...x.intros].map(JSON.parse)})).sort((a,b)=>a.word.localeCompare(b.word));}
const out={generatedAt:new Date().toISOString(),unregisteredOccurrences:r.unregisteredOccurrences,futureOccurrences:r.futureVocabLeakOccurrences,unregistered:uniq(r.unresolved),future:uniq(r.future)};
out.union=[...new Set([...out.unregistered.map(x=>x.word),...out.future.map(x=>x.word)])].sort();
fs.writeFileSync('V11_BATCH10_VOCAB_RESIDUAL_R2_SUMMARY.json',JSON.stringify(out,null,2)+'\n');
console.log('UNREGISTERED='+out.unregistered.map(x=>x.word).join(','));
console.log('FUTURE='+out.future.map(x=>x.word).join(','));
console.log('UNION_COUNT='+out.union.length);
