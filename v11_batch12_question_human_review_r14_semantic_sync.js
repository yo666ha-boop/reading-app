function syncR14(f){
  'use strict';
  if(!f||!Array.isArray(f.passages))return f;
  const p13=f.passages.find(x=>x.id==='V11-B12-G3-013');
  if(!p13)throw new Error('R14 semantic sync: G3-013 missing');
  const a13=[...(p13.questions||[]),...(p13.questionSetB||[])];
  const contrast=a13.filter(x=>x.evidence==='Several species appeared only near fallen branches in the second.'||x.evidence==='The new survey still found many insects in the first pond.');
  if(contrast.length!==2)throw new Error('R14 semantic sync: expected two G3-013 contrast questions, got '+contrast.length);
  for(const q of contrast){q.evidence='The new survey still found many insects in the first pond, but several species appeared only near fallen branches in the second.';q.evidenceJp='最初の池ではやはり多くの昆虫が見つかりましたが、二つ目の池では落ちた枝の近くだけに現れる種類もありました。';q.humanReview='HUMAN_REVIEW_R14_SEMANTIC_SYNC';}
  const p14=f.passages.find(x=>x.id==='V11-B12-G3-014');
  if(!p14)throw new Error('R14 semantic sync: G3-014 missing');
  const a14=[...(p14.questions||[]),...(p14.questionSetB||[])];
  const repair=a14.find(x=>x.evidence==='The largest repair costs came from two electric tools used without instruction.');
  if(!repair)throw new Error('R14 semantic sync: G3-014 repair-risk inference missing');
  repair.evidence='Most late returns involved low-cost hand tools, while the largest repair costs came from two electric tools used without instruction.';
  repair.evidenceJp='返却遅れの多くは安い手工具で起きていましたが、大きな修理費は、説明を受けず使われた電動工具二件から生じていました。';
  repair.reason='返却遅れと高額修理の原因が別種類の工具に分かれていた対比から、安全説明が電動工具の誤使用リスクに対応すると推論します。';repair.humanReview='HUMAN_REVIEW_R14_SEMANTIC_SYNC';
  return f;
}
if(typeof module!=='undefined'&&module.exports)module.exports=syncR14;
if(typeof window!=='undefined'){const f=window.V11_BATCH12_QUESTION_HUMAN_REVIEW_R14;if(f)syncR14(f);}
