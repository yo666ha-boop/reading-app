(function installV11MultiPassageArchitecture(){
  const VERSION='20260905-v11-range-wordcount-001';
  const registry=window.V11_EXTRA_PASSAGES=window.V11_EXTRA_PASSAGES||{};

  function norm(v){
    return String(v==null?'':v).normalize('NFKC').trim().replace(/\s+/g,' ');
  }
  function normSection(v){
    return norm(v).replace(/\s*-\s*/g,'-').replace(/^(program|unit)\s*/i,m=>m.trim().toUpperCase()+' ');
  }
  const keyOf=p=>[norm(p&&p.textbook),String(p&&p.grade),normSection(p&&p.section)].join('|');
  const required=['id','textbook','grade','section','title','sentences','fullTranslation','slashRows','questions'];

  function validatePassage(p){
    const missing=required.filter(k=>p==null||p[k]==null);
    if(missing.length)throw new Error('v11 passage '+(p&&p.id||'?')+' missing '+missing.join(','));
    if(!Array.isArray(p.sentences)||!p.sentences.length)throw new Error(p.id+' sentences empty');
    if(!Array.isArray(p.slashRows)||p.slashRows.length!==p.sentences.length)throw new Error(p.id+' slash row mismatch');
    if(!Array.isArray(p.questions)||p.questions.length<3)throw new Error(p.id+' needs >=3 questions');
    const qbad=p.questions.find(q=>!q.prompt||!q.answer||!q.evidence||!q.evidenceJp||!q.reason);
    if(qbad)throw new Error(p.id+' incomplete question');
    return true;
  }

  function totalExtras(){
    return Object.values(registry).reduce((n,a)=>n+(Array.isArray(a)?a.length:0),0);
  }

  function updateState(added,source){
    window.V11_MULTI_PASSAGE_STATE={
      version:VERSION,
      groups:Object.keys(registry).length,
      extraPassages:totalExtras(),
      lastAdded:added,
      source:source||'unknown',
      updatedAt:new Date().toISOString()
    };
    return window.V11_MULTI_PASSAGE_STATE;
  }

  function afterRegistration(state){
    try{
      if(typeof window.V11_APPLY_EASY_SUPPORT_NOTES==='function')window.V11_APPLY_EASY_SUPPORT_NOTES();
    }catch(err){
      console.error('v11 easy support refresh after registration failed',err);
    }
    try{
      window.dispatchEvent(new CustomEvent('v11:passages-registered',{detail:state}));
    }catch(_){}
    setTimeout(()=>{
      try{
        if(typeof window.V11_SYNC_PASSAGE_VARIANT_UI==='function')window.V11_SYNC_PASSAGE_VARIANT_UI({preserveSelection:true,source:'register'});
      }catch(err){
        console.error('v11 passage selector refresh after registration failed',err);
      }
    },0);
  }

  function register(list){
    let added=0;
    for(const p of list||[]){
      validatePassage(p);
      const k=keyOf(p);
      registry[k]=registry[k]||[];
      if(!registry[k].some(x=>x.id===p.id)){
        registry[k].push(p);
        added++;
      }
    }
    const state=updateState(added,'register');
    afterRegistration(state);
    return state;
  }

  window.V11_REGISTER_PASSAGES=register;
  window.V11_VALIDATE_PASSAGE=validatePassage;
  window.V11_PASSAGE_REGISTRY_KEY=keyOf;

  function escapeHtml(s){
    return String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  }

  function wordCount(p){
    return ((p&&Array.isArray(p.sentences)?p.sentences.join(' '):'').match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g)||[]).length;
  }

  function installUi(){
    if(typeof window.choose!=='function'||typeof window.render!=='function'||typeof window.metaFor!=='function'){
      setTimeout(installUi,30);
      return;
    }
    if(window.__V11_MULTI_PASSAGE_UI_INSTALLED)return;
    window.__V11_MULTI_PASSAGE_UI_INSTALLED=true;

    const baseChoose=window.choose;
    const baseMetaFor=window.metaFor;
    const row=document.querySelector('.row');
    let select=document.getElementById('v11PassageVariant');
    let wordFilter=document.getElementById('v11WordCountFilter');

    if(row&&!wordFilter){
      const wf=document.createElement('div');
      wf.className='field';
      wf.id='v11WordCountFilterField';
      wf.innerHTML='<label>Word数</label><select id="v11WordCountFilter" aria-label="Word数">'+
        '<option value="all">すべて</option>'+
        '<option value="lt100">99 words以下</option>'+
        '<option value="100-129">100〜129 words</option>'+
        '<option value="130-159">130〜159 words</option>'+
        '<option value="160-199">160〜199 words</option>'+
        '<option value="200plus">200 words以上</option>'+
        '</select>';
      const pattern=document.getElementById('pattern');
      const pf=pattern&&pattern.closest('.field');
      if(pf)row.insertBefore(wf,pf);else row.appendChild(wf);
      wordFilter=wf.querySelector('select');
    }

    if(row&&!select){
      const f=document.createElement('div');
      f.className='field';
      f.id='v11PassageVariantField';
      f.style.minWidth='320px';
      f.innerHTML='<label>本文候補（小単元上限まで）</label><select id="v11PassageVariant" aria-label="本文候補"></select>';
      const pattern=document.getElementById('pattern');
      const pf=pattern&&pattern.closest('.field');
      if(pf)row.insertBefore(f,pf);else row.appendChild(f);
      select=f.querySelector('select');
      select.addEventListener('change',()=>{
        const selected=selectedVariant(baseChoose());
        syncCurrentKey(selected);
        window.V11_MULTI_PASSAGE_UI_STATE={
          ...(window.V11_MULTI_PASSAGE_UI_STATE||{}),
          selectedId:selected&&selected.id||null,
          changedByUser:true,
          changedAt:new Date().toISOString()
        };
        window.render();
      });
    }

    function selectedRangeKeys(){
      try{
        if(typeof DATASETS==='undefined')return[];
        const textbook=document.getElementById('textbook');
        const grade=document.getElementById('grade');
        const major=document.getElementById('major');
        const section=document.getElementById('section');
        if(!textbook||!grade||!major||!section)return[];
        const ds=(DATASETS[String(grade.value)]||{})[textbook.value]||{};
        let keys=Object.keys(ds).filter(k=>{
          try{return typeof majorOf==='function'?majorOf(k)===major.value:true}catch(_){return true}
        });
        const upto=keys.indexOf(section.value);
        if(upto>=0)keys=keys.slice(0,upto+1);
        return keys;
      }catch(_){return[]}
    }

    function matchesPattern(p,sectionKey,source){
      const el=document.getElementById('pattern');
      const wanted=el?String(el.value||'all'):'all';
      if(wanted==='all')return true;
      let genre='';
      if(source==='extra')genre=String(p&&p.genre||'');
      if(!genre){
        try{genre=String((baseMetaFor(sectionKey)||{}).genre||'')}catch(_){}
      }
      return genre===wanted;
    }

    function matchesWordCount(p){
      const mode=wordFilter?String(wordFilter.value||'all'):'all';
      if(mode==='all')return true;
      const n=wordCount(p);
      if(mode==='lt100')return n<=99;
      if(mode==='100-129')return n>=100&&n<=129;
      if(mode==='130-159')return n>=130&&n<=159;
      if(mode==='160-199')return n>=160&&n<=199;
      if(mode==='200plus')return n>=200;
      return true;
    }

    function candidateRecords(fallbackBase){
      const records=[];
      const seen=new Set();
      try{
        const textbook=document.getElementById('textbook');
        const grade=document.getElementById('grade');
        if(typeof DATASETS!=='undefined'&&textbook&&grade){
          const ds=(DATASETS[String(grade.value)]||{})[textbook.value]||{};
          const keys=selectedRangeKeys();
          for(const k of keys){
            const base=ds[k];
            if(base&&matchesPattern(base,k,'base')&&matchesWordCount(base)){
              const id=String(base.id||'');
              if(!seen.has(id)){
                seen.add(id);
                records.push({passage:base,source:'base',section:k,extraIndex:0});
              }
            }
            const extras=registry[keyOf({textbook:textbook.value,grade:String(grade.value),section:k})]||[];
            let extraIndex=0;
            for(const p of extras){
              if(!p)continue;
              extraIndex++;
              const id=String(p.id||'');
              if(id&&seen.has(id))continue;
              if(!matchesPattern(p,k,'extra')||!matchesWordCount(p))continue;
              if(id)seen.add(id);
              records.push({passage:p,source:'extra',section:k,extraIndex});
            }
          }
        }
      }catch(err){
        console.error('v11 candidate pool build failed',err);
      }
      if(!records.length&&fallbackBase&&matchesWordCount(fallbackBase)){
        records.push({passage:fallbackBase,source:'base',section:fallbackBase.section||'',extraIndex:0});
      }
      return records;
    }

    function selectedRecord(base){
      const rs=candidateRecords(base);
      if(!rs.length)return null;
      if(!select)return rs[0];
      const wanted=String(select.value||'');
      return rs.find(r=>String(r.passage&&r.passage.id||'')===wanted)||rs[0];
    }

    function selectedVariant(base){
      const r=selectedRecord(base);
      return r&&r.passage||base;
    }

    function syncCurrentKey(p){
      if(!p||!p.section)return;
      try{
        if(typeof currentKey!=='undefined')currentKey=p.section;
      }catch(_){}
    }

    function selectedRegisteredForSection(sec){
      if(!select)return null;
      const wanted=String(select.value||'');
      if(!wanted)return null;
      const r=selectedRecord(null);
      if(r&&r.passage&&String(r.passage.id||'')===wanted&&r.source==='extra')return r.passage;
      const textbook=document.getElementById('textbook');
      const grade=document.getElementById('grade');
      const wantedTextbook=textbook?norm(textbook.value):'';
      const wantedGrade=grade?String(grade.value):'';
      for(const arr of Object.values(registry)){
        if(!Array.isArray(arr))continue;
        const p=arr.find(x=>x&&String(x.id||'')===wanted&&(!wantedTextbook||norm(x.textbook)===wantedTextbook)&&(!wantedGrade||String(x.grade)===wantedGrade));
        if(p)return p;
      }
      return null;
    }

    function optionLabel(r){
      const p=r.passage||{};
      const source=r.source==='extra'?'追加'+String(r.extraIndex||''):'基本';
      return source+'｜'+String(r.section||p.section||'')+'｜'+wordCount(p)+' words｜'+String(p.title||p.id||'');
    }

    function refresh(base,opts){
      opts=opts||{};
      if(!select)return base;
      const rs=candidateRecords(base);
      const oldId=opts.preserveSelection===false?'':String(select.value||'');
      const oldExists=oldId&&rs.some(r=>String(r.passage&&r.passage.id||'')===oldId);
      const fallbackId=base&&base.id?String(base.id):'';
      const targetId=oldExists?oldId:(rs.some(r=>String(r.passage&&r.passage.id||'')===fallbackId)?fallbackId:(rs[0]&&String(rs[0].passage.id||'')));
      select.innerHTML=rs.map(r=>'<option value="'+escapeHtml(String(r.passage&&r.passage.id||''))+'">'+escapeHtml(optionLabel(r))+'</option>').join('');
      if(targetId)select.value=targetId;
      if(!select.value&&rs.length)select.value=String(rs[0].passage.id||'');
      select.disabled=rs.length<=1;
      const selected=selectedVariant(base);
      syncCurrentKey(selected);
      const baseCount=rs.filter(r=>r.source==='base').length;
      const extraCount=rs.filter(r=>r.source==='extra').length;
      window.V11_MULTI_PASSAGE_UI_STATE={
        version:VERSION,
        registryKey:base?keyOf(base):null,
        baseId:base&&base.id||null,
        selectedId:selected&&selected.id||null,
        optionCount:rs.length,
        baseCount,
        extraCount,
        selectedWords:selected?wordCount(selected):0,
        optionIds:rs.map(r=>r.passage&&r.passage.id),
        optionLabels:rs.map(optionLabel),
        wordFilter:wordFilter?wordFilter.value:'all',
        source:opts.source||'refresh',
        refreshedAt:new Date().toISOString()
      };
      return selected||base;
    }

    function sync(opts){
      let base=null;
      try{base=baseChoose();}catch(err){
        console.error('v11 base passage selection failed',err);
      }
      return refresh(base,opts||{preserveSelection:true,source:'sync'});
    }

    window.V11_SYNC_PASSAGE_VARIANT_UI=sync;

    window.choose=function(){
      let base=null;
      try{base=baseChoose();}catch(err){console.error('v11 base choose failed',err)}
      const selected=refresh(base,{preserveSelection:true,source:'choose'})||base;
      syncCurrentKey(selected);
      return selected;
    };

    window.metaFor=function(sec){
      const selected=selectedVariant(null);
      if(selected){
        const baseMeta=baseMetaFor(selected.section)||{};
        if(selectedRegisteredForSection(selected.section)){
          return {
            ...baseMeta,
            genre:selected.genre||baseMeta.genre||'report',
            questionSetB:Array.isArray(selected.questionSetB)?selected.questionSetB:[]
          };
        }
        return baseMeta;
      }
      return baseMetaFor(sec)||{};
    };

    const originalRender=window.render;
    window.render=function(){
      const r=originalRender.apply(this,arguments);
      let base=null;
      try{base=baseChoose();}catch(_){}
      const selected=refresh(base,{preserveSelection:true,source:'render'});
      syncCurrentKey(selected);
      const rs=candidateRecords(base);
      const selectedRec=selectedRecord(base);
      const mc=document.getElementById('masterCount');
      const baseCount=rs.filter(x=>x.source==='base').length;
      const extraCount=rs.filter(x=>x.source==='extra').length;
      if(mc&&selected){
        mc.textContent='候補 '+rs.length+'題（基本'+baseCount+'・追加'+extraCount+'） / 選択中 '+wordCount(selected)+' words';
      }
      const passage=document.getElementById('passage');
      if(passage&&selected){
        let sourceMeta=document.getElementById('v11PassageSourceMeta');
        if(!sourceMeta){
          sourceMeta=document.createElement('div');
          sourceMeta.id='v11PassageSourceMeta';
          sourceMeta.className='meta';
          sourceMeta.style.margin='6px 0 10px';
          const en=passage.querySelector('.en');
          if(en)passage.insertBefore(sourceMeta,en);else passage.appendChild(sourceMeta);
        }
        const sourceLabel=selectedRec&&selectedRec.source==='extra'?'追加本文':'基本本文';
        sourceMeta.innerHTML='<span class="badge">'+escapeHtml(sourceLabel)+'</span> '+wordCount(selected)+' words / '+escapeHtml(selected.section||'');
      }
      return r;
    };

    ['textbook','grade','major','section','pattern'].forEach(id=>{
      const el=document.getElementById(id);
      if(el)el.addEventListener('change',()=>setTimeout(()=>sync({preserveSelection:false,source:'filter-change'}),0));
    });
    if(wordFilter)wordFilter.addEventListener('change',()=>{
      setTimeout(()=>{
        sync({preserveSelection:false,source:'word-filter'});
        if(typeof window.render==='function')window.render();
      },0);
    });
    window.addEventListener('v11:passages-registered',()=>setTimeout(()=>sync({preserveSelection:true,source:'registry-event'}),0));

    sync({preserveSelection:false,source:'install'});
    setTimeout(()=>sync({preserveSelection:true,source:'late-250ms'}),250);
    setTimeout(()=>sync({preserveSelection:true,source:'late-1000ms'}),1000);
    setTimeout(()=>sync({preserveSelection:true,source:'late-3000ms'}),3000);
    if(typeof window.render==='function')window.render();
  }

  updateState(0,'install');
  installUi();
})();