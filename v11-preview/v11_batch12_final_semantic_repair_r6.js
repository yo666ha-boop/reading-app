'use strict';
module.exports=function repairBatch12FinalSemanticR6(candidate){
  const p=(candidate.passages||[]).find(x=>x.id==='V11-B12-G1-006');
  if(!p)throw new Error('R6 semantic repair: G1-006 missing');
  const old='昼食中、ユイは自分の机のマットの下に小さなメモを見つけました。「今日は青い給食用の布を持ち帰ってね」とありましたが、ユイの布は黄色でした。';
  const neu='昼食中、ユイは自分の机のマットの下に小さなメモを見つけました。メモには「今日は青い給食用の布を持ち帰ってね」とありましたが、ユイの布は黄色でした。';
  if(!String(p.fullTranslation||'').includes(old))throw new Error('R6 semantic repair: G1-006 translation source mismatch');
  p.fullTranslation=p.fullTranslation.replace(old,neu);
  const r1=p.slashRows&&p.slashRows[0],r2=p.slashRows&&p.slashRows[1];
  if(!r1||!r2||r1.en!=='During lunch, Yui found a small note under her desk mat.'||r2.en!=="It said, 'Please bring your blue lunch cloth home today,' but Yui's cloth was yellow.")throw new Error('R6 semantic repair: G1-006 slash source mismatch');
  r1.jp='昼食中、ユイは自分の机のマットの下に小さなメモを見つけました。';
  r2.jp='メモには「今日は青い給食用の布を持ち帰ってね」とありましたが、ユイの布は黄色でした。';
  r1.humanReview='HUMAN_REVIEW_1TO1_R6_REPAIRED';r2.humanReview='HUMAN_REVIEW_1TO1_R6_REPAIRED';
  p.humanSemanticReview='B12_HUMAN_REVIEW_R6_SLASH_BOUNDARY_SYNC';
  candidate.finalSemanticRepairs=Array.from(new Set([...(candidate.finalSemanticRepairs||[]),'V11-B12-G1-006']));
  return candidate;
};
