(function bootstrapV11Batch06(){
'use strict';
if(window.V11_BATCH06_LOADED||window.V11_BATCH06_BOOTSTRAP_LOADING)return;
window.V11_BATCH06_BOOTSTRAP_LOADING=true;
const files=[
 'v11_batch06_passages_draft_g1.js','v11_batch06_passages_draft_g2.js','v11_batch06_passages_draft_g3.js',
 'v11_batch06_draft_repairs.js','v11_batch06_grammar_repair.js','v11_batch06_chronology_repair.js','v11_batch06_length_repair.js',
 'v11_batch06_canonical_gloss.js','v11_batch06_notes_finalize.js','v11_batch06_question_regenerate.js','v11_batch06_register.js'
];
function load(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.async=false;s.onload=resolve;s.onerror=()=>reject(new Error('Batch06 script load failed: '+src));document.head.appendChild(s);});}
(async()=>{try{for(const f of files)await load(f);if(!window.V11_BATCH06_LOADED)throw new Error('Batch06 registration did not complete');window.V11_BATCH06_BOOTSTRAP_STATE={version:'20260829-final',files:files.length,loaded:true,total:window.V11_BATCH06_STATE&&window.V11_BATCH06_STATE.totalWithBaseline};if(typeof window.render==='function')window.render();}catch(e){window.V11_BATCH06_BOOTSTRAP_ERROR=String(e&&e.stack||e);console.error(e);throw e;}finally{window.V11_BATCH06_BOOTSTRAP_LOADING=false;}})();
})();
