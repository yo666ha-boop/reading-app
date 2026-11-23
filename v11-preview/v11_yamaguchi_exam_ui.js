(function installV11YamaguchiExamEntry(){
  'use strict';
  const VERSION='20261123-yamaguchi-exam-entry-r1';
  const MANIFEST='V11_YAMAGUCHI_100_SUBSET_20260929.json';
  const EXACT_BATCH_COUNT=832;
  let manifest=null;
  let manifestError='';
  let mode='exam';
  let minWords=0;
  let selectedId='';
  let panel=null;
  let lastStatus='';
  const $=id=>document.getElementById(id);
  const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function wc(p){
    return ((p&&Array.isArray(p.sentences)?p.sentences.join(' '):'').match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g)||[]).length;
  }
  function allRegistered(){
    const registry=window.V11_EXTRA_PASSAGES||{};
    const passages=[];
    Object.values(registry).forEach(xs=>{if(Array.isArray(xs))xs.forEach(p=>passages.push(p))});
    return passages;
  }
  function indexPassages(){
    const byId=new Map();
    allRegistered().forEach(p=>{if(p&&p.id)byId.set(String(p.id),p)});
    return byId;
  }
  function state(part){
    window.V11_YAMAGUCHI_EXAM_UI_STATE=Object.assign({
      version:VERSION, source:MANIFEST, mode:mode, minWords:minWords,
      manifestLoaded:!!manifest, status:lastStatus
    },part||{});
  }
  function initPanel(){
    if(panel)return;
    const header=document.querySelector('.wrap > .panel.screen-only');
    if(!header){setTimeout(initPanel,100);return}
    panel=document.createElement('section');
    panel.className='panel screen-only';
    panel.id='v11YamaguchiExamPanel';
    panel.setAttribute('aria-label','山口県公立高校入試対策');
    panel.innerHTML=
      '<h2 style="margin-bottom:8px">高校入試対策（山口県型）</h2>'+
      '<p class="muted">教科書の単元とは別に、入試用の長文を選べます。100題は登録済み1,000題から選んだ練習セットです。追加100題ではありません。</p>'+
      '<div class="row" style="margin-top:12px">'+
        '<div class="field"><label for="v11ExamMode">練習の種類</label>'+
          '<select id="v11ExamMode"><option value="exam">入試本番型（36題）</option><option value="prep">入試準備・段階練習（100題）</option></select></div>'+
        '<div class="field"><label for="v11ExamMinWords">英文の長さ</label>'+
          '<select id="v11ExamMinWords"><option value="0">すべて</option><option value="350">350語以上</option><option value="400">400語以上</option></select></div>'+
        '<div class="field" style="flex:2 1 280px"><label for="v11ExamPassage">選ぶ長文</label>'+
          '<select id="v11ExamPassage" style="width:100%" disabled></select></div>'+
      '</div>'+
      '<div id="v11ExamStatus" class="muted" style="margin-top:10px" role="status">入試用データを読み込み中です。</div>'+
      '<div class="controlbar"><button type="button" class="primary" id="v11ExamOpen" disabled>選んだ長文を開く</button></div>'+
      '<p class="muted" style="margin-top:9px">本番型は340〜446語の36題（うち400語以上は12題）。入試準備100題には150〜329語の64題も含まれます。実際の県入試過去問の転載ではなく、形式に合わせたオリジナル教材です。</p>';
    header.insertAdjacentElement('afterend',panel);
    $('v11ExamMode').addEventListener('change',()=>{mode=$('v11ExamMode').value;selectedId='';render()});
    $('v11ExamMinWords').addEventListener('change',()=>{minWords=Number($('v11ExamMinWords').value)||0;selectedId='';render()});
    $('v11ExamPassage').addEventListener('change',()=>{selectedId=$('v11ExamPassage').value});
    $('v11ExamOpen').addEventListener('click',openSelected);
    render();
  }
  function render(){
    if(!panel)return;
    const status=$('v11ExamStatus'), sel=$('v11ExamPassage'),open=$('v11ExamOpen');
    const registered=allRegistered().length;
    if(manifestError){
      lastStatus='ERROR';
      status.textContent='入試データを読み込めませんでした：'+manifestError;
      sel.innerHTML='';sel.disabled=true;open.disabled=true;
      state({registered, error:manifestError});
      return;
    }
    if(!manifest||registered<EXACT_BATCH_COUNT){
      lastStatus='LOADING';
      status.textContent='読み込み中：追加長文 '+registered+'/'+EXACT_BATCH_COUNT+'題。すべてのデータが揃うまで選択できません。';
      sel.innerHTML='';sel.disabled=true;open.disabled=true;
      state({registered});
      return;
    }
    const rows=manifest.rows||[];
    const byId=indexPassages(), ids=new Set(rows.map(r=>r.id));
    const missing=rows.filter(r=>!byId.has(r.id)).map(r=>r.id);
    const exam=rows.filter(r=>r.lengthTier==='EXAM_STAMINA'&&r.explicit===true);
    if(rows.length!==100||ids.size!==100||exam.length!==36||missing.length){
      lastStatus='FAIL_CLOSED';
      status.textContent='入試データが一致しません。100題='+rows.length+'、本番型='+exam.length+'、未登録='+missing.length+'。誤った教材を表示しないため停止しています。';
      sel.innerHTML='';sel.disabled=true;open.disabled=true;
      state({registered,rows:rows.length,exam:exam.length,missing});
      return;
    }
    const base=mode==='exam'?exam:rows;
    const filtered=base.map(r=>({row:r,p:byId.get(r.id)})).filter(x=>wc(x.p)>=minWords);
    if(!selectedId||!filtered.some(x=>x.row.id===selectedId))selectedId=filtered.length?filtered[0].row.id:'';
    sel.innerHTML=filtered.map((x,i)=>{
      const tier=x.row.lengthTier==='EXAM_STAMINA'?'本番型':x.row.lengthTier==='LONG'?'長文練習':'基礎・標準';
      return '<option value="'+esc(x.row.id)+'">'+(i+1)+'. '+wc(x.p)+'語｜'+tier+'｜'+esc(x.p.title||x.row.id)+'</option>';
    }).join('');
    sel.value=selectedId;sel.disabled=!filtered.length;open.disabled=!filtered.length;
    const long400=base.filter(r=>wc(byId.get(r.id))>=400).length;
    status.textContent=(mode==='exam'?'入試本番型':'入試準備')+'：'+filtered.length+'題を選択可能（元の候補 '+base.length+'題、400語以上 '+long400+'題）。';
    lastStatus='READY';
    state({registered, rows:rows.length, exam:exam.length, prep:rows.length,
      matching:filtered.length, over400:long400, missing:[], selectedId});
  }
  function openSelected(){
    if(lastStatus!=='READY'||!selectedId||!manifest)return;
    const p=indexPassages().get(selectedId);
    if(!p)return;
    try{
      if(typeof window.refreshMajor!=='function'||typeof window.refreshSection!=='function'||typeof window.majorOf!=='function')throw new Error('単元選択の操作が準備できていません');
      $('textbook').value=p.textbook;
      $('grade').value=String(p.grade);
      window.refreshMajor();
      const major=window.majorOf(p.section);
      $('major').value=major;
      window.refreshSection();
      $('section').value=p.section;
      $('pattern').value='all';
      if($('v11WordCountFilter'))$('v11WordCountFilter').value='all';
      if(typeof window.V11_SYNC_PASSAGE_VARIANT_UI!=='function')throw new Error('長文候補の操作が準備できていません');
      window.V11_SYNC_PASSAGE_VARIANT_UI({preserveSelection:false});
      const variant=$('v11PassageVariant');
      if(!variant||!Array.from(variant.options).some(o=>o.value===p.id))throw new Error('対象長文が候補一覧にありません：'+p.id);
      variant.value=p.id;
      variant.dispatchEvent(new Event('change',{bubbles:true}));
      const active=$('v11ExamPassage');if(active)active.value=p.id;
      const passageTab=document.querySelector('.tabs button[data-tab="passage"]');
      if(passageTab)passageTab.click();
      const panelText=$('passage');
      if(panelText)panelText.scrollIntoView({behavior:'smooth',block:'start'});
      $('v11ExamStatus').textContent='選択しました：'+wc(p)+'語｜'+(p.title||p.id)+'。本文・英文解釈・問題・解答を表示できます。';
      state({openedId:p.id, openedWords:wc(p), registered:allRegistered().length});
    }catch(e){
      $('v11ExamStatus').textContent='長文の表示に失敗しました：'+String(e&&e.message||e);
      state({openError:String(e&&e.message||e)});
    }
  }
  async function loadManifest(){
    try{
      const response=await fetch(MANIFEST,{cache:'no-store'});
      if(!response.ok)throw new Error('HTTP '+response.status);
      const data=await response.json();
      if(!data||!Array.isArray(data.rows))throw new Error('不正なデータ形式');
      manifest=data;manifestError='';
    }catch(e){manifestError=String(e&&e.message||e)}
    render();
  }
  window.addEventListener('v11:passages-registered',()=>setTimeout(render,0));
  window.addEventListener('load',render);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initPanel,{once:true});
  else initPanel();
  loadManifest();
})();