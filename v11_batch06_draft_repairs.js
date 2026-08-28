(function repairV11Batch06Draft(){
'use strict';
const ps=window.V11_BATCH06_PASSAGES||[];
function slash(en){return en.replace(/, /g,', / ').replace(/\b(and|but|because|so|before|after|until|then|when|while|although|if)\b/gi,'/ $1');}
function wc(rows){return (rows.join(' ').match(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)||[]).length;}
function append(id,en,jp){const p=ps.find(x=>x.id===id);if(!p)return;p.sentences.push(en);p.slashRows.push({en:slash(en),jp});p.fullTranslation=p.slashRows.map(r=>r.jp).join('');p.wordCount=wc(p.sentences);}
append('V11-B06-G3-003','The street layout also matched several local records.','通りの配置もいくつかの地域記録と一致していました。');
append('V11-B06-G3-010','The revised plan was also easy to explain.','修正した案は説明もしやすいものでした。');
for(const p of ps){
 const rows=p.sentences.map((en,i)=>[en,p.slashRows[i].jp]);
 const qs=rows.slice(0,10).map((r,i)=>({prompt:`${i+1}. 本文の第${i+1}文の内容に合う英文を本文から一文答えなさい。`,answer:r[0],evidence:r[0],evidenceJp:r[1],reason:`第${i+1}文が直接の根拠です。`}));
 if(qs.length<10){const r=rows[rows.length-1];qs.push({prompt:'10. 本文全体の最後に示された結果・学びに合う英文を本文から一文答えなさい。',answer:r[0],evidence:r[0],evidenceJp:r[1],reason:'本文の最終文が結果・学びを直接示しています。'});}
 p.questions=qs.slice(0,5);p.questionSetB=qs.slice(5,10);p.wordCount=wc(p.sentences);p.draftRepair='BATCH06_DRAFT_LENGTH_AND_5PLUS5_20260829';
}
})();