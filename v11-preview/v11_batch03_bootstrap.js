(function bootstrapV11Batch03(){
'use strict';
if(window.V11_BATCH03_LOADED||window.V11_BATCH03_BOOTSTRAP_LOADING)return;
window.V11_BATCH03_BOOTSTRAP_LOADING=true;
const files=[
 'v11_batch03_passages_draft_g1.js',
 'v11_batch03_g1_length_repair.js',
 'v11_batch03_passages_draft_g2.js',
 'v11_batch03_passages_draft_g3.js',
 'v11_batch03_length_repair.js',
 'v11_batch03_chronology_repair.js',
 'v11_batch03_chronology_repair_r2.js',
 'v11_batch03_note_finalize_prepatch.js',
 'v11_batch03_note_finalize.js',
 'v11_batch03_question_regenerate.js',
 'v11_batch03_register.js'
];
function load(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.async=false;s.onload=resolve;s.onerror=()=>reject(new Error('Batch03 script load failed: '+src));document.head.appendChild(s);});}
(async()=>{try{for(const f of files)await load(f);if(!window.V11_BATCH03_LOADED)throw new Error('Batch03 registration did not complete');window.V11_BATCH03_BOOTSTRAP_STATE={version:'20260828-final',files:files.length,loaded:true,total:window.V11_BATCH03_STATE&&window.V11_BATCH03_STATE.totalWithBaseline};await load('v11_batch04_bootstrap.js');if(typeof window.render==='function')window.render();}catch(e){window.V11_BATCH03_BOOTSTRAP_ERROR=String(e&&e.stack||e);console.error(e);throw e;}finally{window.V11_BATCH03_BOOTSTRAP_LOADING=false;}})();
})();