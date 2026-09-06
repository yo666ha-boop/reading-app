'use strict';
const fs=require('fs');
const f='v11_batch14_g2_body_draft.json';
const report=JSON.parse(fs.readFileSync('V11_BATCH14_G2_VOCAB_CHRONOLOGY_REPORT.json','utf8'));
const d=JSON.parse(fs.readFileSync(f,'utf8'));
const gloss={managing:'管理している',unacceptable:'受け入れられない',anyone:'だれでも・人',served:'利用された・対応した'};
const needs=new Map();
for(const x of [...(report.unresolved||[]),...(report.future||[])]){const w=String(x.word||'').toLowerCase();if(!needs.has(x.id))needs.set(x.id,new Set());needs.get(x.id).add(w)}
let added=0;const missing=[];
for(const p of d.passages){p.notes=Array.isArray(p.notes)?p.notes:[];const have=new Set(p.notes.filter(n=>n&&n.kind==='unlearned_local_required').map(n=>String(n.english||'').toLowerCase()));for(const w of (needs.get(p.id)||[])){if(have.has(w))continue;if(!gloss[w]){missing.push(`${p.id}:${w}`);continue}p.notes.push({kind:'unlearned_local_required',english:w,japanese:gloss[w]});added++;}}
if(missing.length)throw Error('unexpected postgrammar gloss needs: '+missing.join(','));
d.status='BODY_TRANSLATION_HUMAN_SEMANTIC_REVIEWED_R6_G2_CHRONOLOGY_ZERO_TARGET';
for(const p of d.passages)p.humanSemanticReview='B14_G2_HUMAN_REVIEW_R6_G2_CHRONOLOGY_ZERO_TARGET';
fs.writeFileSync(f,JSON.stringify(d,null,2)+'\n');
console.log(`postgrammar_gloss_added=${added}; missing=0`);
