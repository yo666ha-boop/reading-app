function syncR12(f){
  'use strict';
  if(!f||!Array.isArray(f.passages)) return f;
  const p=f.passages.find(x=>x.id==='V11-B12-G3-006');
  if(!p) throw new Error('R12 semantic sync: G3-006 missing');
  const all=[...(p.questions||[]),...(p.questionSetB||[])];
  const q=all.find(x=>x.questionType==='INFERENCE'&&x.prompt&&x.prompt.includes('別調理場所'));
  if(!q) throw new Error('R12 semantic sync: allergy inference missing');
  q.evidence='The organizers did not claim that symbols could remove every risk. They kept a separate preparation area for one severe allergy and told volunteers not to promise that every dish was safe for everyone.';
  q.evidenceJp='ただし記号だけですべての危険がなくなるとは考えませんでした。重いアレルギー一件には別の調理場所を設け、誰にでも安全だと約束しないようボランティアにも伝えました。';
  q.reason='表示の限界に加え、別調理場所と「全員に安全と約束しない」という追加対策を本文から結び付けます。';
  q.humanReview='HUMAN_REVIEW_R12_SEMANTIC_SYNC';
  return f;
}
if(typeof module!=='undefined'&&module.exports) module.exports=syncR12;
if(typeof window!=='undefined'){const f=window.V11_BATCH12_QUESTION_HUMAN_REVIEW_R12;if(f)syncR12(f);}
