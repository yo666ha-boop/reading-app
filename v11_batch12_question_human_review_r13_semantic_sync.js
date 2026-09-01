function syncR13(f){
  'use strict';
  if(!f||!Array.isArray(f.passages))return f;
  const p=f.passages.find(x=>x.id==='V11-B12-G3-009');
  if(!p)throw new Error('R13 semantic sync: G3-009 missing');
  const all=[...(p.questions||[]),...(p.questionSetB||[])];
  const targets=all.filter(x=>x.evidence==='Some fishing rope appeared near the working harbor but not near the swimming area.');
  if(targets.length!==2)throw new Error('R13 semantic sync: expected two harbor-rope questions, got '+targets.length);
  for(const q of targets){
    q.evidence='The later counts were much lower, and some fishing rope appeared near the working harbor but not near the swimming area.';
    q.evidenceJp='その後の数はずっと少なく、漁港近くでは漁網の一部が見つかりましたが、遊泳区域では見つかりませんでした。';
    q.humanReview='HUMAN_REVIEW_R13_SEMANTIC_SYNC';
  }
  return f;
}
if(typeof module!=='undefined'&&module.exports)module.exports=syncR13;
if(typeof window!=='undefined'){const f=window.V11_BATCH12_QUESTION_HUMAN_REVIEW_R13;if(f)syncR13(f);}
