'use strict';
const fs=require('fs');
const r=JSON.parse(fs.readFileSync('V11_BATCH10_VOCAB_CHRONOLOGY_REPORT.json','utf8'));
const by={};for(const x of [...(r.unresolved||[]),...(r.future||[])]){const w=String(x.word).toLowerCase().replace(/[’‘]/g,"'");(by[x.id]??=new Set()).add(w)}
console.log(`unregistered=${r.unregisteredOccurrences} future=${r.futureVocabLeakOccurrences}`);
const all=new Set();for(const [id,s] of Object.entries(by)){const a=[...s].sort();a.forEach(x=>all.add(x));console.log(`${id}: ${a.join(', ')}`)}
console.log(`UNIQUE ${all.size}: ${[...all].sort().join(', ')}`);
