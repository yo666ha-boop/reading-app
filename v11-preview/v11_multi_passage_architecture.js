(function installV11MultiPassageArchitecture(){
  const VERSION='20260904-v11-multipassage-003-filter-safe';
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

    if(row&&!select){
      const f=document.createElement('div');
      f.className='field';
      f.id='v11PassageVariantField';
      f.innerHTML='<label>本文</label><select id="v11PassageVariant" aria-label="本文"></select>';
      const pattern=document.getElementById('pattern');
      const pf=pattern&&pattern.closest('.field');
      if(pf)row.insertBefore(f,pf);else row.appendChild(f);
      select=f.querySelector('select');
      select.addEventListener('change',()=>{
        const selected=selectedVariant(baseChoose());
        window.V11_MULTI_PASSAGE_UI_STATE={
          ...(window.V11_MULTI_PASSAGE_UI_STATE||{}),
          selectedId:selected&&selected.id||null,
          changedByUser:true,
          changedAt:new Date().toISOString()
        };
        window.render();
      });
    }

    function variants(base){
      if(!base)return[];
      const extras=registry[keyOf(base)]||[];
      const out=[base];
      const seen=new Set([String(base.id||'')]);
      for(const p of extras){
        if(!p)continue;
        const id=String(p.id||'');
        if(id&&seen.has(id))continue;
        if(id)seen.add(id);
        out.push(p);
      }
      return out;
    }

    function selectedVariant(base){
      const vs=variants(base);
      if(!vs.length)return base;
      if(!select)return vs[0];
      const wanted=String(select.value||'');
      return vs.find(p=>String(p.id||'')===wanted)||vs[0];
    }

    function selectedRegisteredForSection(sec){
      if(!select)return null;
      const wanted=String(select.value||'');
      if(!wanted)return null;
      const textbook=document.getElementById('textbook');
      const grade=document.getElementById('grade');
      const wantedTextbook=textbook?norm(textbook.value):'';
      const wantedGrade=grade?String(grade.value):'';
      const wantedSection=normSection(sec);
      for(const arr of Object.values(registry)){
        if(!Array.isArray(arr))continue;
        const p=arr.find(x=>x&&String(x.id||'')===wanted&&normSection(x.section)===wantedSection&&(!wantedTextbook||norm(x.textbook)===wantedTextbook)&&(!wantedGrade||String(x.grade)===wantedGrade));
        if(p)return p;
      }
      return null;
    }

    function refresh(base,opts){
      opts=opts||{};
      if(!select||!base)return base;
      const vs=variants(base);
      const oldId=opts.preserveSelection===false?'':String(select.value||'');
      const oldExists=oldId&&vs.some(p=>String(p.id||'')===oldId);
      const targetId=oldExists?oldId:String(base.id||'');
      select.innerHTML=vs.map((p,i)=>
        '<option value="'+escapeHtml(String(p.id||''))+'">'+
        (i===0?'基本':'追加'+i)+'｜'+escapeHtml(p.title||p.id)+'</option>'
      ).join('');
      select.value=targetId;
      if(!select.value&&vs.length)select.value=String(vs[0].id||'');
      select.disabled=vs.length<=1;
      const selected=selectedVariant(base);
      window.V11_MULTI_PASSAGE_UI_STATE={
        version:VERSION,
        registryKey:keyOf(base),
        baseId:base.id||null,
        selectedId:selected&&selected.id||null,
        optionCount:vs.length,
        extraCount:Math.max(0,vs.length-1),
        optionIds:vs.map(p=>p.id),
        source:opts.source||'refresh',
        refreshedAt:new Date().toISOString()
      };
      return selected||base;
    }

    function sync(opts){
      let base=null;
      try{base=baseChoose();}catch(err){
        console.error('v11 base passage selection failed',err);
        return null;
      }
      if(!base)return null;
      return refresh(base,opts||{preserveSelection:true,source:'sync'});
    }

    window.V11_SYNC_PASSAGE_VARIANT_UI=sync;

    window.choose=function(){
      const base=baseChoose();
      if(!base)return base;
      refresh(base,{preserveSelection:true,source:'choose'});
      return selectedVariant(base);
    };

    // Do not call baseChoose() here. The original choose() calls metaFor()
    // while applying the genre filter; calling choose() from metaFor() would recurse.
    window.metaFor=function(sec){
      const baseMeta=baseMetaFor(sec)||{};
      const selected=selectedRegisteredForSection(sec);
      if(!selected)return baseMeta;
      return {
        ...baseMeta,
        genre:selected.genre||baseMeta.genre||'report',
        questionSetB:Array.isArray(selected.questionSetB)?selected.questionSetB:[]
      };
    };

    const originalRender=window.render;
    window.render=function(){
      const r=originalRender.apply(this,arguments);
      const base=baseChoose();
      if(base)refresh(base,{preserveSelection:true,source:'render'});
      const p=base?selectedVariant(base):null;
      const count=base?variants(base).length:0;
      const mc=document.getElementById('masterCount');
      if(mc&&p){
        const suffix=' / この小単元の本文 '+count+'題';
        if(!mc.textContent.includes('この小単元の本文'))mc.textContent+=suffix;
        else mc.textContent=mc.textContent.replace(/\s*\/\s*この小単元の本文\s+\d+題/,suffix);
      }
      return r;
    };

    ['textbook','grade','major','section','pattern'].forEach(id=>{
      const el=document.getElementById(id);
      if(el)el.addEventListener('change',()=>setTimeout(()=>sync({preserveSelection:false,source:'filter-change'}),0));
    });
    window.addEventListener('v11:passages-registered',()=>setTimeout(()=>sync({preserveSelection:true,source:'registry-event'}),0));

    sync({preserveSelection:false,source:'install'});
    setTimeout(()=>sync({preserveSelection:true,source:'late-250ms'}),250);
    setTimeout(()=>sync({preserveSelection:true,source:'late-1000ms'}),1000);
    setTimeout(()=>sync({preserveSelection:true,source:'late-3000ms'}),3000);
    if(typeof window.render==='function')window.render();
  }

  function escapeHtml(s){
    return String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  }

  updateState(0,'install');
  installUi();
})();