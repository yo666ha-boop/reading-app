function syncR12(f){
  'use strict';
  if(!f||!Array.isArray(f.passages)) return f;
  const p6=f.passages.find(x=>x.id==='V11-B12-G3-006');
  if(!p6) throw new Error('R12 semantic sync: G3-006 missing');
  const a6=[...(p6.questions||[]),...(p6.questionSetB||[])];
  const q=a6.find(x=>x.questionType==='INFERENCE'&&x.prompt&&x.prompt.includes('別調理場所'));
  if(!q) throw new Error('R12 semantic sync: allergy inference missing');
  q.evidence='The organizers did not claim that symbols could remove every risk. They kept a separate preparation area for one severe allergy and told volunteers not to promise that every dish was safe for everyone.';
  q.evidenceJp='ただし記号だけですべての危険がなくなるとは考えませんでした。重いアレルギー一件には別の調理場所を設け、誰にでも安全だと約束しないようボランティアにも伝えました。';
  q.reason='表示の限界に加え、別調理場所と「全員に安全と約束しない」という追加対策を本文から結び付けます。';q.humanReview='HUMAN_REVIEW_R12_SEMANTIC_SYNC';
  const label=a6.find(x=>x.questionType==='CONTENT_MATCH'&&x.prompt&&x.prompt.includes('海外から来た参加者'));
  if(!label) throw new Error('R12 semantic sync: English-label question missing');
  label.evidence='They also prepared short English labels for basic ingredients and asked participants to tell the staff about allergies when registering.';
  label.evidenceJp='基本的な材料には短い英語表示も用意し、登録時にアレルギーを伝えてもらうことにしました。';
  label.reason='海外参加者向けの英語表示を、同じ文にある登録時のアレルギー申告と区別しながら確認します。';label.humanReview='HUMAN_REVIEW_R12_SEMANTIC_SYNC';

  const p7=f.passages.find(x=>x.id==='V11-B12-G3-007');
  if(!p7) throw new Error('R12 semantic sync: G3-007 missing');
  const a7=[...(p7.questions||[]),...(p7.questionSetB||[])];
  const sum=a7.find(x=>x.questionType==='SUMMARY_FILL'&&x.prompt&&x.prompt.includes('入口をふさいでいるとの誤解'));
  if(!sum) throw new Error('R12 semantic sync: G3-007 summary missing');
  sum.evidence='Emi checked the original photograph and the event notes. The student had actually been standing in a marked safe area while construction already closed half of the space. The club replaced the cropped image with a wider version and added a caption explaining the construction.';
  sum.evidenceJp='エミが元の写真と活動記録を確認すると、生徒は安全区域として印のある場所に立っており、スペースの半分はすでに工事で閉鎖されていました。部員はより広い範囲を写した写真へ替え、工事について説明するキャプションを加えました。';
  sum.reason='誤解を解くための検証と、その検証結果を反映した写真・説明文の修正を一続きで根拠にします。';sum.humanReview='HUMAN_REVIEW_R12_SEMANTIC_SYNC';
  return f;
}
if(typeof module!=='undefined'&&module.exports) module.exports=syncR12;
if(typeof window!=='undefined'){const f=window.V11_BATCH12_QUESTION_HUMAN_REVIEW_R12;if(f)syncR12(f);}
