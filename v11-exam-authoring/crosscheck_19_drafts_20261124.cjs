#!/usr/bin/env node
'use strict';
// Draft-only cross-check. Exit nonzero for every missing/invalid input; never approve publication.
const fs=require('node:fs'),path=require('node:path');
const dir=__dirname, names=fs.readdirSync(dir).filter(n=>/^\d{3}_.+_original_draft\.json$/.test(n)).sort();
const norm=s=>String(s??'').normalize('NFKC').replace(/\s+/g,' ').trim();
const results=[], seen=new Map();
if(names.length!==19)console.error('COUNT_CHANGED: expected 19 drafts, found '+names.length);
for(const name of names){
 const errors=[];let d;
 try{d=JSON.parse(fs.readFileSync(path.join(dir,name),'utf8'))}catch(e){results.push({name,errors:['PARSE: '+e.message]});continue}
 const sentences=Array.isArray(d.sentences)?d.sentences:[], translation=typeof d.fullTranslation==='string'?d.fullTranslation.split(/\r?\n/).filter(Boolean):[], slash=Array.isArray(d.slashRows)?d.slashRows:[], A=Array.isArray(d.questions)?d.questions:[],B=Array.isArray(d.questionSetB)?d.questionSetB:[],qs=[...A,...B];
 const words=sentences.join(' ').trim().split(/\s+/).filter(Boolean).length;
 if(words<400||words>450||words!==d.wordCount)errors.push('WORD_COUNT');
 if(sentences.length!==translation.length||sentences.length!==slash.length)errors.push('ALIGNMENT_LENGTH');
 if(A.length!==5||B.length!==5)errors.push('QUESTION_COUNT');
 if(new Set(qs.map(q=>q.questionType)).size<6)errors.push('QUESTION_DIVERSITY');
 if(d.isOriginal!==true||!String(d.status).startsWith('DRAFT')||d.publicationApproved===true)errors.push('PUBLICATION_GUARD');
 const key=sentences.map(norm).join(' ');if(seen.has(key))errors.push('DUPLICATE_PASSAGE:'+seen.get(key));else seen.set(key,name);
 sentences.forEach((sentence,i)=>{const en=String(slash[i]?.en||'').split('/'),jp=String(slash[i]?.jp||'').split('/');if(norm(en.join(' '))!==norm(sentence))errors.push('SLASH_RECONSTRUCTION:'+(i+1));if(en.length!==jp.length||en.length<3||en.some(x=>!norm(x))||jp.some(x=>!norm(x)))errors.push('SLASH_BLOCK:'+(i+1))});
 qs.forEach((q,i)=>{const ix=sentences.findIndex(s=>norm(s)===norm(q?.evidence));if(ix<0)errors.push('EVIDENCE:'+(i+1));else if(norm(q?.evidenceJp)!==norm(translation[ix]))errors.push('EVIDENCE_JP:'+(i+1));if(!norm(q?.answer)||!norm(q?.reason))errors.push('ANSWER_REASON:'+(i+1))});
 results.push({name,id:d.id,words,sentences:sentences.length,questions:qs.length,errors});
}
const report={audit:'draft-crosscheck-20261124',drafts:names.length,pass:results.filter(r=>r.errors.length===0).length,fail:results.filter(r=>r.errors.length).length,results,publicationApproved:false,notTested:['NH/SS v7','semantic','Chromium','WebKit','iPhone','A4','public deployment']};
console.log(JSON.stringify(report,null,2));if(report.fail||names.length!==19)process.exitCode=1;
