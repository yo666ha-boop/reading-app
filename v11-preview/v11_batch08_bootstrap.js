(function bootstrapV11Batch08(){
'use strict';
if(window.V11_BATCH08_LOADED||window.V11_BATCH08_BOOTSTRAP_LOADING)return;
window.V11_BATCH08_BOOTSTRAP_LOADING=true;
const files=[
 'v11_batch08_passages_draft_g1.js','v11_batch08_passages_draft_g2.js','v11_batch08_passages_draft_g3.js',
 'v11_batch08_g3_length_repair.js','v11_batch08_grammar_repair.js','v11_batch08_grammar_repair_r2.js','v11_batch08_grammar_repair_r3.js',
 'v11_batch08_vocab_repair.js','v11_batch08_gloss_apply.js','v11_batch08_semantic_repair_r1.js','v11_batch08_question_human_rewrite.js','v11_batch08_register.js'
];
function load(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.async=false;s.onload=resolve;s.onerror=()=>reject(new Error('Batch08 script load failed: '+src));document.head.appendChild(s);});}
(async()=>{try{for(const f of files)await load(f);if(!window.V11_BATCH08_LOADED)throw new Error('Batch08 registration did not complete');await load('v11_batch09_bootstrap.js');window.V11_BATCH08_BOOTSTRAP_STATE={version:'20260829-human-r1-b09-chain',files:files.length+1,loaded:true,total:window.V11_BATCH09_STATE&&window.V11_BATCH09_STATE.totalWithBaseline||window.V11_BATCH08_STATE&&window.V11_BATCH08_STATE.totalWithBaseline};if(typeof window.render==='function')window.render();}catch(e){window.V11_BATCH08_BOOTSTRAP_ERROR=String(e&&e.stack||e);console.error(e);throw e;}finally{window.V11_BATCH08_BOOTSTRAP_LOADING=false;}})();
})();
