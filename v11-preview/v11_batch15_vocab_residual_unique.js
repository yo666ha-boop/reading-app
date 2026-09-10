const fs=require('fs');
const r=JSON.parse(fs.readFileSync('v11_batch15_vocab_chronology_report.json','utf8'));
const m=new Map();
for(const v of r.violations||[]){
  const k=String(v.word||'').toLowerCase();
  if(!m.has(k))m.set(k,{word:k,kinds:new Set(),base:v.base||null,intro:v.intro||null,occurrences:0,passages:new Set(),grades:new Set(),anchors:new Set()});
  const x=m.get(k);x.kinds.add(v.kind);x.occurrences++;x.passages.add(v.id);x.grades.add(v.grade);x.anchors.add(v.anchor);if(!x.base&&v.base)x.base=v.base;if(!x.intro&&v.intro)x.intro=v.intro;
}
const rows=[...m.values()].map(x=>({word:x.word,kinds:[...x.kinds],base:x.base,intro:x.intro,occurrences:x.occurrences,passages:[...x.passages],grades:[...x.grades],anchors:[...x.anchors]})).sort((a,b)=>a.word.localeCompare(b.word));
const out={unique:rows.length,futureUnique:rows.filter(x=>x.kinds.includes('FUTURE_V7_LEAK')).length,unregisteredUnique:rows.filter(x=>x.kinds.includes('UNREGISTERED_V7')).length,rows};
fs.writeFileSync('v11_batch15_vocab_residual_unique.json',JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify({unique:out.unique,futureUnique:out.futureUnique,unregisteredUnique:out.unregisteredUnique},null,2));
