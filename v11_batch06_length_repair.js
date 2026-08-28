(function repairV11Batch06FinalLength(){
'use strict';
const ps=[...(window.V11_BATCH06_G1_PASSAGES||[]),...(window.V11_BATCH06_G2_PASSAGES||[]),...(window.V11_BATCH06_G3_PASSAGES||[])];
const add={
'V11-B06-G2-010':['The class checked the votes again.','クラスは投票結果をもう一度確認しました。'],
'V11-B06-G2-015':['They checked the total again.','彼らは合計をもう一度確認しました。']
};
function wc(rows){return (rows.join(' ').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;}
for(const p of ps){const row=add[p.id];if(!row)continue;if((p.sentences||[]).includes(row[0]))continue;p.sentences.push(row[0]);p.slashRows.push({en:row[0],jp:row[1]});p.fullTranslation=(p.fullTranslation||'')+row[1];p.wordCount=wc(p.sentences);p.auditNote=(p.auditNote||'')+' Final word-band repair added one story-consistent sentence.';}
window.V11_BATCH06_LENGTH_REPAIR_STATE={version:'20260829-final',count:Object.keys(add).length};
})();
