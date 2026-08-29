(function bootstrapV11Batch09(){
'use strict';
if(window.V11_BATCH09_LOADED||window.V11_BATCH09_BOOTSTRAP_LOADING)return;
window.V11_BATCH09_BOOTSTRAP_LOADING=true;
const files=[
'v11_batch09_passages_draft_g1.js','v11_batch09_g1_length_repair.js','v11_batch09_passages_draft_g2.js','v11_batch09_passages_draft_g3.js','v11_batch09_g3_length_repair.js',
'v11_batch09_grammar_repair.js','v11_batch09_grammar_repair_r2.js','v11_batch09_verified_gloss_base.js','v11_batch09_manual_gloss_a_h.js','v11_batch09_manual_gloss_i_r.js',
'v11_batch09_vocab_repair.js','v11_batch09_gloss_apply.js','v11_batch09_vocab_repair_r2.js','v11_batch09_prior_final_gloss.js','v11_batch09_manual_gloss_residual_r3.js','v11_batch09_gloss_apply_r2.js','v11_batch09_chronology_residual_notes_r3.js',
'v11_batch09_semantic_repair_g1_r1.js','v11_batch09_semantic_repair_g2_r1.js','v11_batch09_semantic_repair_g3_r1.js','v11_batch09_question_human_rewrite.js','v11_batch09_register.js'];
function load(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.async=false;s.onload=resolve;s.onerror=()=>reject(new Error('Batch09 script load failed: '+src));document.head.appendChild(s);});}
(async()=>{try{for(const f of files)await load(f);if(!window.V11_BATCH09_LOADED)throw new Error('Batch09 registration did not complete');window.V11_BATCH09_BOOTSTRAP_STATE={version:'20260829-human-r1',files:files.length,loaded:true,total:window.V11_BATCH09_STATE&&window.V11_BATCH09_STATE.totalWithBaseline};if(typeof window.render==='function')window.render();}catch(e){window.V11_BATCH09_BOOTSTRAP_ERROR=String(e&&e.stack||e);console.error(e);throw e;}finally{window.V11_BATCH09_BOOTSTRAP_LOADING=false;}})();
})();
