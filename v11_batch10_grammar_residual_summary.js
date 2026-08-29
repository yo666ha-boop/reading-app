'use strict';
const fs=require('fs');const g=JSON.parse(fs.readFileSync('V11_BATCH10_GRAMMAR_CHRONOLOGY_REPORT.json','utf8'));const rows=g.unresolved||[];
const byGrade={},byFeature={};for(const r of rows){byGrade[r.grade]=(byGrade[r.grade]||0)+Number(r.occurrences||0);byFeature[r.feature]=(byFeature[r.feature]||0)+Number(r.occurrences||0);}
console.log('GRADE '+JSON.stringify(byGrade));console.log('FEATURE '+JSON.stringify(Object.fromEntries(Object.entries(byFeature).sort((a,b)=>b[1]-a[1]))));
for(const r of rows){console.log(`GROUP ${r.textbook}|G${r.grade}|${r.section}|${r.feature}|occ=${r.occurrences}`);for(const s of r.samples||[])console.log(`  ${s.where} :: ${s.match} :: ${s.text}`);}
