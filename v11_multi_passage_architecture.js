(function installV11MultiPassageArchitecture(){
  'use strict';
  const VERSION='20260905-v11-selected-section-003-visible-switch';
  const registry=window.V11_EXTRA_PASSAGES=window.V11_EXTRA_PASSAGES||{};
  const required=['id','textbook','grade','section','title','sentences','fullTranslation','slashRows','questions'];

  function norm(v){return String(v==null?'':v).normalize('NFKC').trim().replace(/\s+/g,' ')}
  function normSection(v){return norm(v).replace(/\s*-\s*/g,'-').replace(/^(program|unit)\s*/i,m=>m.trim().toUpperCase()+' ')}
  const keyOf=p=>[norm(p&&p.textbook),String(p&&p.grade),normSection(p&&p.section)].join('|');
  function esc(s){return String(s==null?'':s).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]))}
  function wordCount(p){return ((p&&Array.isArray(p.sentences)?p.sentences.join(' '):'').match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g)||[]).length}

  function validatePassage(p){
    const missing=required.filter(k=>p==null||p[k]==null);
    if(missing.length)throw new Error('v11 passage '+(p&&p.id||'?')+' missing '+missing.join(','));
    if(!Array.isArray(p.sentences)||!p.sentences.length)throw new Error(p.id+' sentences empty');
    if(!Array.isArray(p.slashRows)||p.slashRows.length!==p.sentences.length)throw new Error(p.id+' slash row mismatch');
    if(!Array.isArray(p.questions)||p.questions.length<3)throw new Error(p.id+' needs >=3 questions');
    const bad=p.questions.find(q=>!q.prompt||!q.answer||!q.evidence||!q.evidenceJp||!q.reason);
    if(bad)throw new Error(p.id+' incomplete question');
    return true;
  }

  function totalExtras(){return Object.values(registry).reduce((n,a)=>n+(Array.isArray(a)?a.length:0),0)}
  function updateState(added,source){
    window.V11_MULTI_PASSAGE_STATE={version:VERSION,groups:Object.keys(registry).length,extraPassages:totalExtras(),lastAdded:added,source:source||'unknown',updatedAt:new Date().toISOString()};
    return window.V11_MULTI_PASSAGE_STATE;
  }
  function register(list){
    let added=0;
    for(const p of list||[]){
      validatePassage(p);
      const k=keyOf(p); registry[k]=registry[k]||[];
      if(!registry[k].some(x=>x.id===p.id)){registry[k].push(p);added++}
    }
    const state=updateState(added,'register');
    try{if(typeof window.V11_APPLY_EASY_SUPPORT_NOTES==='function')window.V11_APPLY_EASY_SUPPORT_NOTES()}catch(e){console.error(e)}
    try{window.dispatchEvent(new CustomEvent('v11:passages-registered',{detail:state}))}catch(_){}
    setTimeout(()=>{try{if(typeof window.V11_SYNC_PASSAGE_VARIANT_UI==='function')window.V11_SYNC_PASSAGE_VARIANT_UI({preserveSelection:true,source:'register'})}catch(e){console.error(e)}},0);
    return state;
  }
  window.V11_REGISTER_PASSAGES=register;
  window.V11_VALIDATE_PASSAGE=validatePassage;
  window.V11_PASSAGE_REGISTRY_KEY=keyOf;

  function installUi(){
    if(typeof window.choose!=='function'||typeof window.render!=='function'||typeof window.metaFor!=='function'){setTimeout(installUi,30);return}
    if(window.__V11_MULTI_PASSAGE_UI_INSTALLED)return;
    window.__V11_MULTI_PASSAGE_UI_INSTALLED=true;

    const baseMetaFor=window.metaFor;
    const originalRender=window.render;
    const row=document.querySelector('.row');
    const controlbar=document.querySelector('.controlbar');
    if(!row)return;

    let wordField=document.getElementById('v11WordCountFilterField');
    if(!wordField){
      wordField=document.createElement('div'); wordField.className='field'; wordField.id='v11WordCountFilterField';
      wordField.innerHTML='<label>長文のWord数</label><select id="v11WordCountFilter" aria-label="長文のWord数">'+
        '<option value="all">すべて</option><option value="lt100">99 words以下</option><option value="100-149">100〜149 words</option><option value="150-199">150〜199 words</option><option value="200-249">200〜249 words</option><option value="250-299">250〜299 words</option><option value="300-399">300〜399 words</option><option value="400plus">400 words以上</option></select>';
      const pattern=document.getElementById('pattern'); const pf=pattern&&pattern.closest('.field'); if(pf)row.insertBefore(wordField,pf);else row.appendChild(wordField);
    }
    const wordFilter=document.getElementById('v11WordCountFilter');

    let candidateField=document.getElementById('v11PassageVariantField');
    if(!candidateField){
      candidateField=document.createElement('div'); candidateField.className='field'; candidateField.id='v11PassageVariantField'; candidateField.style.minWidth='360px'; candidateField.style.flex='2 1 360px';
      candidateField.innerHTML='<label>長文候補（選択した小単元）</label><select id="v11PassageVariant" aria-label="長文候補"></select><div id="v11CandidateInline" class="muted" style="margin-top:4px"></div>';
      const pattern=document.getElementById('pattern'); const pf=pattern&&pattern.closest('.field'); if(pf)row.insertBefore(candidateField,pf);else row.appendChild(candidateField);
    }
    const select=document.getElementById('v11PassageVariant');

    if(controlbar&&!document.getElementById('v11PrevPassageBtn')){
      const prev=document.createElement('button'); prev.id='v11PrevPassageBtn'; prev.type='button'; prev.textContent='← 前の本文';
      const next=document.createElement('button'); next.id='v11NextPassageBtn'; next.type='button'; next.className='primary'; next.textContent='次の本文 →';
      const info=document.createElement('span'); info.id='v11CandidatePosition'; info.className='muted'; info.style.alignSelf='center';
      controlbar.insertBefore(prev,controlbar.firstChild); controlbar.insertBefore(next,prev.nextSibling); controlbar.insertBefore(info,next.nextSibling);
    }
    const prevBtn=document.getElementById('v11PrevPassageBtn');
    const nextBtn=document.getElementById('v11NextPassageBtn');
    const pos=document.getElementById('v11CandidatePosition');
    const inline=document.getElementById('v11CandidateInline');

    let selectedId='';
    let records=[];

    function dataset(){
      try{return (DATASETS[String(document.getElementById('grade').value)]||{})[document.getElementById('textbook').value]||{}}catch(_){return{}}
    }
    function rangeKeys(){
      const ds=dataset(); const all=Object.keys(ds); const sec=document.getElementById('section');
      if(!sec||!sec.value)return [];
      return all.includes(sec.value)?[sec.value]:[];
    }
    function matchesWord(p){
      const n=wordCount(p),m=wordFilter?wordFilter.value:'all';
      return m==='all'||(m==='lt100'&&n<=99)||(m==='100-149'&&n>=100&&n<=149)||(m==='150-199'&&n>=150&&n<=199)||(m==='200-249'&&n>=200&&n<=249)||(m==='250-299'&&n>=250&&n<=299)||(m==='300-399'&&n>=300&&n<=399)||(m==='400plus'&&n>=400);
    }
    function matchesPattern(p,k,source){
      const el=document.getElementById('pattern'), wanted=el?String(el.value||'all'):'all'; if(wanted==='all')return true;
      let genre=source==='extra'?String(p&&p.genre||''):'';
      if(!genre){try{genre=String((baseMetaFor(k)||{}).genre||'')}catch(_){}}
      return genre===wanted;
    }
    function buildRecords(){
      const ds=dataset(), textbook=document.getElementById('textbook').value, grade=String(document.getElementById('grade').value), seen=new Set(), out=[];
      for(const k of rangeKeys()){
        const b=ds[k];
        if(b&&matchesWord(b)&&matchesPattern(b,k,'base')){const id=String(b.id||'');if(!seen.has(id)){seen.add(id);out.push({passage:b,source:'base',section:k})}}
        const extras=registry[keyOf({textbook,grade,section:k})]||[];
        for(const p of extras){if(!p||!matchesWord(p)||!matchesPattern(p,k,'extra'))continue;const id=String(p.id||'');if(id&&seen.has(id))continue;if(id)seen.add(id);out.push({passage:p,source:'extra',section:k})}
      }
      return out;
    }
    function label(r){const p=r.passage||{};return (r.source==='extra'?'追加':'基本')+'｜'+(r.section||p.section||'')+'｜'+wordCount(p)+' words｜'+(p.title||p.id||'')}
    function selectedRecord(){return records.find(r=>String(r.passage&&r.passage.id||'')===selectedId)||records[0]||null}
    function setGlobals(p){
      if(!p)return;
      try{current=p}catch(_){}
      try{currentKey=p.section}catch(_){}
    }
    function refreshOptions(reset){
      records=buildRecords();
      if(reset||!records.some(r=>String(r.passage&&r.passage.id||'')===selectedId))selectedId=records[0]?String(records[0].passage.id||''):'';
      select.innerHTML=records.map(r=>'<option value="'+esc(String(r.passage.id||''))+'">'+esc(label(r))+'</option>').join('');
      select.value=selectedId; select.disabled=records.length<=1;
      const r=selectedRecord(), idx=r?records.indexOf(r):-1;
      if(inline)inline.textContent=records.length?('該当 '+records.length+'題。本文を選ぶか「次の本文」で切り替えできます。'):'この条件に合う長文はありません。';
      if(pos)pos.textContent=records.length?((idx+1)+' / '+records.length+'題'):'0 / 0題';
      if(prevBtn)prevBtn.disabled=records.length<=1; if(nextBtn)nextBtn.disabled=records.length<=1;
      const p=r&&r.passage; setGlobals(p);
      window.V11_MULTI_PASSAGE_UI_STATE={version:VERSION,selectedId:p&&p.id||null,optionCount:records.length,baseCount:records.filter(x=>x.source==='base').length,extraCount:records.filter(x=>x.source==='extra').length,selectedWords:p?wordCount(p):0,wordFilter:wordFilter?wordFilter.value:'all',optionIds:records.map(x=>x.passage.id),optionLabels:records.map(label),source:'refresh',refreshedAt:new Date().toISOString()};
      return p||null;
    }
    function move(delta){
      refreshOptions(false); if(records.length<=1)return;
      const r=selectedRecord(); let i=Math.max(0,records.indexOf(r)); i=(i+delta+records.length)%records.length; selectedId=String(records[i].passage.id||'');
      try{setIndex=0}catch(_){}; refreshOptions(false); window.render();
    }

    window.choose=function(){
      if(!records.length)refreshOptions(false);
      const r=selectedRecord(),p=r&&r.passage||null; setGlobals(p); return p;
    };
    window.metaFor=function(sec){
      const r=selectedRecord(); if(!r)return baseMetaFor(sec)||{};
      const p=r.passage, base=baseMetaFor(r.section)||{};
      if(r.source==='extra')return {...base,genre:p.genre||base.genre||'report',questionSetB:Array.isArray(p.questionSetB)?p.questionSetB:[]};
      return base;
    };

    function decorate(){
      const r=selectedRecord(),p=r&&r.passage; if(!p)return;
      const mc=document.getElementById('masterCount'); if(mc)mc.textContent='該当長文 '+records.length+'題 / 選択中 '+wordCount(p)+' words / '+p.section;
      const panel=document.getElementById('passage'); if(panel){
        let m=document.getElementById('v11PassageSourceMeta'); if(!m){m=document.createElement('div');m.id='v11PassageSourceMeta';m.className='meta';m.style.margin='6px 0 10px';const en=panel.querySelector('.en');if(en)panel.insertBefore(m,en);else panel.appendChild(m)}
        m.innerHTML='<span class="badge">'+(r.source==='extra'?'追加本文':'基本本文')+'</span> '+wordCount(p)+' words / '+esc(p.section||'')+' / '+esc(p.id||'');
      }
      const idx=records.indexOf(r); if(pos)pos.textContent=(idx+1)+' / '+records.length+'題';
      window.V11_MULTI_PASSAGE_UI_STATE={...(window.V11_MULTI_PASSAGE_UI_STATE||{}),selectedId:p.id,selectedWords:wordCount(p),position:idx+1,optionCount:records.length,wordFilter:wordFilter?wordFilter.value:'all',source:'render',renderedAt:new Date().toISOString()};
    }

    window.render=function(){
      refreshOptions(false);
      const p=window.choose();
      if(!p){
        const mc=document.getElementById('masterCount'); if(mc)mc.textContent='該当長文 0題';
        ['passage','slash','questions','answers'].forEach(id=>{const e=document.getElementById(id);if(e)e.innerHTML=''});
        return null;
      }
      const r=originalRender.apply(this,arguments); decorate(); return r;
    };

    select.addEventListener('change',()=>{selectedId=String(select.value||'');try{setIndex=0}catch(_){};window.render()});
    if(wordFilter)wordFilter.addEventListener('change',()=>{selectedId='';try{setIndex=0}catch(_){};refreshOptions(true);window.render()});
    if(prevBtn)prevBtn.addEventListener('click',()=>move(-1));
    if(nextBtn)nextBtn.addEventListener('click',()=>move(1));

    ['textbook','grade','major','section','pattern'].forEach(id=>{const el=document.getElementById(id);if(el)el.addEventListener('change',()=>setTimeout(()=>{selectedId='';try{setIndex=0}catch(_){};refreshOptions(true);window.render()},0))});
    window.addEventListener('v11:passages-registered',()=>setTimeout(()=>{refreshOptions(false);window.render()},0));
    window.V11_SYNC_PASSAGE_VARIANT_UI=function(opts){opts=opts||{};if(opts.preserveSelection===false)selectedId='';const p=refreshOptions(opts.preserveSelection===false);if(opts.render)window.render();return p};

    refreshOptions(true); window.render();
  }

  updateState(0,'install');
  installUi();
})();
