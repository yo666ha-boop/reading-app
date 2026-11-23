#!/usr/bin/env node
'use strict';
// Independent supplementary audit. Never changes publication status.
const fs=require('node:fs'),path=require('node:path');
const dir=__dirname;
const files=fs.readdirSync(dir).filter(f=>/^\d{3}_.+_original_draft\.json$/.test(f)).sort();
const failures=[],warnings=[],report=[];
const seenIds=new Map(),seenPassages=new Map();
const hasOwn=(obj,key)=>Object.prototype.hasOwnProperty.call(obj,key);
const norm=s=>String(s??'').normalize('NFKC').replace(/\s+/g,' ').trim();
for(const file of files){
 let d;try{d=JSON.parse(fs.readFileSync(path.join(dir,file),'utf8'))}catch(e){failures.push(file+': invalid JSON '+e.message);continue}
 if(!d||typeof d!=='object'||Array.isArray(d)){failures.push(file+': root must be an object');continue}
 const q=d.questions;
 const sets=[...(Array.isArray(q)?q:[]),...(Array.isArray(d.questionSetB)?d.questionSetB:[])];
 const row={file,id:d.id,questions:sets.length,issues:[]};
 if(!norm(d.id))row.issues.push('missing id');
 else if(seenIds.has(norm(d.id)))row.issues.push('duplicate draft id with '+seenIds.get(norm(d.id)));
 else seenIds.set(norm(d.id),file);
 if(!d.isOriginal)row.issues.push('isOriginal not true');
 if(d.status==='APPROVED'||d.publicationApproved===true)row.issues.push('draft unexpectedly marked approved');
 const texts=Array.isArray(d.sentences)?d.sentences.map(norm):[];
 const passageKey=texts.join(' ');
 if(passageKey&&seenPassages.has(passageKey))row.issues.push('identical passage to '+seenPassages.get(passageKey));
 else if(passageKey)seenPassages.set(passageKey,file);
 if(new Set(texts).size!==texts.length)row.issues.push('duplicate sentences within passage');
 if(!Array.isArray(d.sentences)||d.sentences.length<10)row.issues.push('missing/short sentences');
 const tr=typeof d.fullTranslation==='string'?d.fullTranslation.split(/\n/):d.fullTranslation;
 if(!Array.isArray(tr)||tr.length!==texts.length)row.issues.push('translation line count mismatch');
 const slash=Array.isArray(d.slashRows)?d.slashRows:[];
 if(!Array.isArray(d.slashRows))row.issues.push('slashRows is not an array');
 if(slash.length!==texts.length)row.issues.push('slash row count mismatch');
 for(let i=0;i<Math.min(slash.length,texts.length);i++){
  const en=norm(String(slash[i]?.en||'').split('/').map(x=>x.trim()).join(' '));
  if(en!==texts[i])row.issues.push('slash EN reconstruction mismatch at sentence '+(i+1));
  const ec=String(slash[i]?.en||'').split('/').length,jc=String(slash[i]?.jp||'').split('/').length;
  if(String(slash[i]?.en||'').split('/').some(x=>!norm(x))||String(slash[i]?.jp||'').split('/').some(x=>!norm(x)))row.issues.push('empty slash block at sentence '+(i+1));
  if(ec!==jc||ec<3)row.issues.push('slash EN/JP block mismatch at sentence '+(i+1));
 }
 if(!Array.isArray(q)||q.length!==5)row.issues.push('A must contain exactly five questions');
 if(!Array.isArray(d.questionSetB)||d.questionSetB.length!==5)row.issues.push('B must contain exactly five questions');
 if(sets.length!==10)row.issues.push('expected 10 questions; found '+sets.length);
 for(const [i,item] of sets.entries()){
  if(!item||typeof item!=='object'){row.issues.push('invalid question '+i);continue}
  const evidence=norm(item.evidence);
  if(evidence&&!texts.includes(evidence))row.issues.push('evidence not exact sentence in question '+(i+1));
  if(!norm(item.evidence))row.issues.push('missing evidence in question '+(i+1));
  if(!norm(item.reason)||!norm(item.evidenceJp))row.issues.push('missing reason/evidenceJp in question '+(i+1));
  const ix=texts.indexOf(evidence);
  if(ix>=0&&Array.isArray(tr)&&norm(item.evidenceJp)!==norm(tr[ix]))row.issues.push('evidenceJp differs from fullTranslation at question '+(i+1));
 }
 report.push(row);for(const issue of row.issues)failures.push(file+': '+issue);
}
const output={audit:'independent-draft-alignment-v2',drafts:files.length,failures,warnings,report,publicationApproved:false};
console.log(JSON.stringify(output,null,2));process.exitCode=failures.length?1:0;
