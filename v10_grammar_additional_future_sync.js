// Bounded follow-up grammar chronology repair after exact Sunshine2 evidence exposed an earlier SVOO use.
// Do not widen the SVOO boundary: rewrite the earlier request with already-learned can + see.
// Idempotent across partial audit VMs: chronology audits remain the fail-closed authority if this does not apply.
(function(){
 function apply(){
  if(window.V10_GRAMMAR_ADDITIONAL_FUTURE_SYNC&&window.V10_GRAMMAR_ADDITIONAL_FUTURE_SYNC.applied)return window.V10_GRAMMAR_ADDITIONAL_FUTURE_SYNC;
  const p=window.V10_PASSAGES_G2_SS&&window.V10_PASSAGES_G2_SS['PROGRAM 3-3'];
  const meta=window.V10_INTERACTION_META&&window.V10_INTERACTION_META['サンシャイン|2|PROGRAM 3-3'];
  const newEn='Can I see this bowl?',newJp='このどんぶりを見てもいいですか。';
  let changed=0,qchanged=0;const missing=[];
  const isOld=s=>/\bshow\s+me\s+(?:this|the|a)?\s*bowl\b/i.test(String(s||''));
  if(!p){missing.push('PROGRAM 3-3 passage unavailable in this runtime');}
  else{
    const ss=Array.isArray(p.sentences)?p.sentences:[];
    let i=ss.findIndex(isOld);
    if(i<0)i=ss.indexOf(newEn);
    if(i>=0&&ss[i]!==newEn){
      const oldSentence=ss[i];ss[i]=newEn;
      if(Array.isArray(p.slashRows)&&p.slashRows[i])p.slashRows[i]={en:newEn,jp:newJp};
      let tr=String(p.fullTranslation||'');
      tr=tr.replace('「このどんぶりを見せてくれますか。」「もちろん。」','「このどんぶりを見てもいいですか。」「もちろん。」');
      tr=tr.replace('このどんぶりを見せてくれますか。',newJp);
      p.fullTranslation=tr;changed++;
    }else if(i<0){missing.push('PROGRAM 3-3 SVOO/new target not found');}
    const syncQ=(q,prompt)=>{if(!q)return 0;if(!(isOld(q.evidence)||q.evidence===newEn))return 0;q.prompt=prompt;q.answer='this bowl';q.evidence=newEn;q.evidenceJp=newJp;q.reason='see の目的語が this bowl です。';return 1;};
    for(const q of (p.questions||[]))qchanged+=syncQ(q,'4. 話し手は何を見てもよいかたずねていますか。本文から英語で答えなさい。');
    if(meta&&Array.isArray(meta.questionSetB))for(const q of meta.questionSetB)qchanged+=syncQ(q,'2. 話し手は何を見てもよいかたずねていますか。本文から英語で答えなさい。');
    if(!String(p.auditNote||'').includes('Grammar chronology follow-up: early SVOO'))p.auditNote=String(p.auditNote||'')+' Grammar chronology follow-up: early SVOO show-me-bowl request was replaced with cumulative can + see; sentence/translation/slash/A+B evidence synchronized.';
  }
  const applied=!!(p&&Array.isArray(p.sentences)&&p.sentences.includes(newEn));
  const state={version:'20260826-v2',changed,qchanged,missing,applied};window.V10_GRAMMAR_ADDITIONAL_FUTURE_SYNC=state;
  if(typeof document!=='undefined'){const sec=document.getElementById('section');if(sec)sec.dispatchEvent(new Event('change',{bubbles:true}));}
  return state;
 }
 window.V10_APPLY_GRAMMAR_ADDITIONAL_FUTURE_SYNC=apply;
 if(window.V10_GRAMMAR_CHRONOLOGY_RUNTIME_FIX_STATE){apply();return;}
 if(typeof setInterval!=='function'){apply();return;}
 let tries=0;const timer=setInterval(()=>{tries++;if(window.V10_GRAMMAR_CHRONOLOGY_RUNTIME_FIX_STATE){clearInterval(timer);apply();}else if(tries>3000){clearInterval(timer);apply();}},10);
})();
