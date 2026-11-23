#!/usr/bin/env node
// Draft-only structural gate. This NEVER grants publication approval.
const fs=require('node:fs');
const path=require('node:path');
const base=path.resolve(__dirname,'..');
// With no explicit paths, audit every numbered draft instead of silently checking only YE-001.
const draftDir=path.join(base,'v11-exam-authoring');
const discovered=fs.readdirSync(draftDir).filter(name=>/^\d{3}_.+_original_draft\.json$/.test(name)).sort().map(name=>path.posix.join('v11-exam-authoring',name));
const files=process.argv.slice(2).length?process.argv.slice(2):discovered;
if(!files.length){console.error('NO_DRAFTS_FOUND: refusing an empty PASS');process.exit(1);}
console.error('DRAFT_GATE_INPUTS='+files.length+'; publication approval is never granted');
let failed=false;
for(const f of files){
 const p=path.resolve(base,f);
 let d;
 try { d=JSON.parse(fs.readFileSync(p,'utf8')); } catch(e) { console.log(JSON.stringify({file:f,structuralPass:false,publicationApproved:false,errors:['Cannot parse draft: '+e.message]}));failed=true;continue; }
 if(!d || !Array.isArray(d.sentences) || !Array.isArray(d.questions) || !Array.isArray(d.questionSetB) || !Array.isArray(d.slashRows)) { console.log(JSON.stringify({file:f,structuralPass:false,publicationApproved:false,errors:['Invalid required arrays: sentences/questions/questionSetB/slashRows']}));failed=true;continue; }
 const errors=[],warn=[];
 const normalize=s=>String(s||'').replace(/\s+/g,' ').trim();
 const sentenceSet=new Set((d.sentences||[]).map(normalize));
 const passage=(d.sentences||[]).join(' ');
 const punctuationErrors=(d.sentences||[]).map((s,i)=>/[.!?][\"']?$/.test(String(s).trim())?null:i+1).filter(Boolean);
 const sentenceIndex=new Map((d.sentences||[]).map((s,i)=>[normalize(s),i]));
 const check=(ok,msg)=>{if(!ok)errors.push(msg)};
 const words=(d.sentences||[]).join(' ').trim().split(/\s+/).filter(Boolean).length;
 check(words>=400&&words<=450,'word count outside 400–450: '+words);
 check(words===d.wordCount,'stored wordCount mismatch: '+d.wordCount+' vs '+words);
 check(punctuationErrors.length===0,'sentences without terminal punctuation: '+punctuationErrors.join(','));
 check(!/\b(?:write an essay|write a paragraph|your opinion in english)\b/i.test(JSON.stringify(d.questions||[])+' '+JSON.stringify(d.questionSetB||[])),'free writing prompt detected');
 check(Array.isArray(d.sentences)&&d.sentences.length>=15,'missing coherent sentence sequence');
 const jp=(d.fullTranslation||'').split(/\r?\n/).filter(Boolean);
 check(jp.length===d.sentences.length,'full translation sentence count mismatch');
 check(d.slashRows?.length===d.sentences?.length,'slashRows count mismatch');
 (d.slashRows||[]).forEach((r,i)=>{
   const en=typeof r?.en==='string'?r.en.split(/\s*\/\s*/):[],ja=typeof r?.jp==='string'?r.jp.split(/\s*\/\s*/):[];
   check(en.every(x=>x.trim())&&ja.every(x=>x.trim()),'empty English/Japanese slash block at sentence '+(i+1));
   check(en.length>=3&&en.length===ja.length,'slash segment mismatch at sentence '+(i+1));
   const norm=s=>s.replace(/[^a-z0-9]/gi,'').toLowerCase();
   check(norm(en.join(' '))===norm(d.sentences[i]||''),'slash English differs from source at '+(i+1));
 });
 check(d.questions?.length===5,'A must have 5 questions');
 check(d.questionSetB?.length===5,'B must have 5 questions');
 const all=[...(d.questions||[]),...(d.questionSetB||[])];
 check(d.isOriginal===true,'originality declaration missing');
 check(d.status?.startsWith('DRAFT'),'draft must remain explicitly DRAFT');
 check(Array.isArray(d.materials?.rows)&&d.materials.rows.length>=2,'source material table missing');
 check(new Set(all.map(q=>normalize(q.prompt).toLowerCase())).size===all.length,'duplicate question prompts');
 check(new Set((d.sentences||[]).map(s=>normalize(s).toLowerCase())).size===d.sentences.length,'duplicate source sentences');
 const allowedTypes=new Set(['DETAIL','GIST','REASON','INFERENCE','SENTENCE_INSERTION','CONTENT_MATCH','CONTEXT_WORD','PHRASE_FILL','SUMMARY_FILL','MATERIAL_LINK']);
 all.forEach((q,i)=>check(allowedTypes.has(q.questionType),'question '+(i+1)+' has unknown reading questionType: '+q.questionType));
 check(all.every(q=>!/(?:英作文|自由英作|英文で(?:書|答)|write (?:your|an|a) (?:own|essay|paragraph|sentence))/i.test(String(q.prompt||''))),'writing instruction in question prompt');
 const types=new Set(all.map(q=>q.questionType));
 check(types.size>=6,'fewer than six distinct question types');
 check(types.has('CONTENT_MATCH'),'CONTENT_MATCH missing');
 check(types.has('SENTENCE_INSERTION')||types.has('SUMMARY_FILL'),'insertion/summary missing');
 check(types.has('CONTEXT_WORD')||types.has('PHRASE_FILL'),'context/phrase missing');
 check(types.has('REASON')||types.has('INFERENCE'),'reason/inference missing');
 for(const [i,q] of all.entries()){
   for(const k of ['questionType','prompt','answer','evidence','evidenceJp','reason'])check(typeof q[k]==='string'&&q[k].trim(),'question '+(i+1)+' missing '+k);
   if(q.evidence && !sentenceSet.has(normalize(q.evidence)))errors.push('Question '+(i+1)+' evidence is not one exact source sentence; require explicit source-aligned evidence');
   const ix=sentenceIndex.get(normalize(q.evidence));
   if(ix!==undefined && normalize(q.evidenceJp)!==normalize(jp[ix]))errors.push('question '+(i+1)+' evidenceJp differs from fullTranslation sentence '+(ix+1));
   if(q.questionType==='MATERIAL_LINK')check(typeof q.materialEvidence==='string'&&q.materialEvidence.trim(),'material question '+(i+1)+' missing materialEvidence');
 }
 check(!/freeWrite|composition|essayTask/i.test(JSON.stringify(d)),'composition field detected');
 warn.push('NOT TESTED: NH/SS v7 lexical and grammar chronology');
 warn.push('NOT TESTED: semantic validity, evidence accuracy, uniqueness against 1000 passages');
 warn.push('NOT TESTED: Chromium/WebKit/iPhone/A4 and public deployment');
 const result={file:f,id:d.id,words,sentences:d.sentences?.length,translationLines:jp.length,slashRows:d.slashRows?.length,questionsA:d.questions?.length,questionsB:d.questionSetB?.length,types:[...types],structuralPass:errors.length===0,publicationApproved:false,errors,warnings:warn};
 console.log(JSON.stringify(result,null,2));if(errors.length)failed=true;
}
process.exitCode=failed?1:0;
