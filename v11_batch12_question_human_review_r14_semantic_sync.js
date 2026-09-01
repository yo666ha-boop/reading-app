function syncR14(f){
  'use strict';
  if(!f||!Array.isArray(f.passages))return f;
  const p=f.passages.find(x=>x.id==='V11-B12-G3-013');
  if(!p)throw new Error('R14 semantic sync: G3-013 missing');
  const all=[...(p.questions||[]),...(p.questionSetB||[])];
  const q=all.find(x=>x.evidence==='Several species appeared only near fallen branches in the second.');
  if(!q)throw new Error('R14 semantic sync: fallen-branches question missing');
  q.evidence='The new survey still found many insects in the first pond, but several species appeared only near fallen branches in the second.';
  q.evidenceJp='最初の池ではやはり多くの昆虫が見つかりましたが、二つ目の池では落ちた枝の近くだけに現れる種類もありました。';
  q.reason='再調査でも第一の池に多くの昆虫がいた一方、第二の池の落ちた枝だけに現れる種類があったという対比全体を根拠にします。';
  q.humanReview='HUMAN_REVIEW_R14_SEMANTIC_SYNC';
  return f;
}
if(typeof module!=='undefined'&&module.exports)module.exports=syncR14;
if(typeof window!=='undefined'){const f=window.V11_BATCH12_QUESTION_HUMAN_REVIEW_R14;if(f)syncR14(f);}
