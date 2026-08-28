(function bootstrapV11Batch04(){
'use strict';
if(window.V11_BATCH04_LOADED||window.V11_BATCH04_BOOTSTRAP_LOADING)return;
window.V11_BATCH04_BOOTSTRAP_LOADING=true;
const files=[
 'v11_batch04_passages_draft_g1.js','v11_batch04_passages_draft_g2.js','v11_batch04_passages_draft_g3.js',
 'v11_batch04_length_repair.js','v11_batch04_length_repair_r2.js','v11_batch04_chronology_repair.js','v11_batch04_grammar_repair.js','v11_batch04_chronology_repair_r2.js','v11_batch04_postgrammar_length_repair.js',
 'v11_batch04_notes_finalize_g1.js','v11_batch04_notes_finalize_g2.js','v11_batch04_notes_finalize_g3.js','v11_batch04_notes_finalize_residual.js',
 'v11_batch04_translation_sync.js','v11_batch04_question_regenerate.js','v11_batch04_register.js'
];
function load(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.async=false;s.onload=resolve;s.onerror=()=>reject(new Error('Batch04 script load failed: '+src));document.head.appendChild(s);});}
(async()=>{try{for(const f of files)await load(f);if(!window.V11_BATCH04_LOADED)throw new Error('Batch04 registration did not complete');window.V11_BATCH04_BOOTSTRAP_STATE={version:'20260828-final',files:files.length,loaded:true,total:window.V11_BATCH04_STATE&&window.V11_BATCH04_STATE.totalWithBaseline};if(!window.V11_BATCH05_LOADED){await load('v11_batch05_bootstrap.js');}if(typeof window.render==='function')window.render();}catch(e){window.V11_BATCH04_BOOTSTRAP_ERROR=String(e&&e.stack||e);console.error(e);throw e;}finally{window.V11_BATCH04_BOOTSTRAP_LOADING=false;}})();
})();
