(function bootstrapV11Batch10(){
'use strict';
if(window.V11_BATCH10_LOADED||window.V11_BATCH10_BOOTSTRAP_LOADING)return;
window.V11_BATCH10_BOOTSTRAP_LOADING=true;
const files=[
'v11_batch10_passages_draft_g1.js','v11_batch10_passages_draft_g2.js','v11_batch10_passages_draft_g3.js',
'v11_batch10_length_repair_r1.js','v11_batch10_grammar_repair_r1.js','v11_batch10_grammar_repair_r2.js','v11_batch10_length_repair_r2.js','v11_batch10_human_semantic_review_r1.js',
'v11_batch10_vocab_inventory.js','v11_batch10_prior_verified_gloss.js','v11_batch10_manual_gloss_r1.js','v11_batch10_gloss_apply.js','v11_batch10_vocab_residual_r2_apply.js',
'v11_batch10_question_human_rewrite.js','v11_batch10_question_human_rewrite_r2.js','v11_batch10_register.js'];
function load(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.async=false;s.onload=resolve;s.onerror=()=>reject(new Error('Batch10 script load failed: '+src));document.head.appendChild(s);});}
function waitFor(test,label,timeout=120000){return new Promise((resolve,reject)=>{const end=Date.now()+timeout;const t=setInterval(()=>{try{if(test()){clearInterval(t);resolve();return}if(Date.now()>end){clearInterval(t);reject(new Error(label+' timeout'))}}catch(e){clearInterval(t);reject(e)}},10)})}
(async()=>{try{
for(const f of files)await load(f);
if(!window.V11_BATCH10_LOADED)throw new Error('Batch10 registration did not complete');
window.V11_BATCH10_BOOTSTRAP_STATE={version:'20260829-human-r1',files:files.length,loaded:true,total:window.V11_BATCH10_STATE&&window.V11_BATCH10_STATE.totalWithBaseline};
const isBatch11Candidate=/[?&]b11candidate=/.test(String(location&&location.search||''));
if(!isBatch11Candidate&&!window.V11_BATCH11_LOADED){await load('v11_batch11_bootstrap.js');await waitFor(()=>window.V11_BATCH11_LOADED===true||!!window.V11_BATCH11_BOOTSTRAP_ERROR,'Batch11 bootstrap');if(window.V11_BATCH11_BOOTSTRAP_ERROR)throw new Error(window.V11_BATCH11_BOOTSTRAP_ERROR);}
if(typeof window.render==='function')window.render();
}catch(e){window.V11_BATCH10_BOOTSTRAP_ERROR=String(e&&e.stack||e);console.error(e);throw e;}finally{window.V11_BATCH10_BOOTSTRAP_LOADING=false;}})();
})();
