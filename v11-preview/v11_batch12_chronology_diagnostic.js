'use strict';
const fs=require('fs');
const vocab=JSON.parse(fs.readFileSync('V11_BATCH12_VOCAB_CHRONOLOGY_REPORT.json','utf8'));
const grammar=JSON.parse(fs.readFileSync('V11_BATCH12_GRAMMAR_CHRONOLOGY_REPORT.json','utf8'));
function aggregate(rows){const byWord=new Map(),byPassage=new Map();for(const r of rows||[]){const w=r.word||r.base||'(unknown)';const a=byWord.get(w)||{word:w,count:0,ids:new Set(),where:new Set(),books:new Set()};a.count++;a.ids.add(r.id);a.where.add(r.where);a.books.add(`${r.book}|${r.grade}|${r.section}`);byWord.set(w,a);byPassage.set(r.id,(byPassage.get(r.id)||0)+1);}return{distinct:byWord.size,top:[...byWord.values()].sort((a,b)=>b.count-a.count||a.word.localeCompare(b.word)).map(x=>({word:x.word,count:x.count,passages:x.ids.size,ids:[...x.ids],sections:[...x.books],sampleWhere:[...x.where].slice(0,8)})),perPassage:[...byPassage].sort((a,b)=>b[1]-a[1]).map(([id,count])=>({id,count}))};}
const u=aggregate(vocab.unresolved),f=aggregate(vocab.future);
const unresolvedRows=grammar.unresolved||grammar.unresolvedRows||grammar.issues||[];
const grammarTypes={};for(const r of unresolvedRows){const k=r.feature||r.type||r.rule||r.grammar||'(unknown)';grammarTypes[k]=(grammarTypes[k]||0)+1;}
const out={generatedAt:new Date().toISOString(),vocab:{unregisteredOccurrences:vocab.unregisteredOccurrences,futureOccurrences:vocab.futureVocabLeakOccurrences,unregistered:u,future:f},grammar:{detectedOccurrences:grammar.detectedOccurrences,unresolvedOccurrences:grammar.unresolvedOccurrences,futureGrammarLeak:grammar.futureGrammarLeak,types:grammarTypes,unresolved:unresolvedRows},status:'DIAGNOSTIC_ONLY_NOT_A_GATE_PASS'};
fs.writeFileSync('V11_BATCH12_CHRONOLOGY_DIAGNOSTIC.json',JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify({unregisteredDistinct:u.distinct,futureDistinct:f.distinct,topUnregistered:u.top.slice(0,30),topFuture:f.top.slice(0,30),grammarTypes,grammarUnresolved:grammar.unresolvedOccurrences},null,2));
