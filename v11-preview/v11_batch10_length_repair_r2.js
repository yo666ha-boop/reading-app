(function repairV11Batch10LengthR2(){
'use strict';
const ps=[...(window.V11_BATCH10_G1_DRAFTS||[]),...(window.V11_BATCH10_G2_DRAFTS||[]),...(window.V11_BATCH10_G3_DRAFTS||[])];
if(ps.length!==50)throw Error('Batch10 length r2 requires 50 passages');
const p=ps.find(x=>x.id==='V11-B10-G2-006');if(!p)throw Error('Missing G2-006');
const oldEn='The reply explained that the leaf had a fresh citrus smell and was used mainly for aroma.';
const newEn='The reply explained that the leaf had a citrus smell and was used mainly for aroma.';
const newJp='返事には、その葉には柑橘系の香りがあり主に香り付けに使うとありました。';
const i=p.sentences.indexOf(oldEn);if(i<0)throw Error('G2-006 trim source not found');
p.sentences[i]=newEn;p.slashRows[i]={en:newEn,jp:newJp};
p.fullTranslation=p.slashRows.map(r=>r.jp).join('');
p.wordCount=((p.sentences.join(' ').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length);
p.lengthRepairR2='20260829-r2';
window.V11_BATCH10_LENGTH_REPAIR_R2_STATE={id:p.id,wordCount:p.wordCount,replacements:1,registered:false};
})();
