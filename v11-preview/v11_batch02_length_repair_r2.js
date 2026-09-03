(function repairV11Batch02LengthR2(){
'use strict';
const ps=window.V11_BATCH02_DRAFT_PASSAGES;if(!Array.isArray(ps)||ps.length!==50)throw new Error('Batch02 missing before length repair r2');
const p=ps.find(x=>x.id==='V11-SS-G2-P8-3-012');if(!p)throw new Error('target passage missing');
const en='We checked the room again.';const jp='私たちはもう一度部屋を確認しました。';
p.sentences.push(en);p.slashRows.push({en,jp});p.fullTranslation+=jp;p.wordCount=(p.sentences.join(' ').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;
window.V11_BATCH02_LENGTH_REPAIR_R2_STATE={version:'20260828-r2',id:p.id,wordCount:p.wordCount,registered:false};
})();