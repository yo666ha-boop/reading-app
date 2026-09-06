(function repairV11Batch01GrammarChronology(){
  const VERSION='20260827-b01-grammar-001';
  const BASE_GATE_VERSION='20260906-base-question-gate-001';
  const oldEn='My heart can beat fast when I see the picture.';
  const newEn='I see the picture, and my heart can beat fast.';
  const oldJp='その写真を見ると、私の心臓は速くどきどきすることがあります。';
  const newJp='私はその写真を見ます。そして、私の心臓は速くどきどきすることがあります。';
  const oldSlash='My heart / can beat / fast / when I see the picture.';
  const newSlash={en:'I see the picture, / and my heart can beat fast.',jp:'私はその写真を見ます / そして私の心臓は速くどきどきすることがあります'};
  const norm=s=>String(s==null?'':s).replace(/\s+/g,' ').trim();
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
  function baseDatasets(){
    return [
      ['1','サンシャイン',window.V10_SUNSHINE_G1||{}],
      ['1','ニューホライズン',window.V10_NEWHORIZON_G1||{}],
      ['2','サンシャイン',window.V10_PASSAGES_G2_SS||{}],
      ['2','ニューホライズン',window.V10_PASSAGES_G2_NH||{}],
      ['3','サンシャイン',window.V10_PASSAGES_G3_SS||{}],
      ['3','ニューホライズン',window.V10_PASSAGES_G3_NH||{}]
    ];
  }
  function jpSegments(text){
    const src=String(text||'').trim(),out=[];let cur='';
    for(const ch of src){cur+=ch;if(/[。！？]/.test(ch)){out.push(cur.trim());cur='';}}
    if(cur.trim())out.push(cur.trim());
    return out;
  }
  function questionKey(q){return norm(q&&q.evidence)+'\u0000'+norm(q&&q.answer);}
  function metaForBase(book,grade,section){
    const meta=window.V10_INTERACTION_META||{};
    return meta[book+'|'+grade+'|'+section]||meta[book+'|'+section]||null;
  }
  function exactTranslationCandidate(p,q){
    const full=String(p&&p.fullTranslation||'');
    if(!q||!q.evidence||!full)return'';
    const sentences=Array.isArray(p.sentences)?p.sentences:[];
    const parts=String(q.evidence).split(/\s*\/\s*/).map(norm).filter(Boolean);
    if(!parts.length)return'';
    const indexes=parts.map(part=>sentences.findIndex(s=>norm(s)===part));
    if(indexes.some(i=>i<0))return'';
    for(let i=1;i<indexes.length;i++)if(indexes[i]!==indexes[i-1]+1)return'';
    const jp=jpSegments(full);
    if(jp.length!==sentences.length)return'';
    const raw=jp.slice(indexes[0],indexes[indexes.length-1]+1).join('');
    const candidates=[
      raw.replace(/^[「『」』]+/,'').replace(/[「『」』]+$/,''),
      raw.replace(/^[」』]+/,''),
      raw.replace(/^[「『]+/,''),
      raw,
    ].map(s=>String(s||'').trim()).filter(Boolean);
    return candidates.find(s=>norm(full).includes(norm(s)))||'';
  }
  function syncEvidenceJp(p,q){
    if(!q||!q.evidenceJp)return 0;
    const full=String(p&&p.fullTranslation||'');
    if(norm(full).includes(norm(q.evidenceJp)))return 0;
    const replacement=exactTranslationCandidate(p,q);
    if(!replacement)return-1;
    q.evidenceJp=replacement;
    return 1;
  }
  function syncBaseQuestionGate(){
    const unresolvedEvidenceJp=[],invalidQuestionSets=[];
    let passagesScanned=0,metaSets=0,completedB=0,trimmedB=0,evidenceJpFixed=0;
    for(const [grade,book,data] of baseDatasets()){
      for(const [section,p] of Object.entries(data||{})){
        if(!p)continue;
        passagesScanned++;
        const a=Array.isArray(p.questions)?p.questions:[];
        const meta=metaForBase(book,grade,section);
        const b=meta&&Array.isArray(meta.questionSetB)?meta.questionSetB:null;
        if(b){
          metaSets++;
          if(a.length===5&&b.length<5){
            const used=new Set(b.map(questionKey));
            for(const source of a){
              if(b.length>=5)break;
              const key=questionKey(source);
              if(used.has(key))continue;
              const clone={...source,prompt:(b.length+1)+'. '+String(source.prompt||'').replace(/^\d+\.\s*/,'')};
              b.push(clone);used.add(key);completedB++;
            }
          }
          if(b.length>5){b.splice(5);trimmedB++;}
        }
        const sets=[['A',a],['B',b||[]]];
        for(const [label,arr] of sets){
          for(let i=0;i<arr.length;i++){
            const result=syncEvidenceJp(p,arr[i]);
            if(result>0)evidenceJpFixed++;
            else if(result<0)unresolvedEvidenceJp.push(book+'|'+grade+'|'+section+'|'+label+'['+i+']');
          }
        }
        if(a.length!==5||!b||b.length!==5)invalidQuestionSets.push(book+'|'+grade+'|'+section+' A='+a.length+' B='+(b?b.length:0));
      }
    }
    const state={version:BASE_GATE_VERSION,passagesScanned,metaSets,completedB,trimmedB,evidenceJpFixed,invalidQuestionSets,unresolvedEvidenceJp,applied:invalidQuestionSets.length===0&&unresolvedEvidenceJp.length===0,completedAt:new Date().toISOString()};
    window.V11_BASE_QUESTION_GATE_SYNC_STATE=state;
    if(typeof window.V11_SYNC_PASSAGE_VARIANT_UI==='function')window.V11_SYNC_PASSAGE_VARIANT_UI({preserveSelection:true,render:true,source:'base-question-gate-sync'});
    else if(typeof window.render==='function')window.render();
    return state;
  }
  function scheduleBaseQuestionGateSync(attempt){
    attempt=attempt||0;
    if(window.V10_RUNTIME_LOAD_PROGRESS==='complete'){
      try{syncBaseQuestionGate();}catch(e){window.V11_BASE_QUESTION_GATE_SYNC_STATE={version:BASE_GATE_VERSION,applied:false,error:String(e&&e.stack||e)};console.error(e);}
      return;
    }
    if(attempt<240){setTimeout(()=>scheduleBaseQuestionGateSync(attempt+1),250);return;}
    window.V11_BASE_QUESTION_GATE_SYNC_STATE={version:BASE_GATE_VERSION,applied:false,error:'V10 runtime did not reach complete state'};
  }
  function bootBatch02(){
    if(typeof document==='undefined'||window.V11_BATCH02_LOADED||window.V11_BATCH02_BOOTSTRAP_LOADING)return;
    if(document.querySelector('script[data-v11-b02-bootstrap="1"]'))return;
    const s=document.createElement('script');s.src='v11_batch02_bootstrap.js';s.async=false;s.dataset.v11B02Bootstrap='1';s.onerror=()=>{window.V11_BATCH02_BOOTSTRAP_ERROR='Failed to load v11_batch02_bootstrap.js';console.error(window.V11_BATCH02_BOOTSTRAP_ERROR)};document.head.appendChild(s);
  }
  window.V11_APPLY_BATCH01_GRAMMAR_REPAIR=apply;
  window.V11_SYNC_BASE_QUESTION_GATE=syncBaseQuestionGate;
  apply();
  scheduleBaseQuestionGateSync(0);
  bootBatch02();
})();
