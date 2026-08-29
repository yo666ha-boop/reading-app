'use strict';
const fs=require('fs'),vm=require('vm');
const files=['v11_batch11_passages_draft_g1.js','v11_batch11_passages_draft_g2.js','v11_batch11_g3_core.js','v11_batch11_passages_draft_g3_standard.js','v11_batch11_passages_draft_g3_long.js','v11_batch11_passages_draft_g3_yamaguchi_a.js','v11_batch11_passages_draft_g3_yamaguchi_b.js','v11_batch11_length_repair_r1.js','v11_batch11_length_repair_r2.js','v11_batch11_length_repair_r3.js','v11_batch11_length_repair_r4.js','v11_batch11_grammar_repair_r1.js','v11_batch11_grammar_repair_r2.js'];
const sandbox={window:{},console};sandbox.globalThis=sandbox.window;vm.createContext(sandbox);for(const f of files)vm.runInContext(fs.readFileSync(f,'utf8'),sandbox,{filename:f});
const ps=[...(sandbox.window.V11_BATCH11_G1_DRAFTS||[]),...(sandbox.window.V11_BATCH11_G2_DRAFTS||[]),...(sandbox.window.V11_BATCH11_G3_DRAFTS||[])];
const failures=[],warnings=[],prompts=new Map(),types={};let questionCount=0,evidenceLinked=0,answerLinked=0,freeWrites=0,yMaterial=0;
const banned=[/第\s*\d+\s*文/,/第\s*\d+\s*段階/,/空所.{0,12}第\s*\d+/,/sentence\s*\d+/i,/付近.{0,8}答え/i];
function fail(id,code,detail){failures.push({id,code,detail});}
for(const p of ps){
 if(p.questionStage!=='BATCH11_HUMAN_REWRITE_R2')fail(p.id,'STAGE','question r2 not applied');if(p.questionHumanReview!=='FULL_50_PASSAGE_REVIEW_20260829')fail(p.id,'HUMAN_REVIEW','question human review marker missing');
 const qs=[...(p.questions||[]),...(p.questionSetB||[])];if((p.questions||[]).length!==5||(p.questionSetB||[]).length!==5)fail(p.id,'COUNT',`${(p.questions||[]).length}+${(p.questionSetB||[]).length}`);
 const sent=new Set(p.sentences||[]),jpMap=new Map((p.slashRows||[]).map(r=>[r.en,r.jp]));const localEvidence=new Map();
 qs.forEach((q,idx)=>{questionCount++;types[q.questionType]=(types[q.questionType]||0)+1;const key=String(q.prompt||'').trim();if(!key)fail(p.id,'EMPTY_PROMPT',idx);else{if(prompts.has(key))fail(p.id,'DUPLICATE_PROMPT',`${prompts.get(key)} / ${idx+1}`);prompts.set(key,`${p.id}:${idx+1}`);}for(const re of banned)if(re.test(key))fail(p.id,'MECHANICAL_PROMPT',key);
  if(!q.evidence||!sent.has(q.evidence))fail(p.id,'EVIDENCE_NOT_IN_PASSAGE',idx+1);else{evidenceLinked++;const prior=localEvidence.get(q.evidence)||[];prior.push(q.questionType);localEvidence.set(q.evidence,prior);}
  if(q.questionType==='FREE_WRITE_20_30'){freeWrites++;const wc=(String(q.answer||'').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;if(wc<20||wc>30)fail(p.id,'FREE_WRITE_WORDCOUNT',wc);if(!q.scoring||q.scoring.wordMin!==20||q.scoring.wordMax!==30||!Array.isArray(q.scoring.conditions)||q.scoring.conditions.length<3)fail(p.id,'FREE_WRITE_SCORING','missing/invalid');}
  else{const expected=jpMap.get(q.evidence);if(q.answer!==expected||q.evidenceJp!==expected)fail(p.id,'ANSWER_EVIDENCE_MISMATCH',idx+1);else answerLinked++;}
  if(!q.reason||String(q.reason).length<8)fail(p.id,'WEAK_REASON',idx+1);if(q.questionType==='INFERENCE')fail(p.id,'UNSUPPORTED_INFERENCE_TEMPLATE','R2 must not label a direct evidence answer as inference');
 });
 if(p.level==='YAMAGUCHI_EXAM'){const m=qs.filter(q=>q.questionType==='MATERIAL_LINK').length;yMaterial+=m;if(m<2)fail(p.id,'YAMAGUCHI_MATERIAL_LINK_COUNT',m);if(!p.materialData)fail(p.id,'YAMAGUCHI_MATERIAL_DATA','missing');}
 for(const [ev,arr] of localEvidence){if(arr.length>1&&!arr.includes('FREE_WRITE_20_30'))warnings.push({id:p.id,code:'REUSED_EVIDENCE',types:arr,evidence:ev});}
}
const requiredTypes=['GIST','DETAIL','REASON','CONTENT_MATCH','RESULT','SUMMARY_FILL','EVIDENCE','PHRASE_FILL','MATERIAL_LINK'];for(const t of requiredTypes)if(!types[t])fail('B11','TYPE_MISSING',t);
const byGrade={};for(const p of ps){const g=String(p.grade);byGrade[g]=(byGrade[g]||0)+1;}
const out={generatedAt:new Date().toISOString(),passages:ps.length,byGrade,questionCount,expectedQuestions:500,uniquePrompts:prompts.size,evidenceLinked,answerLinked,freeWrites,yamaguchiMaterialLinks:yMaterial,questionTypes:types,failures,warnings,finalPass:ps.length===50&&questionCount===500&&prompts.size===500&&failures.length===0};fs.writeFileSync('V11_BATCH11_QUESTION_QUALITY_REPORT.json',JSON.stringify(out,null,2)+'\n');console.log(`B11 question passages=${ps.length} questions=${questionCount} unique=${prompts.size} evidence=${evidenceLinked} answer=${answerLinked} freeWrites=${freeWrites} yMaterial=${yMaterial} failures=${failures.length} warnings=${warnings.length} final=${out.finalPass?'PASS':'FAIL'}`);if(!out.finalPass)process.exitCode=1;
