(function bootstrapV11Batch05(){
'use strict';
if(window.V11_BATCH05_LOADED||window.V11_BATCH05_BOOTSTRAP_LOADING)return;
window.V11_BATCH05_BOOTSTRAP_LOADING=true;
const files=[
 'v11_batch05_passages_draft_g1.js','v11_batch05_passages_draft_g2.js','v11_batch05_passages_draft_g3.js',
 'v11_batch05_grammar_repair.js','v11_batch05_grammar_repair_r2.js','v11_batch05_chronology_repair.js',
 'v11_batch05_notes_finalize_pre.js','v11_batch05_notes_finalize.js','v11_batch05_translation_sync.js','v11_batch05_question_regenerate.js','v11_batch05_register.js'
];
function load(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.async=false;s.onload=resolve;s.onerror=()=>reject(new Error('Batch05 script load failed: '+src));document.head.appendChild(s);});}
(async()=>{try{for(const f of files)await load(f);if(!window.V11_BATCH05_LOADED)throw new Error('Batch05 registration did not complete');window.V11_BATCH05_BOOTSTRAP_STATE={version:'20260829-final',files:files.length,loaded:true,total:window.V11_BATCH05_STATE&&window.V11_BATCH05_STATE.totalWithBaseline};if(typeof window.render==='function')window.render();}catch(e){window.V11_BATCH05_BOOTSTRAP_ERROR=String(e&&e.stack||e);console.error(e);throw e;}finally{window.V11_BATCH05_BOOTSTRAP_LOADING=false;}})();
})();
