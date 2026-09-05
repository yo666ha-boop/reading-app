(function installV11VisibleCandidateList(){
  'use strict';
  const VERSION='20260905-visible-candidate-list-001';
  function esc(s){return String(s==null?'':s).replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]))}
  function install(){
    const select=document.getElementById('v11PassageVariant');
    const field=document.getElementById('v11PassageVariantField');
    if(!select||!field){setTimeout(install,50);return}
    if(document.getElementById('v11CandidateList'))return;
    const style=document.createElement('style');
    style.id='v11CandidateListStyle';
    style.textContent='.v11-candidate-list{margin-top:8px;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:7px;max-height:310px;overflow:auto;padding:6px;border:1px solid #e2e8f0;border-radius:10px;background:#f8fafc}.v11-candidate{display:block;text-align:left;padding:8px 10px;border:1px solid #cbd5e1;border-radius:8px;background:#fff;font-weight:600;line-height:1.45}.v11-candidate.active{border:2px solid #0f172a;background:#e2e8f0}.v11-candidate-summary{font-size:12px;color:#475569;margin-top:6px}@media(max-width:700px){.v11-candidate-list{grid-template-columns:1fr;max-height:260px}}@media print{#v11CandidateList,#v11CandidateListSummary{display:none!important}}';
    document.head.appendChild(style);
    const summary=document.createElement('div');summary.id='v11CandidateListSummary';summary.className='v11-candidate-summary';
    const list=document.createElement('div');list.id='v11CandidateList';list.className='v11-candidate-list';list.setAttribute('aria-label','長文候補一覧');
    field.appendChild(summary);field.appendChild(list);

    function render(){
      const opts=Array.from(select.options||[]);
      summary.textContent=opts.length?('この条件の長文 '+opts.length+'題。下から直接選べます。'):'この条件に合う長文はありません。';
      list.innerHTML=opts.map((o,i)=>'<button type="button" class="v11-candidate '+(o.value===select.value?'active':'')+'" data-id="'+esc(o.value)+'"><span>'+(i+1)+'.</span> '+esc(o.textContent)+'</button>').join('');
      const active=list.querySelector('.active');if(active&&typeof active.scrollIntoView==='function')active.scrollIntoView({block:'nearest'});
      window.V11_VISIBLE_CANDIDATE_LIST_STATE={version:VERSION,count:opts.length,selectedId:select.value,updatedAt:new Date().toISOString()};
    }
    list.addEventListener('click',e=>{const b=e.target.closest('button[data-id]');if(!b)return;select.value=b.dataset.id;select.dispatchEvent(new Event('change',{bubbles:true}));setTimeout(render,0)});
    select.addEventListener('change',()=>setTimeout(render,0));
    const observer=new MutationObserver(()=>render());observer.observe(select,{childList:true,subtree:true});
    ['textbook','grade','major','section','pattern','v11WordCountFilter'].forEach(id=>{const el=document.getElementById(id);if(el)el.addEventListener('change',()=>setTimeout(render,60))});
    const prev=document.getElementById('v11PrevPassageBtn'),next=document.getElementById('v11NextPassageBtn');if(prev)prev.addEventListener('click',()=>setTimeout(render,0));if(next)next.addEventListener('click',()=>setTimeout(render,0));
    render();
  }
  install();
})();
