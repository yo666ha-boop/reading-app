(function bootstrapV11Batch07(){
'use strict';
if(window.V11_BATCH07_LOADED||window.V11_BATCH07_BOOTSTRAP_LOADING)return;
window.V11_BATCH07_BOOTSTRAP_LOADING=true;
const files=[
 'v11_batch07_passages_draft_g1.js','v11_batch07_g1_semantic_repair.js',
 'v11_batch07_passages_draft_g2.js','v11_batch07_g2_semantic_repair.js',
 'v11_batch07_standard_draft_g3.js','v11_batch07_standard_semantic_repair.js',
 'v11_batch07_long_draft_g3.js','v11_batch07_long_semantic_repair.js',
 'v11_batch07_yamaguchi_exam_draft_g3.js','v11_batch07_yamaguchi_semantic_repair.js','v11_batch07_yamaguchi_exam_evidence_sync.js',
 'v11_batch07_grammar_repair.js','v11_batch07_grammar_repair_r3.js','v11_batch07_length_repair.js','v11_batch07_vocab_repair.js',
 'v11_batch06_canonical_gloss.js','v11_batch07_notes_finalize.js','v11_batch07_register.js'
];
function load(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.async=false;s.onload=resolve;s.onerror=()=>reject(new Error('Batch07 script load failed: '+src));document.head.appendChild(s);});}
(async()=>{try{for(const f of files)await load(f);if(!window.V11_BATCH07_LOADED)throw new Error('Batch07 registration did not complete');window.V11_BATCH07_BOOTSTRAP_STATE={version:'20260829-final',files:files.length,loaded:true,total:window.V11_BATCH07_STATE&&window.V11_BATCH07_STATE.totalWithBaseline};if(typeof window.render==='function')window.render();}catch(e){window.V11_BATCH07_BOOTSTRAP_ERROR=String(e&&e.stack||e);console.error(e);throw e;}finally{window.V11_BATCH07_BOOTSTRAP_LOADING=false;}})();
})();
