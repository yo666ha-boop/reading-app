#!/usr/bin/env node
// Draft-only structural gate. This NEVER grants publication approval.
const fs=require('node:fs');
const path=require('node:path');
const base=path.resolve(__dirname,'..');
const files=process.argv.slice(2).length?process.argv.slice(2):['001_water_stations_original_draft.json'];
let failed=false;
for(const f of files){
 const p=path.resolve(base,f),d=JSON.parse(fs.readFileSync(p,'utf8'));
 const errors=[],warn=[];
 const check=(ok,msg)=>{if(!ok)errors.push(msg)};
 const words=(d.sentences||[]).join(' ').trim().split(/\s+/).filter(Boolean).length;
 check(words>=400&&words<=450,'word count outside 400–450: '+words);
 check(words===d.wordCount,'stored wordCount mismatch: '+d.wordCount+' vs '+words);
 check(Array.isArray(d.sentences)&&d.sentences.length>=15,'missing coherent sentence sequence');
 const jp=(d.fullTranslation||'').split(/\r?\n/).filter(Boolean);
 check(jp.length===d.sentences.length,'full translation sentence count mismatch');
 check(d.slashRows?.length===d.sentences?.length,'slashRows count mismatch');
 (d.slashRows||[]).forEach((r,i)=>{
   const en=r.en?.split(/\s*\/\s*/)||[],ja=r.jp?.split(/\s*\/\s*/)||[];
   check(en.length>=2&&en.length===ja.length,'slash segment mismatch at sentence '+(i+1));
   const norm=s=>s.replace(/[^a-z0-9]/gi,'').toLowerCase();
   check(norm(en.join(' '))===norm(d.sentences[i]||''),'slash English differs from source at '+(i+1));
 });
 check(d.questions?.length===5,'A must have 5 questions');
 check(d.questionSetB?.length===5,'B must have 5 questions');
 const all=[...(d.questions||[]),...(d.questionSetB||[])];
 const types=new Set(all.map(q=>q.questionType));
 check(types.size>=6,'fewer than six distinct question types');
 check(types.has('CONTENT_MATCH'),'CONTENT_MATCH missing');
 check(types.has('SENTENCE_INSERTION')||types.has('SUMMARY_FILL'),'insertion/summary missing');
 check(types.has('CONTEXT_WORD')||types.has('PHRASE_FILL'),'context/phrase missing');
 check(types.has('REASON')||types.has('INFERENCE'),'reason/inference missing');
 for(const [i,q] of all.entries()){
   for(const k of ['questionType','prompt','answer','evidence','evidenceJp','reason'])check(typeof q[k]==='string'&&q[k].trim(),'question '+(i+1)+' missing '+k);
 }
 check(!/freeWrite|composition|essayTask/i.test(JSON.stringify(d)),'composition field detected');
 warn.push('NOT TESTED: NH/SS v7 lexical and grammar chronology');
 warn.push('NOT TESTED: semantic validity, evidence accuracy, uniqueness against 1000 passages');
 warn.push('NOT TESTED: Chromium/WebKit/iPhone/A4 and public deployment');
 const result={file:f,id:d.id,words,sentences:d.sentences?.length,translationLines:jp.length,slashRows:d.slashRows?.length,questionsA:d.questions?.length,questionsB:d.questionSetB?.length,types:[...types],structuralPass:errors.length===0,publicationApproved:false,errors,warnings:warn};
 console.log(JSON.stringify(result,null,2));if(errors.length)failed=true;
}
process.exitCode=failed?1:0;
