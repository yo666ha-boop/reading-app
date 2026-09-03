(function repairV11Batch04PostGrammarLength(){
'use strict';
const ps=[...(window.V11_BATCH04_G1_PASSAGES||[]),...(window.V11_BATCH04_G2_PASSAGES||[]),...(window.V11_BATCH04_G3_PASSAGES||[])];
const p=ps.find(x=>x.id==='V11-NH-G2-U7-4-030');
if(!p)throw new Error('target passage missing');
const words=s=>(String(s||'').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;
const before=words(p.sentences.join(' '));
if(before!==169)throw new Error('unexpected pre-repair word count '+before);
p.sentences.push('It worked.');
p.slashRows.push({en:'It worked.',jp:'うまくいきました。'});
p.wordCount=words(p.sentences.join(' '));
p.fullTranslation=p.slashRows.map(r=>r.jp||'').join('');
p.auditNote=(p.auditNote||'')+' Post-grammar length repair: added a natural two-word result sentence.';
window.V11_BATCH04_POSTGRAMMAR_LENGTH_REPAIR_STATE={version:'20260828-v1',id:p.id,before,after:p.wordCount,registered:false};
})();