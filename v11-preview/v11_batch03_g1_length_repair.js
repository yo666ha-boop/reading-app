(function repairV11Batch03G1Length(){
'use strict';
const ps=window.V11_BATCH03_DRAFT_G1_PASSAGES;if(!Array.isArray(ps)||ps.length!==17)throw new Error('Batch03 G1 draft missing');
function slash(en){return en.replace(/, /g,', / ').replace(/\b(and|but|because|so|before|after|until|then|when)\b/gi,'/ $1');}
const A={
'V11-SS-G1-P10-2-021':['The quiet walk also gave me time to think about the day ahead.','その静かな散歩は、その日のことを考える時間もくれました。'],
'V11-SS-G1-P10-2-022':['The next morning, both pairs were easy to tell apart.','次の朝には、二足を簡単に見分けられました。'],
'V11-SS-G1-P10-2-024':['Everyone remembered the open window before going home.','みんな帰る前に開いた窓のことを覚えていました。'],
'V11-NH-G1-U10-2-022':['The blue sign was easy to remember after that day.','その日以降、青い看板は覚えやすい目印になりました。'],
'V11-NH-G1-U10-2-023':['We saved the other pictures in our family album.','ほかの写真は家族のアルバムに保存しました。'],
'V11-NH-G1-U10-2-024':['We were ready when the activity finally started.','活動がようやく始まったとき、私たちは準備できていました。']
};
let changed=0;for(const p of ps){const a=A[p.id];if(!a)continue;p.sentences.push(a[0]);p.fullTranslation+=a[1];p.slashRows.push({en:slash(a[0]),jp:a[1]});p.wordCount=(p.sentences.join(' ').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;p.auditNote+=' Word-count repair added one story-specific sentence; target band unchanged.';changed++;}
if(changed!==6)throw new Error('Batch03 G1 length repair changed '+changed);
window.V11_BATCH03_G1_LENGTH_REPAIR_STATE={changed,registered:false};
})();