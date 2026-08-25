// Bounded follow-up grammar chronology repair after exact Sunshine2 evidence exposed an earlier SVOO use.
// Do not widen the SVOO boundary: rewrite the earlier request with already-learned can + see.
(function(){
 function apply(){
  if(window.V10_GRAMMAR_ADDITIONAL_FUTURE_SYNC&&window.V10_GRAMMAR_ADDITIONAL_FUTURE_SYNC.applied)return window.V10_GRAMMAR_ADDITIONAL_FUTURE_SYNC;
  const p=window.V10_PASSAGES_G2_SS&&window.V10_PASSAGES_G2_SS['PROGRAM 3-3'];
  const meta=window.V10_INTERACTION_META&&window.V10_INTERACTION_META['サンシャイン|2|PROGRAM 3-3'];
  const oldEn='Can you show me this bowl?',newEn='Can I see this bowl?';
  const oldJp='「このどんぶりを見せてくれますか。」「もちろん。」',newJp='「このどんぶりを見てもいいですか。」「もちろん。」';
  const missing=[];let changed=0,qchanged=0;
  if(!p)missing.push('PROGRAM 3-3 passage');
  else{
    const i=(p.sentences||[]).indexOf(oldEn);
    if(i>=0){p.sentences[i]=newEn;if(Array.isArray(p.slashRows)&&p.slashRows[i])p.slashRows[i]={en:newEn,jp:'このどんぶりを見てもいいですか。'};p.fullTranslation=String(p.fullTranslation||'').replace(oldJp,newJp);changed++;}
    else if(!(p.sentences||[]).includes(newEn))missing.push('PROGRAM 3-3 target sentence');
    for(const q of (p.questions||[])){if(q&&q.evidence===oldEn){q.prompt='4. 話し手は何を見てもよいかたずねていますか。本文から英語で答えなさい。';q.answer='this bowl';q.evidence=newEn;q.evidenceJp='このどんぶりを見てもいいですか。';q.reason='see の目的語が this bowl です。';qchanged++;}}
    p.auditNote=String(p.auditNote||'')+' Grammar chronology follow-up: early SVOO show me this bowl was replaced with cumulative can + see; sentence/translation/slash/A+B evidence synchronized.';
  }
  if(meta&&Array.isArray(meta.questionSetB))for(const q of meta.questionSetB){if(q&&q.evidence===oldEn){q.prompt='2. 話し手は何を見てもよいかたずねていますか。本文から英語で答えなさい。';q.answer='this bowl';q.evidence=newEn;q.evidenceJp='このどんぶりを見てもいいですか。';q.reason='see の目的語が this bowl です。';qchanged++;}}
  const state={version:'20260826',changed,qchanged,missing,applied:missing.length===0};window.V10_GRAMMAR_ADDITIONAL_FUTURE_SYNC=state;
  if(missing.length)throw new Error('additional grammar chronology sync missing: '+missing.join(' | '));
  const sec=document.getElementById('section');if(sec)sec.dispatchEvent(new Event('change',{bubbles:true}));
  return state;
 }
 window.V10_APPLY_GRAMMAR_ADDITIONAL_FUTURE_SYNC=apply;
 if(window.V10_GRAMMAR_CHRONOLOGY_RUNTIME_FIX_STATE){apply();return;}
 let tries=0;const timer=setInterval(()=>{tries++;if(window.V10_GRAMMAR_CHRONOLOGY_RUNTIME_FIX_STATE){clearInterval(timer);apply();}else if(tries>3000){clearInterval(timer);window.V10_GRAMMAR_ADDITIONAL_FUTURE_SYNC={version:'20260826',changed:0,qchanged:0,missing:['grammar bridge timeout'],applied:false};}},10);
})();
