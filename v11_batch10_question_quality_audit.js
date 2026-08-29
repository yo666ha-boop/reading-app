'use strict';
const fs=require('fs'),vm=require('vm');
const files=['v11_batch10_passages_draft_g1.js','v11_batch10_passages_draft_g2.js','v11_batch10_passages_draft_g3.js','v11_batch10_length_repair_r1.js','v11_batch10_grammar_repair_r1.js','v11_batch10_grammar_repair_r2.js','v11_batch10_question_human_rewrite.js'];
const sandbox={window:{},console};sandbox.globalThis=sandbox.window;vm.createContext(sandbox);for(const f of files)vm.runInContext(fs.readFileSync(f,'utf8'),sandbox,{filename:f});
const ps=[...(sandbox.window.V11_BATCH10_G1_DRAFTS||[]),...(sandbox.window.V11_BATCH10_G2_DRAFTS||[]),...(sandbox.window.V11_BATCH10_G3_DRAFTS||[])];
const failures=[],warnings=[],prompts=new Map();let questionCount=0,evidenceLinked=0,answerLinked=0,freeWrites=0;
const banned=[/第\s*\d+\s*文/,/第\s*\d+\s*段階/,/空所.{0,12}第\s*\d+/,/sentence\s*\d+/i];
function fail(id,code,detail){failures.push({id,code,detail});}
for(const p of ps){
 if(p.questionStage!=='BATCH10_HUMAN_REWRITE_R1')fail(p.id,'STAGE','question rewrite not applied');
 const qs=[...(p.questions||[]),...(p.questionSetB||[])];if((p.questions||[]).length!==5||(p.questionSetB||[]).length!==5)fail(p.id,'COUNT',`${(p.questions||[]).length}+${(p.questionSetB||[]).length}`);
 const sent=new Set(p.sentences||[]), jpMap=new Map((p.slashRows||[]).map(r=>[r.en,r.jp]));
 qs.forEach((q,idx)=>{questionCount++;const key=String(q.prompt||'').trim();if(!key)fail(p.id,'EMPTY_PROMPT',idx);else{if(prompts.has(key))fail(p.id,'DUPLICATE_PROMPT',`${prompts.get(key)} / ${idx+1}`);prompts.set(key,`${p.id}:${idx+1}`);}for(const re of banned)if(re.test(key))fail(p.id,'MECHANICAL_PROMPT',key);if(!q.evidence||!sent.has(q.evidence))fail(p.id,'EVIDENCE_NOT_IN_PASSAGE',idx+1);else evidenceLinked++;if(q.questionType==='FREE_WRITE_20_30'){freeWrites++;const wc=(String(q.answer||'').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;if(wc<20||wc>30)fail(p.id,'FREE_WRITE_WORDCOUNT',wc);if(!q.scoring||q.scoring.wordMin!==20||q.scoring.wordMax!==30)fail(p.id,'FREE_WRITE_SCORING','missing/invalid');}else{const expected=jpMap.get(q.evidence);if(q.answer!==expected||q.evidenceJp!==expected)fail(p.id,'ANSWER_EVIDENCE_MISMATCH',idx+1);else answerLinked++;}if(!q.reason||String(q.reason).length<8)fail(p.id,'WEAK_REASON',idx+1);});
}
const byGrade={};for(const p of ps){const g=String(p.grade);byGrade[g]=(byGrade[g]||0)+1;}
const out={generatedAt:new Date().toISOString(),passages:ps.length,byGrade,questionCount,expectedQuestions:500,uniquePrompts:prompts.size,evidenceLinked,answerLinked,freeWrites,failures,warnings,finalPass:ps.length===50&&questionCount===500&&prompts.size===500&&failures.length===0};
fs.writeFileSync('V11_BATCH10_QUESTION_QUALITY_REPORT.json',JSON.stringify(out,null,2)+'\n');console.log(`B10 question quality passages=${ps.length} questions=${questionCount} unique=${prompts.size} evidence=${evidenceLinked} answer=${answerLinked} freeWrites=${freeWrites} failures=${failures.length} final=${out.finalPass?'PASS':'FAIL'}`);if(!out.finalPass)process.exitCode=1;
