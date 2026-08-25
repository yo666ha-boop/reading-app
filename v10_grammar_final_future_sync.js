// Final bounded grammar-chronology content repairs.
// These five constructions are earlier than their evidence-backed introduction or have no junior-high boundary in scope.
// Every mutation synchronizes sentence, fullTranslation, slash row, A/B evidence, changed answer, evidenceJp and reason.
(function(){
 function pool(book,grade){
  if(grade==='1')return book==='ニューホライズン'?window.V10_NEWHORIZON_G1:window.V10_SUNSHINE_G1;
  if(grade==='2')return book==='ニューホライズン'?window.V10_PASSAGES_G2_NH:window.V10_PASSAGES_G2_SS;
  return book==='ニューホライズン'?window.V10_PASSAGES_G3_NH:window.V10_PASSAGES_G3_SS;
 }
 const fixes=[
  {book:'ニューホライズン',grade:'1',section:'Unit 5-1',oldEn:'I enjoy working as a guide.',newEn:'I work as a guide, and I like it.',newJp:'私はガイドとして働いていて、その仕事が好きです。',basis:'gerund enjoy working precedes the evidence-backed grade-2 gerund chronology'},
  {book:'ニューホライズン',grade:'1',section:'Unit 10-2',oldEn:'My heart can beat fast when I see it.',newEn:'I see it, and my heart can beat fast.',newJp:'私はそれを見ます。そして、心臓が速く打つことがあります。',basis:'conjunction when is introduced at NH2 Unit 2 Part 1 in canonical v7 / official 2025 chronology'},
  {book:'ニューホライズン',grade:'2',section:'Unit 7-1',oldEn:'This natural value is one reason the site may meet a standard.',newEn:'This natural value can meet a standard.',newJp:'この自然の価値は基準を満たすことができます。',basis:'possibility may is introduced later than Unit 7-1; cumulative can preserves possibility without future modal grammar'},
  {book:'ニューホライズン',grade:'3',section:'Unit 4-2',oldEn:'The bag must not become too heavy to carry.',newEn:'The bag must not become very heavy.',newJp:'そのバッグはとても重くなってはいけません。',oldAnswer:'too heavy to carry',newAnswer:'very heavy',basis:'too ... to has no evidence-backed boundary in the junior-high chronology used by this app'},
  {book:'ニューホライズン',grade:'3',section:'Unit 6-1',oldEn:'It was still clean and strong enough to use.',newEn:'It was still clean and strong, so we used it.',newJp:'それはまだ清潔で丈夫だったので、私たちはそれを使いました。',basis:'enough to has no evidence-backed boundary in the junior-high chronology used by this app'}
 ];
 function apply(){
  if(window.V10_GRAMMAR_FINAL_FUTURE_SYNC&&window.V10_GRAMMAR_FINAL_FUTURE_SYNC.applied)return window.V10_GRAMMAR_FINAL_FUTURE_SYNC;
  let changed=0,qchanged=0,translationFallbacks=0;const missing=[];
  for(const f of fixes){
   const p=pool(f.book,f.grade)&&pool(f.book,f.grade)[f.section];
   const meta=window.V10_INTERACTION_META&&window.V10_INTERACTION_META[`${f.book}|${f.grade}|${f.section}`];
   if(!p){missing.push(`${f.book}|${f.grade}|${f.section}: passage unavailable`);continue;}
   const ss=Array.isArray(p.sentences)?p.sentences:[];
   let i=ss.indexOf(f.oldEn);if(i<0)i=ss.indexOf(f.newEn);
   if(i<0){missing.push(`${f.book}|${f.grade}|${f.section}: target sentence missing`);continue;}
   const oldJp=Array.isArray(p.slashRows)&&p.slashRows[i]?String(p.slashRows[i].jp||''):'';
   if(ss[i]!==f.newEn){ss[i]=f.newEn;changed++;}
   if(Array.isArray(p.slashRows)&&p.slashRows[i])p.slashRows[i]={en:f.newEn,jp:f.newJp};
   let tr=String(p.fullTranslation||'');
   if(oldJp&&tr.includes(oldJp))tr=tr.replace(oldJp,f.newJp);
   else if(!tr.includes(f.newJp)&&Array.isArray(p.slashRows)){tr=p.slashRows.map(r=>String(r&&r.jp||'')).filter(Boolean).join(' ');translationFallbacks++;}
   p.fullTranslation=tr;
   const syncQ=q=>{
    if(!q)return;
    let hit=false;
    if(String(q.evidence||'')===f.oldEn||String(q.evidence||'')===f.newEn){q.evidence=f.newEn;q.evidenceJp=f.newJp;hit=true;}
    if(f.oldAnswer&&String(q.answer||'').trim().toLowerCase()===f.oldAnswer.toLowerCase()){q.answer=f.newAnswer;hit=true;}
    if(hit){q.reason=`本文の「${f.newEn}」が根拠です。`;qchanged++;}
   };
   for(const q of (p.questions||[]))syncQ(q);
   if(meta&&Array.isArray(meta.questionSetB))for(const q of meta.questionSetB)syncQ(q);
   p.auditNote=String(p.auditNote||'')+` Grammar chronology final repair: ${f.basis}; sentence/fullTranslation/slash/A+B synchronized.`;
  }
  const applied=fixes.every(f=>{const p=pool(f.book,f.grade)&&pool(f.book,f.grade)[f.section];return !!(p&&Array.isArray(p.sentences)&&p.sentences.includes(f.newEn));});
  const state={version:'20260826-final5-v1',definitions:fixes.length,changed,qchanged,translationFallbacks,missing,applied};window.V10_GRAMMAR_FINAL_FUTURE_SYNC=state;return state;
 }
 window.V10_APPLY_GRAMMAR_FINAL_FUTURE_SYNC=apply;
 if(window.V10_GRAMMAR_ADDITIONAL_FUTURE_SYNC&&window.V10_GRAMMAR_ADDITIONAL_FUTURE_SYNC.applied){apply();return;}
 if(typeof setInterval!=='function'){apply();return;}
 let tries=0;const t=setInterval(()=>{tries++;if(window.V10_GRAMMAR_ADDITIONAL_FUTURE_SYNC&&window.V10_GRAMMAR_ADDITIONAL_FUTURE_SYNC.applied){clearInterval(t);apply();}else if(tries>3000){clearInterval(t);apply();}},10);
})();
