(function repairV11Batch01GrammarChronology(){
  const VERSION='20260827-b01-grammar-001';
  const oldEn='My heart can beat fast when I see the picture.';
  const newEn='I see the picture, and my heart can beat fast.';
  const oldJp='その写真を見ると、私の心臓は速くどきどきすることがあります。';
  const newJp='私はその写真を見ます。そして、私の心臓は速くどきどきすることがあります。';
  const oldSlash='My heart / can beat / fast / when I see the picture.';
  const newSlash={en:'I see the picture, / and my heart can beat fast.',jp:'私はその写真を見ます / そして私の心臓は速くどきどきすることがあります'};
  function repairQuestion(q){if(!q||q.evidence!==oldEn)return 0;q.evidence=newEn;q.evidenceJp=newJp;return 1;}
  function apply(){
    const all=window.V11_BATCH01_PASSAGES||[];let passages=0,sentences=0,slashes=0,questions=0;
    for(const p of all){
      if(!p||p.textbook!=='ニューホライズン'||String(p.grade)!=='1'||p.section!=='Unit 10-2')continue;
      passages++;
      const i=(p.sentences||[]).indexOf(oldEn);
      if(i>=0){p.sentences[i]=newEn;sentences++;}
      p.fullTranslation=String(p.fullTranslation||'').split(oldJp).join(newJp);
      for(const r of p.slashRows||[])if(r&&r.en===oldSlash){r.en=newSlash.en;r.jp=newSlash.jp;slashes++;}
      for(const q of p.questions||[])questions+=repairQuestion(q);
      for(const q of p.questionSetB||[])questions+=repairQuestion(q);
      if(!String(p.auditNote||'').includes('NH1 when-clause chronology repair'))p.auditNote=String(p.auditNote||'')+' NH1 when-clause chronology repair: replaced unsupported when-clause with coordination and synchronized translation/slash/A+B evidence.';
    }
    const remaining=all.filter(p=>p&&p.textbook==='ニューホライズン'&&String(p.grade)==='1'&&p.section==='Unit 10-2').flatMap(p=>p.sentences||[]).filter(s=>/\bwhen\s+i\s+see\b/i.test(String(s)));
    const state={version:VERSION,passages,sentences,slashes,questions,remainingUnsupportedWhenClauses:remaining.length,applied:passages>0&&remaining.length===0};
    window.V11_BATCH01_GRAMMAR_REPAIR_STATE=state;
    if(!state.applied)throw new Error('Batch01 grammar repair incomplete '+JSON.stringify(state));
    if(typeof window.V11_APPLY_EASY_SUPPORT_NOTES==='function')window.V11_APPLY_EASY_SUPPORT_NOTES();
    return state;
  }
  function bootBatch02(){
    if(typeof document==='undefined'||window.V11_BATCH02_LOADED||window.V11_BATCH02_BOOTSTRAP_LOADING)return;
    if(document.querySelector('script[data-v11-b02-bootstrap="1"]'))return;
    const s=document.createElement('script');s.src='v11_batch02_bootstrap.js';s.async=false;s.dataset.v11B02Bootstrap='1';s.onerror=()=>{window.V11_BATCH02_BOOTSTRAP_ERROR='Failed to load v11_batch02_bootstrap.js';console.error(window.V11_BATCH02_BOOTSTRAP_ERROR)};document.head.appendChild(s);
  }
  window.V11_APPLY_BATCH01_GRAMMAR_REPAIR=apply;
  apply();
  bootBatch02();
})();
