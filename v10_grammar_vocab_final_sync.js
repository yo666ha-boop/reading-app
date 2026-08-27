// Final bounded sync after reference + grammar chronology rewrites.
// Restores vocabulary chronology where a grammar-safe rewrite accidentally introduced a later lexical item.
// This file can be loaded early: it waits for the grammar rewrite bridge, then applies once.
(function(){
 const defs=[
  {section:'Unit 3-3',from:'I practice every day.',to:'I practice after school.',jpFrom:'毎日練習するんだ。',jpTo:'放課後に練習するんだ。',slash:{en:'I practice / after school.',jp:'私は練習します / 放課後に'},prompt:'話し手はいつ練習しますか。本文から英語で答えなさい。',answer:'after school'},
  {section:'Unit 4-2',from:'We practice every day.',to:'We practice after school.',jpFrom:'私たちは毎日練習します。',jpTo:'私たちは放課後に練習します。',slash:{en:'We practice / after school.',jp:'私たちは練習します / 放課後に'},prompt:'話し手たちはいつ練習しますか。本文から英語で答えなさい。',answer:'after school'}
 ];
 function metas(section){const out=[];for(const key of ['ニューホライズン|1|'+section,'ニューホライズン|'+section]){const m=window.V10_INTERACTION_META&&window.V10_INTERACTION_META[key];if(m)out.push(m);}for(const k of Object.keys(window)){if(!/^V10_INTERACTION_META_SEMANTIC_REPAIRS(?:_\d{3}_\d{3})?$/.test(k))continue;const obj=window[k];if(!obj||typeof obj!=='object')continue;for(const key of ['ニューホライズン|1|'+section,'ニューホライズン|'+section])if(obj[key])out.push(obj[key]);}return [...new Set(out)];}
 function syncQ(q,d){if(!q)return 0;const hit=String(q.evidence||'').includes(d.from)||String(q.answer||'')==='every day';if(!hit)return 0;q.prompt=d.prompt;q.answer=d.answer;q.evidence=d.to;q.evidenceJp=d.jpTo;q.reason='本文の after school が練習する時を表しています。';return 1;}
 function apply(){
  if(window.V10_GRAMMAR_VOCAB_FINAL_SYNC&&window.V10_GRAMMAR_VOCAB_FINAL_SYNC.applied)return window.V10_GRAMMAR_VOCAB_FINAL_SYNC;
  const data=window.V10_NEWHORIZON_G1||{};let changed=0,qchanged=0;const missing=[];
  for(const d of defs){const p=data[d.section];if(!p){missing.push(d.section+':passage');continue;}const i=(p.sentences||[]).indexOf(d.from);if(i<0){if(!(p.sentences||[]).includes(d.to))missing.push(d.section+':sentence');}else{p.sentences[i]=d.to;if(Array.isArray(p.slashRows)&&p.slashRows[i])p.slashRows[i]=d.slash;p.fullTranslation=String(p.fullTranslation||'').split(d.jpFrom).join(d.jpTo);changed++;}for(const q of (p.questions||[]))qchanged+=syncQ(q,d);for(const m of metas(d.section))for(const q of (m.questionSetB||[]))qchanged+=syncQ(q,d);if(p&&!String(p.auditNote||'').includes('Final chronology sync: grammar-safe rewrite used future lexical day'))p.auditNote=String(p.auditNote||'')+' Final chronology sync: grammar-safe rewrite used future lexical day; replaced with already-learned after school and synchronized sentence/translation/slash/A+B evidence.';}
  const state={definitions:defs.length,changed,qchanged,missing,version:'20260826',applied:missing.length===0};window.V10_GRAMMAR_VOCAB_FINAL_SYNC=state;
  if(missing.length)throw new Error('grammar-vocab final sync missing: '+missing.join(' | '));
  const sec=document.getElementById('section');if(sec)sec.dispatchEvent(new Event('change',{bubbles:true}));
  return state;
 }
 window.V10_APPLY_GRAMMAR_VOCAB_FINAL_SYNC=apply;
 if(window.V10_GRAMMAR_CHRONOLOGY_RUNTIME_FIX_STATE){apply();return;}
 let tries=0;const timer=setInterval(()=>{tries++;if(window.V10_GRAMMAR_CHRONOLOGY_RUNTIME_FIX_STATE){clearInterval(timer);apply();}else if(tries>3000){clearInterval(timer);window.V10_GRAMMAR_VOCAB_FINAL_SYNC={definitions:defs.length,changed:0,qchanged:0,missing:['grammar bridge timeout'],version:'20260826',applied:false};}},10);
})();

// v11 branch-only extensions. Keep v10 main untouched until v11 gates pass.
(function loadV11Extensions(){
 if(typeof document==='undefined'||window.__V11_EXTENSION_LOADER)return;
 window.__V11_EXTENSION_LOADER=true;
 const BUILD='20260827-v11-003';
 function load(src,ok,fail){const s=document.createElement('script');s.src=src+(src.includes('?')?'&':'?')+'v='+encodeURIComponent(BUILD);s.onload=ok||(()=>{});s.onerror=fail||(()=>{});document.head.appendChild(s);}
 load('v11_easy_support_notes.js',()=>{
   window.V11_EASY_SUPPORT_LOADED=true;
   if(typeof window.V11_APPLY_EASY_SUPPORT_NOTES==='function')window.V11_APPLY_EASY_SUPPORT_NOTES();
   load('v11_multi_passage_architecture.js',()=>{
     window.V11_MULTI_PASSAGE_LOADED=true;
     load('v11_batch01_passages_001_050.js',()=>{
       load('v11_batch01_uniqueness_repair.js',()=>{
         window.V11_BATCH01_LOADED=true;
         if(typeof window.V11_APPLY_EASY_SUPPORT_NOTES==='function')window.V11_APPLY_EASY_SUPPORT_NOTES();
         if(typeof window.render==='function')window.render();
       },()=>{window.V11_BATCH01_REPAIR_LOAD_ERROR='v11_batch01_uniqueness_repair.js failed';});
     },()=>{window.V11_BATCH01_LOAD_ERROR='v11_batch01_passages_001_050.js failed';});
   },()=>{window.V11_MULTI_PASSAGE_LOAD_ERROR='v11_multi_passage_architecture.js failed';});
 },()=>{window.V11_EASY_SUPPORT_LOAD_ERROR='v11_easy_support_notes.js failed';});
})();
