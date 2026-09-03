(function bootstrapV11Batch02(){
'use strict';
if(window.V11_BATCH02_LOADED||window.V11_BATCH02_BOOTSTRAP_LOADING)return;
window.V11_BATCH02_BOOTSTRAP_LOADING=true;
const files=[
 'v11_batch02_passages_draft.js',
 'v11_batch02_unit_safe_repair.js',
 'v11_batch02_unique_structure_repair.js',
 'v11_batch02_semantic_rewrite_pass1.js',
 'v11_batch02_semantic_chronology_repair_pass1.js',
 'v11_batch02_required_notes_repair.js',
 'v11_batch02_semantic_rewrite_pass2_grade2.js',
 'v11_batch02_grade2_chronology_repair.js',
 'v11_batch02_semantic_rewrite_pass3_grade3.js',
 'v11_batch02_grade3_chronology_repair.js',
 'v11_batch02_length_repair.js',
 'v11_batch02_length_repair_r2.js',
 'v11_batch02_postlength_chronology_repair.js',
 'v11_batch02_question_repair.js',
 'v11_batch02_register.js'
];
function load(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.async=false;s.onload=resolve;s.onerror=()=>reject(new Error('Batch02 script load failed: '+src));document.head.appendChild(s);});}
(async()=>{try{for(const f of files)await load(f);if(!window.V11_BATCH02_LOADED)throw new Error('Batch02 registration did not complete');window.V11_BATCH02_BOOTSTRAP_STATE={version:'20260828-final',files:files.length,loaded:true,total:window.V11_BATCH02_STATE&&window.V11_BATCH02_STATE.totalWithBaseline};await load('v11_batch03_bootstrap.js');if(typeof window.render==='function')window.render();}catch(e){window.V11_BATCH02_BOOTSTRAP_ERROR=String(e&&e.stack||e);console.error(e);throw e;}finally{window.V11_BATCH02_BOOTSTRAP_LOADING=false;}})();
})();