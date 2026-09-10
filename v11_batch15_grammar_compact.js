'use strict';
const fs=require('fs');
const r=JSON.parse(fs.readFileSync('V11_BATCH15_GRAMMAR_CHRONOLOGY_REPORT.json','utf8'));
const out=[];
for(const u of r.unresolved||[]){for(const s of u.samples||[]){out.push({textbook:u.textbook,grade:u.grade,section:u.section,feature:u.feature,occurrences:u.occurrences,where:s.where,match:s.match,text:s.text});}}
fs.writeFileSync('V11_BATCH15_GRAMMAR_UNRESOLVED_COMPACT.json',JSON.stringify({generatedAt:new Date().toISOString(),unresolvedOccurrences:r.unresolvedOccurrences,futureGrammarLeak:r.futureGrammarLeak,rows:out},null,2)+'\n');
fs.writeFileSync('V11_BATCH15_GRAMMAR_UNRESOLVED_COMPACT.txt',out.map((x,i)=>`${i+1}\t${x.textbook}\tG${x.grade}\t${x.section}\t${x.feature}\tmatch=${x.match}`).join('\n')+'\n');
console.log(`grammar unresolved=${r.unresolvedOccurrences} rows=${out.length} future=${r.futureGrammarLeak}`);
