'use strict';
const fs=require('fs'),vm=require('vm');
function run(s,f){vm.runInContext(fs.readFileSync(f,'utf8'),s,{filename:f});}
function words(s){return (String(s||'').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;}
function fail(reason,data){console.error(JSON.stringify({final:'FAIL',reason,...(data||{})},null,2));process.exit(1);}
const s={window:{},console};s.globalThis=s.window;vm.createContext(s);
for(const f of ['v11_batch06_passages_draft_g1.js','v11_batch06_passages_draft_g2.js','v11_batch06_passages_draft_g3.js'])run(s,f);
const ps=s.window.V11_BATCH06_PASSAGES||[];
const grades={1:0,2:0,3:0},ids=new Set(),lengthIssues=[],structureIssues=[],questionIssues=[];
for(const p of ps){
 grades[p.grade]=(grades[p.grade]||0)+1;
 if(ids.has(p.id))structureIssues.push({id:p.id,reason:'duplicate id'});ids.add(p.id);
 const wc=words((p.sentences||[]).join(' ')),band=p.targetWordBand||[];
 if(band.length!==2||wc<+band[0]||wc>+band[1])lengthIssues.push({id:p.id,wc,band});
 if(p.wordCount!==wc)structureIssues.push({id:p.id,reason:'stale wordCount',stored:p.wordCount,actual:wc});
 if(!Array.isArray(p.sentences)||!p.sentences.length||!Array.isArray(p.slashRows)||p.sentences.length!==p.slashRows.length)structureIssues.push({id:p.id,reason:'sentence/slash count'});
 if((p.slashRows||[]).some(r=>!r||!r.en||!r.jp))structureIssues.push({id:p.id,reason:'empty slash row'});
 const jp=(p.slashRows||[]).map(r=>r.jp).join('');if(jp!==p.fullTranslation)structureIssues.push({id:p.id,reason:'translation mismatch'});
 const qs=[...(p.questions||[]),...(p.questionSetB||[])];if(qs.length!==10)questionIssues.push({id:p.id,reason:'question count',count:qs.length});
 for(const q of qs){if(!q.prompt||!q.answer||!q.evidence||!q.evidenceJp||!q.reason)questionIssues.push({id:p.id,reason:'missing question field'});if(!(p.sentences||[]).includes(q.evidence))questionIssues.push({id:p.id,reason:'evidence not in body'});const i=(p.sentences||[]).indexOf(q.evidence);if(i>=0&&p.slashRows[i].jp!==q.evidenceJp)questionIssues.push({id:p.id,reason:'evidence jp mismatch'});}
}
const result={passages:ps.length,grades,uniqueIds:ids.size,lengthIssues,structureIssues,questionIssues,registeredCount:ps.filter(p=>p.registered).length,finalPass:ps.length===50&&grades[1]===17&&grades[2]===17&&grades[3]===16&&ids.size===50&&!lengthIssues.length&&!structureIssues.length&&!questionIssues.length&&ps.every(p=>p.registered===false)};
console.log(JSON.stringify(result,null,2));if(!result.finalPass)process.exit(1);