(function repairV11Batch07Length(){
'use strict';
const groups=[window.V11_BATCH07_G1_DRAFTS||[],window.V11_BATCH07_G2_DRAFTS||[],window.V11_BATCH07_STANDARD_DRAFTS||[],window.V11_BATCH07_LONG_DRAFTS||[],window.V11_BATCH07_YAMAGUCHI_EXAM_DRAFTS||[]];
const ps=groups.flat();const p=ps.find(x=>x.id==='V11-B07-G2-010');if(!p)throw Error('V11-B07-G2-010 missing');
const en='The workers repeated the test.';const jp='職員たちはテストを繰り返しました。';
if(!(p.sentences||[]).includes(en)){p.sentences.push(en);p.slashRows.push({en,jp});p.fullTranslation=(p.slashRows||[]).map(x=>x.jp||'').join('');p.wordCount=(String(p.sentences.join(' ')).match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;}
window.V11_BATCH07_LENGTH_REPAIR_STATE={version:'20260829',id:p.id,wordCount:p.wordCount,registered:false};
})();
