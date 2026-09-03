(function installV11MultiPassageArchitecture(){
  const VERSION='20260827-v11-multipassage-001';
  const registry=window.V11_EXTRA_PASSAGES=window.V11_EXTRA_PASSAGES||{};
  const keyOf=p=>[p.textbook,String(p.grade),p.section].join('|');
  const required=['id','textbook','grade','section','title','sentences','fullTranslation','slashRows','questions'];
  function validatePassage(p){const missing=required.filter(k=>p==null||p[k]==null);if(missing.length)throw new Error('v11 passage '+(p&&p.id||'?')+' missing '+missing.join(','));if(!Array.isArray(p.sentences)||!p.sentences.length)throw new Error(p.id+' sentences empty');if(!Array.isArray(p.slashRows)||p.slashRows.length!==p.sentences.length)throw new Error(p.id+' slash row mismatch');if(!Array.isArray(p.questions)||p.questions.length<3)throw new Error(p.id+' needs >=3 questions');const qbad=p.questions.find(q=>!q.prompt||!q.answer||!q.evidence||!q.evidenceJp||!q.reason);if(qbad)throw new Error(p.id+' incomplete question');return true;}
  function register(list){let added=0;for(const p of list||[]){validatePassage(p);const k=keyOf(p);registry[k]=registry[k]||[];if(!registry[k].some(x=>x.id===p.id)){registry[k].push(p);added++;}}window.V11_MULTI_PASSAGE_STATE={version:VERSION,groups:Object.keys(registry).length,extraPassages:Object.values(registry).reduce((n,a)=>n+a.length,0),lastAdded:added};return window.V11_MULTI_PASSAGE_STATE;}
  window.V11_REGISTER_PASSAGES=register;
  window.V11_VALIDATE_PASSAGE=validatePassage;
  function installUi(){if(typeof window.choose!=='function'||typeof window.render!=='function'||typeof window.metaFor!=='function'){setTimeout(installUi,30);return;}if(window.__V11_MULTI_PASSAGE_UI_INSTALLED)return;window.__V11_MULTI_PASSAGE_UI_INSTALLED=true;
    const baseChoose=window.choose,baseMetaFor=window.metaFor;
    const row=document.querySelector('.row');let select=document.getElementById('v11PassageVariant');
    if(row&&!select){const f=document.createElement('div');f.className='field';f.id='v11PassageVariantField';f.innerHTML='<label>本文</label><select id="v11PassageVariant"></select>';const pattern=document.getElementById('pattern');const pf=pattern&&pattern.closest('.field');if(pf)row.insertBefore(f,pf);else row.appendChild(f);select=f.querySelector('select');select.addEventListener('change',()=>window.render());}
    function variants(base){if(!base)return[];const extras=registry[keyOf(base)]||[];return [base,...extras];}
    function refresh(base){if(!select)return base;const vs=variants(base);const old=select.value;select.innerHTML=vs.map((p,i)=>'<option value="'+String(i)+'">'+(i===0?'基本':'追加'+i)+'｜'+escapeHtml(p.title||p.id)+'</option>').join('');let idx=Number(old);if(!Number.isInteger(idx)||idx<0||idx>=vs.length)idx=vs.length>1?vs.length-1:0;select.value=String(idx);select.disabled=vs.length<=1;return vs[idx]||base;}
    window.choose=function(){const base=baseChoose();if(!base)return base;return refresh(base);};
    window.metaFor=function(sec){const base=baseChoose();if(!base)return baseMetaFor(sec);const vs=variants(base);const idx=select?Number(select.value||0):0;const selected=vs[idx]||base;if(selected!==base)return {genre:selected.genre||'report',questionSetB:Array.isArray(selected.questionSetB)?selected.questionSetB:[]};return baseMetaFor(sec);};
    const originalRender=window.render;window.render=function(){const r=originalRender.apply(this,arguments);const p=window.choose();const count=variants(baseChoose()).length;const mc=document.getElementById('masterCount');if(mc&&p)mc.textContent+=' / この小単元の本文 '+count+'題';return r;};
    if(typeof window.render==='function')window.render();
  }
  function escapeHtml(s){return String(s==null?'':s).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));}
  installUi();
})();
