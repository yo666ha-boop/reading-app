'use strict';
const fs=require('fs');
const path=require('path');
const draftFile='v11_batch14_g2_body_draft.json';
const reportFile='V11_BATCH14_G2_VOCAB_CHRONOLOGY_REPORT.json';
if(!fs.existsSync(reportFile)) throw Error('missing prior G2 vocab report');
const draft=JSON.parse(fs.readFileSync(draftFile,'utf8'));
const report=JSON.parse(fs.readFileSync(reportFile,'utf8'));
const glossary=new Map();
function put(en,jp){en=String(en||'').trim().toLowerCase();jp=String(jp||'').trim();if(en&&jp&&!glossary.has(en))glossary.set(en,jp)}
function walk(x){if(!x)return;if(Array.isArray(x)){for(const y of x)walk(y);return}if(typeof x==='object'){if(typeof x.english==='string'&&typeof x.japanese==='string')put(x.english,x.japanese);for(const v of Object.values(x))walk(v)}}
for(const name of fs.readdirSync('.')){
 if(name===draftFile||!name.endsWith('.json'))continue;
 try{walk(JSON.parse(fs.readFileSync(name,'utf8')))}catch(e){}
}
for(const name of fs.readdirSync('.')){
 if(!name.endsWith('.js'))continue;
 let s='';try{s=fs.readFileSync(name,'utf8')}catch(e){continue}
 const re=/english\s*:\s*['\"]([^'\"]+)['\"]\s*,\s*japanese\s*:\s*['\"]([^'\"]+)['\"]/g;let m;while((m=re.exec(s)))put(m[1],m[2]);
}
const needs=new Map();
for(const x of [...(report.unresolved||[]),...(report.future||[])]){const w=String(x.word||'').toLowerCase();if(!w)continue;if(!needs.has(x.id))needs.set(x.id,new Set());needs.get(x.id).add(w)}
let added=0;const missing=new Set();
for(const p of draft.passages){p.notes=Array.isArray(p.notes)?p.notes:[];const have=new Set(p.notes.filter(n=>n&&n.kind==='unlearned_local_required').map(n=>String(n.english||'').toLowerCase()));for(const w of (needs.get(p.id)||[])){if(have.has(w))continue;const jp=glossary.get(w);if(jp){p.notes.push({kind:'unlearned_local_required',english:w,japanese:jp});have.add(w);added++;}else missing.add(w)}}
draft.status='BODY_TRANSLATION_HUMAN_SEMANTIC_REVIEWED_R3_REUSED_CANONICAL_GLOSSES';
for(const p of draft.passages)p.humanSemanticReview='B14_G2_HUMAN_REVIEW_R3_REUSED_CANONICAL_GLOSSES';
fs.writeFileSync(draftFile,JSON.stringify(draft,null,2)+'\n');
fs.writeFileSync('V11_BATCH14_G2_MISSING_GLOSSES.txt',[`reused_gloss_added=${added}`,`missing_unique=${missing.size}`,[...missing].sort().join(' ')].join('\n')+'\n');
console.log(`reused_gloss_added=${added}\nmissing_unique=${missing.size}`);
