(function materializeV11Batch07TemporaryVocabNotes(){
'use strict';
const groups=[window.V11_BATCH07_G1_DRAFTS||[],window.V11_BATCH07_G2_DRAFTS||[],window.V11_BATCH07_STANDARD_DRAFTS||[],window.V11_BATCH07_LONG_DRAFTS||[],window.V11_BATCH07_YAMAGUCHI_EXAM_DRAFTS||[]];
const ps=groups.flat();if(ps.length!==50)throw Error('Batch07 50 passages missing');
const tokens=s=>(String(s||'').toLowerCase().replace(/[’‘]/g,"'").match(/[a-z]+(?:'[a-z]+)?/g)||[]);
let added=0;
for(const p of ps){p.notes=Array.isArray(p.notes)?p.notes:[];const have=new Set(p.notes.map(n=>String(n&&n.english||'').toLowerCase().replace(/[’‘]/g,"'")));const body=[...(p.sentences||[]),...(p.questions||[]).flatMap(q=>[q.prompt,q.answer,Array.isArray(q.evidence)?q.evidence.join(' '):q.evidence]),...(p.questionSetB||[]).flatMap(q=>[q.prompt,q.answer,Array.isArray(q.evidence)?q.evidence.join(' '):q.evidence])].join(' ');for(const w of new Set(tokens(body))){if(have.has(w))continue;p.notes.push({english:w,japanese:'',kind:'temporary_vocab_inventory',source:'v11 Batch07 chronology inventory only; never satisfies required-local gate'});have.add(w);added++;}p.auditNote=(p.auditNote||'')+' Temporary vocabulary inventory applied; it is not a valid required-local gloss and cannot satisfy chronology.';}
window.V11_BATCH07_TEMP_VOCAB_NOTES_STATE={version:'20260829-r2',passages:ps.length,added,temporaryGlosses:true,gateEligible:false,registered:false};
})();
